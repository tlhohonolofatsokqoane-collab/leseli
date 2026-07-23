const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, "uniscopels.db");
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS universities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      location TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS faculties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      university_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
      UNIQUE(university_id, name)
    );

    CREATE TABLE IF NOT EXISTS programmes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      faculty_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      duration TEXT,
      entry_type TEXT,
      description TEXT,
      career_paths TEXT,
      additional_info TEXT,
      FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
      UNIQUE(faculty_id, name)
    );

    CREATE TABLE IF NOT EXISTS programme_requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      programme_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      min_symbol TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (programme_id) REFERENCES programmes(id) ON DELETE CASCADE
    );
  `);
}

function seedIfEmpty() {
  const count = db.prepare("SELECT COUNT(*) AS count FROM universities").get().count;
  if (count > 0) return;

  const insertUniversity = db.prepare(`
    INSERT INTO universities (name, location, description)
    VALUES (@name, @location, @description)
  `);
  const insertFaculty = db.prepare(`
    INSERT INTO faculties (university_id, name, description)
    VALUES (@university_id, @name, @description)
  `);
  const insertProgramme = db.prepare(`
    INSERT INTO programmes (faculty_id, name, duration, entry_type, description, career_paths, additional_info)
    VALUES (@faculty_id, @name, @duration, @entry_type, @description, @career_paths, @additional_info)
  `);
  const insertRequirement = db.prepare(`
    INSERT INTO programme_requirements (programme_id, subject, min_symbol, notes)
    VALUES (@programme_id, @subject, @min_symbol, @notes)
  `);

  const tx = db.transaction(() => {
    const nulResult = insertUniversity.run({
        name: "National University of Lesotho",
        location: "Roma, Maseru District, Lesotho",
        description: "The premier institution of higher learning in Lesotho, established in 1945."
    });
    const uniId = nulResult.lastInsertRowid;

    const fAgri = insertFaculty.run({ university_id: uniId, name: "Faculty of Agriculture", description: "Promoting sustainable agriculture and food security." }).lastInsertRowid;
    const fEdu = insertFaculty.run({ university_id: uniId, name: "Faculty of Education", description: "Nurturing transformative educators." }).lastInsertRowid;
    const fHealth = insertFaculty.run({ university_id: uniId, name: "Faculty of Health Sciences", description: "Advancing health through research and training." }).lastInsertRowid;
    const fHum = insertFaculty.run({ university_id: uniId, name: "Faculty of Humanities", description: "Fostering critical thinking and cultural understanding." }).lastInsertRowid;
    const fLaw = insertFaculty.run({ university_id: uniId, name: "Faculty of Law", description: "Providing quality legal education." }).lastInsertRowid;
    const fSci = insertFaculty.run({ university_id: uniId, name: "Faculty of Science and Technology", description: "Driving innovation and scientific excellence." }).lastInsertRowid;
    const fSoc = insertFaculty.run({ university_id: uniId, name: "Faculty of Social Sciences", description: "Analyzing society and economic development." }).lastInsertRowid;
    const fIems = insertFaculty.run({ university_id: uniId, name: "Institute of Extra-Mural Studies", description: "Lifelong learning and community outreach." }).lastInsertRowid;

    // Faculty of Agriculture
    const bscAgriProg = insertProgramme.run({
        faculty_id: fAgri,
        name: "BSc Agriculture",
        duration: "4 years",
        entry_type: "Direct Entry",
        description: "Comprehensive study of agricultural economics and general science.",
        career_paths: "Agriculturalist, Environmental Scientist, Food Security Officer.",
        additional_info: "Year 2 entry available for Diploma holders."
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: bscAgriProg, subject: "Mathematics", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: bscAgriProg, subject: "English Language", min_symbol: "D", notes: "" });
    insertRequirement.run({ programme_id: bscAgriProg, subject: "Biology or Physical Science", min_symbol: "C", notes: "" });

    const bscAgriEcon = insertProgramme.run({
        faculty_id: fAgri,
        name: "BSc Agricultural Economics",
        duration: "4 years",
        entry_type: "Direct Entry",
        description: "Focus on production, marketing, and research in agriculture.",
        career_paths: "Economic Planner, Marketing Manager, Research Analyst.",
        additional_info: ""
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: bscAgriEcon, subject: "Mathematics", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: bscAgriEcon, subject: "English Language", min_symbol: "D", notes: "" });

    // Faculty of Education
    const bed = insertProgramme.run({
        faculty_id: fEdu,
        name: "Bachelor of Education",
        duration: "4 years",
        entry_type: "Direct Entry",
        description: "Teacher training for secondary schools.",
        career_paths: "Secondary Teacher, Subject Specialist, Principal.",
        additional_info: "Specializations in Business, Economics, and English available."
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: bed, subject: "English Language", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: bed, subject: "General Subjects", min_symbol: "C", notes: "At least 4 credits required including English." });

    const bscEdu = insertProgramme.run({
        faculty_id: fEdu,
        name: "Bachelor of Science with Education",
        duration: "4 years",
        entry_type: "Direct Entry",
        description: "Specialized training for Science and Math teachers.",
        career_paths: "Science Teacher, Math Teacher, Curriculum Developer.",
        additional_info: "Requires strong science background."
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: bscEdu, subject: "Mathematics", min_symbol: "B", notes: "" });
    insertRequirement.run({ programme_id: bscEdu, subject: "Biology or Physical Science", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: bscEdu, subject: "English Language", min_symbol: "D", notes: "" });

    // Faculty of Health Sciences
    const nursing = insertProgramme.run({
        faculty_id: fHealth,
        name: "BSc in Nursing and Midwifery",
        duration: "5 years",
        entry_type: "Direct Entry",
        description: "Professional nursing and midwifery qualification.",
        career_paths: "Nursing Officer, Unit Manager, Private Practice.",
        additional_info: "Ranked based on Science and Math performance."
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: nursing, subject: "Mathematics", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: nursing, subject: "Biology or Physical Science", min_symbol: "B", notes: "" });
    insertRequirement.run({ programme_id: nursing, subject: "English Language", min_symbol: "C", notes: "" });

    const pharmacy = insertProgramme.run({
        faculty_id: fHealth,
        name: "Bachelor of Pharmacy (Honours)",
        duration: "5 years",
        entry_type: "Direct Entry",
        description: "Advanced pharmaceutical sciences and clinical practice.",
        career_paths: "Pharmacist, Clinical Researcher, Drug Controller.",
        additional_info: "High demand program."
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: pharmacy, subject: "Mathematics", min_symbol: "B", notes: "" });
    insertRequirement.run({ programme_id: pharmacy, subject: "Biology or Physical Science", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: pharmacy, subject: "English Language", min_symbol: "C", notes: "" });

    const envHealth = insertProgramme.run({
        faculty_id: fHealth,
        name: "BSc in Environmental Health",
        duration: "4 years",
        entry_type: "Direct Entry",
        description: "Safety, health and environment (SHE) specialization.",
        career_paths: "SHE Officer, Environmental Consultant, Inspector.",
        additional_info: ""
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: envHealth, subject: "Mathematics", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: envHealth, subject: "Biology or Physical Science", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: envHealth, subject: "English Language", min_symbol: "C", notes: "" });

    // Faculty of Law
    const llb = insertProgramme.run({
        faculty_id: fLaw,
        name: "Bachelor of Laws (LLB)",
        duration: "5 years",
        entry_type: "Direct Entry",
        description: "Comprehensive legal education for professional practice.",
        career_paths: "Legal Practitioner, Magistrate, Corporate Counsel.",
        additional_info: "Ranked by English Literature, History, and Development Studies."
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: llb, subject: "English Language", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: llb, subject: "General Subjects", min_symbol: "C", notes: "4 subjects including English." });

    // Faculty of Science and Technology
    const bscCS = insertProgramme.run({
        faculty_id: fSci,
        name: "BSc Computer Science",
        duration: "4 years",
        entry_type: "Direct Entry",
        description: "Focuses on software engineering, algorithms, and technology systems.",
        career_paths: "Software Engineer, Database Administrator, Security Specialist.",
        additional_info: "Computer Science can count as a science subject for entry."
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: bscCS, subject: "Mathematics", min_symbol: "B", notes: "" });
    insertRequirement.run({ programme_id: bscCS, subject: "Biology or Physical Science", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: bscCS, subject: "English Language", min_symbol: "D", notes: "" });

    // Faculty of Social Sciences
    const bcommAcc = insertProgramme.run({
        faculty_id: fSoc,
        name: "BComm in Accounting and Finance",
        duration: "4 years",
        entry_type: "Direct Entry",
        description: "Professional accounting, auditing, and financial management.",
        career_paths: "Accountant, Auditor, Financial Planner.",
        additional_info: "Commonly leads to CAS professional qualification."
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: bcommAcc, subject: "Mathematics", min_symbol: "C", notes: "" });
    insertRequirement.run({ programme_id: bcommAcc, subject: "English Language", min_symbol: "C", notes: "" });

    // Humanities
    const journalism = insertProgramme.run({
        faculty_id: fHum,
        name: "Bachelor of Journalism & Media Studies",
        duration: "4 years",
        entry_type: "Direct Entry",
        description: "News reporting, multimedia design, and digital entrepreneurship.",
        career_paths: "News Reporter, PR Specialist, Multimedia Developer.",
        additional_info: ""
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: journalism, subject: "English Language", min_symbol: "C", notes: "" });

    // IEMS (Part-time / Diploma)
    const dipMan = insertProgramme.run({
        faculty_id: fIems,
        name: "Diploma in Management",
        duration: "3 years",
        entry_type: "Part-time",
        description: "Foundational management skills.",
        career_paths: "Accountant, HR Manager, Insurance Manager.",
        additional_info: ""
    }).lastInsertRowid;
    insertRequirement.run({ programme_id: dipMan, subject: "Mathematics", min_symbol: "D", notes: "" });
    insertRequirement.run({ programme_id: dipMan, subject: "English Language", min_symbol: "D", notes: "" });
  });

  tx();
}

function ensureStarterCatalogue() {
    // Ensuring other universities are present
    const universities = [
        { name: "Botho University", location: "Maseru", description: "Focus on computing and business." },
        { name: "Limkokwing University of Creative Technology", location: "Maseru", description: "Creative arts and technology." },
        { name: "Centre of Accounting Studies", location: "Maseru", description: "Professional accounting training." },
        { name: "Roma College of Nursing", location: "Roma", description: "Specialized nursing education." }
    ];

    const insertUni = db.prepare("INSERT OR IGNORE INTO universities (name, location, description) VALUES (?, ?, ?)");
    universities.forEach(u => insertUni.run(u.name, u.location, u.description));
}

module.exports = { db, initSchema, seedIfEmpty, ensureStarterCatalogue };
