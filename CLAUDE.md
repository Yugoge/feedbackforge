# CLAUDE.md — feedbackforge

> Sentinel for the **nested git repo** at `/root/feedbackforge`.
> Last updated: 2026-04-25

---

## Nested Git Repo (parent `/root` does NOT track this directory)

This project lives under `/root/feedbackforge` and has its **own** `.git` —
separate from `/root/.git`. The parent `/root/.gitignore` contains a
`feedbackforge/` line, so commits and pushes for this project flow only
through the local repo.

This mirrors the existing `/root/.claude` arrangement (see `/root/CLAUDE.md`).

### What this means in practice

- `git -C /root log -- feedbackforge/...` returns **empty**. That is **not**
  a "never tracked" signal — the real history lives here.
- Run `cd /root/feedbackforge && git log` (or
  `git -C /root/feedbackforge log`) to see this project's history.
- Never run `git push` from `/root` expecting feedbackforge changes to flow
  through. The parent's gitignore makes them invisible.

### Verify isolation

```bash
git -C /root status --short feedbackforge   # must return 0 lines
git -C /root check-ignore -v feedbackforge/ # must point to .gitignore line
```

---

## Project Overview

- **Stack**: Next.js 14.2.35 (App Router) + TypeScript 5.4.5 + Tailwind CSS 3.4.17
- **API**: MiniMax Anthropic-compatible endpoint via `@anthropic-ai/sdk@0.30.1`
  with `baseURL=https://api.minimaxi.com/anthropic` and `model=MiniMax-M2.7`.
- **Pages**: `/` (4-employee dashboard) and `/feedback/[id]` (chat).
- **Spec source of truth**: `/root/docs/dev/specs/spec-20260425-123922.md`.

## Run locally

```bash
cd /root/feedbackforge
npm install
# Edit .env.local and replace MINIMAX_AUTH_TOKEN with the real token.
npm run dev    # http://localhost:3000
```

## Run-time secrets

- `.env.local` is **uncommitted** (covered by Next 14's default `.env*.local`).
- `.env.local.example` (committed) documents required keys.
- The current `.env.local` ships with `MINIMAX_AUTH_TOKEN=REPLACE_WITH_FULL_TOKEN_FROM_USER`
  — replace before live API smoke testing.
