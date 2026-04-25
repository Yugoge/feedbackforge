"use client";

import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  isLoading: boolean;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

function isComposingEnter(e: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing;
}

export function ChatInput({ value, isLoading, onChange, onSubmit }: Props) {
  const disabled = value.trim() === "" || isLoading;
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isComposingEnter(e)) return;
    e.preventDefault();
    if (!disabled) onSubmit();
  };
  return (
    <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-end gap-2 px-3 py-3 sm:px-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your response..."
          rows={2}
          className="min-h-[44px] max-h-32 resize-none text-base"
        />
        <Button
          onClick={onSubmit}
          disabled={disabled}
          aria-label="Send message"
          className="h-11 w-11 shrink-0 bg-blue-600 p-0 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
