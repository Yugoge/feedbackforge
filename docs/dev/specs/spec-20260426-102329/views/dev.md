<!-- AUTO-GENERATED VIEW for dev | source: docs/dev/specs/spec-20260426-102329.md | extracted: 2026-04-26T10:35:00Z -->

# dev view of spec-20260426-102329

**Monolith**: docs/dev/specs/spec-20260426-102329.md
**Extraction**: content-block level (no section-level mapping)

---

## Role Mandate

> <!-- WHO WRITES: Dev (after each implementation attempt) -->

---

## Section 1: Before — File Map (line-level baseline rows)

- `app/page.tsx`
  - L12-14: header block — `<div className="flex items-center gap-2"> <Sparkles className="h-6 w-6 text-blue-600" /> <h1 className="text-2xl font-bold text-slate-900">FeedbackForge</h1> </div>`. Not centered, no large padding.
  - L17: subtitle `"NormalCompany — Marketing Team"` rendered as `text-sm text-slate-500`. No NC logo.
  - L28: dashboard renders cards via `<EmployeeCard />` — does NOT inline the tenure markup itself.

- `components/EmployeeCard.tsx` (L38) — tenure currently rendered as `<Badge variant="secondary">{employee.tenure}</Badge>`. **Implementation detail for CHANGE 3**: the tenure is inside this component, not in `app/page.tsx` directly; the dev must edit `EmployeeCard.tsx` to swap the Badge for a plain text + `Briefcase` icon (`text-slate-500`). User's spec text says "In the dashboard card (app/page.tsx)" — this is the dashboard card component, treat the file path as descriptive intent rather than literal.

- `lib/employees.ts` — current tenure values: Ken `"1 year"`, Jenny `"7 years"`, John `"5 years"`, Clara `"2 years"`. Other fields (id, name, age, role, department, avatarColor, description?) untouched.

- `app/feedback/[id]/page.tsx` is a thin wrapper that delegates to `ChatPageBody`. `useRouter` is already imported on L4.

- `components/DraftActions.tsx` — three action buttons live here:
  - L21 "Accept & Save" → `onAccept` (green `bg-green-600`)
  - L28 "Refine Further" → `onRefine` (outline; sends "I'd like to adjust this draft.")
  - L30-36 "Start Over" → `onStartOver` (outline; resets session)
  **Implementation detail for CHANGE 4**: the "Start Over" button to remove is in `components/DraftActions.tsx`, not `app/feedback/[id]/page.tsx`. Treat user's path as descriptive intent.

- `lib/use-chat-page-actions.ts` (L17-20) — current `onAccept` handler:
  ```ts
  const onAccept = () => {
    setToast("Draft ready — copy it before your 1:1");
    setTimeout(() => router.push("/"), 2000);
  };
  ```
  Currently 2s delay, no clipboard, no message body capture. CHANGE 5 needs: read the last assistant message from `session.messages`, `navigator.clipboard.writeText(...)` it, swap toast text to the new copy, bump delay to 3s.
  `navigator.clipboard` is **not** used anywhere in the repo currently.

- `lib/prompts.ts`
  - L3: comment mentioning "FeedbackForge"
  - L6: prompt opens `"You are FeedbackForge Coach..."` — must rename for CHANGE 1 ("any other place the name appears").
  - L12-18: EMPLOYEE CONTEXT block (uses `{employee.tenure}` placeholder — no edit needed).
  - L27-49: CONVERSATION FLOW (OPEN / CLARIFY / DRAFT phases).
  - L87-96: **SPECIAL CASES** block — currently:
    ```
    SPECIAL CASES:
    - "Nothing to say" / "Everything is fine": Gently probe...
    - Harassment/discrimination/safety: Do NOT draft feedback. Flag for HR escalation.
    - Emotionally charged venting: Acknowledge briefly, redirect...
    - Only positive feedback: Apply SBI...
    ```
    The harassment line (verbatim) is the one CHANGE 7 replaces.
  - L98-104: **CONSTRAINTS** block — CHANGE 6's META-RULES inserts immediately above this.

- `app/layout.tsx` L8: metadata title contains "FeedbackForge" — also covered by CHANGE 1's "any other place the name appears" clause.

---

## Section 5: Implementation-detail verbatim slices (Tailwind, file paths, exact strings)

- Make the title significantly bigger (text-4xl) and bold
- Position it inline-flex with the company text, gap-2
In lib/employees.ts, update each employee's tenure field to read
- Ken: "1 year at NormalCompany"
- Jenny: "7 years at NormalCompany"
- John: "5 years at NormalCompany"
- Clara: "2 years at NormalCompany"
In the dashboard card (app/page.tsx), display this tenure text
(Briefcase from lucide-react) next to it in slate-500 color.
clipboard using navigator.clipboard.writeText().
