"use client"

import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"

import { gradeOptions } from "./data"
import { GradeButton } from "./grade-button"
import type { Grade } from "./types"

export function CoreSubjectStep({
  currentSubject,
  grade,
  subjectIndex,
  onBack,
  onChooseGrade,
  onSkip,
}: {
  currentSubject: string
  grade: Grade
  subjectIndex: number
  onBack: () => void
  onChooseGrade: (grade: Exclude<Grade, "">) => void
  onSkip: () => void
}) {
  return (
    <BlurFade key={currentSubject} direction="left" offset={16} duration={0.35}>
      <div className="rounded-[1.75rem] bg-[#faf8f5] p-6 text-center sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f26a1b]">
          Core subject
        </p>
        <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#17120f]">
          {currentSubject}
        </h3>
        <p className="mt-3 leading-7 text-[#6b625c]">
          What symbol did you get for this subject?
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-6">
          {gradeOptions.map((option) => (
            <GradeButton
              key={option}
              grade={option}
              active={grade === option}
              onClick={() => onChooseGrade(option)}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={subjectIndex === 0}
              className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
              onClick={onSkip}
            >
              Skip subject
            </Button>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}
