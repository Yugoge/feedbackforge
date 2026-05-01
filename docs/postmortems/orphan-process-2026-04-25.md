# Orphan next-server incident — 2026-04-25

Moved from `CLAUDE.md` during token-economy cleanup. The operational rule remains in `CLAUDE.md`; this file preserves the incident context and prevention rationale.

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
