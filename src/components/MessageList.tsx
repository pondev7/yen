import { Box, Text } from "ink";
import type { ChatMessage } from "../types.js";
import { CodeBlock } from "./CodeBlock.js";

interface MessageListProps {
  messages: ChatMessage[];
}

// Splits message content into plain text and fenced code block segments
type Segment = { kind: "text"; content: string } | { kind: "code"; lang: string; code: string };

function parseSegments(content: string): Segment[] {
  const segments: Segment[] = [];
  const fenceRe = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;

  for (const match of content.matchAll(fenceRe)) {
    if (match.index > lastIndex) {
      segments.push({ kind: "text", content: content.slice(lastIndex, match.index) });
    }
    segments.push({ kind: "code", lang: match[1] ?? "", code: match[2] ?? "" });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ kind: "text", content: content.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ kind: "text", content }];
}

function MessageContent({ content }: { content: string }) {
  const segments = parseSegments(content);
  return (
    <Box flexDirection="column">
      {segments.map((seg, i) =>
        seg.kind === "code" ? (
          <CodeBlock key={i} code={seg.code.trimEnd()} lang={seg.lang} />
        ) : (
          <Text key={i}>{seg.content}</Text>
        ),
      )}
    </Box>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="cyan" bold>
        you
      </Text>
      <MessageContent content={message.content} />
    </Box>
  );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="green" bold>
        yen
      </Text>
      <Text color={message.status === "error" ? "red" : undefined}>
        {message.status === "streaming" && !message.content ? "…" : ""}
      </Text>
      {message.content && <MessageContent content={message.content} />}
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
