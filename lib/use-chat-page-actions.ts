"use client";

import { useRouter } from "next/navigation";

type Args = {
  sendMessage: (text?: string) => Promise<void>;
  resetSession: () => void;
  setToast: (s: string | null) => void;
};

export function useChatPageActions({
  sendMessage,
  resetSession,
  setToast,
}: Args) {
  const router = useRouter();
  const onAccept = () => {
    setToast("Draft ready — copy it before your 1:1");
    setTimeout(() => router.push("/"), 2000);
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
