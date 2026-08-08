"use client"

import { Card, CardContent } from "@/components/ui/card"
import { NumberTicker } from "@/components/ui/number-ticker"

import type { ProgrammeMatch } from "./types"

export function ApsSummary({
  aps,
  rankedProgrammes,
}: {
  aps: number
  rankedProgrammes: ProgrammeMatch[]
}) {
  const metrics = [
    [
      rankedProgrammes.filter((item) => item.evaluation.status === "Likely")
        .length,
      "likely",
    ],
    [
      rankedProgrammes.filter((item) => item.evaluation.status === "Close").length,
      "close",
    ],
    [rankedProgrammes.length, "paths"],
  ]

  return (
    <Card className="rounded-[2rem] border-0 bg-[#fff7ed] py-0 text-[#17120f] shadow-none ring-0">
      <CardContent className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="rounded-[1.75rem] bg-white p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a14300]">
            Estimated APS
          </p>
          <div className="mt-3 flex items-end justify-center gap-2">
            <NumberTicker
              value={aps}
              className="text-7xl font-semibold tracking-[-0.06em] text-[#17120f]"
            />
            <span className="pb-3 text-sm font-semibold text-[#8a4b12]">
              pts
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#17120f]">
            Here is the shape of your options.
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b625c]">
            This estimate uses your best six symbols. It is a guide for narrowing
            options, not a replacement for official admissions requirements.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {metrics.map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white px-4 py-3">
                <NumberTicker
                  value={Number(value)}
                  className="text-2xl font-semibold tracking-normal text-[#17120f]"
                />
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8a4b12]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
