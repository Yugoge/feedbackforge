"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onAccept: () => void;
  onRefine: () => void;
  onStartOver: () => void;
};

// 3 action buttons rendered below the assistant draft message (spec 5.7.4).
// Toast text in M24 is intentionally softened to avoid implying persistence
// (ui-specialist F11): "Draft ready — copy it before your 1:1".
export function DraftActions({ onAccept, onRefine, onStartOver }: Props) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Button
        onClick={onAccept}
        className="min-h-11 bg-green-600 text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
      >
        Accept &amp; Save
      </Button>
      <Button
        onClick={onRefine}
        variant="outline"
        className="min-h-11 border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Refine Further
      </Button>
      <Button
        onClick={onStartOver}
        variant="outline"
        className="min-h-11 border-slate-300 text-slate-600 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
      >
        Start Over
      </Button>
    </div>
  );
}
