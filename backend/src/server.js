const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { db, initSchema, seedIfEmpty, ensureStarterCatalogue } = require("./db");

loadLocalEnv();
initSchema();
seedIfEmpty();
ensureStarterCatalogue();

const app = express();
app.use(cors());
app.use(express.json());

const gradeRank = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 };
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.2";

function loadLocalEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
}

function normalizeSubject(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^english$/, "english language")
    .replace(/^maths?$/, "mathematics");
}

function splitRequirementSubjects(value) {
  return String(value || "")
    .split(/\s+or\s+|\/|,/i)
    .map(normalizeSubject)
    .filter(Boolean);
}

function buildSubjectMap(subjects) {
  const map = {};
  subjects.forEach((s) => {
    if (!s.subject || !s.symbol) return;
    const key = normalizeSubject(s.subject);
    const symbol = String(s.symbol).trim().toUpperCase();
    if (!gradeRank[symbol]) return;
    if (!map[key] || gradeRank[symbol] < gradeRank[map[key]]) map[key] = symbol;
  });
  return map;
}

function getStudentSymbol(subjectMap, requirementSubject) {
  let best = null;
  splitRequirementSubjects(requirementSubject).forEach((subject) => {
    const symbol = subjectMap[subject];
    if (!symbol) return;
    if (!best || gradeRank[symbol] < gradeRank[best]) best = symbol;
  });
  return best;
}

function inferField(row) {
  const text = `${row.name || ""} ${row.faculty_name || ""} ${row.description || ""}`.toLowerCase();
  if (/computer|software|technology|information|data|it\b/.test(text)) return "technology";
  if (/health|nursing|pharmacy|medical|clinical/.test(text)) return "health";
  if (/account|business|finance|management|commerce/.test(text)) return "business";
  if (/education|teaching|teacher/.test(text)) return "education";
  if (/design|creative|media|communication/.test(text)) return "creative";
  return "science";
}

