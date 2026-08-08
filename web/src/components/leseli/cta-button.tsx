"use client"

import { useEffect, useState } from "react"

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { cn } from "@/lib/utils"

import { scrollToSection } from "./helpers"

export function CtaButton({
  children,
  href,
  className,
  onNavigate,
}: {
  children: string
  href: string
  className?: string
  onNavigate?: () => void
}) {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimationComplete(true), 550)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <InteractiveHoverButton
      type="button"
      active={animationComplete}
      onClick={() => {
        onNavigate?.()
        scrollToSection(href)
      }}
      className={cn(
        "h-12 border-[#f26a1b] bg-white px-6 text-base text-[#17120f] shadow-sm transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </InteractiveHoverButton>
  )
}
