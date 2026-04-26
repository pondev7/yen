# Yen — TUI Coding Agent: Milestones

A TUI-based coding agent built with TypeScript + Bun + Ink, aiming to match and exceed Claude Code CLI.

**Tech stack:** Bun · TypeScript · Ink (React TUI) · @anthropic-ai/sdk · Zod · Biome

**Learning goals:** TypeScript mastery · Agentic engineering patterns · TUI development

---

## Progress

| # | Milestone | Status |
|---|---|---|
| 1 | Foundation & TUI Shell | 🔲 Not started |
| 2 | Claude API Integration & Streaming | 🔲 Not started |
| 3 | Tool Use & The Agentic Loop | 🔲 Not started |
| 4 | Advanced Coding Tools & LSP | 🔲 Not started |
| 5 | Context Management & Memory | 🔲 Not started |
| 6 | Permissions, Safety & Hooks | 🔲 Not started |
| 7 | Skills & Slash Commands | 🔲 Not started |
| 8 | Git, Multimodal & Voice | 🔲 Not started |
| 9 | Multi-Agent & Subagents | 🔲 Not started |
| 10 | MCP & Plugin System | 🔲 Not started |
| 11 | Observability, CI/CD & Cloud | 🔲 Not started |
| 12 | Polish, Performance & Ship | 🔲 Not started |

**v1 (daily driver):** Milestones 1–7
**v2 (competitive with Claude Code):** Milestones 8–12

---

## Milestone 1 — Foundation & TUI Shell
**Status:** 🔲 Not started
**Goal:** Build a polished, production-quality terminal interface before touching any AI.

### Build
- `bun init` project scaffold with `tsconfig.json`, `biome.json`
- Ink app with chat layout: scrollable message history + sticky input box
- Message components: user bubbles, assistant bubbles, system messages
- Vim mode for the input box (normal/insert/visual, full hjkl + text objects)
- 50+ keyboard shortcuts: Ctrl+C abort, Ctrl+L redraw, Ctrl+R history search, Alt+B/F word nav, Ctrl+K/U/W line editing, Up/Down history, Ctrl+O transcript toggle
- Syntax highlighting for code blocks in responses
- Status bar: model name, token count, cost, git branch, permission mode
- Diff view component: show file changes with +/- lines before applying
- Multiline input: Shift+Enter / backslash+Enter
- `@filename` autocomplete for injecting file contents into prompt
- Color themes: dark, light, custom — switchable with Ctrl+T
- `.env` loading for `ANTHROPIC_API_KEY`

### Learn
- TypeScript: types, interfaces, `type` vs `interface`, union types
- React hooks in Ink: `useState`, `useEffect`, `useInput`, `useApp`
- JSX in TypeScript — how TSX works
- `tsconfig.json` — `strict`, `moduleResolution`, `target`, `lib`
- Component composition and re-render model in terminal UIs
- Vim's modal editing model and how to implement a state machine for it

---

## Milestone 2 — Claude API Integration & Streaming
**Status:** 🔲 Not started
**Goal:** Connect to Claude with production-grade API usage patterns.

### Build
- Anthropic SDK integration with full streaming
- Conversation history management (`MessageParam[]` array)
- Configurable system prompt with `CLAUDE.md` file loading (project root)
- Prompt caching: cache system prompt and CLAUDE.md — show cache hit/miss in status bar
- Extended thinking: toggle with Alt+T, configurable budget, adaptive vs. fixed mode
- Model switching: Alt+P cycles through Opus/Sonnet/Haiku
- Effort levels: low/medium/high reasoning effort per request
- Real-time cost tracking: `$X.XXXX` per turn and session total
- Token counter: input, output, cache read/write tokens displayed live
- Abort/interrupt: Ctrl+C cancels in-flight stream cleanly

### Learn
- TypeScript generics — `MessageParam[]`, `ContentBlock`, SDK types
- `for await...of` on async iterables (streaming)
- How the Messages API works: roles, turns, `stop_reason`
- Prompt caching mechanics — what gets cached, TTL, 90% cost reduction
- Extended thinking — thinking tokens, when they help
- Token budgeting and context window arithmetic
- TypeScript `readonly`, `as const`, literal types

---

## Milestone 3 — Tool Use & The Agentic Loop
**Status:** 🔲 Not started
**Goal:** Build the core engine — the heart of the whole application.

### Build
- Tool schema definition system with Zod → JSON schema auto-conversion
- Tool registry: register tools with name, description, Zod input schema, handler
- Agentic loop: `LLM → tool_use → tool_result → LLM → repeat until end_turn`
- Parallel tool execution: when Claude returns multiple `tool_use` blocks, run with `Promise.all`
- Plan mode: `/plan` slash command — Claude proposes steps, user approves before execution
- Tool execution display in TUI: show tool name, inputs, spinner, result inline
- Built-in tools: `bash`, `read_file`, `write_file`, `edit_file`, `list_files`, `grep`, `glob`, `web_search`, `web_fetch`

