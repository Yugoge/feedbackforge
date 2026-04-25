# feedbackforge

> AI feedback-coaching tool for managers. Helps you draft high-quality 1:1 feedback using the **SBI** (Situation-Behavior-Impact) framework — the AI never evaluates employees itself, it just helps you articulate your own observations clearly.

**Live demo:** https://forge.life-ai.app

![stack](https://img.shields.io/badge/stack-Next.js%2014-blue) ![ts](https://img.shields.io/badge/TypeScript-5.4-blue) ![tw](https://img.shields.io/badge/Tailwind-3.4-blue) ![api](https://img.shields.io/badge/API-MiniMax%20Anthropic-purple)

---

## Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.2.35 |
| Language | TypeScript | 5.4.5 |
| Styling | Tailwind CSS | 3.4.17 |
| UI primitives | shadcn/ui | 2.1.8 |
| Icons | lucide-react | 0.469.0 |
| AI SDK | `@anthropic-ai/sdk` (Anthropic Messages API surface) | 0.30.1 |
| AI provider | MiniMax-M2.7 via Anthropic-compatible endpoint | n/a |

The repo deliberately pins exact versions (no caret ranges) — see `package.json`. This avoids the "works on my machine" class of bugs caused by transient minor-version drift.

---

## Quick start (local)

### 1. Clone + install

```bash
git clone https://github.com/Yugoge/feedbackforge.git
cd feedbackforge
npm install
```

### 2. Get a MiniMax API key

The app speaks the **Anthropic Messages API** but routes calls to MiniMax via its compatibility endpoint. You need a MiniMax account (NOT an Anthropic account):

1. Sign up at https://api.minimax.io (China region) or https://api.minimaxi.com
2. Generate an API key — the prefix should be `sk-cp-...`
3. The compatibility base URL is `https://api.minimaxi.com/anthropic`

### 3. Configure `.env.local`

Copy the example file and fill in your key:

```bash
cp .env.local.example .env.local
$EDITOR .env.local
```

`.env.local` (this file is gitignored — never commit it):

```env
# MiniMax Anthropic-compatible API
MINIMAX_AUTH_TOKEN=sk-cp-YOUR_REAL_TOKEN_HERE
MINIMAX_BASE_URL=https://api.minimaxi.com/anthropic
MINIMAX_MODEL=MiniMax-M2.7

# Kept for spec fidelity (Prompt 1 mentions Gemini), never imported by the API route.
GEMINI_API_KEY=your-key-here
```

### 4. Run dev server

```bash
npm run dev
```

Open http://localhost:3000.

> **Note:** Next.js does **not** hot-reload `.env.local` — restart the dev server after editing.

### 5. Build + run production

```bash
npm run build
npm run start          # serves on PORT (default 3000)
PORT=3025 npm run start  # custom port
```

---

## API configuration

The chat route is `app/api/chat/route.ts`. It accepts `POST` with body:

```json
{
  "employeeId": "ken | jenny | john | clara",
  "messages": [
    { "role": "user" | "assistant", "content": "..." }
  ]
}
```

It returns `{ "content": "<assistant text>" }`.

### How the route binds MiniMax

The route constructs an Anthropic SDK client with a **`baseURL` override**:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey:  process.env.MINIMAX_AUTH_TOKEN,
  baseURL: process.env.MINIMAX_BASE_URL,  // https://api.minimaxi.com/anthropic
});

const response = await client.messages.create({
  model:      process.env.MINIMAX_MODEL,  // MiniMax-M2.7
  system:     buildSystemPrompt(employee),
  messages:   inboundMessages,            // already in {role, content} shape
  max_tokens: 1024,
});
```

The route runs on the **Node runtime** (no `runtime = 'edge'` export) because `@anthropic-ai/sdk` targets Node — edge would break it.

### Quick smoke test

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"ken","messages":[]}'
```

You should get a JSON `{ "content": "Hi Alex, ..." }` opening greeting back. With an invalid/placeholder token you'll get HTTP 500 with `{"error":"Failed to generate response. Please try again."}` — that proves the route is wired correctly even if auth fails.

### Pinning the SDK version

`@anthropic-ai/sdk` is pinned to `0.30.1`. Newer versions (0.91.x+) send extra `anthropic-beta` headers that MiniMax's compatibility shim may reject. If you bump the version, smoke-test the route immediately.

