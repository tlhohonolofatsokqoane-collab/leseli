"use client"

import { BlurFade } from "@/components/ui/blur-fade"

import { ApplySection } from "./apply-section"
import type { ProgrammeMatch } from "./types"

export function ApplySectionBlock({ topMatch }: { topMatch: ProgrammeMatch | null }) {
  return (
    <section id="resources" className="grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr]">
      <BlurFade direction="up" inView offset={16}>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f26a1b]">
          Apply
        </p>
        <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Make the next move obvious.
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#6b625c]">
          The best result page does not just say yes or no. It tells a student
          what to check, compare, and prepare.
        </p>
      </BlurFade>

      <BlurFade direction="left" inView offset={18}>
        <ApplySection topMatch={topMatch} />
      </BlurFade>
    </section>
  )
}
