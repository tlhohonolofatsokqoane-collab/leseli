"use client"

import { useEffect, useMemo, useState } from "react"

import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

import {
  coreSubjects,
  firstOtherSubjectIndex,
  initialGrades,
  matcherSubjects,
  otherSubjects,
  programmes,
} from "./data"
import { calculateAps, evaluateProgramme } from "./helpers"
import { CoreSubjectStep } from "./core-subject-step"
import { MatcherResults } from "./matcher-results"
import { OptionalSubjectStep } from "./optional-subject-step"
import type { Grade, ProgrammeMatch } from "./types"

export function GradeMatcher({
  onTopMatchChange,
}: {
  onTopMatchChange: (programme: ProgrammeMatch | null) => void
}) {
  const [grades, setGrades] = useState(initialGrades)
  const [subjectIndex, setSubjectIndex] = useState(0)
  const [otherSubject, setOtherSubject] = useState("")
  const [otherQuery, setOtherQuery] = useState("")
  const [matcherComplete, setMatcherComplete] = useState(false)

  const aps = calculateAps(grades)
  const currentSubject = coreSubjects[subjectIndex] ?? coreSubjects[0]
  const inOtherStep = !matcherComplete && subjectIndex >= firstOtherSubjectIndex
  const progress = matcherComplete
    ? 100
    : Math.round((subjectIndex / (coreSubjects.length + 1)) * 100)
  const searchedOtherSubjects = otherSubjects.filter((subject) =>
    subject.toLowerCase().includes(otherQuery.trim().toLowerCase())
  )
  const rankedProgrammes = useMemo(() => {
    return programmes
      .map((programme) => ({
        ...programme,
        evaluation: evaluateProgramme(programme, grades),
      }))
      .sort((a, b) => b.evaluation.score - a.evaluation.score)
  }, [grades])

  useEffect(() => {
    onTopMatchChange(matcherComplete ? rankedProgrammes[0] ?? null : null)
  }, [matcherComplete, onTopMatchChange, rankedProgrammes])

  const chooseGrade = (grade: Exclude<Grade, "">) => {
    if (inOtherStep) {
      if (!otherSubject) return

      setGrades((current) => ({ ...current, [otherSubject]: grade }))
      setOtherSubject("")
      setOtherQuery("")
      return
    }

    setGrades((current) => ({ ...current, [currentSubject]: grade }))
    setSubjectIndex((index) => Math.min(coreSubjects.length, index + 1))
  }

  const skipSubject = () => {
    if (inOtherStep) {
      setOtherSubject("")
      setOtherQuery("")
      return
    }

    setGrades((current) => ({ ...current, [currentSubject]: "" }))
    setSubjectIndex((index) => Math.min(coreSubjects.length, index + 1))
  }

  const goBack = () => {
    if (matcherComplete) {
      setMatcherComplete(false)
      setSubjectIndex(matcherSubjects.length - 1)
      return
    }

    if (inOtherStep) {
      setOtherSubject("")
      setOtherQuery("")
    }

    setSubjectIndex((index) => Math.max(0, index - 1))
  }

  const resetMatcher = () => {
    setGrades(initialGrades)
    setSubjectIndex(0)
    setOtherSubject("")
    setOtherQuery("")
    setMatcherComplete(false)
  }

  return (
    <section id="matcher" className="py-16">
      <div className={cn("space-y-8", !matcherComplete && "mx-auto w-full max-w-5xl")}>
        <MatcherIntro matcherComplete={matcherComplete} />

        <BlurFade
          className={cn(
            matcherComplete
              ? "bg-transparent p-0"
              : "rounded-[2rem] border border-[#eee7df] bg-white p-5 shadow-[0_18px_50px_rgba(37,30,24,0.045)] sm:p-8"
          )}
          direction="up"
          inView
          offset={12}
        >
          {!matcherComplete ? (
            <MatcherProgress
              inOtherStep={inOtherStep}
              progress={progress}
              subjectIndex={subjectIndex}
            />
          ) : null}

          {matcherComplete ? (
            <MatcherResults
              aps={aps}
              rankedProgrammes={rankedProgrammes}
              onReset={resetMatcher}
              onReview={() => {
                setMatcherComplete(false)
                setSubjectIndex(0)
              }}
            />
          ) : inOtherStep ? (
            <OptionalSubjectStep
              grade={grades[otherSubject] ?? ""}
              otherQuery={otherQuery}
              otherSubject={otherSubject}
              searchedOtherSubjects={searchedOtherSubjects}
              onBack={goBack}
              onChooseGrade={chooseGrade}
              onQueryChange={(value) => {
                setOtherQuery(value)
                setOtherSubject("")
              }}
              onSelectSubject={setOtherSubject}
              onShowAps={() => setMatcherComplete(true)}
            />
          ) : (
            <CoreSubjectStep
              currentSubject={currentSubject}
              grade={grades[currentSubject] ?? ""}
              subjectIndex={subjectIndex}
              onBack={goBack}
              onChooseGrade={chooseGrade}
              onSkip={skipSubject}
            />
          )}
        </BlurFade>
      </div>
    </section>
  )
}

function MatcherIntro({ matcherComplete }: { matcherComplete: boolean }) {
  return (
    <BlurFade
      className={cn("max-w-2xl", !matcherComplete && "mx-auto text-center")}
      direction="up"
      inView
      offset={14}
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f26a1b]">
        Matcher
      </p>
      <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#17120f] sm:text-5xl">
        Your grades become a direction.
      </h2>
      <p className="mt-4 text-lg leading-8 text-[#6b625c]">
        Enter the subjects you took, skip the ones you did not, then see the APS
        estimate and study paths when you are ready.
      </p>
    </BlurFade>
  )
}

function MatcherProgress({
  inOtherStep,
  progress,
  subjectIndex,
}: {
  inOtherStep: boolean
  progress: number
  subjectIndex: number
}) {
  return (
    <div className="mb-7">
      <div className="mb-3 flex items-center justify-between gap-4 text-sm font-semibold text-[#8a7f76]">
        <span>{inOtherStep ? "Step 2 · Other subjects" : "Step 1 · Core subjects"}</span>
        <span>
          {inOtherStep ? "Optional" : `${subjectIndex + 1} of ${coreSubjects.length}`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#f4f1ed]">
        <div
          className="h-full rounded-full bg-[#f26a1b] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
