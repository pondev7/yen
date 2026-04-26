import { Box, Text } from "ink";
import type { ChatMessage } from "../types.js";

interface MessageListProps {
  messages: ChatMessage[];
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="cyan" bold>
        you
      </Text>
      <Text>{message.content}</Text>
    </Box>
  );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="green" bold>
        yen
      </Text>
      <Text color={message.status === "error" ? "red" : undefined}>{message.content || "…"}</Text>
    </Box>
  );
}

function SystemMessage({ message }: { message: ChatMessage }) {
  return (
    <Box marginBottom={1}>
      <Text color="yellow" dimColor>
        {message.content}
      </Text>
    </Box>
  );
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Box flexGrow={1} alignItems="center" justifyContent="center">
        <Text dimColor>Start a conversation…</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1}>
      {messages.map((message) => {
        if (message.role === "user") return <UserMessage key={message.id} message={message} />;
        if (message.role === "assistant")
          return <AssistantMessage key={message.id} message={message} />;
        return <SystemMessage key={message.id} message={message} />;
      })}
    </Box>
  );
}
