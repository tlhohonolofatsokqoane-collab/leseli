"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

export function LeseliLogo({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <span
      className={cn(
        "relative block overflow-hidden ",
        className
      )}
    >
      <Image
        src="/leseli-logo.png"
        alt="Leseli"
        fill
        priority={priority}
        sizes="96px"
        className="object-cover scale-[1.6]"
      />
    </span>
  )
}
