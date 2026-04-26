import { Box, useApp, useInput } from "ink";
import { useState } from "react";
import { InputBox } from "./components/InputBox.js";
import { MessageList } from "./components/MessageList.js";
import { StatusBar } from "./components/StatusBar.js";
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

export function App() {
  const { exit } = useApp();

  const [state, setState] = useState<AppState>({
    messages: [makeMessage("system", "Welcome to yen. Type a message to get started.")],
    isStreaming: false,
    theme: "dark",
    model: DEFAULT_MODEL,
  });

  // Ctrl+C exits
  useInput((_input, key) => {
    if (key.ctrl && _input === "c") {
      exit();
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

    // placeholder — will be replaced with real Claude API call in Milestone 2
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
          makeMessage("system", "Available commands: /clear, /help, /quit"),
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
    <Box flexDirection="column" height="100%">
      <StatusBar model={state.model} isStreaming={state.isStreaming} />
      <Box borderStyle="single" borderColor="gray" flexDirection="column" flexGrow={1}>
        <MessageList messages={state.messages} />
      </Box>
      <InputBox onSubmit={handleSubmit} isDisabled={state.isStreaming} />
    </Box>
  );
}
