"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/types";
import {
  detectDraft,
  newMessage,
  postChat,
} from "@/lib/chat-utils";

type SessionStatus = "active" | "drafted";

type Result = {
  messages: Message[];
  isLoading: boolean;
  sessionStatus: SessionStatus;
  sendMessage: (userText?: string) => Promise<void>;
  resetSession: () => void;
};

function useAbort() {
  const ref = useRef<AbortController | null>(null);
  const swap = useCallback(() => {
    ref.current?.abort();
    const c = new AbortController();
    ref.current = c;
    return c;
  }, []);
  const abort = useCallback(() => ref.current?.abort(), []);
  return { swap, abort };
}

function useDraftDetection(
  messages: Message[],
  status: SessionStatus,
  setStatus: (s: SessionStatus) => void,
) {
  useEffect(() => {
    if (status === "drafted") return;
    if (detectDraft(messages)) setStatus("drafted");
  }, [messages, status, setStatus]);
}

async function performSend(
  employeeId: string,
  history: Message[],
  signal: AbortSignal,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
): Promise<void> {
  try {
    const content = await postChat({ employeeId, history, signal });
    setMessages((prev) => [...prev, newMessage("assistant", content)]);
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    console.error("[chat] sendMessage failed", err);
    setMessages((prev) => [
      ...prev,
      newMessage(
        "assistant",
        "Couldn't reach the coach — try again in a moment.",
      ),
    ]);
  }
}

function useInitialGreeting(
  employeeId: string | undefined,
  abort: () => void,
  send: () => Promise<void>,
) {
  const didInitRef = useRef(false);
  useEffect(() => {
    if (!employeeId || didInitRef.current) return;
    didInitRef.current = true;
    void send();
    return () => abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);
  return didInitRef;
}

function useSendMessage(
  employeeId: string | undefined,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: (b: boolean) => void,
  swap: () => AbortController,
) {
  return useCallback(
    async (userText?: string) => {
      if (!employeeId) return;
      const controller = swap();
      setIsLoading(true);
      const base = userText
        ? [...messages, newMessage("user", userText)]
        : messages;
      if (userText) setMessages(base);
      await performSend(employeeId, base, controller.signal, setMessages);
      setIsLoading(false);
    },
    [employeeId, messages, swap, setMessages, setIsLoading],
  );
}

export function useChatSession(employeeId: string | undefined): Result {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("active");
  const { swap, abort } = useAbort();

  useDraftDetection(messages, sessionStatus, setSessionStatus);
  const sendMessage = useSendMessage(
    employeeId,
    messages,
    setMessages,
    setIsLoading,
    swap,
  );
  const didInitRef = useInitialGreeting(employeeId, abort, sendMessage);

  const resetSession = useCallback(() => {
    abort();
    setMessages([]);
    setSessionStatus("active");
    didInitRef.current = false;
  }, [abort, didInitRef]);

  return { messages, isLoading, sessionStatus, sendMessage, resetSession };
}
