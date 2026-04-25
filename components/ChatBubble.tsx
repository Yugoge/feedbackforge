"use client";

import { Bot } from "lucide-react";
import { MarkdownLite } from "@/components/MarkdownLite";

type Props = {
  role: "user" | "assistant";
  content: string;
  /** Optional children rendered below the bubble (e.g. DraftActions). */
  children?: React.ReactNode;
};

function AssistantBubble({ content, children }: Omit<Props, "role">) {
  return (
    <div className="bubble-fade-in flex max-w-[80%] flex-col">
      <div className="mb-1 flex items-center gap-1 text-xs text-slate-400">
        <Bot className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Coach</span>
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-base text-slate-900">
        <MarkdownLite text={content} />
      </div>
      {children}
    </div>
  );
}

function UserBubble({ content }: Omit<Props, "role">) {
  return (
    <div className="bubble-fade-in ml-auto flex max-w-[80%] flex-col items-end">
      <div className="mb-1 text-right text-xs text-slate-400">You</div>
      <div className="rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 text-base text-white whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}

export function ChatBubble({ role, content, children }: Props) {
  if (role === "assistant") {
    return <AssistantBubble content={content}>{children}</AssistantBubble>;
  }
  return <UserBubble content={content} />;
}
