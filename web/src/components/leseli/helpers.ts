import { gradePoints } from "./data"
import type { Grade, Programme, ProgrammeEvaluation, Requirement } from "./types"

export function minGradeLabel(requirement: Requirement) {
  return `${requirement.subject} ${requirement.min}+`
}

export function calculateAps(grades: Record<string, Grade>) {
  return Object.values(grades)
    .map((grade) => gradePoints[grade])
    .sort((a, b) => b - a)
    .slice(0, 6)
    .reduce((sum, value) => sum + value, 0)
}

export function evaluateProgramme(
  programme: Programme,
  grades: Record<string, Grade>
): ProgrammeEvaluation {
  const missingSubjects = programme.requirements.filter((requirement) => {
    const studentGrade = grades[requirement.subject] ?? ""

    return gradePoints[studentGrade] < gradePoints[requirement.min]
  })
  const aps = calculateAps(grades)
  const apsMet = !programme.aps || aps >= programme.aps
  const metCount =
    programme.requirements.length - missingSubjects.length + (apsMet ? 1 : 0)
  const totalCount = programme.requirements.length + (programme.aps ? 1 : 0)
  const score = totalCount === 0 ? 1 : metCount / totalCount
  const status =
    missingSubjects.length === 0 && apsMet
      ? "Likely"
      : score >= 0.65
        ? "Close"
        : "Stretch"

  return {
    missingSubjects,
    score,
    status,
  }
}

export function statusStyles(status: string) {
  if (status === "Likely") {
    return "bg-[#fff1dc] text-[#a14300]"
  }
  if (status === "Close") {
    return "bg-[#f8f1e8] text-[#8a4b12]"
  }
  return "bg-[#f3f4f6] text-[#6b7280]"
}

export function scrollToSection(href: string) {
  document.querySelector(href)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}
