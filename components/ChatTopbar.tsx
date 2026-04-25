"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  employeeName: string;
  role: string;
  tenure: string;
  age: number;
  onBack: () => void;
};

function TopbarTitle({
  employeeName,
  role,
  tenure,
  age,
}: Omit<Props, "onBack">) {
  return (
    <div className="min-w-0">
      <h1 className="truncate text-base font-semibold text-slate-900">
        Feedback Session: {employeeName}
      </h1>
      <p className="text-xs text-slate-400">
        {role} · {tenure} · {age}yo
      </p>
    </div>
  );
}

export function ChatTopbar(props: Props) {
  const { onBack, ...rest } = props;
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          aria-label="Back to dashboard"
          className="h-11 w-11 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <TopbarTitle {...rest} />
      </div>
    </header>
  );
}
