// ─────────────────────────────────────────────────────────────
// TOPIC: React + Ink basics — rendering to the terminal
// RUN:   bun run sandbox/react-ink/01-hello-world.tsx
// PREREQUISITE: 00-jsx-rendering.tsx, 00b-layout.tsx
// SEE:   src/index.tsx — entry point of the real app
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: What is Ink? ───────────────────────────────────
// Ink is React for the terminal. Instead of a browser DOM,
// it renders to stdout using terminal escape codes.
// You write components exactly like React — same hooks, same JSX.
//
// Box  → a container with layout properties (see 00b-layout.tsx)
// Text → displays text with optional styling

import { Box, Text, render } from "ink";

// ── CONCEPT 2: A React component ─────────────────────────────
// A component is just a function that returns JSX.
// JSX looks like HTML but it's actually TypeScript function calls.

function HelloWorld() {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="cyan">
        Hello from Ink!
      </Text>
      <Text>
        This is rendered in the <Text color="green">terminal</Text>.
      </Text>
      <Text dimColor>
        (same React you use for websites — just different renderer)
      </Text>
    </Box>
  );
}

// ── CONCEPT 3: render() ───────────────────────────────────────
// render() mounts your root component and starts the Ink loop.
// Ink takes over stdout and re-renders on state changes.

render(<HelloWorld />);

// ── CONCEPT 4: JSX compilation ───────────────────────────────
// JSX is not magic — it compiles to regular function calls.
// <Text bold>hello</Text>
//   becomes → createElement(Text, { bold: true }, "hello")
//
// The tsconfig.json "jsx": "react-jsx" setting tells TypeScript
// to use the modern JSX transform (no manual React import needed).

// ── CONCEPT 5: Box and Text props ────────────────────────────
// Box controls layout (like CSS flexbox):
//   flexDirection: "row" | "column"
//   gap: number             — space between children
//   padding: number         — inner space
//   margin: number          — outer space
//   width / height: number  — fixed size
//   justifyContent          — like CSS justify-content
//   alignItems              — like CSS align-items
//
// Text controls appearance:
//   bold, italic, underline, strikethrough, inverse, dimColor
//   color: "red" | "green" | "blue" | "cyan" | "yellow" | "white" | "#hex"
//   backgroundColor: same options

// ── CONCEPT 6: The component tree ────────────────────────────
// React renders a TREE of components.
// Each component can contain other components (composition).
// This is how you build complex UIs from simple pieces.

function Greeting({ name, role }: { name: string; role: string }) {
  return (
    <Box>
      <Text>[</Text>
      <Text color="yellow">{role}</Text>
      <Text>] </Text>
      <Text bold>{name}</Text>
    </Box>
  );
}

// (Not rendered here — used as an example of composition)
// In the real app: MessageList renders a list of Message components

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Create a component called `Banner` that renders a box with
// a colored title and a subtitle below it.
// Use a bold cyan title and a dimColor subtitle.
// Render it by replacing <HelloWorld /> with <Banner />
// YOUR CODE:


// EXERCISE 2:
// Create a component `ColorPalette` that shows a row of
// colored boxes, one for each: red, green, blue, yellow, cyan, magenta
// Each box should show its color name in that color
// YOUR CODE:


// EXERCISE 3:
// Create a component `KeyValueTable` that takes an array of
// { key: string, value: string } pairs and renders them
// in a two-column layout. Keys in dim, values in bold white.
// Test it with 4 pairs of your choice.
// YOUR CODE:
