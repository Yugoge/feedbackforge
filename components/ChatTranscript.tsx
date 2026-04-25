"use client";

import type { Message } from "@/lib/types";
import { ChatBubble } from "@/components/ChatBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { DraftActions } from "@/components/DraftActions";
import { EmptyState } from "@/components/EmptyState";

type DraftActionHandlers = {
  onAccept: () => void;
  onRefine: () => void;
  onStartOver: () => void;
};

type Props = {
  messages: Message[];
  isLoading: boolean;
  showActionsOnLast: boolean;
  draftActions: DraftActionHandlers;
  endRef: React.RefObject<HTMLDivElement>;
};

function MessageList({
  messages,
  showActionsOnLast,
  draftActions,
}: Pick<Props, "messages" | "showActionsOnLast" | "draftActions">) {
  return (
    <>
      {messages.map((m, idx) => (
        <ChatBubble key={m.id} role={m.role} content={m.content}>
          {showActionsOnLast && idx === messages.length - 1 ? (
            <DraftActions {...draftActions} />
          ) : null}
        </ChatBubble>
      ))}
    </>
  );
}

export function ChatTranscript({
  messages,
  isLoading,
  showActionsOnLast,
  draftActions,
  endRef,
}: Props) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 overflow-y-auto px-0 py-4 sm:px-4">
      {messages.length === 0 ? <EmptyState /> : null}
      <MessageList
        messages={messages}
        showActionsOnLast={showActionsOnLast}
        draftActions={draftActions}
      />
      {isLoading && messages.length > 0 ? <TypingIndicator /> : null}
      <div ref={endRef} />
    </main>
  );
}
