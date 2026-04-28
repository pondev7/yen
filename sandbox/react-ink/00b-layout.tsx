// ─────────────────────────────────────────────────────────────
// TOPIC: Layout with Box — terminal flexbox from scratch
// RUN:   bun run sandbox/react-ink/00b-layout.tsx
// PREREQUISITE: 00-jsx-rendering.tsx
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: What is layout? ───────────────────────────────
// Layout = how elements are positioned relative to each other.
//
// In a terminal, "layout" means:
//   - How wide is this Box?
//   - Are children stacked vertically or side by side?
//   - How much space is between them?
//   - How much padding is inside the box?
//
// Ink uses a system called "flexbox" to answer these questions.
// You don't need any CSS knowledge — we'll explain everything here.

import { Box, Text, render } from "ink";

// ── CONCEPT 2: The two directions ─────────────────────────────
// Every Box has a flexDirection: "row" or "column"
//
// "column" (default) = children stack TOP to BOTTOM:
// ┌────────┐
// │ Item 1 │
// │ Item 2 │
// │ Item 3 │
// └────────┘
//
// "row" = children sit LEFT to RIGHT:
// ┌─────────────────────────┐
// │ Item 1  Item 2  Item 3  │
// └─────────────────────────┘

function DirectionDemo() {
  return (
    <Box flexDirection="column" gap={1}>

      <Text bold>Column (top to bottom):</Text>
      <Box flexDirection="column">
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </Box>

      <Text bold>Row (left to right):</Text>
      <Box flexDirection="row">
        <Text>Item 1  </Text>
        <Text>Item 2  </Text>
        <Text>Item 3</Text>
      </Box>

    </Box>
  );
}

// ── CONCEPT 3: gap — space between children ──────────────────
// gap={1} adds 1 blank line between children (in column mode)
// gap={1} adds 1 space between children (in row mode)
// gap={2} adds 2 blank lines / 2 spaces

function GapDemo() {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>No gap:</Text>
      <Box flexDirection="row">
        <Text>[A]</Text>
        <Text>[B]</Text>
        <Text>[C]</Text>
      </Box>

      <Text bold>gap={"{"}2{"}"}:</Text>
      <Box flexDirection="row" gap={2}>
        <Text>[A]</Text>
        <Text>[B]</Text>
        <Text>[C]</Text>
      </Box>
    </Box>
  );
}

// ── CONCEPT 4: padding and margin ────────────────────────────
// padding = space INSIDE the box (between the border and the content)
// margin  = space OUTSIDE the box (between the box and its neighbors)
//
// ┌──────────────────┐
// │  ← padding       │
// │   Content here   │
// │                  │
// └──────────────────┘
// ↕ margin (space outside the box)
//
// paddingX = left + right padding
// paddingY = top + bottom padding
// padding  = all sides
//
// marginLeft, marginRight, marginTop, marginBottom — individual sides

function PaddingDemo() {
  return (
    <Box flexDirection="column" gap={1}>
      <Box borderStyle="single">
        <Text>No padding</Text>
      </Box>

      <Box borderStyle="single" padding={1}>
        <Text>padding={"{"}1{"}"}</Text>
      </Box>

      <Box borderStyle="single" paddingX={2} paddingY={1}>
        <Text>paddingX=2 paddingY=1</Text>
      </Box>
    </Box>
  );
}

// ── CONCEPT 5: width and height ───────────────────────────────
// By default, a Box is as wide as its content.
// You can give it a fixed width or height:

function SizeDemo() {
  return (
    <Box flexDirection="column" gap={1}>
      <Box width={30} borderStyle="single">
        <Text>Fixed width 30</Text>
      </Box>

      <Box width={20} borderStyle="single">
        <Text>Fixed width 20</Text>
      </Box>
    </Box>
  );
}

// ── CONCEPT 6: justifyContent — distribute along main axis ────
// "Main axis" = the direction of flexDirection.
// In a "row" box, the main axis is horizontal (left→right).
// In a "column" box, the main axis is vertical (top→bottom).
//
// justifyContent controls where items GO along that axis:
//
//   "flex-start"   → pack at the start (default)
//   "center"       → center them
//   "flex-end"     → pack at the end
//   "space-between"→ spread them out, no gaps at edges
//
// Example with "row":
// flex-start:    [A][B][C]· · · · · · · ·
// center:        · · · · ·[A][B][C]· · · ·
// flex-end:      · · · · · · · · ·[A][B][C]
// space-between: [A]· · · · · ·[B]· · · · ·[C]

