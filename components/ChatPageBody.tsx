"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { Employee, Message } from "@/lib/types";
import { useChatSession } from "@/lib/use-chat-session";
import { useChatPageActions } from "@/lib/use-chat-page-actions";

import { ChatTopbar } from "@/components/ChatTopbar";
import { ChatInput } from "@/components/ChatInput";
import { ChatTranscript } from "@/components/ChatTranscript";
import { Toast } from "@/components/EmptyState";

type Props = { employee: Employee };

function useAutoScroll(deps: ReadonlyArray<unknown>) {
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return endRef;
}

function lastIsDraft(messages: Message[], status: string): boolean {
  if (status !== "drafted") return false;
  if (messages.length === 0) return false;
  return messages[messages.length - 1].role === "assistant";
}

type LayoutProps = {
  employee: Employee;
  session: ReturnType<typeof useChatSession>;
  inputValue: string;
  setInputValue: (s: string) => void;
  toast: string | null;
  draftActions: ReturnType<typeof useChatPageActions>;
  endRef: React.RefObject<HTMLDivElement>;
  onBack: () => void;
  onSubmit: () => void;
};

function ChatLayout(props: LayoutProps) {
  const { employee, session, inputValue, setInputValue } = props;
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <ChatTopbar
        employeeName={employee.name}
        role={employee.role}
        tenure={employee.tenure}
        age={employee.age}
        onBack={props.onBack}
      />
      <ChatTranscript
        messages={session.messages}
        isLoading={session.isLoading}
        showActionsOnLast={lastIsDraft(session.messages, session.sessionStatus)}
        draftActions={props.draftActions}
        endRef={props.endRef}
      />
      <ChatInput
        value={inputValue}
        isLoading={session.isLoading}
        onChange={setInputValue}
        onSubmit={props.onSubmit}
      />
      {props.toast ? <Toast text={props.toast} /> : null}
    </div>
  );
}

function useSubmitHandler(
  inputValue: string,
  setInputValue: (s: string) => void,
  send: (s?: string) => Promise<void>,
) {
  return () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    void send(text);
  };
}

export function ChatPageBody({ employee }: Props) {
  const router = useRouter();
  const session = useChatSession(employee.id);
  const [inputValue, setInputValue] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const endRef = useAutoScroll([session.messages.length, session.isLoading]);
  const draftActions = useChatPageActions({
    sendMessage: session.sendMessage,
    resetSession: session.resetSession,
    setToast,
  });
  const onSubmit = useSubmitHandler(inputValue, setInputValue, session.sendMessage);
  return (
    <ChatLayout
      employee={employee}
      session={session}
      inputValue={inputValue}
      setInputValue={setInputValue}
      toast={toast}
      draftActions={draftActions}
      endRef={endRef}
      onBack={() => router.push("/")}
      onSubmit={onSubmit}
    />
  );
}
