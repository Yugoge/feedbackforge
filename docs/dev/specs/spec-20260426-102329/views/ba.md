<!-- AUTO-GENERATED VIEW for ba | source: docs/dev/specs/spec-20260426-102329.md | extracted: 2026-04-26T10:35:00Z -->

# ba view of spec-20260426-102329

**Monolith**: docs/dev/specs/spec-20260426-102329.md
**Extraction**: content-block level (no section-level mapping)

---

## Role Mandate

> <!-- WHO WRITES: BA (on first analysis) -->

---

## Section 1: Before — analysis framing

**Stack confirmed**: Next.js 14 App Router, TypeScript, Tailwind, `lucide-react@0.469.0` (already a dep — no install needed).

**File map (current state, baseline before any change)**:

**Other "FeedbackForge" string sites (full sweep)**: only the four locations above. No README/docs strings need rebranding for the in-app rebrand to be complete (project repo dir name `/root/feedbackforge` and CLAUDE.md references are infrastructure, not user-facing).

**Shared components in play**: `components/ui/badge.tsx` (Badge — kept for `age`, removed for `tenure`); `Sparkles` icon already imported in `app/page.tsx`; `Briefcase` will need to be added to that import.

---

## Section 5: User's Acceptance Criterion (BA owns this)

Make the following changes to the FeedbackForge app:

CHANGE 1 — Rename and rebrand the app
In app/page.tsx and any other place the name appears:

CHANGE 2 — Add NC logo next to NormalCompany
On the dashboard, next to the "NormalCompany — Marketing Team" text,
add a circular NC logo on the LEFT side. Create it inline as a div:

CHANGE 3 — Make tenure more explicit in dashboard cards
naturally:
directly without a badge wrapper, with a small briefcase icon

CHANGE 4 — Remove "Start Over" button
In app/feedback/[id]/page.tsx, remove the "Start Over" action button
entirely from the action buttons section. Keep only "Accept & Save"
and "Refine Further".

CHANGE 5 — Accept & Save copies BOTH draft and delivery guidance
When the "Accept & Save" button is clicked, instead of just showing
a toast, copy the COMPLETE final assistant message (which contains
both "Feedback Draft" and "Delivery Guidance" sections) to the

CHANGE 6 — Stop AI from leaking system instructions
In lib/prompts.ts, add this section near the end of the system prompt,
before the CONSTRAINTS block:

CHANGE 7 — Sensitive case: redirect to HR and CONCLUDE the conversation
In lib/prompts.ts, find the SPECIAL CASES section and replace the
"Harassment/discrimination/safety" handling with this exact text:
