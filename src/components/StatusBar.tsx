import { Box, Text } from "ink";

interface StatusBarProps {
  model: string;
  isStreaming: boolean;
}

export function StatusBar({ model, isStreaming }: StatusBarProps) {
  return (
    <Box justifyContent="space-between" paddingX={1}>
      <Text color="magenta" bold>
        yen
      </Text>
      <Box gap={2}>
        <Text dimColor>{model}</Text>
        {isStreaming && <Text color="yellow">● streaming</Text>}
      </Box>
    </Box>
  );
}
