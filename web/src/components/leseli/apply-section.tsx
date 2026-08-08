"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { minGradeLabel, statusStyles } from "./helpers"
import type { ProgrammeMatch } from "./types"

export function ApplySection({ topMatch }: { topMatch: ProgrammeMatch | null }) {
  const checklist = topMatch
    ? [
        [
          "Verify the entry rule",
          [
            topMatch.aps ? `APS ${topMatch.aps}+` : "Confirm the APS rule",
            ...topMatch.requirements.map(minGradeLabel),
          ].join(" · "),
        ],
        [
          "Compare the real fit",
          `Check fees, campus, accommodation, and support at ${topMatch.institution}.`,
        ],
        [
          "Prepare the application",
          "Gather your results slip, ID copy, application fee proof, and any programme forms.",
        ],
      ]
    : [
        [
          "Run the matcher",
          "Enter your symbols first so Leseli can turn this into a programme-specific checklist.",
        ],
        [
          "Compare the top options",
          "Once results appear, look beyond eligibility: fees, location, support, and duration matter.",
        ],
        [
          "Prepare the essentials",
          "Keep your results slip, ID copy, payment proof, and application forms close.",
        ],
      ]

  return (
    <Card className="rounded-[2rem] border-0 bg-[#faf8f5] py-7 shadow-none ring-0">
      <CardHeader>
        {topMatch ? (
          <div className="mb-2 rounded-3xl bg-white p-5">
            <Badge
              variant="secondary"
              className={cn(
                "mb-4 h-6 rounded-full px-3 font-semibold",
                statusStyles(topMatch.evaluation.status)
              )}
            >
              Top match
            </Badge>
            <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-[#17120f]">
              Before you apply to {topMatch.title}
            </CardTitle>
            <CardDescription className="mt-2 text-base leading-7 text-[#6b625c]">
              {topMatch.institution} · {topMatch.duration}
            </CardDescription>
          </div>
        ) : (
          <>
            <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-[#17120f]">
              Your next steps will appear here.
            </CardTitle>
            <CardDescription className="text-base leading-7 text-[#6b625c]">
              Finish the matcher and Leseli will turn the top result into a
              focused apply checklist.
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {checklist.map(([title, body], index) => (
            <div key={title} className="flex gap-4 rounded-3xl bg-white p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff1dc] text-sm font-semibold text-[#c24f00]">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-[#221a15]">{title}</p>
                <p className="mt-1 text-sm leading-6 text-[#6b625c]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