function getProgrammes({ universityId, q } = {}) {
  const conditions = [];
  const params = {};

  if (universityId) {
    conditions.push("u.id = @universityId");
    params.universityId = universityId;
  }

  if (q) {
    conditions.push("(p.name LIKE @q OR u.name LIKE @q OR f.name LIKE @q)");
    params.q = `%${q}%`;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const programmes = db
    .prepare(
      `SELECT
        p.*,
        f.name AS faculty_name,
        u.id AS university_id,
        u.name AS university_name,
        u.location AS university_location
       FROM programmes p
       JOIN faculties f ON p.faculty_id = f.id
       JOIN universities u ON f.university_id = u.id
       ${where}
       ORDER BY u.name, f.name, p.name`
    )
    .all(params);
  const reqStmt = db.prepare("SELECT subject, min_symbol, notes FROM programme_requirements WHERE programme_id = ? ORDER BY id");

  return programmes.map((programme) => ({
    ...programme,
    field: inferField(programme),
    requirements: reqStmt.all(programme.id)
  }));
}

function scoreProgramme(programme, subjectMap, preferredField = "", goal = "") {
  const failed = [];
  let score = 40;

  programme.requirements.forEach((requirement) => {
    const minimum = String(requirement.min_symbol || "").toUpperCase();
    const student = getStudentSymbol(subjectMap, requirement.subject);
    if (!student || !gradeRank[minimum] || gradeRank[student] > gradeRank[minimum]) {
      failed.push({ ...requirement, student_symbol: student || null });
      return;
    }

    score += 15;
    score += Math.max(0, gradeRank[minimum] - gradeRank[student]) * 4;
  });

  if (preferredField && programme.field === preferredField) score += 18;

  const goalWords = String(goal || "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length > 3);
  const programmeText = `${programme.name} ${programme.description} ${programme.career_paths} ${programme.faculty_name}`.toLowerCase();
  const hits = goalWords.filter((word) => programmeText.includes(word)).length;
  score += Math.min(hits * 6, 18);

  const qualifies = failed.length === 0 && programme.requirements.length > 0;
  return {
    ...programme,
    score: Math.min(score, 100),
    qualifies,
    failed_requirements: failed,
    recommendation_reason: qualifies
      ? `Meets listed entry requirements${preferredField && programme.field === preferredField ? " and aligns with preferred field" : ""}.`
      : "Does not meet one or more listed requirements yet."
  };
}

function inferPreferredFieldFromProfile(subjectMap, goal = "") {
  const text = String(goal || "").toLowerCase();
  if (/computer|software|coding|technology|data|it\b/.test(text)) return "technology";
  if (/health|nurs|pharmacy|doctor|patient|helping people|clinic/.test(text)) return "health";
  if (/business|account|finance|audit|tax|money/.test(text)) return "business";
  if (/teach|teacher|education|children|school/.test(text)) return "education";
  if (/design|creative|media|art|brand|drawing/.test(text)) return "creative";
  if (/farm|agriculture|biology|science|environment/.test(text)) return "science";

  const strongSubjects = Object.entries(subjectMap)
    .filter(([, symbol]) => gradeRank[symbol] <= 2)
    .map(([subject]) => subject);

  if (strongSubjects.some((subject) => /computer|mathematics/.test(subject))) return "technology";
  if (strongSubjects.some((subject) => /biology|physical science|chemistry/.test(subject))) return "health";
  if (strongSubjects.some((subject) => /accounting|business/.test(subject))) return "business";
  if (strongSubjects.some((subject) => /english|development studies/.test(subject))) return "education";
  return "";
}

function buildAdvisorContext({ message, matches, subjects }) {
  const courseLines = (Array.isArray(matches) ? matches : [])
    .slice(0, 6)
    .map((match, index) => {
      const requirements = (match.requirements || [])
        .map((requirement) => `${requirement.subject}: ${requirement.min_symbol} or better`)
        .join("; ");
      return `${index + 1}. ${match.name} at ${match.university_name || match.university || "Unknown university"} (${match.field || "field unknown"}). Requirements: ${requirements || "not listed"}. Careers: ${match.career_paths || "not listed"}.`;
    })
    .join("\n");

  const subjectLines = (Array.isArray(subjects) ? subjects : [])
    .map((subject) => `${subject.subject}: ${subject.symbol}`)
    .join(", ");

  return [
    {
      role: "system",
      content:
        "You are UniScopels, a warm but careful university course advisor for students in Lesotho using LGCSE results. Explain options clearly, avoid guaranteeing admission, and base advice only on the supplied course data and student profile. If data is missing, say what should be checked with the university."
    },
    {
      role: "user",
      content:
        `Student question: ${message}\n` +
        `Student LGCSE subjects: ${subjectLines || "not provided"}\n` +
        `Current eligible/recommended courses:\n${courseLines || "No current match list was provided."}\n` +
        "Reply in a friendly, concise way. Recommend next steps and ask at most one useful follow-up question."
    }
  ];
}

async function callOpenAIAdvisor(payload) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("OPENAI_API_KEY is not configured");
    error.status = 503;
    throw error;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: buildAdvisorContext(payload),
      max_output_tokens: 450
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error && data.error.message ? data.error.message : "OpenAI request failed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data.output_text || "I could not generate a response this time. Please try again.";
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "uniscopels-backend" });
});

app.get("/api/universities", (_req, res) => {
  const rows = db.prepare("SELECT * FROM universities ORDER BY name").all();
  res.json(rows);
});

