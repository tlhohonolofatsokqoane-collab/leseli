"use client"

import { BrainCircuit, X } from "lucide-react"
import { FormEvent, KeyboardEvent } from "react"

import { ChatComposer } from "./chat-composer"

const suggestions = [
  "What can I study with my APS?",
  "Explain these requirements",
  "Help me compare two options",
]

export function ChatPanel({
  canSend,
  inputAtLimit,
  inputExpanded,
  message,
  messages,
  textareaRef,
  onClose,
  onInputExpandChange,
  onKeyDown,
  onMessageChange,
  onSubmit,
}: {
  canSend: boolean
  inputAtLimit: boolean
  inputExpanded: boolean
  message: string
  messages: string[]
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onClose: () => void
  onInputExpandChange: (expanded: boolean) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onMessageChange: (message: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-t-[2rem] bg-[#faf8f5] md:rounded-[2rem]">
      <div className="flex items-center justify-between gap-3 p-4 text-left md:px-6 md:pt-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#fff1dc] text-[#f26a1b]">
            <BrainCircuit className="size-4" />
          </span>
          <p className="font-semibold tracking-[-0.02em] text-[#17120f]">
            Leseli AI
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full bg-white text-[#17120f] transition hover:bg-[#eee7df] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25"
          aria-label="Close Leseli AI chat"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-32 pt-2 md:px-6 md:pb-40">
        {messages.length === 0 ? (
          <EmptyChat onSuggestion={onMessageChange} />
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      <ChatComposer
        canSend={canSend}
        inputAtLimit={inputAtLimit}
        inputExpanded={inputExpanded}
        message={message}
        textareaRef={textareaRef}
        onInputExpandChange={onInputExpandChange}
        onKeyDown={onKeyDown}
        onMessageChange={onMessageChange}
        onSubmit={onSubmit}
      />
    </div>
  )
}

function EmptyChat({ onSuggestion }: { onSuggestion: (message: string) => void }) {
  return (
    <div className="mx-auto mt-16 max-w-xl text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#fff1dc] text-[#f26a1b]">
        <BrainCircuit className="size-5" />
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#17120f]">
        How can Leseli help?
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#6b625c]">
        Ask about APS, programme matches, requirements, or what to prepare before
        applying.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestion(suggestion)}
            className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#6b625c] transition hover:bg-[#fff1dc] hover:text-[#17120f]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageList({ messages }: { messages: string[] }) {
  return (
    <div className="space-y-4">
      {messages.map((item, index) => (
        <div key={`${item}-${index}`} className="space-y-3">
          <div className="ml-auto max-w-[78%] rounded-[1.4rem] bg-[#f26a1b] px-4 py-3 text-sm leading-6 text-white">
            {item}
          </div>
          <div className="max-w-[78%] rounded-[1.4rem] bg-white px-4 py-3 text-sm leading-6 text-[#6b625c]">
            Leseli AI is not connected yet. This is where the guidance response
            will appear.
          </div>
        </div>
      ))}
    </div>
  )
}
