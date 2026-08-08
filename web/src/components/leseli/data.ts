import type { Grade, Programme } from "./types"

export const gradePoints: Record<Grade, number> = {
  "A*": 8,
  A: 7,
  B: 6,
  C: 5,
  D: 4,
  E: 3,
  "": 0,
}

export const gradeOptions: Exclude<Grade, "">[] = ["A*", "A", "B", "C", "D", "E"]

export const coreSubjects = [
  "English",
  "Sesotho",
  "Mathematics",
  "Physical Science",
  "Biology",
]

export const otherSubjects = [
  "Accounting",
  "Business Studies",
  "Economics",
  "Geography",
  "Computer Studies",
  "Agriculture",
  "Literature",
]

export const matcherSubjects = [...coreSubjects, ...otherSubjects]
export const firstOtherSubjectIndex = coreSubjects.length

export const initialGrades: Record<string, Grade> = {
  English: "",
  Sesotho: "",
  Mathematics: "",
  "Physical Science": "",
  Biology: "",
  Accounting: "",
  "Business Studies": "",
  Economics: "",
  Geography: "",
  "Computer Studies": "",
  Agriculture: "",
  Literature: "",
}

export const programmes: Programme[] = [
  {
    title: "Computer Science",
    institution: "National University of Lesotho",
    field: "technology software computing",
    duration: "4 years",
    aps: 28,
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Mathematics", min: "C" },
      { subject: "Physical Science", min: "C" },
    ],
    note: "Build software, understand systems, and learn how digital products work.",
  },
  {
    title: "General Nursing",
    institution: "National Health Training College",
    field: "health nursing medicine care biology",
    duration: "3 years",
    aps: 26,
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Biology", min: "C" },
      { subject: "Physical Science", min: "D" },
      { subject: "Mathematics", min: "D" },
    ],
    note: "A science-led route for students drawn to care, hospitals, and community health.",
  },
  {
    title: "Civil Engineering",
    institution: "Lerotholi Polytechnic",
    field: "engineering construction maths science infrastructure",
    duration: "3 years",
    requirements: [
      { subject: "English", min: "D" },
      { subject: "Mathematics", min: "C" },
      { subject: "Physical Science", min: "C" },
    ],
    note: "Design and build the roads, structures, and infrastructure people use every day.",
  },
  {
    title: "Law",
    institution: "National University of Lesotho",
    field: "law policy writing justice humanities",
    duration: "5 years",
    aps: 26,
    requirements: [
      { subject: "English", min: "B" },
      { subject: "Sesotho", min: "C" },
    ],
    note: "For strong readers and writers who enjoy argument, policy, and public life.",
  },
  {
    title: "Accounting and Finance",
    institution: "Centre for Accounting Studies",
    field: "accounting finance business economics money",
    duration: "3 years",
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Mathematics", min: "C" },
      { subject: "Accounting", min: "C" },
    ],
    note: "A practical professional path for students who like numbers and business rules.",
  },
  {
    title: "Business Management",
    institution: "Botho University Lesotho",
    field: "business entrepreneurship management economics",
    duration: "4 years",
    aps: 22,
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Mathematics", min: "D" },
    ],
    note: "A flexible route into operations, startups, sales, finance, or management.",
  },
  {
    title: "Secondary Teaching",
    institution: "Lesotho College of Education",
    field: "teaching education humanities science",
    duration: "3 years",
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Sesotho", min: "C" },
    ],
    note: "A good fit for students who want to teach and have two strong subject areas.",
  },
  {
    title: "Creative Design",
    institution: "Limkokwing University",
    field: "design media art animation creative technology",
    duration: "4 years",
    requirements: [{ subject: "English", min: "D" }],
    note: "For visual thinkers who want to make media, brands, interfaces, or stories.",
  },
]

export const institutions = [
  "NUL",
  "Lerotholi Polytechnic",
  "Botho University",
  "Limkokwing",
  "NHTC",
  "LCE",
  "CAS",
  "IDM Lesotho",
  "LAC",
  "LIPAM",
]

export const institutionRows = [
  institutions.slice(0, Math.ceil(institutions.length / 2)),
  institutions.slice(Math.ceil(institutions.length / 2)),
]

export const footerGroups = [
  {
    title: "Product",
    links: [
      ["Matcher", "#matcher"],
      ["Institutions", "#institutions"],
      ["Apply checklist", "#resources"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Contact", "mailto:hello@leseli.app"],
      ["Help centre", "#"],
      ["Feedback", "mailto:hello@leseli.app"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy policy", "#"],
      ["Terms", "#"],
      ["Accessibility", "#"],
      ["Data policy", "#"],
    ],
  },
]
