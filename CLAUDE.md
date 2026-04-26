# Yen — TUI Coding Agent

## Project Overview
Building a TUI-based coding agent in TypeScript, aiming to match and exceed Claude Code CLI.
This is also a TypeScript learning project — explain concepts clearly as we build.

## Tech Stack
- **Runtime:** Bun (not Node.js)
- **Language:** TypeScript (strict mode)
- **TUI:** Ink (React for terminal)
- **AI:** @anthropic-ai/sdk with streaming + tool use
- **Validation:** Zod
- **Linting/Formatting:** Biome

## Current Milestone
See [MILESTONES.md](./MILESTONES.md) for the full plan and progress tracker.
Check the milestone table at the top — work on whichever milestone is `🔄 In progress`.
If nothing is in progress, start the next `🔲 Not started` milestone.

## Working Principles
- Always use Bun APIs over Node.js equivalents (`Bun.file`, `Bun.spawn`, `Bun.$`)
- Strict TypeScript — no `any`, no type casting unless truly necessary
- Biome for formatting — run `bun biome check` before considering anything done
- Explain TypeScript and agentic engineering concepts as we encounter them
- Prefer small, focused commits per feature

## Project Structure (to be built)
```
yen/
├── src/
│   ├── app.tsx          # Root Ink app
│   ├── components/      # Ink UI components
│   ├── agent/           # Agentic loop + tool registry
│   ├── tools/           # Individual tool implementations
│   ├── hooks/           # Hooks system
│   ├── skills/          # Built-in skills
│   ├── memory/          # Memory + session management
│   └── config/          # Settings + permissions
├── .agent/              # Runtime config (gitignored)
├── MILESTONES.md
├── CLAUDE.md
└── README.md
```

## Key Files
- `MILESTONES.md` — full milestone plan with build + learn goals per milestone
- `src/agent/loop.ts` — the agentic loop (core of the app)
- `src/tools/registry.ts` — tool registration system
- `.agent/settings.json` — permissions and hooks config (runtime, not committed)
