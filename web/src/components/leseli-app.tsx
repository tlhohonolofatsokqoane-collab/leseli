"use client"

import { useState } from "react"

import { ApplySectionBlock } from "@/components/leseli/apply-section-block"
import { FloatingNav } from "@/components/leseli/floating-nav"
import { GradeMatcher } from "@/components/leseli/grade-matcher"
import { HeroSection } from "@/components/leseli/hero-section"
import { InstitutionsSection } from "@/components/leseli/institutions-section"
import { SiteFooter } from "@/components/leseli/site-footer"
import type { ProgrammeMatch } from "@/components/leseli/types"

export function LeseliApp() {
  const [topMatch, setTopMatch] = useState<ProgrammeMatch | null>(null)

  return (
    <main className="min-h-screen bg-white text-[#17120f]">
      <FloatingNav />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <HeroSection />
        <GradeMatcher onTopMatchChange={setTopMatch} />
        <InstitutionsSection />
        <ApplySectionBlock topMatch={topMatch} />
        <SiteFooter />
      </div>
    </main>
  )
}
