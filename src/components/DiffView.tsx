import { Box, Text } from "ink";

export interface DiffLine {
  kind: "added" | "removed" | "context" | "header";
  content: string;
}

export interface FileDiff {
  path: string;
  lines: DiffLine[];
}

interface DiffViewProps {
  diff: FileDiff;
}

// Parses unified diff text into structured DiffLine array
export function parseDiff(raw: string): DiffLine[] {
  return raw.split("\n").map((line) => {
    if (line.startsWith("+") && !line.startsWith("+++"))
      return { kind: "added" as const, content: line };
    if (line.startsWith("-") && !line.startsWith("---"))
      return { kind: "removed" as const, content: line };
    if (line.startsWith("@@")) return { kind: "header" as const, content: line };
    return { kind: "context" as const, content: line };
  });
}

export function DiffView({ diff }: DiffViewProps) {
  const added = diff.lines.filter((l) => l.kind === "added").length;
  const removed = diff.lines.filter((l) => l.kind === "removed").length;

  return (
    <Box flexDirection="column" borderStyle="single" borderColor="yellow" marginY={1}>
      {/* Header */}
      <Box paddingX={1} justifyContent="space-between">
        <Text color="yellow" bold>
          {diff.path}
        </Text>
        <Box gap={1}>
          <Text color="green">+{added}</Text>
          <Text color="red">-{removed}</Text>
        </Box>
      </Box>

      {/* Diff lines */}
      {diff.lines.map((line, i) => {
        switch (line.kind) {
          case "added":
            return (
              <Box key={i} paddingX={1}>
                <Text color="green">{line.content}</Text>
              </Box>
            );
          case "removed":
            return (
              <Box key={i} paddingX={1}>
                <Text color="red">{line.content}</Text>
              </Box>
            );
          case "header":
            return (
              <Box key={i} paddingX={1}>
                <Text color="cyan" dimColor>
                  {line.content}
                </Text>
              </Box>
            );
          default:
            return (
              <Box key={i} paddingX={1}>
                <Text dimColor>{line.content}</Text>
              </Box>
            );
        }
      })}
    </Box>
  );
}
