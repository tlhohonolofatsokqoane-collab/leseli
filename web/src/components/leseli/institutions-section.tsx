"use client"

import { Building2 } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

import { institutionRows } from "./data"

export function InstitutionsSection() {
  return (
    <section id="institutions" className="py-16">
      <BlurFade
        className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        direction="up"
        inView
        offset={16}
      >
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f26a1b]">
            Institutions
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Keep the landscape visible.
          </h2>
        </div>
        <p className="max-w-lg text-lg leading-8 text-[#6b625c]">
          A simple institution layer helps students compare before they commit
          attention, fees, and applications.
        </p>
      </BlurFade>
      <BlurFade
        className="relative overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        direction="up"
        inView
        offset={14}
      >
        <div className="space-y-4">
          {institutionRows.map((row, rowIndex) => (
            <Marquee
              key={row.join("-")}
              pauseOnHover
              reverse={rowIndex === 1}
              className={cn("[--duration:32s]", rowIndex === 1 && "[--duration:38s]")}
            >
              {row.map((institution) => (
                <div
                  key={institution}
                  className="mx-2 flex h-16 min-w-56 items-center justify-between rounded-3xl bg-[#faf8f5] px-5"
                >
                  <span className="font-semibold text-[#221a15]">
                    {institution}
                  </span>
                  <Building2 className="size-4 text-[#f26a1b]" />
                </div>
              ))}
            </Marquee>
          ))}
        </div>
      </BlurFade>
    </section>
  )
}
