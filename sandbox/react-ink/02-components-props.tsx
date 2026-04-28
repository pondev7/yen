// ─────────────────────────────────────────────────────────────
// TOPIC: Components, props, and composition
// RUN:   bun run sandbox/react-ink/02-components-props.tsx
// PREREQUISITE: 00-jsx-rendering.tsx, 00b-layout.tsx
// SEE:   src/components/MessageList.tsx — real component with props
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: Props ──────────────────────────────────────────
// Props are the inputs to a component — like function arguments.
// You define them as a TypeScript interface or inline object type.

import { Box, Text, render } from "ink";

interface BadgeProps {
  label: string;
  color: string;
}

function Badge({ label, color }: BadgeProps) {
  //            ^^^^^^^^^^^^^^^^^^^
  //            destructuring props directly in the parameter
  return (
    <Box borderStyle="round" paddingX={1}>
      <Text color={color}>{label}</Text>
    </Box>
  );
}

// ── CONCEPT 2: Composition — components inside components ─────
// You build complex UIs by nesting components.

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function Message({ role, content, timestamp }: MessageProps) {
  const color = role === "user" ? "cyan" : "green";

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box gap={1}>
        <Badge label={role} color={color} />
        <Text dimColor>{timestamp}</Text>
      </Box>
      <Box marginLeft={2}>
        <Text>{content}</Text>
      </Box>
    </Box>
  );
}

// ── CONCEPT 3: Children prop ──────────────────────────────────
// Components can accept children — content placed between their tags.
// Like how <Box> wraps <Text> in all our components.
//
// React.ReactNode = "anything React can render":
//   a string, a number, a JSX element, an array of elements, null, undefined
// It's the type for "whatever you put between opening and closing tags".

interface PanelProps {
  title: string;
  children: React.ReactNode;  // anything renderable
}

function Panel({ title, children }: PanelProps) {
  return (
    <Box flexDirection="column" borderStyle="single" padding={1} gap={1}>
      <Text bold underline>{title}</Text>
      {children}
    </Box>
  );
}

// ── CONCEPT 4: Arrays of components ───────────────────────────
// Use .map() to render a list of items as components.
// (In the real app this is how MessageList renders messages)

const sampleMessages: MessageProps[] = [
  { role: "user", content: "What is TypeScript?", timestamp: "10:00" },
  { role: "assistant", content: "TypeScript is JavaScript with types.", timestamp: "10:01" },
  { role: "user", content: "How do I use generics?", timestamp: "10:02" },
];

function App() {
  return (
    <Panel title="yen — coding agent">
      {sampleMessages.map((msg, i) => (
        <Message
          key={i}
          role={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
        />
      ))}
    </Panel>
  );
}

render(<App />);

// ── CONCEPT 5: Conditional rendering ─────────────────────────
// Use && or ternary to show/hide parts of the UI based on state.

function StatusLine({ streaming }: { streaming: boolean }) {
  return (
    <Box gap={1}>
      <Text>Status:</Text>
      {streaming ? (
        <Text color="yellow">▋ streaming...</Text>
      ) : (
        <Text color="green">✓ ready</Text>
      )}
      {streaming && <Text dimColor>(press Ctrl+C to cancel)</Text>}
    </Box>
  );
}

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Create a `Tag` component that takes a `text: string` and
// `variant: "info" | "success" | "error" | "warning"` prop.
// Render different colors for each variant (your choice).
// Render 4 tags, one of each variant.
// YOUR CODE:


// EXERCISE 2:
// Create a `FileList` component that takes `files: string[]` and
// renders each filename. Show the index number dimmed, and the
// filename in white. If files is empty, show "No files found" in yellow.
// Test with 3 filenames and then with an empty array.
// YOUR CODE:


// EXERCISE 3:
// Create a `TwoColumn` layout component that takes:
//   - left: React.ReactNode
//   - right: React.ReactNode
//   - leftWidth: number
// and renders them side by side.
// Use it to show a list of keys on the left and values on the right.
// YOUR CODE:
