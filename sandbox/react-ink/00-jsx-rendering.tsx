// ─────────────────────────────────────────────────────────────
// TOPIC: JSX and the React rendering model — from scratch
// RUN:   bun run sandbox/react-ink/00-jsx-rendering.tsx
// READ THIS FIRST before any other react-ink file.
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: What is React? ─────────────────────────────────
// React is a library for building UIs by describing WHAT you want,
// not HOW to draw it step by step.
//
// Normally, building a UI means:
//   "Draw a box. Inside it, draw text. When state changes, clear it and redraw."
//
// React's approach:
//   "Here is what the UI should look like right now."
//   React figures out what changed and updates only that part.
//
// Ink = React, but instead of drawing to a browser, it draws to the terminal.
// Same React code. Same hooks. Same mental model. Different renderer.

// ── CONCEPT 2: What is JSX? ───────────────────────────────────
// JSX looks like HTML inside TypeScript. It's not a separate language —
// it's special syntax that TypeScript understands and transforms.
//
// JSX:                     What TypeScript actually compiles it to:
// <Text bold>hello</Text>  →  createElement(Text, { bold: true }, "hello")
//
// So <Text bold>hello</Text> is just a function call in disguise.
// The file extension is .tsx (TypeScript + JSX).

// ── CONCEPT 3: A component is just a function ─────────────────
// A React component is a function that:
//   - Takes an object of "props" (inputs)
//   - Returns JSX (the description of what to render)
//
// React calls your function → gets back JSX → renders it.
// When state changes → React calls your function again → re-renders.

import { Box, Text, render } from "ink";

// The simplest possible component:
function HelloWorld() {
  return <Text>Hello from React + Ink!</Text>;
}

// That function gets called by React when it needs to render.
// You never call it directly: ✅ render(<HelloWorld />) not ❌ HelloWorld()

// ── CONCEPT 4: JSX syntax rules ──────────────────────────────
// 1. Tags must always be closed:
//    ✅ <Text>hello</Text>   ✅ <Box />  (self-closing for empty elements)
//    ❌ <Text>hello           ❌ <Box>   (never leave open)
//
// 2. A component must return ONE root element:
//    ✅ <Box><Text>a</Text><Text>b</Text></Box>  (one root Box)
//    ❌ <Text>a</Text><Text>b</Text>             (two roots — error)
//
// 3. JavaScript expressions go inside { }:
//    <Text>{2 + 2}</Text>      → "4"
//    <Text>{name}</Text>       → the value of `name`
//    <Text>{isOk ? "yes" : "no"}</Text>  → conditional

const userName = "Alice";
const isOnline = true;

function UserStatus() {
  return (
    <Box gap={1}>
      <Text bold>{userName}</Text>
      <Text color={isOnline ? "green" : "red"}>
        {isOnline ? "● online" : "○ offline"}
      </Text>
    </Box>
  );
}

// 4. Component names MUST start with a capital letter:
//    ✅ <UserStatus />   (capital U — React knows it's a component)
//    ❌ <userStatus />   (lowercase — React thinks it's an HTML tag)
//
// 5. Props look like HTML attributes, but they're TypeScript:
//    <Text color="green">    — string value
//    <Text bold>             — boolean true (same as bold={true})
//    <Text bold={false}>     — explicit false
//    <Box width={40}>        — number value (note: { } not quotes)
//    <Box flexDirection="column">  — string value

// ── CONCEPT 5: The Ink component tree ────────────────────────
// Ink has two core components:
//   Box  — a container (holds other components, controls layout)
//   Text — displays styled text
//
// Think of Box as a transparent container and Text as the actual content.
// You cannot put Text directly inside Text with layout — use Box for structure.

function ComponentTree() {
  return (
    <Box flexDirection="column">        {/* outer container, vertical stack */}
      <Box>                             {/* inner container, horizontal row */}
        <Text bold>Title: </Text>
        <Text color="cyan">yen agent</Text>
      </Box>
      <Text dimColor>A coding assistant</Text>
    </Box>
  );
}

// ── CONCEPT 6: Conditional rendering ─────────────────────────
// Python: print("yes") if condition else None
// JSX:    {condition && <Text>yes</Text>}   ← only renders if condition is true
//   OR:   {condition ? <Text>yes</Text> : <Text>no</Text>}

function StatusLine({ streaming }: { streaming: boolean }) {
  return (
    <Box gap={1}>
      <Text>Status:</Text>
      {streaming
        ? <Text color="yellow">streaming...</Text>
        : <Text color="green">ready</Text>
      }
      {streaming && <Text dimColor>(Ctrl+C to cancel)</Text>}
    </Box>
  );
}

// ── CONCEPT 7: Rendering a list ───────────────────────────────
// To render multiple items from an array, use .map():
// Each item needs a unique `key` prop — React uses it to track changes.

const languages = ["TypeScript", "Python", "Rust"];

function LanguageList() {
  return (
    <Box flexDirection="column">
      {languages.map((lang, index) => (
        <Text key={index}>• {lang}</Text>
        //    ^^^^^^^^^^
        //    required — helps React update efficiently
      ))}
    </Box>
  );
}

// ── CONCEPT 8: render() — mounting the app ────────────────────
// render() is the entry point. You call it once with your root component.
// Ink takes over the terminal output and manages re-renders.

function App() {
  return (
    <Box flexDirection="column" gap={1} padding={1}>
      <HelloWorld />
      <UserStatus />
      <ComponentTree />
      <StatusLine streaming={false} />
      <LanguageList />
    </Box>
  );
}

render(<App />);

// ── CONCEPT 9: The React update cycle ────────────────────────
// 1. render(<App />) → React calls App()
// 2. App returns JSX tree
// 3. Ink draws the tree to the terminal
// 4. When state changes (useState, etc.) → React calls App() again
// 5. React compares new JSX tree vs old tree (diffing)
// 6. Ink only redraws the parts that changed
//
// You never manually update the terminal.
// You just describe WHAT should be on screen, React handles the rest.

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Create a component `Greeting` that takes two props:
//   name: string, time: "morning" | "afternoon" | "evening"
// It should show "Good morning, Alice!" with the time in color:
//   morning → yellow, afternoon → cyan, evening → blue
// YOUR CODE:


// EXERCISE 2:
// Create a component `FeatureList` that takes features: string[]
// and renders each as "✓ feature-name" in green.
// If the list is empty, render "No features yet" in dim gray.
// Test it with 3 features and also with an empty array.
// YOUR CODE:


// EXERCISE 3:
// Create a component `Card` that takes:
//   title: string, value: string | number, highlighted?: boolean
// If highlighted is true, render the value in bold yellow.
// Otherwise render it in white.
// Create 4 cards: model name, token count, cost, status.
// YOUR CODE:
