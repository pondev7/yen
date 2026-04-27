# Sandbox — Learning Playground

A self-contained environment to learn every technology used in this project.
Each file is a standalone lesson you can run immediately.

---

## How to use

```bash
# Run any file directly with bun
bun run sandbox/typescript/01-basics.ts
bun run sandbox/react-ink/01-hello-world.tsx
bun run sandbox/bun/01-file-system.ts
```

Each file has:
- **CONCEPT** sections — explanation with working code you can read and run
- **EXERCISE** sections — your turn to write code
- **Expected output** in comments so you know if it worked
- **"See it in the real app"** pointers — where the concept lives in `src/`

---

## Topics and order

Work through these in order — each topic builds on the previous.

### 1. TypeScript (`sandbox/typescript/`)
| File | Topic |
|---|---|
| `01-basics.ts` | Types, inference, const/let, template literals |
| `02-interfaces.ts` | interface, type, optional props, readonly |
| `03-unions-narrowing.ts` | Union types, type narrowing, discriminated unions |
| `04-generics.ts` | Generics — reusable typed functions |
| `05-async-await.ts` | Promises, async/await, for await...of |
| `06-reducers.ts` | useReducer pattern — the heart of useInputBuffer |

### 2. React + Ink (`sandbox/react-ink/`)
| File | Topic |
|---|---|
| `01-hello-world.tsx` | Your first Ink app — Box, Text, render |
| `02-components-props.tsx` | Components, props, children |
| `03-usestate.tsx` | useState — reactive state |
| `04-usereducer.tsx` | useReducer — complex state |
| `05-keyboard-input.tsx` | useInput — reading keypresses |
| `06-context.tsx` | createContext + useContext — shared state |

### 3. Bun APIs (`sandbox/bun/`)
| File | Topic |
|---|---|
| `01-file-system.ts` | Read/write files with Bun.file |
| `02-spawn-processes.ts` | Run shell commands with Bun.spawn |
| `03-fetch-http.ts` | HTTP requests with Bun's built-in fetch |

### 4. Agentic Engineering (`sandbox/agentic/`)
| File | Topic |
|---|---|
| `01-tool-schemas.ts` | Defining tools with Zod |
| `02-agentic-loop.ts` | The core agent loop pattern |
| `03-streaming.ts` | Streaming LLM responses token by token |

---

## Tips

- Uncomment lines marked `// ← uncomment` to see errors on purpose — learning what errors look like is as important as learning what works
- The `// EXERCISE:` sections are yours to fill in — there is no single right answer
- If you get stuck, the real implementation is always in `src/` for reference
