// ─────────────────────────────────────────────────────────────
// TOPIC: useState — local component state + re-rendering
// RUN:   bun run sandbox/react-ink/03-usestate.tsx
// PREREQUISITE: 00-jsx-rendering.tsx, 00b-layout.tsx, 01-hello-world.tsx
// SEE:   src/components/StatusBar.tsx — useState for branch/streaming
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: What is state? ─────────────────────────────────
// State is data that can change over time.
// When state changes, React re-renders the component.
// This is what makes UIs interactive.
//
// useState<T>(initialValue) returns:
//   [currentValue, setterFunction]
//
// NEVER mutate state directly — always use the setter.

import { useState, useEffect } from "react";
import { Box, Text, render, useInput, useApp } from "ink";

// ── CONCEPT 2: A simple counter ───────────────────────────────

function Counter() {
  const [count, setCount] = useState(0);
  //    ^^^^^   ^^^^^^^^   ^^^^^^^^^^^
  //    value   setter     initial value

  useInput((input, key) => {
    if (input === "+" || input === "=") setCount(count + 1);
    if (input === "-") setCount(count - 1);
    if (input === "r") setCount(0);
    if (input === "q") process.exit(0);
  });

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Counter: <Text color="cyan">{count}</Text></Text>
      <Text dimColor>+/= increment  -  decrement  r reset  q quit</Text>
    </Box>
  );
}

// ── CONCEPT 3: Functional updates ────────────────────────────
// When new state depends on old state, pass a function to setter.
// This avoids stale closure bugs with async operations.

// ❌ Might have stale state in callbacks:
// setCount(count + 1);

// ✅ Always gets the latest state:
// setCount(prev => prev + 1);

// ── CONCEPT 4: Multiple state values ─────────────────────────
// You can call useState multiple times — one per piece of state.

function StatusBoard() {
  const [branch, setBranch] = useState("main");
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [streaming, setStreaming] = useState(false);
  const [tick, setTick] = useState(0);

  // Simulate streaming toggling every second
  useEffect(() => {
    const id = setInterval(() => {
      setStreaming(prev => !prev);
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box gap={2} borderStyle="single">
      <Text>⎇ <Text color="cyan">{branch}</Text></Text>
      <Text dimColor>{model}</Text>
      {streaming
        ? <Text color="yellow">▋ streaming</Text>
        : <Text color="green">● ready</Text>
      }
      <Text dimColor>tick:{tick}</Text>
    </Box>
  );
}

// ── CONCEPT 5: State that's an object ────────────────────────
// Group related state into one object.
// Use spread to update individual fields.

interface InputState {
  value: string;
  submitted: boolean;
}

function SimpleInput() {
  const { exit } = useApp();
  const [state, setState] = useState<InputState>({ value: "", submitted: false });

  useInput((input, key) => {
    if (state.submitted) return;

    if (key.return) {
      setState(prev => ({ ...prev, submitted: true }));
    } else if (key.backspace || key.delete) {
      setState(prev => ({ ...prev, value: prev.value.slice(0, -1) }));
    } else if (input && !key.ctrl && !key.meta) {
      setState(prev => ({ ...prev, value: prev.value + input }));
    }

    if (key.ctrl && input === "c") exit();
  });

  if (state.submitted) {
    return <Text color="green">You typed: "{state.value}"</Text>;
  }

  return (
    <Box gap={1}>
      <Text dimColor>›</Text>
      <Text>{state.value}</Text>
      <Text inverse> </Text>
      <Text dimColor>(press Enter to submit, Ctrl+C to exit)</Text>
    </Box>
  );
}

// ── CONCEPT 6: Choosing what to render ───────────────────────
// Run one of these to see different concepts in action.
// Change which one is rendered below.

render(<SimpleInput />);
// render(<Counter />);
// render(<StatusBoard />);

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Create a component `ToggleTheme` that tracks a theme: "dark" | "light"
// Show the current theme and let the user press "t" to toggle.
// Display the background hint for each theme:
//   dark → "#1a1a2e"    light → "#ffffff"
// YOUR CODE:


// EXERCISE 2:
// Create a `Stopwatch` component that:
//   - Tracks elapsed seconds (use useEffect + setInterval)
//   - Shows the time as MM:SS
//   - Lets the user press space to pause/resume
//   - Lets the user press r to reset
// YOUR CODE:


// EXERCISE 3:
// Create a `ChoiceMenu` component that takes a list of string options
// and lets the user navigate with arrow keys (up/down) and select with Enter.
// Show a ▶ indicator next to the selected item.
// Print the chosen item when Enter is pressed.
// YOUR CODE:
