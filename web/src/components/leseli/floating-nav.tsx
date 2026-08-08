"use client"

import { ArrowRight, Menu, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { scrollToSection } from "./helpers"
import { LeseliLogo } from "./leseli-logo"

type NavMode = "expanded" | "shrinking" | "hamburger"

export function FloatingNav() {
  const [navMode, setNavMode] = useState<NavMode>("expanded")
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)
  const shrinkTimer = useRef<number | null>(null)
  const navModeRef = useRef<NavMode>("expanded")

  const setNavModeState = useCallback((mode: NavMode) => {
    navModeRef.current = mode
    setNavMode(mode)
  }, [])

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const clearShrinkTimer = () => {
      if (shrinkTimer.current) {
        window.clearTimeout(shrinkTimer.current)
        shrinkTimer.current = null
      }
    }
    const expandNav = () => {
      clearShrinkTimer()
      setNavModeState("expanded")
      setMenuOpen(false)
    }
    const collapseNav = () => {
      if (navModeRef.current !== "expanded") return

      clearShrinkTimer()
      setMenuOpen(false)
      setNavModeState("shrinking")
      shrinkTimer.current = window.setTimeout(() => {
        setNavModeState("hamburger")
        shrinkTimer.current = null
      }, 320)
    }
    const onScroll = () => {
      const currentY = window.scrollY
      const distance = currentY - lastScrollY.current

      if (currentY < 40) expandNav()
      else if (distance > 8) collapseNav()
      else if (distance < -8) expandNav()

      lastScrollY.current = currentY
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      clearShrinkTimer()
      window.removeEventListener("scroll", onScroll)
    }
  }, [setNavModeState])

  const flipped = navMode === "hamburger" && !menuOpen
  const contentVisible = navMode === "expanded"
  const openExpandedNav = () => {
    if (shrinkTimer.current) {
      window.clearTimeout(shrinkTimer.current)
      shrinkTimer.current = null
    }

    setNavModeState("expanded")
    setMenuOpen(true)
  }

  return (
    <header
      className={cn(
        "fixed left-1/2 top-4 z-50 -translate-x-1/2 [perspective:1200px] transition-[width,height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        navMode === "hamburger" || navMode === "shrinking"
          ? "h-12 w-12"
          : menuOpen
            ? "h-[292px] w-[calc(100%-1.5rem)] max-w-3xl md:h-[60px] md:w-[500px]"
            : "h-[60px] w-[calc(100%-1.5rem)] max-w-3xl md:w-[500px]"
      )}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]",
          flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        <ExpandedFace
          contentVisible={contentVisible}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <button
          type="button"
          onClick={openExpandedNav}
          className="absolute inset-0 flex items-center justify-center rounded-full border border-[#eee7df] bg-white text-[#17120f] shadow-[0_12px_36px_rgba(23,18,15,0.12)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  )
}

function ExpandedFace({
  contentVisible,
  menuOpen,
  setMenuOpen,
}: {
  contentVisible: boolean
  menuOpen: boolean
  setMenuOpen: (value: boolean | ((current: boolean) => boolean)) => void
}) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-[#eee7df] bg-white/95 px-2 py-1.5 shadow-[0_18px_50px_rgba(23,18,15,0.10)] backdrop-blur-xl [backface-visibility:hidden] sm:px-2">
      <div
        className={cn(
          "flex h-12 items-center justify-between gap-2 transition-all duration-300 ease-out md:h-full md:justify-around",
          contentVisible ? "translate-x-0 opacity-100 delay-300" : "-translate-x-4 opacity-0"
        )}
      >
        <div className="flex h-fit items-center gap-2">
          <a href="#" aria-label="Leseli home" className="block">
            <LeseliLogo className="h-8 w-14 md:h-9 md:w-16" priority />
          </a>
          <Separator
            orientation="vertical"
            className="hidden h-7 self-center bg-[#e7ded5] md:block"
          />
        </div>
        <nav className="hidden items-center gap-3 text-sm font-medium text-[#6f665f] md:flex">
          <a className="transition hover:text-[#17120f]" href="#matcher">Matcher</a>
          <a className="transition hover:text-[#17120f]" href="#institutions">Institutions</a>
          <a className="transition hover:text-[#17120f]" href="#resources">Apply</a>
        </nav>
        <Button
          type="button"
          onClick={() => scrollToSection("#matcher")}
          className="hidden h-10 min-w-32 rounded-full bg-[#f26a1b] px-5 font-semibold text-white hover:bg-[#d9580f] sm:inline-flex"
        >
          Start
          <ArrowRight className="ml-1 size-4" />
        </Button>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex size-10 items-center justify-center rounded-full bg-[#f6f3ef] text-[#17120f] transition hover:bg-[#eee7df] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25 md:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  )
}

function MobileMenu({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean
  setMenuOpen: (value: boolean) => void
}) {
  return (
    <div
      className={cn(
        "grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
        menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <nav className="flex flex-col gap-2 pt-4 text-sm font-semibold text-[#17120f]">
          {[
            ["Matcher", "#matcher"],
            ["Institutions", "#institutions"],
            ["Apply", "#resources"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl bg-[#f8f6f2] px-4 py-3 transition hover:bg-[#fff1dc]"
            >
              {label}
            </a>
          ))}
          <Button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              scrollToSection("#matcher")
            }}
            className="mt-1 h-11 rounded-full bg-[#f26a1b] font-semibold text-white hover:bg-[#d9580f] sm:hidden"
          >
            Start
          </Button>
        </nav>
      </div>
    </div>
  )
}