app.post("/api/universities", (req, res) => {
  const { name, location = "", description = "" } = req.body || {};
  if (!name) return res.status(400).json({ error: "name is required" });

  try {
    const result = db
      .prepare("INSERT INTO universities (name, location, description) VALUES (?, ?, ?)")
      .run(name, location, description);
    const university = db.prepare("SELECT * FROM universities WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(university);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/universities/:id/full", (req, res) => {
  const id = Number(req.params.id);
  const university = db.prepare("SELECT * FROM universities WHERE id = ?").get(id);
  if (!university) return res.status(404).json({ error: "university not found" });

  const faculties = db.prepare("SELECT * FROM faculties WHERE university_id = ? ORDER BY name").all(id);
  const programmesByFaculty = db
    .prepare(
      "SELECT p.*, f.id AS faculty_id FROM programmes p JOIN faculties f ON f.id = p.faculty_id WHERE f.university_id = ? ORDER BY p.name"
    )
    .all(id);
  const requirements = db.prepare("SELECT * FROM programme_requirements ORDER BY id").all();

  const facultiesFull = faculties.map((f) => {
    const programmes = programmesByFaculty
      .filter((p) => p.faculty_id === f.id)
      .map((p) => ({
        ...p,
        requirements: requirements.filter((r) => r.programme_id === p.id)
      }));
    return { ...f, programmes };
  });

  res.json({ ...university, faculties: facultiesFull });
});

app.get("/api/faculties", (req, res) => {
  const universityId = Number(req.query.university_id);
  if (!universityId) {
    return res.status(400).json({ error: "university_id query parameter is required" });
  }
  const rows = db
    .prepare("SELECT * FROM faculties WHERE university_id = ? ORDER BY name")
    .all(universityId);
  res.json(rows);
});

app.post("/api/faculties", (req, res) => {
  const { university_id, name, description = "" } = req.body || {};
  if (!university_id || !name) {
    return res.status(400).json({ error: "university_id and name are required" });
  }

  try {
    const result = db
      .prepare("INSERT INTO faculties (university_id, name, description) VALUES (?, ?, ?)")
      .run(university_id, name, description);
    const row = db.prepare("SELECT * FROM faculties WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(row);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/programmes", (req, res) => {
  const facultyId = Number(req.query.faculty_id);
  const universityId = Number(req.query.university_id);
  const q = String(req.query.q || "").trim();

  if (!facultyId) {
    return res.json(getProgrammes({ universityId, q }));
  }

  const programmes = db.prepare("SELECT * FROM programmes WHERE faculty_id = ? ORDER BY name").all(facultyId);
  const requirementStmt = db.prepare("SELECT * FROM programme_requirements WHERE programme_id = ? ORDER BY id");
  const result = programmes.map((p) => ({ ...p, requirements: requirementStmt.all(p.id) }));
  res.json(result);
});

app.post("/api/programmes", (req, res) => {
  const {
    faculty_id,
    name,
    duration = "",
    entry_type = "",
    description = "",
    career_paths = "",
    additional_info = "",
    requirements = []
  } = req.body || {};

  if (!faculty_id || !name) return res.status(400).json({ error: "faculty_id and name are required" });

  try {
    const tx = db.transaction(() => {
      const programResult = db
        .prepare(
          "INSERT INTO programmes (faculty_id, name, duration, entry_type, description, career_paths, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .run(faculty_id, name, duration, entry_type, description, career_paths, additional_info);

      const programmeId = programResult.lastInsertRowid;
      const reqStmt = db.prepare(
        "INSERT INTO programme_requirements (programme_id, subject, min_symbol, notes) VALUES (?, ?, ?, ?)"
      );
      requirements.forEach((r) => {
        if (!r.subject || !r.min_symbol) return;
        reqStmt.run(programmeId, r.subject, String(r.min_symbol).toUpperCase(), r.notes || "");
      });

      return programmeId;
    });

    const id = tx();
    const programme = db.prepare("SELECT * FROM programmes WHERE id = ?").get(id);
    const programmeRequirements = db
      .prepare("SELECT * FROM programme_requirements WHERE programme_id = ? ORDER BY id")
      .all(id);
    res.status(201).json({ ...programme, requirements: programmeRequirements });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/match", (req, res) => {
  const { university_id, subjects = [], preferred_field = "", goal = "", include_ineligible = false, limit = 50 } =
    req.body || {};

  if (!Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ error: "subjects[] is required" });
  }

  const subjectMap = buildSubjectMap(subjects);
  const inferredField = preferred_field || inferPreferredFieldFromProfile(subjectMap, goal);
  const programmes = getProgrammes({ universityId: Number(university_id) || null });
  
  let matches = programmes
    .map((programme) => scoreProgramme(programme, subjectMap, inferredField, goal))
    .filter((programme) => include_ineligible || programme.qualifies)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  // If no strict matches found, provide the top 5 highest scoring programs as recommendations
  if (matches.length === 0) {
    matches = programmes
      .map((programme) => scoreProgramme(programme, subjectMap, inferredField, goal))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
  matches = matches.slice(0, safeLimit);

  res.json({
    count: matches.length,
    total_considered: programmes.length,
    inferred_field: inferredField || null,
    best_match: matches.find((programme) => programme.qualifies) || null,
    matches
  });
});

app.post("/api/advisor", async (req, res) => {
  const { message = "", matches = [], subjects = [] } = req.body || {};
  const prompt = String(message).trim().toLowerCase();

  if (!prompt) return res.status(400).json({ error: "message is required" });

  try {
    const reply = await callOpenAIAdvisor({ message: prompt, matches, subjects });
    res.json({ reply, ai_provider: "openai", model: OPENAI_MODEL });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      setup_required: !process.env.OPENAI_API_KEY,
      message: process.env.OPENAI_API_KEY
        ? "The AI advisor could not respond right now."
        : "Set OPENAI_API_KEY in backend/.env to enable the real AI advisor."
    });
  }
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${PORT}`);
});
