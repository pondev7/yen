import { Box, Text, useApp, useInput } from "ink";
import { createElement, useState } from "react";
import { InputBox } from "./components/InputBox.js";
import { MessageList } from "./components/MessageList.js";
import { StatusBar } from "./components/StatusBar.js";
import { DARK_THEME, LIGHT_THEME, ThemeContext } from "./hooks/useTheme.js";
import type { AppState, ChatMessage } from "./types.js";

const DEFAULT_MODEL = "claude-sonnet-4-6";

function makeMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    status: "done",
    timestamp: new Date(),
  };
}

// Transcript panel — shows all messages with timestamps
function TranscriptPanel({ messages }: { messages: ChatMessage[] }) {
  return (
    <Box flexDirection="column" borderStyle="single" borderColor="cyan" width={60} padding={1}>
      <Text color="cyan" bold>
        Transcript
      </Text>
      <Text dimColor>Ctrl+O to close</Text>
      <Box flexDirection="column" marginTop={1}>
        {messages.map((m) => (
          <Box key={m.id} flexDirection="column" marginBottom={1}>
            <Text dimColor>
              [{m.timestamp.toLocaleTimeString()}]{" "}
              <Text
                color={m.role === "user" ? "cyan" : m.role === "assistant" ? "green" : "yellow"}
              >
                {m.role}
              </Text>
            </Text>
            <Text wrap="wrap">
              {m.content.slice(0, 200)}
              {m.content.length > 200 ? "…" : ""}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function App() {
  const { exit } = useApp();

  const [state, setState] = useState<AppState>({
    messages: [makeMessage("system", "Welcome to yen. Type a message to get started.")],
    isStreaming: false,
    theme: "dark",
    model: DEFAULT_MODEL,
  });

  const [showTranscript, setShowTranscript] = useState(false);

  const theme = state.theme === "dark" ? DARK_THEME : LIGHT_THEME;

  // Global shortcuts (handled at app level, not input level)
  useInput((input, key) => {
    // Ctrl+C → exit
    if (key.ctrl && input === "c") {
      exit();
      return;
    }
    // Ctrl+T → toggle theme
    if (key.ctrl && input === "t") {
      setState((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }));
      return;
    }
    // Ctrl+O → toggle transcript
    if (key.ctrl && input === "o") {
      setShowTranscript((prev) => !prev);
      return;
    }
    // Ctrl+L → clear screen by adding a system message separator
    if (key.ctrl && input === "l") {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, makeMessage("system", "─── screen cleared ───")],
      }));
    }
  });

  function handleSubmit(input: string) {
    if (input.startsWith("/")) {
      handleSlashCommand(input);
      return;
    }

    const userMessage = makeMessage("user", input);
    const assistantMessage: ChatMessage = {
      ...makeMessage("assistant", ""),
      status: "streaming",
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage, assistantMessage],
      isStreaming: true,
    }));

    // placeholder — replaced with real Claude API call in Milestone 2
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        messages: prev.messages.map((m) =>
          m.id === assistantMessage.id ? { ...m, content: `Echo: ${input}`, status: "done" } : m,
        ),
      }));
    }, 500);
  }

  function handleSlashCommand(input: string) {
    const cmd = input.trim().toLowerCase();

    if (cmd === "/clear") {
      setState((prev) => ({
        ...prev,
        messages: [makeMessage("system", "Session cleared.")],
      }));
      return;
    }
    if (cmd === "/help") {
      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          makeMessage(
            "system",
            "Commands: /clear  /help  /quit\nShortcuts: Ctrl+T theme · Ctrl+O transcript · Ctrl+L clear · Esc vim normal mode",
          ),
        ],
      }));
      return;
    }
    if (cmd === "/quit") {
      exit();
      return;
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, makeMessage("system", `Unknown command: ${input}`)],
    }));
  }

  return (
    // ThemeContext makes the theme available to all child components
    createElement(
      ThemeContext.Provider,
      { value: theme },
      <Box flexDirection="column" height="100%">
        <StatusBar model={state.model} isStreaming={state.isStreaming} themeName={state.theme} />
        <Box flexDirection="row" flexGrow={1}>
          <Box borderStyle="single" borderColor="gray" flexDirection="column" flexGrow={1}>
            <MessageList messages={state.messages} />
          </Box>
          {showTranscript && <TranscriptPanel messages={state.messages} />}
        </Box>
        <InputBox onSubmit={handleSubmit} isDisabled={state.isStreaming} />
      </Box>,
    )
  );
}
