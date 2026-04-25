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

---

## Production server: ALWAYS use systemd, NEVER `nohup npm run start`

The production server is managed by a systemd unit at
`/etc/systemd/system/feedbackforge.service` listening on `localhost:3025`,
fronted by the cloudflared-lifeai tunnel mapping
`forge.life-ai.app -> localhost:3025`.

```bash
sudo systemctl status feedbackforge
sudo systemctl restart feedbackforge
journalctl -u feedbackforge -f
```

**Future Claude / future agents — do NOT use `nohup npm run start &` or any
ad-hoc background launcher.** The systemd unit is already in place; restart
it, do not spawn parallel servers.

### Why this rule exists

On 2026-04-25 a prior agent session ran several rounds of
`PORT=30NN nohup npm run start &` for smoke-testing. Each call left a
`next-server` process behind because:

1. The `nohup`'d `npm` wrapper survived the agent's shell exit.
2. Its child `next-server` was reparented up the chain but the **immediate
   parent** (the npm/sh wrapper) stayed alive, so the hourly
   `cleanup-orphan-next-server.timer` skipped them — its strict `ppid==1`
   check failed.
3. By the end of that session there were 4 stale next-server processes
   wasting **~840 MB RSS** total.

The cleanup script (`/root/bin/cleanup-orphan-next-server.sh`) was patched
the same day to walk the parent chain (`chain_has_reparented_ancestor`) so
future "deep orphans" of this shape get reaped automatically. But the
prevention is simpler:

### The rule

| Need | Use this | Do NOT use this |
|---|---|---|
| Production server (forge.life-ai.app) | `sudo systemctl start/restart feedbackforge` | `nohup npm run start &` |
| Throwaway smoke test | `cd /root/feedbackforge && npm run dev` (foreground only) and Ctrl-C when done | `nohup npm run dev &` |
| Re-run after `.env.local` edit | `sudo systemctl restart feedbackforge` (Next does NOT hot-reload env) | manual restart of nohup'd process |
| Check current status | `systemctl status feedbackforge` + `journalctl -u feedbackforge` | `ps -ef \| grep next` |

If you absolutely need a parallel ad-hoc server (e.g. testing a different
build on a separate port), launch it in the **foreground** in your own
terminal so it dies with the session. Never leave one running in the
background of an agent session — the agent will exit and the process will
linger as a "deep orphan" that the strict-mode cleaner cannot detect for
hours.
