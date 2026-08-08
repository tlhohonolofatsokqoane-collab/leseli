"use client"

import { Check } from "lucide-react"

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

export function ProgrammeCard({ programme }: { programme: ProgrammeMatch }) {
  return (
    <Card className="min-w-[260px] flex-1 basis-[18rem] rounded-[1.75rem] border-0 bg-[#faf8f5] py-4 shadow-none ring-0">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="secondary"
            className={cn(
              "h-6 rounded-full px-3 font-semibold",
              statusStyles(programme.evaluation.status)
            )}
          >
            {programme.evaluation.status}
          </Badge>
          <span className="text-xs font-medium text-[#9d928a]">
            {programme.duration}
          </span>
        </div>
        <div>
          <CardTitle className="text-xl font-semibold tracking-[-0.02em] text-[#17120f]">
            {programme.title}
          </CardTitle>
          <CardDescription className="text-[#756a62]">
            {programme.institution}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-6 text-[#6b625c]">{programme.note}</p>
        <div className="flex flex-wrap gap-2">
          {programme.requirements.map((requirement) => (
            <span
              key={minGradeLabel(requirement)}
              className="rounded-full bg-[#f7f4ef] px-3 py-1 text-xs font-medium text-[#6b625c]"
            >
              {minGradeLabel(requirement)}
            </span>
          ))}
          {programme.aps ? (
            <span className="rounded-full bg-[#fff1dc] px-3 py-1 text-xs font-semibold text-[#a14300]">
              APS {programme.aps}+
            </span>
          ) : null}
        </div>
        {programme.evaluation.missingSubjects.length > 0 ? (
          <p className="text-xs text-[#9d928a]">
            Check{" "}
            {programme.evaluation.missingSubjects.map(minGradeLabel).join(", ")}
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-xs font-medium text-[#c24f00]">
            <Check className="size-3.5" />
            Requirements look aligned. Confirm before applying.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
