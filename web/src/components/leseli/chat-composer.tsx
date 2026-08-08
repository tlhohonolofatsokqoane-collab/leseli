"use client"

import {
  FileText,
  ImageIcon,
  Maximize2,
  Minimize2,
  Paperclip,
  Send,
} from "lucide-react"
import { FormEvent, KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ChatComposer({
  canSend,
  inputAtLimit,
  inputExpanded,
  message,
  textareaRef,
  onInputExpandChange,
  onKeyDown,
  onMessageChange,
  onSubmit,
}: {
  canSend: boolean
  inputAtLimit: boolean
  inputExpanded: boolean
  message: string
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onInputExpandChange: (expanded: boolean) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onMessageChange: (message: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const showExpandButton = inputAtLimit || inputExpanded
  const textarea = (
    <textarea
      ref={textareaRef}
      value={message}
      onChange={(event) => onMessageChange(event.target.value)}
      onKeyDown={onKeyDown}
      placeholder='Ask Leseli AI'
      rows={1}
      className={cn(
        "flex-1 resize-none bg-transparent px-4 py-3 text-base leading-7 text-[#17120f] outline-none placeholder:text-[#9d928a] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        showExpandButton && "pr-14",
        inputExpanded
          ? "h-full max-h-none min-h-0 w-full"
          : "max-h-36 min-h-13"
      )}
    />
  )
  const actions = (
    <ComposerActions
      canSend={canSend}
    />
  )

  return (
    <form
      className={cn(
        "absolute z-20 flex items-end gap-2 rounded-[1.75rem] bg-white p-2 shadow-[0_16px_48px_rgba(23,18,15,0.12)] transition-[inset,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        inputExpanded
          ? "inset-3 flex-col md:inset-6"
          : "inset-x-3 bottom-3 md:inset-x-6 md:bottom-6"
      )}
      onSubmit={onSubmit}
    >
      {showExpandButton ? (
        <ExpandComposerButton
          inputExpanded={inputExpanded}
          onInputExpandChange={onInputExpandChange}
        />
      ) : null}
      {inputExpanded ? (
        <>
          {textarea}
          <div className="flex w-full items-center justify-between gap-2">
            <AttachMenu />
            {actions}
          </div>
        </>
      ) : (
        <>
          <AttachMenu />
          {textarea}
          {actions}
        </>
      )}
    </form>
  )
}

function ExpandComposerButton({
  inputExpanded,
  onInputExpandChange,
}: {
  inputExpanded: boolean
  onInputExpandChange: (expanded: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onInputExpandChange(!inputExpanded)}
      className="absolute right-3 top-3 z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f6f3ef] text-[#6b625c] transition hover:bg-[#fff1dc] hover:text-[#17120f] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25"
      aria-label={inputExpanded ? "Shrink chat input" : "Expand chat input"}
    >
      {inputExpanded ? (
        <Minimize2 className="size-4" />
      ) : (
        <Maximize2 className="size-4" />
      )}
    </button>
  )
}

function AttachMenu() {
  return (
    <div className="shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="mb-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f6f3ef] text-[#6b625c] transition hover:bg-[#fff1dc] hover:text-[#17120f] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25"
              aria-label="Attach file"
            />
          }
        >
          <Paperclip className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="top"
          sideOffset={10}
          className="w-56 rounded-2xl border-0 bg-white p-2 text-[#17120f] shadow-[0_18px_60px_rgba(23,18,15,0.14)] ring-0"
        >
          <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-3 text-sm font-medium focus:bg-[#fff1dc]">
            <ImageIcon className="size-4 text-[#f26a1b]" />
            Upload photo
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-3 text-sm font-medium focus:bg-[#fff1dc]">
            <FileText className="size-4 text-[#f26a1b]" />
            Upload documents
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function ComposerActions({
  canSend,
}: {
  canSend: boolean
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        type="submit"
        disabled={!canSend}
        className="mb-1 size-10 shrink-0 rounded-full bg-[#f26a1b] p-0 text-white hover:bg-[#d9580f] disabled:bg-[#e6ded6] disabled:text-[#a99f96]"
        aria-label="Send message"
      >
        <Send className="size-4" />
      </Button>
    </div>
  )
}