---

## Project structure

```
feedbackforge/
├── app/
│   ├── layout.tsx           # Inter font, gradient background, 100dvh
│   ├── page.tsx             # Dashboard: 4 employee cards
│   ├── globals.css          # Tailwind + pulse-dot keyframes + bubble fade-in
│   ├── api/chat/route.ts    # MiniMax POST handler
│   └── feedback/[id]/page.tsx  # Chat page
├── components/
│   ├── ChatBubble.tsx       # Assistant + user bubble variants
│   ├── ChatInput.tsx        # Auto-grow textarea, IME-safe Enter
│   ├── ChatPageBody.tsx
│   ├── ChatTopbar.tsx
│   ├── ChatTranscript.tsx   # Auto-scroll, EmptyState skeleton
│   ├── DraftActions.tsx     # Accept / Refine / Start Over buttons
│   ├── EmployeeCard.tsx     # Left-side color bar, hover transition
│   ├── EmptyState.tsx       # "Starting session..." skeleton
│   ├── MarkdownLite.tsx     # Regex-based renderer (escapes HTML first)
│   ├── TypingIndicator.tsx  # 3-dot animated, aria-live
│   └── ui/                  # shadcn primitives
├── lib/
│   ├── types.ts             # Employee, Message, FeedbackSession
│   ├── employees.ts         # 4 hardcoded employees + descriptions
│   ├── prompts.ts           # buildSystemPrompt(employee) — SBI framework
│   ├── chat-utils.ts        # newMessage, toApiMessages, postChat, detectDraft
│   ├── use-chat-session.ts  # useChatSession hook (state + abort + StrictMode-safe)
│   ├── use-chat-page-actions.ts  # Accept / Refine / Start Over handlers
│   └── utils.ts             # shadcn cn() helper
├── .env.local.example       # Required env vars (committed)
├── .env.local               # Real secrets (gitignored)
├── package.json             # Exact version pins
├── tailwind.config.ts       # content glob includes ./lib/**
└── tsconfig.json
```

---

## How it works

The UX is a 3-phase coaching conversation:

1. **OPEN** — AI asks one open question about the employee's recent behavior.
2. **CLARIFY** — AI fills in missing **S**ituation, **B**ehavior, or **I**mpact details (max 2 follow-ups).
3. **DRAFT** — AI emits a complete feedback draft + delivery guidance, then shows three action buttons:
   - **Accept & Save** — toast + return to dashboard
   - **Refine Further** — sends "I'd like to adjust this draft." back to the AI
   - **Start Over** — aborts the in-flight fetch, clears messages, fetches a fresh greeting

Calibration is automatic: junior employees get warm/encouraging tone, senior employees get peer-to-peer directness. Edge cases (harassment, "nothing to say", purely positive feedback) all have spec-defined handling — see `lib/prompts.ts`.

---

## Routes

| Path | Method | Purpose |
|---|---|---|
| `/` | GET | Dashboard (4 employee cards) |
| `/feedback/[id]` | GET | Chat session for `id ∈ {ken, jenny, john, clara}` |
| `/api/chat` | POST | MiniMax-backed chat completion |

---

## Deployment

The live demo at https://forge.life-ai.app is served by:
1. `npm run start` running on `localhost:3025`
2. A Cloudflare named tunnel routing `forge.life-ai.app` → `localhost:3025`

Any equivalent reverse-proxy + Node.js host works. The MiniMax token stays on the server — it is never exposed to the client bundle.

---

## Development notes

- **System prompt** lives in `lib/prompts.ts`. It's a long string with strict 3-phase structure, output format, and edge-case handling. Don't shorten it casually — model behaviour is calibrated to it.
- **Markdown renderer** (`components/MarkdownLite.tsx`) escapes `<`, `>`, `&` **before** running regex replacements. Don't reorder — that would re-introduce an XSS vector.
- **StrictMode-safe initial greeting**: `useChatSession` uses a `didInitRef` flag to guard against React 18 dev double-invoke. The `EmptyState` gate in `ChatTranscript.tsx` is decoupled from `isLoading` so the skeleton survives an aborted in-flight fetch.
- **Tailwind content glob** includes `./lib/**` because `avatarColor` strings live in `lib/employees.ts`. Without that include, the JIT compiler purges the four `bg-*-500` classes.

---

## License

Private. Ask the maintainer.