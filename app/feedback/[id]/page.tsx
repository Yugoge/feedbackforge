"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { getEmployeeById } from "@/lib/employees";
import { ChatPageBody } from "@/components/ChatPageBody";

type Props = { params: { id: string } };

function useNotFoundRedirect(found: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (!found) router.replace("/");
  }, [found, router]);
}

export default function FeedbackChatPage({ params }: Props) {
  const employee = useMemo(() => getEmployeeById(params.id), [params.id]);
  useNotFoundRedirect(Boolean(employee));
  if (!employee) return null;
  return <ChatPageBody employee={employee} />;
}
