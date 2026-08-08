"use client"

import { Search } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { gradeOptions } from "./data"
import { GradeButton } from "./grade-button"
import type { Grade } from "./types"

export function OptionalSubjectStep({
  grade,
  otherQuery,
  otherSubject,
  searchedOtherSubjects,
  onBack,
  onChooseGrade,
  onQueryChange,
  onSelectSubject,
  onShowAps,
}: {
  grade: Grade
  otherQuery: string
  otherSubject: string
  searchedOtherSubjects: string[]
  onBack: () => void
  onChooseGrade: (grade: Exclude<Grade, "">) => void
  onQueryChange: (value: string) => void
  onSelectSubject: (subject: string) => void
  onShowAps: () => void
}) {
  return (
    <BlurFade key="other-subjects" direction="left" offset={16} duration={0.35}>
      <div className="rounded-[1.75rem] bg-[#faf8f5] p-6 text-center sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f26a1b]">
          Optional subjects
        </p>
        <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#17120f]">
          Add another subject?
        </h3>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-[#6b625c]">
          Search for an extra subject you took. If it is not listed, you can skip
          straight to the APS score.
        </p>

        <div className="relative mx-auto mt-6 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9d928a]" />
          <Input
            value={otherQuery}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Accounting, Geography, Agriculture..."
            className="h-12 rounded-full border-0 bg-white pl-11 text-base shadow-none focus-visible:ring-orange-500/30"
          />
        </div>

        <SubjectSearchState
          otherQuery={otherQuery}
          otherSubject={otherSubject}
          searchedOtherSubjects={searchedOtherSubjects}
          onSelectSubject={onSelectSubject}
          onShowAps={onShowAps}
        />

        {otherSubject ? (
          <div className="mx-auto mt-7 max-w-3xl rounded-3xl bg-white p-4">
            <p className="text-sm font-semibold text-[#221a15]">{otherSubject}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {gradeOptions.map((option) => (
                <GradeButton
                  key={option}
                  grade={option}
                  active={grade === option}
                  onClick={() => onChooseGrade(option)}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="secondary"
            className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-11 rounded-full bg-[#f26a1b] px-5 font-semibold text-white hover:bg-[#d9580f]"
            onClick={onShowAps}
          >
            Show APS score
          </Button>
        </div>
      </div>
    </BlurFade>
  )
}

function SubjectSearchState({
  otherQuery,
  otherSubject,
  searchedOtherSubjects,
  onSelectSubject,
  onShowAps,
}: {
  otherQuery: string
  otherSubject: string
  searchedOtherSubjects: string[]
  onSelectSubject: (subject: string) => void
  onShowAps: () => void
}) {
  if (!otherQuery.trim()) {
    return null
  }

  if (searchedOtherSubjects.length === 0) {
    return (
      <div className="mx-auto mt-4 max-w-xl rounded-3xl bg-white p-4">
        <p className="text-sm font-medium text-[#6b625c]">
          That subject is not in this version of Leseli yet.
        </p>
        <Button
          type="button"
          className="mt-4 h-11 rounded-full bg-[#f26a1b] px-5 font-semibold text-white hover:bg-[#d9580f]"
          onClick={onShowAps}
        >
          Show APS score
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {searchedOtherSubjects.map((subject) => (
        <button
          key={subject}
          type="button"
          onClick={() => onSelectSubject(subject)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25",
            otherSubject === subject
              ? "bg-[#17120f] text-white"
              : "bg-white text-[#6b625c] hover:bg-[#fff1dc] hover:text-[#17120f]"
          )}
        >
          {subject}
        </button>
      ))}
    </div>
  )
}