function JustifyDemo() {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>justifyContent in a row (width=40):</Text>

      <Box flexDirection="row" width={40} justifyContent="flex-start" borderStyle="single">
        <Text>[A]</Text><Text>[B]</Text><Text>[C]</Text>
      </Box>

      <Box flexDirection="row" width={40} justifyContent="center" borderStyle="single">
        <Text>[A]</Text><Text>[B]</Text><Text>[C]</Text>
      </Box>

      <Box flexDirection="row" width={40} justifyContent="flex-end" borderStyle="single">
        <Text>[A]</Text><Text>[B]</Text><Text>[C]</Text>
      </Box>

      <Box flexDirection="row" width={40} justifyContent="space-between" borderStyle="single">
        <Text>[A]</Text><Text>[B]</Text><Text>[C]</Text>
      </Box>
    </Box>
  );
}

// ── CONCEPT 7: alignItems — align along cross axis ────────────
// "Cross axis" = perpendicular to flexDirection.
// In a "row" box, the cross axis is vertical.
// In a "column" box, the cross axis is horizontal.
//
// alignItems controls where items align on the cross axis:
//   "flex-start" → align to start (top in row, left in column)
//   "center"     → center
//   "flex-end"   → align to end

function AlignDemo() {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>alignItems in a column (width=30):</Text>

      <Box flexDirection="column" width={30} alignItems="flex-start" borderStyle="single">
        <Text>[flex-start]</Text>
      </Box>

      <Box flexDirection="column" width={30} alignItems="center" borderStyle="single">
        <Text>[center]</Text>
      </Box>

      <Box flexDirection="column" width={30} alignItems="flex-end" borderStyle="single">
        <Text>[flex-end]</Text>
      </Box>
    </Box>
  );
}

// ── CONCEPT 8: A real-world layout — status bar ───────────────
// Putting it all together: a typical terminal app layout.
// Left side: mode indicator. Right side: model + branch.

function StatusBar() {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      borderStyle="single"
      paddingX={1}
    >
      <Box gap={1}>
        <Text color="cyan" bold>INSERT</Text>
        <Text dimColor>mode</Text>
      </Box>

      <Box gap={2}>
        <Text color="green">main</Text>
        <Text dimColor>claude-sonnet-4-6</Text>
      </Box>
    </Box>
  );
}

// ── CONCEPT 9: Nesting — building complex layouts ────────────
// Real layouts nest Box inside Box inside Box.
// There's no limit to nesting depth.
// Think in layers: outer structure → inner sections → content.

function AppLayout() {
  return (
    <Box flexDirection="column" padding={1} gap={1}>

      {/* Header row */}
      <Box flexDirection="row" justifyContent="space-between">
        <Text bold color="cyan">yen</Text>
        <Text dimColor>v1.0.0</Text>
      </Box>

      {/* Main content area */}
      <Box flexDirection="row" gap={2}>

        {/* Left panel */}
        <Box flexDirection="column" width={20} borderStyle="single" padding={1}>
          <Text bold>Files</Text>
          <Text dimColor>src/app.tsx</Text>
          <Text dimColor>src/types.ts</Text>
        </Box>

        {/* Right panel */}
        <Box flexDirection="column" borderStyle="single" padding={1}>
          <Text bold>Output</Text>
          <Text>Hello from the agent!</Text>
        </Box>

      </Box>

      {/* Footer */}
      <StatusBar />

    </Box>
  );
}

render(<AppLayout />);

// ── SUMMARY ───────────────────────────────────────────────────
// Box props:
//   flexDirection: "row" | "column"       — direction of children
//   gap: number                           — space between children
//   padding / paddingX / paddingY: number — inner space
//   margin / marginLeft / etc.: number    — outer space
//   width / height: number                — fixed dimensions
//   justifyContent: "flex-start" | "center" | "flex-end" | "space-between"
//   alignItems: "flex-start" | "center" | "flex-end"
//   borderStyle: "single" | "double" | "round" | "bold" | "classic"

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Build a 2-column layout where:
//   Left column: 25 chars wide, contains a list of 4 menu items
//   Right column: fills the rest, contains a title + some content
// Add a border around each column and a gap between them.
// YOUR CODE:


// EXERCISE 2:
// Build a "header bar" that has:
//   Left side: an app name (bold)
//   Center: a status message (dim)
//   Right side: a version number
// It should span the full width using justifyContent="space-between".
// YOUR CODE:


// EXERCISE 3:
// Build a "dashboard" layout:
//   - A header at the top (full width)
//   - Three equal-width stat boxes in a row below it
//   - Each stat box shows a label (dim, top) and a value (bold, bottom)
// Stats: { Tokens: "1,234" }, { Cost: "$0.0023" }, { Turns: "5" }
// YOUR CODE:
