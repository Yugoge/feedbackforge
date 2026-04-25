"use client";

// Centered skeleton + label shown while the initial greeting is loading
// (spec 5.7.6).
export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-slate-400">
      <div className="flex gap-1">
        <span className="pulse-dot block h-2 w-2 rounded-full bg-slate-300" />
        <span className="pulse-dot block h-2 w-2 rounded-full bg-slate-300" />
        <span className="pulse-dot block h-2 w-2 rounded-full bg-slate-300" />
      </div>
      <p className="text-sm">Starting session...</p>
    </div>
  );
}

type ToastProps = { text: string };

export function Toast({ text }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
    >
      {text}
    </div>
  );
}
