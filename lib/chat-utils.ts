import type { Message } from "@/lib/types";

// Spec 5.7.4 + ui-specialist F9: regex tolerates *single* OR **double**
// asterisks AND only triggers when messages.length >= 3 (so the assistant
// can't flag a draft on the very first turn).
const DRAFT_REGEX = /\*+\s*(Feedback Draft|Delivery Guidance)\s*\*+/i;

export type ApiMessage = { role: "user" | "assistant"; content: string };

export function newMessage(
  role: "user" | "assistant",
  content: string,
): Message {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: new Date(),
  };
}

export function toApiMessages(messages: Message[]): ApiMessage[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

export function detectDraft(messages: Message[]): boolean {
  if (messages.length < 3) return false;
  const last = messages[messages.length - 1];
  if (!last || last.role !== "assistant") return false;
  return DRAFT_REGEX.test(last.content);
}

type FetchArgs = {
  employeeId: string;
  history: Message[];
  signal: AbortSignal;
};

export async function postChat({
  employeeId,
  history,
  signal,
}: FetchArgs): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employeeId, messages: toApiMessages(history) }),
    signal,
  });
  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(errBody.error ?? `HTTP ${res.status}`);
  }
  const data = (await res.json()) as { content: string };
  return data.content ?? "";
}
