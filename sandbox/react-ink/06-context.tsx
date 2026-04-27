// ─────────────────────────────────────────────────────────────
// TOPIC: React Context — sharing state without prop drilling
// RUN:   bun run sandbox/react-ink/06-context.tsx
// SEE:   src/hooks/useTheme.ts — ThemeContext in the real app
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: The prop drilling problem ─────────────────────
// Without context, you pass props down through every level.
// If App has a theme, and a deeply nested component needs it,
// every intermediate component must pass it along — even if
// it doesn't use it. That's "prop drilling".
//
// Context solves this: put data at the top, read it anywhere.

// ── CONCEPT 2: Creating and using context ────────────────────

import { createContext, useContext, useState } from "react";
import { Box, Text, render, useInput, useApp } from "ink";

// Step 1: Define the type
interface Theme {
  accent: string;
  dim: string;
  border: string;
  bg: string;
}

// Step 2: Define the values
const DARK: Theme = {
  accent: "cyan",
  dim: "gray",
  border: "white",
  bg: "black",
};

const LIGHT: Theme = {
  accent: "blue",
  dim: "gray",
  border: "black",
  bg: "white",
};

// Step 3: Create the context with a default value
const ThemeContext = createContext<Theme>(DARK);
//                  ^^^^^^^^^^^^^^^^^^^^
//                  TypeScript knows the context type

// Step 4: Custom hook to read the context (convenience wrapper)
function useTheme() {
  return useContext(ThemeContext);
  //      ^^^^^^^^^^
  //      reads the nearest ThemeContext.Provider above this component
}

// ── CONCEPT 3: Components that use the context ───────────────

function Header({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <Box borderStyle="single" paddingX={1}>
      <Text bold color={theme.accent}>{title}</Text>
    </Box>
  );
}

function Footer({ hint }: { hint: string }) {
  const theme = useTheme();
  return (
    <Text color={theme.dim}>{hint}</Text>
  );
}

function MessageBubble({ role, content }: { role: string; content: string }) {
  const theme = useTheme();
  const color = role === "user" ? theme.accent : "green";
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color={color} bold>[{role}]</Text>
      <Box marginLeft={2}>
        <Text>{content}</Text>
      </Box>
    </Box>
  );
}

// ── CONCEPT 4: The Provider ───────────────────────────────────
// ThemeContext.Provider wraps the tree and injects the value.
// Any component inside can call useTheme() to read it.
// Changing the Provider's value re-renders all consumers.

function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? DARK : LIGHT;
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.ctrl && input === "c") exit();
    if (input === "t") setIsDark(prev => !prev);
  });

  return (
    // ThemeContext.Provider makes `theme` available to ALL children
    <ThemeContext.Provider value={theme}>
      <Box flexDirection="column" gap={1} padding={1}>
        <Header title="yen — context demo" />

        <MessageBubble role="user" content="What can you do?" />
        <MessageBubble role="assistant" content="I can help with code, explain concepts, and more." />

        <Footer hint={`Theme: ${isDark ? "dark" : "light"} — press t to toggle, Ctrl+C to quit`} />
      </Box>
    </ThemeContext.Provider>
  );
}

render(<App />);

// ── CONCEPT 5: Multiple contexts ─────────────────────────────
// You can have multiple contexts for different concerns:
//   <ThemeContext.Provider value={theme}>
//     <ConfigContext.Provider value={config}>
//       <App />
//     </ConfigContext.Provider>
//   </ThemeContext.Provider>
//
// In the real app, we use ThemeContext for colors.
// Later milestones will add ConfigContext for model/settings.

// ── CONCEPT 6: When NOT to use context ───────────────────────
// Don't use context for everything — it causes all consumers
// to re-render when the value changes.
// Good for: theme, config, current user, language settings
// Prefer props for: component-specific data, list items

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Create a `FontSizeContext` that provides a font scale: "small" | "normal" | "large"
// Create a `Label` component that reads it and renders text
// with different dimColor/bold settings based on scale.
// Let the user cycle through sizes with a keypress.
// YOUR CODE:


// EXERCISE 2:
// Create a `UserContext` that provides { name: string, role: "admin" | "user" }
// Create components:
//   - `Greeting`: shows "Hello, <name>!"
//   - `AdminPanel`: shows "Admin tools available" only if role === "admin"
//   - `ProfileBar`: shows name dimmed in the corner
// Wrap them all in the Provider with a hardcoded user.
// YOUR CODE:


// EXERCISE 3:
// Create a notification system using context:
//   NotificationContext provides:
//     - notifications: Array<{ id: number, text: string }>
//     - add(text: string): void
//     - dismiss(id: number): void
// Create a `NotificationBanner` that reads the context and shows them.
// Create a root component that adds a notification every 2 seconds.
// YOUR CODE:
