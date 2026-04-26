"use client";

import { useRouter } from "next/navigation";
import type { Message } from "@/lib/types";

type Args = {
  sendMessage: (text?: string) => Promise<void>;
  resetSession: () => void;
  setToast: (s: string | null) => void;
  messages: Message[];
};

const ACCEPT_TOAST =
  "Copied to clipboard! Both the feedback draft and delivery guidance are ready to paste into your notes.";

function getLastAssistantContent(messages: Message[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") return messages[i].content ?? "";
  }
  return "";
}

export function useChatPageActions({
  sendMessage,
  resetSession,
  setToast,
  messages,
}: Args) {
  const router = useRouter();
  const onAccept = () => {
    const draft = getLastAssistantContent(messages);
    try {
      void navigator.clipboard?.writeText(draft);
    } catch {
      // Best-effort: clipboard API may be unavailable (insecure context,
      // permission denied, missing user gesture). The toast + navigation
      // still proceed so the manager has the visual confirmation.
    }
    setToast(ACCEPT_TOAST);
    setTimeout(() => router.push("/"), 3000);
  };
  const onRefine = () => {
    void sendMessage("I'd like to adjust this draft.");
  };
  const onStartOver = () => {
    resetSession();
    // The initial-greeting effect inside useChatSession is keyed on
    // employeeId; we trigger a fresh greeting manually after a microtask.
    setTimeout(() => void sendMessage(), 0);
  };
  return { onAccept, onRefine, onStartOver };
}
