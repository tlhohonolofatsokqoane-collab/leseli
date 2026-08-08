"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"

import { ApsSummary } from "./aps-summary"
import { ProgrammeCard } from "./programme-card"
import type { ProgrammeMatch } from "./types"

export function MatcherResults({
  aps,
  rankedProgrammes,
  onReset,
  onReview,
}: {
  aps: number
  rankedProgrammes: ProgrammeMatch[]
  onReset: () => void
  onReview: () => void
}) {
  return (
    <BlurFade key="matcher-complete" direction="left" offset={16} duration={0.35}>
      <div className="space-y-5">
        <ApsSummary aps={aps} rankedProgrammes={rankedProgrammes} />

        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#17120f]">
                Likely courses
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b625c]">
                APS is calculated from the best six symbols entered. Use these as
                a guide, then confirm official requirements.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
                onClick={onReview}
              >
                Review answers
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
                onClick={onReset}
              >
                Start over
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {rankedProgrammes.slice(0, 6).map((programme) => (
              <ProgrammeCard
                key={`${programme.institution}-${programme.title}`}
                programme={programme}
              />
            ))}
          </div>
        </div>
      </div>
    </BlurFade>
  )
}
