import { Box, Text } from "ink";
import { useEffect, useState } from "react";

interface StatusBarProps {
  model: string;
  isStreaming: boolean;
  themeName: string;
}

// Reads the current git branch once at mount via Bun.spawn
async function getGitBranch(): Promise<string> {
  try {
    const proc = Bun.spawn(["git", "branch", "--show-current"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const text = await new Response(proc.stdout).text();
    return text.trim();
  } catch {
    return "";
  }
}

export function StatusBar({ model, isStreaming, themeName }: StatusBarProps) {
  const [branch, setBranch] = useState("");

  useEffect(() => {
    getGitBranch().then(setBranch);
  }, []);

  return (
    <Box justifyContent="space-between" paddingX={1}>
      <Box gap={1}>
        <Text color="magenta" bold>
          yen
        </Text>
        {branch && (
          <Text dimColor>
            git:(<Text color="cyan">{branch}</Text>)
          </Text>
        )}
      </Box>
      <Box gap={2}>
        <Text dimColor>{themeName === "dark" ? "● dark" : "○ light"}</Text>
        <Text dimColor>{model}</Text>
        {isStreaming && <Text color="yellow">● streaming</Text>}
      </Box>
    </Box>
  );
}