### Learn
- How tool use works in the Messages API — `tool_use` and `tool_result` content blocks
- The agentic loop pattern — why it loops, what `end_turn` means, max_turns safety
- TypeScript discriminated unions — narrowing `ContentBlock` types
- Zod: `z.object`, `z.string`, `z.enum`, `z.union`, `.parse()`, `.safeParse()`
- `Promise.all` vs `Promise.allSettled` for parallel async work
- Tool design principles: single responsibility, idempotency, clear descriptions
- Why tool descriptions matter as much as the code — LLMs read them literally

---

## Milestone 4 — Advanced Coding Tools & LSP
**Status:** 🔲 Not started
**Goal:** Give the agent deep code intelligence, not just raw file access.

### Build
- Checkpointing system: snapshot file state before every tool execution
- Rewind: Esc+Esc restores files + conversation to previous checkpoint
- LSP client: connect to `tsserver`, `pyright`, `rust-analyzer` via stdio
- LSP tools: `lsp_hover`, `lsp_go_to_definition`, `lsp_find_references`, `lsp_diagnostics`
- NotebookEdit tool: read/write/execute Jupyter `.ipynb` cells
- `find_symbol` tool: search for function/class/variable definitions by name
- `get_diagnostics` tool: return all lint/type errors in a file
- Code diff viewer: before/after for every file edit, approve/reject per-edit
- Undo stack: `/undo` command to revert last N edits

### Learn
- LSP protocol: JSON-RPC over stdio, request/response/notification lifecycle
- How type checkers work conceptually — what diagnostics are
- TypeScript `Map`, `Set`, and data structures for tracking state
- Snapshot/restore patterns — immutability and state management
- Jupyter notebook format (JSON structure of cells and outputs)
- TypeScript `class` vs functional patterns — when to use each

---

## Milestone 5 — Context Management & Memory
**Status:** 🔲 Not started
**Goal:** Handle arbitrarily long sessions without losing context.

### Build
- Token counter per message — visual warning at 80% / 90% context window
- Auto-compaction: summarize old turns when approaching limit, continue seamlessly
- Manual compaction: `/compact` slash command
- CLAUDE.md hierarchical loading: `~/.agent/CLAUDE.md`, project-level, subdirectory-specific
- `@path/to/file` import syntax inside CLAUDE.md
- Auto-memory system: agent writes structured memories to `~/.agent/memory/`
- `MEMORY.md` index file — loaded every session
- `/memory` command: view and edit memory files in `$EDITOR`
- Session persistence: save full conversation + metadata as JSON
- Session resume: `--resume <id>` flag or `/resume` with session picker
- Session fork: `/fork` — branch off current session
- Session naming: `/name <title>`

### Learn
- Context window mechanics — why 200K tokens still runs out
- Compaction strategies: sliding window, summarization, keep-last-N tradeoffs
- TypeScript `JSON.stringify` / `JSON.parse` with type safety
- File-based state persistence patterns
- Memory system design — what's worth remembering vs. deriving fresh
- Hierarchical config loading — merge/override semantics

---

## Milestone 6 — Permissions, Safety & Hooks
**Status:** 🔲 Not started
**Goal:** Make the agent safe and fully automatable.

### Build
- Permission system with 4 modes: `ask`, `auto`, `acceptEdits`, `bypassAll`
- Fine-grained rules in `.agent/settings.json`: per-tool allow/deny patterns
- Protected paths: `.env`, `*.pem`, credentials files never touched without approval
- TUI approval dialog: `[y]es / [n]o / [a]lways / [d]eny-always`
- Dry-run mode: `--dry-run` flag — plan all actions, execute nothing
- Hooks system with 30+ lifecycle events: `PreToolUse`, `PostToolUse`, `SessionStart`, `SessionEnd`, `PermissionRequest`, `PreCompact`, `Stop`, etc.
- Hook types: shell command, HTTP webhook, Claude prompt, spawn subagent
- Hook exit codes: `0` = allow, `1` = deny, `2` = modify behavior
- `/hooks` command: list configured hooks, show last N executions

### Learn
- Security principles: least privilege, blast radius, defense in depth
- Trust boundaries in agentic systems
- TypeScript `enum` and `const` assertions for permission levels
- Event-driven architecture — hooks as middleware
- How exit codes control program flow
- JSON Schema for validating config files at startup

---

## Milestone 7 — Skills & Slash Commands
**Status:** 🔲 Not started
**Goal:** Make the agent extensible without code changes.

### Build
- Skills system: Markdown files in `~/.agent/skills/` or `.agent/skills/`
- Skill frontmatter: name, description, disable-model-invocation
- `/skill-name` invocation syntax
- Built-in skills: `/review`, `/simplify`, `/security-review`, `/init`, `/debug`
- Slash commands: `/clear`, `/compact`, `/plan`, `/memory`, `/hooks`, `/help`, `/usage`, `/model`, `/config`, `/undo`, `/resume`, `/fork`, `/btw`
- Plugin namespacing: `/<plugin>:<skill>`
- Live skill reloading: detect file changes, reload without restart

