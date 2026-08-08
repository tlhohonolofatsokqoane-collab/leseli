"use client"

import Image from "next/image"

import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"

import { CtaButton } from "./cta-button"
import { scrollToSection } from "./helpers"

export function HeroSection() {
  return (
    <section className="grid min-h-screen gap-x-12 gap-y-8 pb-14 pt-32 lg:grid-cols-[0.92fr_1.08fr] lg:grid-rows-[auto_auto] lg:content-center lg:items-center lg:pt-28">
      <BlurFade
        className="order-1 max-w-3xl"
        direction="up"
        offset={18}
        duration={0.55}
      >
        <div className="space-y-5">
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#17120f] sm:text-7xl">
            Find the path your grades can unlock.
          </h1>
          <p className="max-w-xl text-xl leading-8 text-[#6b625c]">
            Leseli helps students move from LGCSE results to realistic study
            options across Lesotho.
          </p>
        </div>
      </BlurFade>

      <BlurFade
        className="relative order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        direction="left"
        offset={18}
        delay={0.12}
        duration={0.55}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-[#eee7df] bg-white shadow-[0_30px_100px_rgba(37,30,24,0.10)]">
          <div className="relative aspect-[16/11]">
            <Image
              src="/leseli-students.png"
              alt="Students using phones together on campus"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 44rem, 100vw"
            />
          </div>
        </div>
      </BlurFade>

      <BlurFade
        className="order-3 flex w-full flex-col items-stretch gap-3 lg:col-start-1 lg:row-start-2 lg:flex-row lg:items-center"
        direction="up"
        offset={12}
        delay={0.08}
        duration={0.45}
      >
        <CtaButton href="#matcher" className="w-full lg:w-auto">
          Check my options
        </CtaButton>
        <Button
          type="button"
          onClick={() => scrollToSection("#institutions")}
          variant="secondary"
          className="h-12 w-full rounded-full bg-[#f4f1ed] px-6 text-base font-semibold hover:bg-[#ebe5de] lg:w-auto"
        >
          Browse institutions
        </Button>
      </BlurFade>
    </section>
  )
}
