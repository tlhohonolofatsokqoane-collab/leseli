"use client"

import { BrainCircuit, Send } from "lucide-react"
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

import { ChatPanel } from "./chat-panel"

export function FloatingChatBar() {
  const [compactInput, setCompactInput] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  const [inputExpanded, setInputExpanded] = useState(false)
  const [inputAtLimit, setInputAtLimit] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canSend = message.trim().length > 0

  useEffect(() => {
    const timer = window.setTimeout(() => setCompactInput(true), 950)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)")
    const syncViewport = () => setIsDesktop(query.matches)

    syncViewport()
    query.addEventListener("change", syncViewport)

    return () => query.removeEventListener("change", syncViewport)
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "0px"
    const maxHeight = inputExpanded ? window.innerHeight - 170 : 148
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 52), maxHeight)
    textarea.style.height = `${nextHeight}px`
    setInputAtLimit(textarea.scrollHeight > 148)
  }, [message, chatOpen, inputExpanded])

  const sendMessage = () => {
    const trimmed = message.trim()
    if (!trimmed) return

    setMessages((current) => [...current, trimmed])
    setMessage("")
    setInputExpanded(false)
  }

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <aside
        className={cn(
          "fixed bottom-4 left-1/2 z-40 -translate-x-1/2 will-change-[width,height] transition-[width,height] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          compactInput ? "h-16 w-[calc(100%-1.5rem)] max-w-4xl" : "h-14 w-14"
        )}
      >
        <div className="h-full overflow-hidden rounded-full p-0 shadow-[0_18px_60px_rgba(23,18,15,0.14)] transition-shadow duration-700">
          {compactInput ? (
            <CompactChatInput onOpen={() => setChatOpen(true)} />
          ) : (
            <button
              type="button"
              onClick={() => setCompactInput(true)}
              className="flex h-full w-full items-center justify-center rounded-full bg-[#f26a1b] text-white transition hover:bg-[#d9580f] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25"
              aria-label="Open Leseli AI input"
            >
              <BrainCircuit className="size-5" />
            </button>
          )}
        </div>
      </aside>

      {isDesktop ? (
        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogContent
            showCloseButton={false}
            className="h-[min(760px,calc(100dvh-6rem))] w-[calc(100%-3rem)] max-w-5xl gap-0 border-0 bg-transparent p-0 shadow-none ring-0 duration-500 sm:max-w-none data-closed:slide-out-to-bottom-16 data-closed:zoom-out-100 data-open:slide-in-from-bottom-16 data-open:zoom-in-100"
          >
            <DialogTitle className="sr-only">Leseli AI</DialogTitle>
            <DialogDescription className="sr-only">
              Ask about APS, courses, and applications.
            </DialogDescription>
            <ChatPanel
              canSend={canSend}
              inputAtLimit={inputAtLimit}
              inputExpanded={inputExpanded}
              message={message}
              messages={messages}
              textareaRef={textareaRef}
              onClose={() => setChatOpen(false)}
              onInputExpandChange={setInputExpanded}
              onKeyDown={handleKeyDown}
              onMessageChange={setMessage}
              onSubmit={submitMessage}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={chatOpen} onOpenChange={setChatOpen}>
          <DrawerContent className="border-0 bg-transparent [--drawer-height:calc(100dvh-1rem)]">
            <ChatPanel
              canSend={canSend}
              inputAtLimit={inputAtLimit}
              inputExpanded={inputExpanded}
              message={message}
              messages={messages}
              textareaRef={textareaRef}
              onClose={() => setChatOpen(false)}
              onInputExpandChange={setInputExpanded}
              onKeyDown={handleKeyDown}
              onMessageChange={setMessage}
              onSubmit={submitMessage}
            />
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

function CompactChatInput({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex h-full w-full animate-in fade-in-0 slide-in-from-left-2 items-center gap-2 rounded-full bg-[#faf8f5] pl-4 pr-2 duration-500">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none"
        aria-label='Ask Leseli AI instead'
      >
        <BrainCircuit className="size-4 shrink-0 text-[#f26a1b]" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#9d928a]">
          <i>Ask Leseli AI instead</i>
        </span>
      </button>
      <button
        type="button"
        disabled
        className="flex size-10 shrink-0 items-center justify-center rounded-full  bg-[#f26a1b] p-0 text-white hover:bg-[#d9580f]"
      >
        <Send className="size-4" />
      </button>
    </div>
  )
}
