# Milestone 1 — Learning Guide

> Complete beginner's reference for every technology and concept used in Milestone 1.
> No prior knowledge of TypeScript, Bun, React, or Ink is assumed.

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
2. [Bun — the runtime](#2-bun--the-runtime)
3. [TypeScript — the language](#3-typescript--the-language)
4. [React — the UI model](#4-react--the-ui-model)
5. [Ink — React for the terminal](#5-ink--react-for-the-terminal)
6. [Biome — linting and formatting](#6-biome--linting-and-formatting)
7. [Project structure explained](#7-project-structure-explained)
8. [Types and interfaces](#8-types-and-interfaces)
9. [React hooks deep dive](#9-react-hooks-deep-dive)
10. [Components we built](#10-components-we-built)
11. [Key patterns to remember](#11-key-patterns-to-remember)

---

## 1. The Big Picture

Before diving into individual technologies, here is how they all fit together:

```
┌─────────────────────────────────────────────┐
│  Your terminal (macOS / Linux)               │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │  Bun                                 │   │
│  │  (runs your TypeScript code)         │   │
│  │                                      │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │  React                       │   │   │
│  │  │  (manages UI state + logic)  │   │   │
│  │  │                              │   │   │
│  │  │  ┌────────────────────────┐ │   │   │
│  │  │  │  Ink                   │ │   │   │
│  │  │  │  (draws React output   │ │   │   │
│  │  │  │   into the terminal)   │ │   │   │
│  │  │  └────────────────────────┘ │   │   │
│  │  └──────────────────────────────┘   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**You write TypeScript → Bun runs it → React manages state → Ink draws it in the terminal.**

---

## 2. Bun — the runtime

### What is a runtime?

When you write code, something needs to actually *execute* it on your computer. For JavaScript/TypeScript, that something is called a **runtime**. The most common runtime is Node.js. Bun is a newer, faster alternative.

### Why Bun instead of Node.js?

| Feature | Node.js | Bun |
|---|---|---|
| Runs TypeScript | ❌ needs extra tools | ✅ natively |
| Speed | Slower startup | Very fast |
| Built-in test runner | ❌ | ✅ `bun test` |
| Built-in bundler | ❌ | ✅ `bun build` |
| Package manager | npm / yarn | `bun install` |
| `.env` file loading | ❌ needs dotenv | ✅ automatic |

**The key win:** with Bun you can write a `.ts` file and run it directly with `bun run file.ts`. No compilation step, no config needed.

### Bun commands you'll use daily

```bash
bun run src/index.tsx      # run the app
bun run --watch src/...    # run and auto-restart on file changes
bun install                # install all dependencies from package.json
bun add ink react          # add a new package
bun add -d @biomejs/biome  # add a dev-only package (-d = devDependency)
bun run typecheck          # run typescript type check
bun run lint               # run biome linter
bun run format             # auto-format all files
```

### `package.json` — the project manifest

Every JavaScript/TypeScript project has a `package.json` that describes the project:

```json
{
  "name": "yen",
  "scripts": {
    "dev": "bun run --watch src/index.tsx",  // custom commands you define
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "ink": "^7.0.1",     // packages needed to run the app
    "react": "^19.2.5"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.4.13"  // packages only needed during development
  }
}
```

The `^` before version numbers means "this version or any compatible newer version".

---

## 3. TypeScript — the language

### What is TypeScript?

TypeScript is JavaScript with **types** added on top. JavaScript lets you do things like:

```javascript
// JavaScript — no errors until it crashes at runtime
let name = "Alice";
name = 42;          // reassigned to a number — JavaScript allows this
name.toUpperCase(); // crashes at runtime: 42.toUpperCase is not a function
```

TypeScript catches this before you even run the code:

```typescript
// TypeScript — error caught immediately
let name: string = "Alice";
name = 42;  // ❌ Type 'number' is not assignable to type 'string'
```

### Basic types

```typescript
// Primitive types
let age: number = 25;
let name: string = "Alice";
let isActive: boolean = true;

// Arrays
let scores: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

// null and undefined
let maybeValue: string | null = null;     // can be a string OR null
let optional: string | undefined = undefined;

// Any — avoid this, it defeats the purpose of TypeScript
let anything: any = "hello";  // ⚠️ loses all type safety
```

### Type inference — TypeScript is smart

You don't have to write types everywhere. TypeScript figures them out:

```typescript
let name = "Alice";      // TypeScript infers: string
let age = 25;            // TypeScript infers: number
let active = true;       // TypeScript infers: boolean

const scores = [1, 2, 3]; // TypeScript infers: number[]
```

Only write explicit types when TypeScript can't infer, or for function parameters.

### Functions

```typescript
// Parameters need types. Return type is optional (TypeScript infers it).
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Arrow functions (same thing, different syntax)
const greet = (name: string): string => `Hello, ${name}`;

// Optional parameter (has a ?)
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}`;
  //                  ^^  "nullish coalescing" — uses right side if left is null/undefined
}

// Default parameter
function greet(name: string, greeting = "Hello"): string {
  return `${greeting}, ${name}`;
}
```

### `type` — naming a type

```typescript
// Give a type a name so you can reuse it
type UserId = string;
type Score = number;
type Direction = "north" | "south" | "east" | "west";  // union type

// Now use it
let playerId: UserId = "abc123";
let facing: Direction = "north";
facing = "diagonal";  // ❌ Error: not one of the allowed values
```

### `interface` — describing an object shape

```typescript
interface User {
  id: string;
  name: string;
  age: number;
  email?: string;  // optional property (the ?)
}

// TypeScript ensures every User has id, name, and age
const alice: User = {
  id: "1",
  name: "Alice",
  age: 25,
  // email is optional so we can omit it
};

alice.name = "Bob";    // ✅ fine
alice.score = 100;     // ❌ Error: 'score' does not exist on type 'User'
```

### `type` vs `interface` — when to use which

```typescript
// Use interface for objects you might extend
interface Animal {
  name: string;
}
interface Dog extends Animal {  // extends works with interface
  breed: string;
}

// Use type for unions, primitives, and complex combinations
type Status = "pending" | "done" | "error";
type ID = string | number;
type Handler = (event: MouseEvent) => void;
```

**Rule of thumb used in this project:** `interface` for component props and data shapes, `type` for unions and aliases.

### Union types — OR logic

```typescript
// This value can be one of several specific things
type Role = "user" | "assistant" | "system";
type MessageStatus = "pending" | "streaming" | "done" | "error";

let role: Role = "user";
role = "admin";  // ❌ Error: "admin" is not a valid Role
```

### Generics — reusable types with parameters

```typescript
// Without generics — only works for strings
function firstItem(arr: string[]): string {
  return arr[0];
}

// With generics — works for any type
function firstItem<T>(arr: T[]): T {
  return arr[0];
}

firstItem(["a", "b"]);  // T is inferred as string, returns string
firstItem([1, 2, 3]);   // T is inferred as number, returns number
firstItem<boolean>([true, false]); // T explicitly set to boolean
```

You'll see generics everywhere in this project:
```typescript
useState<AppState>({ ... })    // state is typed as AppState
useRef<string[]>([])           // ref holds a string array
createContext<Theme>(DARK_THEME) // context value is typed as Theme
```

### `const` vs `let`

```typescript
const name = "Alice";  // cannot be reassigned
let age = 25;          // can be reassigned

name = "Bob";  // ❌ Error: cannot assign to 'name'
age = 26;      // ✅ fine
```

**Prefer `const` everywhere.** Use `let` only when you need to reassign. Biome will warn you if you use `let` for something that never gets reassigned.

### Template literals

```typescript
const name = "Alice";
const age = 25;

// Old way (don't do this)
const msg = "Hello " + name + ", you are " + age + " years old";

// Template literal (use this)
const msg = `Hello ${name}, you are ${age} years old`;
```

### Optional chaining and nullish coalescing

```typescript
// Optional chaining (?.) — safely access nested properties
const user = null;
const name = user?.name;        // returns undefined instead of crashing
const city = user?.address?.city; // chained

// Nullish coalescing (??) — fallback when null or undefined
const name = user?.name ?? "Anonymous";  // "Anonymous" if name is null/undefined
const port = config?.port ?? 3000;
```

These appear constantly in the project because React state can be undefined before it loads.

### `export` and `import`

```typescript
// file: types.ts
export type Role = "user" | "assistant";  // named export
export interface ChatMessage { ... }       // named export
export default function App() { ... }     // default export (one per file)

// file: app.tsx
import { Role, ChatMessage } from "./types.js";  // named imports
import App from "./app.js";                       // default import
import type { Role } from "./types.js";           // type-only import (erased at runtime)
```

Note the `.js` extension in imports — Bun requires it even for `.ts` files. TypeScript resolves them correctly.

---

## 4. React — the UI model

### What is React?

React is a library for building user interfaces. The core idea: **describe what the UI should look like, React figures out how to update it.**

Without React, you'd manually update the terminal or DOM:
```javascript
// Imperative (old way) — you tell it HOW to change
document.getElementById("name").textContent = newName;
terminal.clearLine();
terminal.write(newName);
```

With React:
```typescript
// Declarative — you describe WHAT it should look like
function NameDisplay({ name }: { name: string }) {
  return <Text>{name}</Text>;  // React handles the updates
}
```

### Components — building blocks

A component is just a function that returns UI:

```typescript
// Simplest possible component
function Hello() {
  return <Text>Hello, world!</Text>;
}

// Component with props (inputs)
function Greeting({ name, age }: { name: string; age: number }) {
  return <Text>Hello {name}, you are {age} years old</Text>;
}

// Using components
function App() {
  return (
    <Box>
      <Hello />
      <Greeting name="Alice" age={25} />
    </Box>
  );
}
```

### JSX — HTML-like syntax in TypeScript

JSX looks like HTML but it's actually TypeScript. The `.tsx` file extension means "TypeScript with JSX".

```tsx
// JSX                          // What it compiles to
<Text color="red">Hi</Text>    →  React.createElement(Text, { color: "red" }, "Hi")
<Box flexDirection="column" />  →  React.createElement(Box, { flexDirection: "column" })
```

Rules of JSX:
```tsx
// 1. One root element per return
return (
  <Box>         {/* wrap in a container if you need multiple */}
    <Text>A</Text>
    <Text>B</Text>
  </Box>
);

// 2. Self-close tags with no children
<Box flexDirection="column" />

// 3. JavaScript expressions go in {}
<Text color={isError ? "red" : "green"}>{message}</Text>

// 4. Comments in JSX use {/* */}
{/* This is a comment */}

// 5. className doesn't exist in Ink — just use props directly
<Box borderStyle="single" borderColor="cyan" />
```

### Props — component inputs

```typescript
// Define the shape of props with an interface
interface ButtonProps {
  label: string;
  color?: string;    // optional
  onClick: () => void; // function prop
}

// Destructure props in the function signature
function Button({ label, color = "cyan", onClick }: ButtonProps) {
  return (
    <Text color={color} onPress={onClick}>
      {label}
    </Text>
  );
}

// Use it
<Button label="Submit" onClick={() => handleSubmit()} />
```

### State — values that change over time

State is data that the component "remembers" between renders. When state changes, React re-renders the component.

```typescript
import { useState } from "react";

function Counter() {
  // [currentValue, functionToUpdateIt] = useState(initialValue)
  const [count, setCount] = useState(0);

  return (
    <Box>
      <Text>Count: {count}</Text>
      <Text onPress={() => setCount(count + 1)}>Increment</Text>
    </Box>
  );
}
```

**The golden rule:** never mutate state directly. Always use the setter:

```typescript
// ❌ Wrong — React won't know the state changed
state.count = 5;

// ✅ Correct — React sees the change and re-renders
setCount(5);
setCount(prev => prev + 1);  // functional update (use when new value depends on old)
```

### Re-rendering — how React updates the UI

Every time state changes, React:
1. Calls your component function again with the new state
2. Compares the new output with the previous output
3. Updates only what changed

This is why your component functions run multiple times — React calls them whenever it needs to redraw.

```typescript
function App() {
  const [name, setName] = useState("Alice");

  // This function runs every time name changes
  console.log("rendering with name:", name);

  return <Text>{name}</Text>;
}
```

---

## 5. Ink — React for the terminal

### What is Ink?

Ink lets you use React to build terminal UIs. Instead of rendering to a browser DOM, it renders to the terminal using ANSI escape codes.

```
Browser React:              Ink (terminal React):
<div>                  →    <Box>
<span>                 →    <Text>
CSS flexbox            →    flexbox props on Box
```

### `Box` — the layout component

`Box` is like a `div`. It uses **flexbox** for layout.

```tsx
// Vertical stack (default direction is "row")
<Box flexDirection="column">
  <Text>Line 1</Text>
  <Text>Line 2</Text>
</Box>

// Horizontal layout
<Box flexDirection="row" gap={2}>
  <Text>Left</Text>
  <Text>Right</Text>
</Box>

// Take all available space
<Box flexGrow={1}>
  <Text>This fills remaining space</Text>
</Box>

// Borders
<Box borderStyle="single" borderColor="cyan" padding={1}>
  <Text>Bordered box</Text>
</Box>

// Alignment
<Box justifyContent="space-between" alignItems="center">
  <Text>Left</Text>
  <Text>Right</Text>
</Box>
```

### `Text` — the text component

```tsx
<Text>Plain text</Text>
<Text color="red">Red text</Text>
<Text color="green" bold>Bold green</Text>
<Text dimColor>Dimmed/gray text</Text>
<Text underline>Underlined</Text>
<Text inverse>Inverse colors (background/foreground swapped)</Text>

{/* Nest Text for mixed styles */}
<Text>
  Hello <Text color="cyan" bold>Alice</Text>!
</Text>
```

Available colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`.

### `useInput` — reading keyboard input

```typescript
import { useInput } from "ink";

function MyComponent() {
  useInput((input, key) => {
    // `input` is the raw character typed (e.g., "a", "b", "1")
    // `key` has boolean flags for special keys

    if (key.return) {
      // Enter was pressed
    }
    if (key.escape) {
      // Escape was pressed
    }
    if (key.ctrl && input === "c") {
      // Ctrl+C
    }
    if (key.backspace) {
      // Backspace
    }
    if (key.upArrow) {
      // Up arrow
    }
    if (key.meta && input === "b") {
      // Alt+B (meta = Alt/Option key)
    }
  });
}
```

`key` object properties:
| Property | Description |
|---|---|
| `key.return` | Enter key |
| `key.escape` | Escape key |
| `key.backspace` | Backspace |
| `key.delete` | Delete |
| `key.ctrl` | Ctrl is held |
| `key.shift` | Shift is held |
| `key.meta` | Alt/Option is held |
| `key.upArrow` | Up arrow |
| `key.downArrow` | Down arrow |
| `key.leftArrow` | Left arrow |
| `key.rightArrow` | Right arrow |
| `key.tab` | Tab key |

### `useApp` — app-level controls

```typescript
import { useApp } from "ink";

function App() {
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.ctrl && input === "c") {
      exit();  // clean exit
    }
  });
}
```

### `render` — mounting the app

The entry point `src/index.tsx`:

```typescript
import { render } from "ink";
import { App } from "./app.js";

render(<App />);  // mount the App component into the terminal
```

---

## 6. Biome — linting and formatting

### What is a linter?

A linter reads your code and warns you about:
- Potential bugs (`if (x = 5)` instead of `if (x === 5)`)
- Bad practices (unused variables, `any` types)
- Style inconsistencies

### What is a formatter?

A formatter automatically rewrites your code to be consistently styled — consistent indentation, quotes, trailing commas, line length, etc.

### Why Biome instead of ESLint + Prettier?

ESLint (linter) and Prettier (formatter) are the traditional tools, but they're two separate tools that sometimes conflict. Biome does both in one fast tool.

```bash
bun run lint           # check for problems
bun run format         # auto-fix formatting
bun x biome check --write .  # fix all auto-fixable issues
```

### `tsconfig.json` key settings explained

```json
{
  "strict": true,
  // enables: noImplicitAny, strictNullChecks, strictFunctionTypes, and more
  // basically: "be as strict as possible about types"

  "noUnusedLocals": true,
  // error if you declare a variable and never use it

  "noUnusedParameters": true,
  // error if a function has a parameter it never uses

  "noUncheckedIndexedAccess": true,
  // array[i] returns T | undefined, not just T
  // forces you to handle the case where the index doesn't exist

  "jsx": "react-jsx",
  // enables JSX syntax in .tsx files, uses React 17+ transform
  // (you don't need to import React at the top of every file)

  "moduleResolution": "bundler"
  // uses Bun/bundler-style module resolution
  // allows importing "./file.js" for a ".ts" source file
}
```

---

## 7. Project structure explained

```
yen/
├── src/
│   ├── index.tsx          Entry point — mounts the app
│   ├── app.tsx            Root component — owns all state, global shortcuts
│   ├── types.ts           Shared TypeScript types (ChatMessage, AppState, etc.)
│   │
│   ├── components/        UI components (what things look like)
│   │   ├── InputBox.tsx   The text input at the bottom
│   │   ├── MessageList.tsx The scrollable chat history
│   │   ├── StatusBar.tsx  The top bar (model, branch, theme)
│   │   ├── CodeBlock.tsx  Syntax-highlighted code renderer
│   │   └── DiffView.tsx   File diff renderer (+/- lines)
│   │
│   └── hooks/             Custom React hooks (reusable logic)
│       ├── useInputBuffer.ts  Text + cursor state (reducer)
│       ├── useHistory.ts      Command history (ref)
│       ├── useVimMode.ts      Vim modal state machine
│       └── useTheme.ts        Theme context
│
├── docs/
│   └── milestone-1-learning.md   ← you are here
│
├── biome.json             Linter + formatter config
├── tsconfig.json          TypeScript compiler config
├── package.json           Project manifest + scripts
├── bun.lock               Exact dependency versions (commit this)
├── CLAUDE.md              Instructions for Claude Code
└── MILESTONES.md          Project roadmap
```

**Separation of concerns:**
- `hooks/` contains **logic** — no JSX, no UI
- `components/` contains **UI** — what things look like
- `types.ts` contains **data shapes** — what data looks like
- `app.tsx` **wires it all together** — state lives here

---

## 8. Types and interfaces

Here is every type defined in the project and what it means:

### `src/types.ts`

```typescript
// The three kinds of messages in a chat
export type Role = "user" | "assistant" | "system";

// The lifecycle of a single message
export type MessageStatus =
  | "pending"    // created but not yet sent
  | "streaming"  // currently receiving tokens
  | "done"       // complete
  | "error";     // something went wrong

// A single chat message
export interface ChatMessage {
  id: string;           // unique ID (from crypto.randomUUID())
  role: Role;           // who sent it
  content: string;      // the text
  status: MessageStatus;
  timestamp: Date;      // when it was created
}

// The two available themes
export type Theme = "dark" | "light";

// The top-level application state (everything App.tsx manages)
export interface AppState {
  messages: ChatMessage[];  // the full conversation history
  isStreaming: boolean;     // is Claude currently responding?
  theme: Theme;
  model: string;            // which Claude model to use
}
```

### `src/hooks/useTheme.ts`

```typescript
// Defines what a theme object looks like
export interface Theme {
  name: "dark" | "light";
  accent: string;    // main color (cyan in dark, blue in light)
  assistant: string; // color for assistant messages
  system: string;    // color for system messages
  dim: string;       // color for dimmed text
  border: string;    // color for borders
}
```

### `src/hooks/useInputBuffer.ts`

```typescript
// Every possible operation on the text buffer
// This is a "discriminated union" — each case has a unique "type" field
export type BufferAction =
  | { type: "insert"; text: string }    // insert text at cursor
  | { type: "deleteBackward" }           // backspace
  | { type: "deleteForward" }            // delete key
  | { type: "deleteWordBackward" }       // Ctrl+W
  | { type: "deleteWordForward" }        // dw in vim
  | { type: "deleteToEnd" }              // Ctrl+K
  | { type: "deleteToStart" }            // Ctrl+U
  | { type: "deleteLine"; saveYank?: boolean } // dd in vim
  | { type: "moveLeft"; n?: number }     // ← or h
  | { type: "moveRight"; n?: number }    // → or l
  | { type: "moveToStart" }              // Ctrl+A or 0
  | { type: "moveToEnd" }                // Ctrl+E or $
  | { type: "moveWordBackward" }         // Alt+B or b
  | { type: "moveWordForward" }          // Alt+F or w
  | { type: "moveWordEnd" }              // e
  | { type: "yankLine" }                 // yy — copy line
  | { type: "pasteAfter" }               // p — paste
  | { type: "pasteBefore" }              // P — paste before
  | { type: "set"; value: string; cursor?: number }  // replace entire value
  | { type: "clear" };                   // empty the buffer
```

---

## 9. React hooks deep dive

Hooks are functions that let components "hook into" React features. They always start with `use`.

### `useState`

```typescript
const [value, setValue] = useState<string>("");
//     ^^^^^  ^^^^^^^^^              ^^^^^^
//     current  update fn           initial value
//     value

// Reading state
console.log(value);

// Updating state
setValue("new value");

// Functional update — use when new value depends on old value
setValue(prev => prev + " world");
```

**Rule:** Only call hooks at the top level of a component function. Never inside `if`, loops, or nested functions.

### `useReducer`

When state is complex (multiple related values, complex update logic), `useReducer` is cleaner than multiple `useState` calls.

```typescript
// Instead of:
const [value, setValue] = useState("");
const [cursor, setCursor] = useState(0);
const [yank, setYank] = useState("");
// Updating cursor and value together can get out of sync ^^^

// Use useReducer:
interface State { value: string; cursor: number; yank: string; }
type Action = { type: "insert"; text: string } | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "insert":
      return {
        ...state,  // spread: copy all existing fields
        value: state.value.slice(0, state.cursor) + action.text + state.value.slice(state.cursor),
        cursor: state.cursor + action.text.length,
        // yank is unchanged — ...state takes care of it
      };
    case "clear":
      return { ...state, value: "", cursor: 0 };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { value: "", cursor: 0, yank: "" });

// Now updates are atomic — cursor and value always change together
dispatch({ type: "insert", text: "hello" });
dispatch({ type: "clear" });
```

The `...state` spread operator copies all fields from the old state and then you override only what changed. This is the **immutable update** pattern — you never modify the existing state object, you always return a new one.

### `useRef`

A ref is a box that holds a value that:
- Persists across renders (survives re-renders)
- Does NOT trigger a re-render when changed
- Is accessed via `.current`

```typescript
const count = useRef(0);  // initial value

count.current;      // read
count.current = 5;  // write (no re-render triggered)
```

In `useHistory.ts`, we use refs because the history array and navigation index are "behind-the-scenes" data — the UI doesn't need to re-render when they change:

```typescript
const entries = useRef<string[]>([]);   // the history list
const index = useRef(-1);               // current position (-1 = not navigating)
const saved = useRef("");               // saved draft before navigating
```

### `useEffect`

Runs a side effect after a render. "Side effects" are things outside React's world: API calls, timers, reading the filesystem.

```typescript
useEffect(() => {
  // runs after every render by default

  // Run an async operation
  getGitBranch().then(branch => setBranch(branch));

  // Optional cleanup function (runs before next effect or unmount)
  return () => {
    // cleanup code here (cancel timers, abort requests, etc.)
  };
}, []);  // dependency array:
         // []       = run once after first render only
         // [value]  = run when `value` changes
         // omitted  = run after every render
```

In `StatusBar.tsx`, we use `useEffect` to get the git branch once at startup:

```typescript
useEffect(() => {
  getGitBranch().then(setBranch);
}, []);  // [] means "run once"
```

### `useContext`

Lets components access shared data without passing props through every level.

```typescript
// 1. Create the context with a default value
const ThemeContext = createContext<Theme>(DARK_THEME);

// 2. Provide the value at the top level
function App() {
  const [theme, setTheme] = useState(DARK_THEME);
  return (
    <ThemeContext.Provider value={theme}>
      <Everything />   {/* all children can access theme */}
    </ThemeContext.Provider>
  );
}

// 3. Consume the value anywhere in the tree
function DeepComponent() {
  const theme = useContext(ThemeContext);
  return <Text color={theme.accent}>hello</Text>;
}
```

### Custom hooks — reusing logic

A custom hook is just a function that uses other hooks. It lets you extract and reuse stateful logic across components.

```typescript
// Custom hook — reusable input buffer logic
export function useInputBuffer(initial = "") {
  const [state, dispatch] = useReducer(reducer, {
    value: initial,
    cursor: initial.length,
    yank: "",
  });
  return { ...state, dispatch };  // expose state + dispatch
}

// Use in any component
function InputBox() {
  const buf = useInputBuffer();   // get the buffer
  buf.value;                      // read
  buf.cursor;                     // read
  buf.dispatch({ type: "insert", text: "hi" });  // write
}
```

---

## 10. Components we built

### `src/components/InputBox.tsx`

The input field at the bottom of the screen. It:
1. Uses `useInputBuffer` for cursor-aware text editing
2. Uses `useHistory` for Up/Down history navigation
3. Uses `useVimMode` to track insert/normal mode
4. Renders the cursor at the correct position
5. Handles every keypress via `useInput`

**How cursor rendering works:**

```
Input value: "hello world"
Cursor at position 5 (the space)

Rendering:
  before   cursor   after
  "hello"  " "      "world"
           ^^^
           rendered with inverse/underline style
```

```typescript
const before = line.slice(0, cursorCol);         // "hello"
const ch = line[cursorCol] ?? " ";               // " " (the space)
const after = line.slice(cursorCol + 1);         // "world"

return (
  <Text>
    {before}
    <Text inverse={isNormal} underline={!isNormal}>{ch}</Text>
    {after}
  </Text>
);
```

### `src/hooks/useInputBuffer.ts`

The reducer handles all text mutations. Key concept: **every operation is defined as a pure function** (no side effects, same input always gives same output):

```typescript
// Example: how "deleteWordBackward" works
case "deleteWordBackward": {
  const newPos = wordBackward(value, cursor);  // find start of previous word
  return {
    ...state,
    value: value.slice(0, newPos) + value.slice(cursor),  // remove the word
    cursor: newPos,  // move cursor to where the word started
  };
}
```

**Word navigation algorithm (vim `b` motion):**

```
"hello world|"  ← cursor after 'd'
         ^
Step 1: skip whitespace going left (none here)
Step 2: skip word chars going left: d → l → r → o → w
Step 3: land at: "hello |world"
               cursor here ^
```

### `src/hooks/useVimMode.ts`

A simple state machine with two states:

```
┌─────────┐   Esc         ┌────────┐
│  INSERT │ ─────────────→│ NORMAL │
│  mode   │ ←─────────────│  mode  │
└─────────┘   i/I/a/A/o/O └────────┘
```

The `pendingOp` state handles operators that need a motion:
```
User presses 'd' → pendingOp = "d" (waiting for motion)
User presses 'w' → dispatch deleteWordForward, clear pendingOp
User presses 'd' again → dispatch deleteLine (dd), clear pendingOp
```

### `src/components/CodeBlock.tsx`

Parses each line with a regex and classifies tokens:

```
Input:  "const name: string = \"hello\";"
Tokens: ["const"] → keyword (blue)
        [" name"] → plain
        [":"]     → plain
        [" string"] → keyword (blue)
        [" = "]   → plain
        ["\"hello\""] → string (green)
        [";"]     → plain
```

### `src/components/MessageList.tsx`

Parses fenced code blocks from message content:

```
Input message:
"Here is some code:
```typescript
const x = 1;
```
And some more text."

Parsed segments:
1. { kind: "text", content: "Here is some code:\n" }
2. { kind: "code", lang: "typescript", code: "const x = 1;" }
3. { kind: "text", content: "\nAnd some more text." }
```

Segment 2 gets rendered as `<CodeBlock>`, segments 1 and 3 as `<Text>`.

### `src/components/StatusBar.tsx`

Gets the git branch asynchronously using `Bun.spawn`:

```typescript
async function getGitBranch(): Promise<string> {
  const proc = Bun.spawn(["git", "branch", "--show-current"], {
    stdout: "pipe",  // capture stdout
  });
  const text = await new Response(proc.stdout).text();
  return text.trim();  // remove trailing newline
}
```

`Bun.spawn` is Bun's equivalent of Node's `child_process.spawn`. It runs a system command and lets you read its output.

---

## 11. Key patterns to remember

### Pattern 1: Discriminated unions for actions

```typescript
// Each action has a unique "type" — TypeScript can narrow the type in each case
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set"; value: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "increment": return state + 1;
    case "decrement": return state - 1;
    case "set": return action.value;  // TypeScript knows action.value exists here
  }
}
```

### Pattern 2: Immutable state updates

```typescript
// ❌ Wrong — mutates existing state
case "updateName":
  state.name = action.name;
  return state;

// ✅ Correct — returns a new object
case "updateName":
  return { ...state, name: action.name };
```

### Pattern 3: Functional state updates

```typescript
// When new state depends on old state, use the functional form
setCount(prev => prev + 1);       // ✅ safe
setCount(count + 1);              // ⚠️ can be stale in async code
```

### Pattern 4: Async in useEffect

```typescript
// Can't make useEffect itself async — use an inner function
useEffect(() => {
  async function loadData() {
    const data = await fetchSomething();
    setData(data);
  }
  loadData();
}, []);

// Or shorthand:
useEffect(() => {
  fetchSomething().then(setData);
}, []);
```

### Pattern 5: Custom hook returns

```typescript
// Return an object (named properties — easier to use)
function useCounter() {
  const [count, setCount] = useState(0);
  return {
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
    reset: () => setCount(0),
  };
}

// Use it
const counter = useCounter();
counter.count;
counter.increment();
```

### Pattern 6: TypeScript `as const`

```typescript
// Without as const — TypeScript infers string
const model = "claude-sonnet-4-6";  // type: string

// With as const — TypeScript infers the exact literal
const model = "claude-sonnet-4-6" as const;  // type: "claude-sonnet-4-6"

// Useful for objects
const THEMES = {
  dark: { accent: "cyan" },
  light: { accent: "blue" },
} as const;
// TypeScript knows the exact shape, can't accidentally add/modify keys
```

---

## What's next — Milestone 2 preview

Milestone 2 connects everything to the real Claude API. You'll learn:

- **`@anthropic-ai/sdk`** — the official TypeScript SDK for Claude
- **Streaming** — `for await...of` on an async iterator of response tokens
- **The Messages API** — how to format a conversation as `MessageParam[]`
- **Prompt caching** — how to reduce API costs on repeated context
- **Extended thinking** — how to give Claude more reasoning time

The `handleSubmit` function in `app.tsx` currently has a `setTimeout` placeholder that echoes back your message. In Milestone 2 you'll replace that with a real streaming API call.

---

*Last updated: Milestone 1 complete — Foundation & TUI Shell*