### Learn
- Markdown frontmatter parsing (`gray-matter`)
- Plugin architecture patterns — registry, discovery, namespacing
- Why skills beat hardcoded commands for extensibility
- Dynamic module loading in TypeScript
- TypeScript `fs.watch` / Bun file watcher API

---

## Milestone 8 — Git, Multimodal & Voice
**Status:** 🔲 Not started
**Goal:** Deep git integration and the ability to see what the user sees.

### Build
- Git tools: `git_status`, `git_diff`, `git_log`, `git_blame`, `git_commit`, `git_create_branch`, `git_checkout`, `git_create_pr`
- Git worktrees: `/worktree <branch>` — create isolated worktree
- Auto-inject git context into system prompt
- Git status in status bar
- Image/vision input: paste image from clipboard, agent analyzes screenshots
- PDF support: attach PDF via `@file.pdf`
- Multi-image support: reference by `[Image #1]`, `[Image #2]`
- Voice dictation: hold Space to record, release to transcribe

### Learn
- Spawning CLI tools and parsing structured output
- How LLMs process multimodal input — base64 image encoding
- Git worktree internals — how they provide isolation
- Audio recording in Bun — subprocess pipelines
- TypeScript `Buffer` and binary data handling

---

## Milestone 9 — Multi-Agent & Subagents
**Status:** 🔲 Not started
**Goal:** Orchestrate fleets of agents.

### Build
- `spawn_agent` tool: launch subagents with isolated context + tool set
- TUI shows agent hierarchy tree view
- Agent types: code reviewer, debugger, test writer, security auditor
- Parallel subagents: `Promise.all` across independent agents
- `/batch` command: run the same prompt across N isolated agents
- Agent teams (experimental): named agents with shared task list
- Inter-agent messaging: `SendMessage` tool
- Agent resume: subagents persist state across turns

### Learn
- Multi-agent orchestration patterns: orchestrator/subagent, peer-to-peer, pipeline
- Why subagents: context isolation, parallelism, specialization, blast radius reduction
- `Promise.all`, `Promise.race`, `Promise.allSettled` — when to use each
- TypeScript worker threads vs. async concurrency
- How to decompose a task into parallelizable subtasks

---

## Milestone 10 — MCP & Plugin System
**Status:** 🔲 Not started
**Goal:** Make the agent infinitely extensible.

### Build
- MCP client: `stdio` and `SSE` transports, OAuth authentication
- Dynamic tool discovery from MCP servers
- MCP config in `.agent/mcp.json`
- `/mcp` command: list servers, show tools, check status
- MCP Resources: `list_mcp_resources`, `read_mcp_resource`
- `ToolSearch` tool: on-demand tool schema loading
- Plugin system: manifest `plugin.json`, install from local/GitHub/npm
- Plugin marketplace: fetch index, browse, install
- Plugin namespacing, enable/disable, live reload

### Learn
- MCP protocol: JSON-RPC 2.0 over stdio/SSE
- How OAuth works in CLI tools
- Plugin architecture: manifest schema, discovery, isolation
- Dynamic tool registration at runtime
- SSE (Server-Sent Events) — streaming HTTP

---

## Milestone 11 — Observability, CI/CD & Cloud
**Status:** 🔲 Not started
**Goal:** Production-grade instrumentation and automation.

### Build
- OpenTelemetry: spans for every agent turn, tool call, API request
- Metrics: session count, tokens, cost, tool frequency, error rate
- `/usage` command: full token/cost breakdown
- GitHub Actions integration
- GitLab CI/CD equivalent
- Headless/non-interactive mode: `agent run "prompt"`
- Unix pipeline mode: `cat error.log | agent "explain this"`
- `--json` output flag for scripting
- Scheduled tasks: cron syntax
- Webhook triggers: HTTP endpoint that runs the agent

### Learn
- OpenTelemetry: traces, spans, metrics — the three pillars of observability
- How to instrument async code with spans
- GitHub Actions YAML schema
- Headless CLI design: stdin/stdout/stderr conventions, exit codes
- Unix pipeline philosophy
- TypeScript process signal handling

---

## Milestone 12 — Polish, Performance & Ship
**Status:** 🔲 Not started
**Goal:** A binary you're proud to share.

### Build
- Single compiled binary: `bun build --compile`
- Full README with architecture diagram and demo GIF
- CLI flags: `--model`, `--system`, `--max-turns`, `--permission-mode`
- `agent init` command: scaffold `.agent/` directory
- Auto-update checker
- Performance: fast startup (`<200ms` to first prompt)
- Windows/Linux compatibility
- Published to npm as `@yourname/agent`

### Learn
- Bun compile targets and runtime embedding
- CLI argument parsing: `util.parseArgs`, `commander`
- npm publishing workflow: `bin` field, semver, `npm publish`
- Cross-platform path handling
- Startup performance profiling

---

## How to update this file

When a milestone is complete, change its status to `✅ Done`.
When in progress, change to `🔄 In progress`.

Example:
```
| 1 | Foundation & TUI Shell | ✅ Done |
| 2 | Claude API Integration & Streaming | 🔄 In progress |
```
