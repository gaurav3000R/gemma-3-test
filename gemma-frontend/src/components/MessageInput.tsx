"use client";

import { FormEvent } from "react";
import Image from "next/image";

interface MessageInputProps {
  input: string;
  setInput: (val: string) => void;
  handleSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export const MessageInput = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
}: MessageInputProps) => (
  <div className="border-t border-border bg-background p-4">
    <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-3xl">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full resize-none rounded-lg border border-input bg-secondary p-3 pr-12 text-foreground placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        placeholder="Ask Gemma anything..."
        disabled={isLoading}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        className="absolute bottom-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-secondary"
        disabled={isLoading || !input.trim()}
      >
        <Image src="/icons/send.svg" alt="Send" width={16} height={16} />
      </button>
    </form>
  </div>
);