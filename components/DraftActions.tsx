"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onAccept: () => void;
  onRefine: () => void;
  onStartOver: () => void;
};

// 2 action buttons rendered below the assistant draft message (spec 5.7.4).
// CHANGE 4: "Start Over" button removed (Section 5 of spec-20260426-102329).
// onStartOver prop retained for caller compatibility (no longer used here).
export function DraftActions({ onAccept, onRefine }: Props) {
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
    </div>
  );
}
