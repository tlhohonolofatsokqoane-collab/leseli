"use client"

import { cn } from "@/lib/utils"

import type { Grade } from "./types"

export function GradeButton({
  active,
  grade,
  onClick,
}: {
  active: boolean
  grade: Exclude<Grade, "">
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-14 min-w-14 rounded-2xl px-4 text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25",
        active
          ? "bg-[#f26a1b] text-white shadow-[0_8px_22px_rgba(242,106,27,0.25)]"
          : "bg-[#f4f4f1] text-[#6b625c] hover:bg-[#ffe7cf] hover:text-[#b24600]"
      )}
      aria-pressed={active}
    >
      {grade}
    </button>
  )
}
