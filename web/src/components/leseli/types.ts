export type Grade = "A*" | "A" | "B" | "C" | "D" | "E" | ""

export type Requirement = {
  subject: string
  min: Exclude<Grade, "">
}

export type Programme = {
  title: string
  institution: string
  field: string
  duration: string
  aps?: number
  requirements: Requirement[]
  note: string
}

export type ProgrammeEvaluation = {
  missingSubjects: Requirement[]
  score: number
  status: "Likely" | "Close" | "Stretch"
}

export type ProgrammeMatch = Programme & {
  evaluation: ProgrammeEvaluation
}
