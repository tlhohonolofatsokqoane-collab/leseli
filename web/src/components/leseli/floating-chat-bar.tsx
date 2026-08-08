"use client"

import { MessageCircle, Send, Sparkles, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const suggestions = [
  "What can I study with my APS?",
  "Explain these requirements",
  "Help me compare two options",
]

export function FloatingChatBar() {
  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState("")

  return (
    <aside
      className={cn(
        "fixed bottom-4 left-1/2 z-40 -translate-x-1/2 transition-[width,height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        expanded
          ? "h-[360px] w-[calc(100%-1.5rem)] max-w-3xl"
          : "h-14 w-[calc(100%-1.5rem)] max-w-xl"
      )}
    >
      <div className="h-full overflow-hidden rounded-[2rem] border border-[#eee7df] bg-white/95 p-2 shadow-[0_18px_60px_rgba(23,18,15,0.12)] backdrop-blur-xl">
        <div
          className={cn(
            "flex h-full flex-col transition-all duration-300 ease-out",
            expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-100"
          )}
        >
          {expanded ? (
            <ExpandedChat
              message={message}
              onClose={() => setExpanded(false)}
              onMessageChange={setMessage}
            />
          ) : (
            <CollapsedChat onExpand={() => setExpanded(true)} />
          )}
        </div>
      </div>
    </aside>
  )
}

function CollapsedChat({ onExpand }: { onExpand: () => void }) {
  return (
    <button
      type="button"
      onClick={onExpand}
      className="flex h-full w-full items-center gap-3 rounded-full px-3 text-left transition hover:bg-[#faf8f5] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25"
      aria-label='Ask "Leseli AI"'
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fff1dc] text-[#f26a1b]">
        <Sparkles className="size-4" />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#8a7f76]">
        Ask &quot;Leseli AI&quot;
      </span>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f26a1b] text-white">
        <MessageCircle className="size-4" />
      </span>
    </button>
  )
}

function ExpandedChat({
  message,
  onClose,
  onMessageChange,
}: {
  message: string
  onClose: () => void
  onMessageChange: (message: string) => void
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 px-2 pb-3 pt-1">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#fff1dc] text-[#f26a1b]">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="font-semibold tracking-[-0.02em] text-[#17120f]">
              Leseli AI
            </p>
            <p className="text-xs font-medium text-[#8a7f76]">
              Ask about APS, courses, and applications.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full bg-[#f6f3ef] text-[#17120f] transition hover:bg-[#eee7df] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25"
          aria-label="Close Leseli AI chat"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-end rounded-[1.5rem] bg-[#faf8f5] p-4">
        <div className="mb-4 max-w-md rounded-3xl bg-white p-4">
          <p className="text-sm font-semibold text-[#17120f]">
            How can Leseli help?
          </p>
          <p className="mt-2 text-sm leading-6 text-[#6b625c]">
            Ask about APS, programme matches, requirements, or what to prepare
            before applying.
          </p>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onMessageChange(suggestion)}
              className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#6b625c] transition hover:bg-[#fff1dc] hover:text-[#17120f]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <form
        className="mt-2 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <Input
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder='Ask "Leseli AI"'
          className="h-12 rounded-full border-0 bg-[#faf8f5] px-5 text-base shadow-none focus-visible:ring-orange-500/30"
        />
        <Button
          type="submit"
          className="size-12 shrink-0 rounded-full bg-[#f26a1b] p-0 text-white hover:bg-[#d9580f]"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </>
  )
}
