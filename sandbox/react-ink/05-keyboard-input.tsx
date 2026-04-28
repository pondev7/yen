// ─────────────────────────────────────────────────────────────
// TOPIC: Keyboard input, useInput, special keys
// RUN:   bun run sandbox/react-ink/05-keyboard-input.tsx
// PREREQUISITE: 03-usestate.tsx
// SEE:   src/components/InputBox.tsx — full keyboard handling
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: useInput ───────────────────────────────────────
// Ink's useInput hook fires a callback on every keypress.
// Signature: useInput((input, key) => void)
//
// `input` — the character pressed (e.g. "a", "1", " ")
//           ctrl combos: "c" when Ctrl+C pressed
// `key`   — special key flags:
//   key.return       — Enter
//   key.backspace    — Backspace
//   key.delete       — Delete
//   key.escape       — Escape
//   key.tab          — Tab
//   key.upArrow      — ↑
//   key.downArrow    — ↓
//   key.leftArrow    — ←
//   key.rightArrow   — →
//   key.ctrl         — Ctrl held
//   key.meta         — Alt/Option held
//   key.shift        — Shift held (only with special keys)

import { useState } from "react";
import { Box, Text, render, useInput, useApp } from "ink";

// ── CONCEPT 2: Logging all keypresses ────────────────────────
// Great for debugging — see exactly what Ink reports for each key

interface KeyEvent {
  input: string;
  flags: string[];
  id: number;
}

function KeyLogger() {
  const [events, setEvents] = useState<KeyEvent[]>([]);
  const [id, setId] = useState(0);
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.ctrl && input === "c") { exit(); return; }

    const flags: string[] = [];
    if (key.return)    flags.push("return");
    if (key.backspace) flags.push("backspace");
    if (key.delete)    flags.push("delete");
    if (key.escape)    flags.push("escape");
    if (key.tab)       flags.push("tab");
    if (key.upArrow)   flags.push("up");
    if (key.downArrow) flags.push("down");
    if (key.leftArrow) flags.push("left");
    if (key.rightArrow)flags.push("right");
    if (key.ctrl)      flags.push("ctrl");
    if (key.meta)      flags.push("meta");
    if (key.shift)     flags.push("shift");

    const event: KeyEvent = { input, flags, id };
    setEvents(prev => [...prev.slice(-9), event]);  // keep last 10
    setId(prev => prev + 1);
  });

  return (
    <Box flexDirection="column" gap={1} padding={1}>
      <Text bold>Key Logger — press keys to see what Ink reports</Text>
      <Text dimColor>Ctrl+C to quit</Text>

      <Box flexDirection="column">
        {events.length === 0 && <Text dimColor>press any key...</Text>}
        {events.map(e => (
          <Box key={e.id} gap={2}>
            <Text color="cyan" bold>
              {e.input ? JSON.stringify(e.input) : "(empty)"}
            </Text>
            <Text dimColor>{e.flags.length > 0 ? e.flags.join(", ") : "no flags"}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ── CONCEPT 3: Common input patterns ─────────────────────────

// Text input (visible chars only):
// if (input && !key.ctrl && !key.meta && !key.return) { append(input) }

// Ctrl+letter combos:
// if (key.ctrl && input === "a") { moveToStart() }
// if (key.ctrl && input === "e") { moveToEnd() }
// if (key.ctrl && input === "k") { deleteToEnd() }
// if (key.ctrl && input === "u") { deleteToStart() }
// if (key.ctrl && input === "w") { deleteWordBack() }
// if (key.ctrl && input === "c") { exit() }

// Alt/Meta combos (word navigation):
// if (key.meta && input === "b") { wordBackward() }
// if (key.meta && input === "f") { wordForward() }

// ── CONCEPT 4: A full-featured text input ────────────────────

function TextInput() {
  const [value, setValue] = useState("");
  const [cursor, setCursor] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.ctrl && input === "c") { exit(); return; }

    if (key.return) {
      if (value.trim()) {
        setHistory(prev => [...prev, value]);
        setValue("");
        setCursor(0);
      }
      return;
    }

    if (key.backspace) {
      if (cursor === 0) return;
      setValue(prev => prev.slice(0, cursor - 1) + prev.slice(cursor));
      setCursor(prev => prev - 1);
      return;
    }

    if (key.leftArrow || (key.ctrl && input === "b")) {
      setCursor(prev => Math.max(0, prev - 1));
      return;
    }

    if (key.rightArrow || (key.ctrl && input === "f")) {
      setCursor(prev => Math.min(value.length, prev + 1));
      return;
    }

    if (key.ctrl && input === "a") { setCursor(0); return; }
    if (key.ctrl && input === "e") { setCursor(value.length); return; }

    if (key.ctrl && input === "k") {
      setValue(prev => prev.slice(0, cursor));
      return;
    }

    if (key.ctrl && input === "u") {
      setValue(prev => prev.slice(cursor));
      setCursor(0);
      return;
    }

    if (input && !key.ctrl && !key.meta) {
      setValue(prev => prev.slice(0, cursor) + input + prev.slice(cursor));
      setCursor(prev => prev + 1);
    }
  });

  // Render cursor in the text
  const before = value.slice(0, cursor);
  const atCursor = value[cursor] ?? " ";
  const after = value.slice(cursor + 1);

  return (
    <Box flexDirection="column" gap={1} padding={1}>
      <Text bold>Text Input with cursor and history</Text>

      <Box flexDirection="column">
        {history.map((line, i) => (
          <Box key={i} gap={1}>
            <Text dimColor>›</Text>
            <Text>{line}</Text>
          </Box>
        ))}
      </Box>

      <Box gap={1}>
        <Text color="cyan">›</Text>
        <Text>
          {before}
          <Text inverse>{atCursor}</Text>
          {after}
        </Text>
      </Box>

      <Text dimColor>
        Ctrl+A start  Ctrl+E end  Ctrl+K kill  Ctrl+U clear  Enter submit
      </Text>
    </Box>
  );
}

render(<KeyLogger />);
// Swap to see the text input demo:
// render(<TextInput />);

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Build a `VimLite` component with two modes: "insert" and "normal"
//   - In insert mode: type normally, press Escape to go normal
//   - In normal mode:
//     - h/l: move left/right
//     - i: enter insert mode
//     - x: delete char under cursor
//     - 0/$: move to start/end
//   - Show the current mode in the status bar
// YOUR CODE:


// EXERCISE 2:
// Build a `NumberPad` component that lets the user:
//   - Enter a number by pressing digit keys (0-9)
//   - Press Backspace to delete the last digit
//   - Press + - * / then another number and Enter to calculate
//   - Display the running expression and result
// YOUR CODE:


// EXERCISE 3:
// Build a `SearchBox` that:
//   - Takes a list of strings as initial data
//   - Filters the list as the user types
//   - Highlights the matching characters in the results (make them bold or colored)
//   - Shows count: "3 of 10 results"
// YOUR CODE:
