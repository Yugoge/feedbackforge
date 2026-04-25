"use client";

// 3-dot animated typing indicator (spec 5.7.1).
// Animations are defined as @keyframes pulse-dot in app/globals.css.
// aria-live="polite" keeps SR users informed of in-flight assistant work.
export function TypingIndicator() {
  return (
    <div
      className="bubble-fade-in inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3"
      role="status"
      aria-live="polite"
      aria-label="Coach is typing"
    >
      <span className="pulse-dot block h-2 w-2 rounded-full bg-slate-400" />
      <span className="pulse-dot block h-2 w-2 rounded-full bg-slate-400" />
      <span className="pulse-dot block h-2 w-2 rounded-full bg-slate-400" />
    </div>
  );
}
