"use client"

import { footerGroups } from "./data"
import { LeseliLogo } from "./leseli-logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-[#f0ebe5] py-12">
      <div className="grid gap-10 text-sm md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <LeseliLogo className="h-16 w-28" />
          <p className="mt-3 max-w-xs leading-6 text-[#8a7f76]">
            Study choices, made clearer for students comparing options in Lesotho.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <p className="font-semibold text-[#17120f]">{group.title}</p>
            <div className="mt-4 flex flex-col gap-3 text-[#8a7f76]">
              {group.links.map(([label, href]) => (
                <a
                  key={label}
                  className="transition hover:text-[#17120f]"
                  href={href}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-3 text-xs font-medium text-[#9d928a] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Leseli. All rights reserved.</p>
        <p>Guidance only. Always confirm official entry requirements.</p>
      </div>
    </footer>
  )
}
