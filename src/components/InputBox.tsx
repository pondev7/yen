import type { Key } from "ink";
import { Box, Text, useInput } from "ink";
import { useHistory } from "../hooks/useHistory.js";
import { useInputBuffer } from "../hooks/useInputBuffer.js";
import { useVimMode } from "../hooks/useVimMode.js";

interface InputBoxProps {
  onSubmit: (value: string) => void;
  isDisabled?: boolean;
}

// Renders a single line with the cursor injected at the right column.
// In normal mode the cursor is a block (inverse); in insert mode it's an underline.
function LineWithCursor({
  line,
  cursorCol,
  isNormal,
  isLastLine,
}: {
  line: string;
  cursorCol: number;
  isNormal: boolean;
  isLastLine: boolean;
}) {
  const before = line.slice(0, cursorCol);
  // In normal mode cursor sits ON a char; in insert mode it sits BETWEEN chars
  // so we show the char-under-cursor differently
  const ch = line[cursorCol] ?? (isLastLine ? " " : "");
  const after = line.slice(cursorCol + 1);

  return (
    <Text>
      {before}
      {ch !== "" && (
        <Text inverse={isNormal} underline={!isNormal}>
          {ch}
        </Text>
      )}
      {after}
    </Text>
  );
}

export function InputBox({ onSubmit, isDisabled = false }: InputBoxProps) {
  const buf = useInputBuffer();
  const history = useHistory();
  const vim = useVimMode();

  function handleInsert(input: string, key: Key) {
    // Esc → normal mode, cursor nudges left (vim behaviour)
    if (key.escape) {
      if (buf.cursor > 0) buf.dispatch({ type: "moveLeft" });
      vim.toNormal();
      return;
    }

    // Enter submits; Shift+Enter inserts a newline
    if (key.return) {
      if (key.shift) {
        buf.dispatch({ type: "insert", text: "\n" });
        return;
      }
      const val = buf.value.trim();
      if (val) {
        history.add(val);
        onSubmit(val);
        buf.dispatch({ type: "clear" });
      }
      return;
    }

    if (key.backspace || key.delete) {
      buf.dispatch({ type: "deleteBackward" });
      return;
    }

    // Ctrl shortcuts
    if (key.ctrl) {
      switch (input) {
        case "a":
          buf.dispatch({ type: "moveToStart" });
          break;
        case "e":
          buf.dispatch({ type: "moveToEnd" });
          break;
        case "k":
          buf.dispatch({ type: "deleteToEnd" });
          break;
        case "u":
          buf.dispatch({ type: "deleteToStart" });
          break;
        case "w":
          buf.dispatch({ type: "deleteWordBackward" });
          break;
      }
      return;
    }

    // Alt/Meta word motion
    if (key.meta) {
      if (input === "b") buf.dispatch({ type: "moveWordBackward" });
      if (input === "f") buf.dispatch({ type: "moveWordForward" });
      return;
    }

    // Arrow keys
    if (key.leftArrow) {
      buf.dispatch({ type: "moveLeft" });
      return;
    }
    if (key.rightArrow) {
      buf.dispatch({ type: "moveRight" });
      return;
    }
    if (key.upArrow) {
      const entry = history.prev(buf.value);
      if (entry !== undefined) buf.dispatch({ type: "set", value: entry });
      return;
    }
    if (key.downArrow) {
      const entry = history.next();
      if (entry !== undefined) buf.dispatch({ type: "set", value: entry });
      return;
    }

    // Regular printable character
    if (!key.ctrl && !key.meta && input) {
      buf.dispatch({ type: "insert", text: input });
    }
  }

  function handleNormal(input: string, key: Key) {
    const op = vim.pendingOp;

    if (key.escape) {
      vim.toNormal(); // clears pending op
      return;
    }

    // Enter submits from normal mode too
    if (key.return) {
      const val = buf.value.trim();
      if (val) {
        history.add(val);
        onSubmit(val);
        buf.dispatch({ type: "clear" });
        vim.toNormal();
      }
      return;
    }

    // Resolve pending operator + motion
    if (op) {
      switch (op) {
        case "d":
          switch (input) {
            case "d":
              buf.dispatch({ type: "deleteLine", saveYank: true });
              break;
            case "w":
              buf.dispatch({ type: "deleteWordForward" });
              break;
            case "b":
              buf.dispatch({ type: "deleteWordBackward" });
              break;
            case "$":
              buf.dispatch({ type: "deleteToEnd" });
              break;
            case "0":
              buf.dispatch({ type: "deleteToStart" });
              break;
          }
          vim.setPendingOp(null);
          return;

        case "c":
          switch (input) {
            case "c":
              buf.dispatch({ type: "deleteLine" });
              break;
            case "w":
              buf.dispatch({ type: "deleteWordForward" });
              break;
            case "$":
              buf.dispatch({ type: "deleteToEnd" });
              break;
          }
          vim.toInsert();
          return;

        case "y":
          if (input === "y") buf.dispatch({ type: "yankLine" });
          vim.setPendingOp(null);
          return;
      }
    }

    // Normal mode motions and actions
    switch (input) {
      // Motion
      case "h":
        buf.dispatch({ type: "moveLeft" });
        break;
      case "l":
        buf.dispatch({ type: "moveRight" });
        break;
      case "w":
        buf.dispatch({ type: "moveWordForward" });
        break;
      case "b":
        buf.dispatch({ type: "moveWordBackward" });
        break;
      case "e":
        buf.dispatch({ type: "moveWordEnd" });
        break;
      case "0":
        buf.dispatch({ type: "moveToStart" });
        break;
      case "$":
        buf.dispatch({ type: "moveToEnd" });
        break;

      // Enter insert mode
      case "i":
        vim.toInsert();
        break;
      case "I":
        buf.dispatch({ type: "moveToStart" });
        vim.toInsert();
        break;
      case "a":
        buf.dispatch({ type: "moveRight" });
        vim.toInsert();
        break;
      case "A":
        buf.dispatch({ type: "moveToEnd" });
        vim.toInsert();
        break;
      case "o":
      case "O":
        buf.dispatch({ type: "moveToEnd" });
        vim.toInsert();
        break;

      // Editing
      case "x":
        buf.dispatch({ type: "deleteForward" });
        break;
      case "X":
        buf.dispatch({ type: "deleteBackward" });
        break;
      case "p":
        buf.dispatch({ type: "pasteAfter" });
        break;
      case "P":
        buf.dispatch({ type: "pasteBefore" });
        break;

      // Operators (wait for motion on next keypress)
      case "d":
        vim.setPendingOp("d");
        break;
      case "c":
        vim.setPendingOp("c");
        break;
      case "y":
        vim.setPendingOp("y");
        break;

      default:
        // Arrow keys still work in normal mode
        if (key.leftArrow) buf.dispatch({ type: "moveLeft" });
        if (key.rightArrow) buf.dispatch({ type: "moveRight" });
        break;
    }
  }

  useInput(
    (input, key) => {
      if (vim.isInsert) handleInsert(input, key);
      else handleNormal(input, key);
    },
    { isActive: !isDisabled },
  );

  // ── Rendering ──────────────────────────────────────────────────────────────

  const { value, cursor } = buf;
  const lines = value.split("\n");

  // Determine which line and column the cursor is on
  let remaining = cursor;
  let cursorLine = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineLen = lines[i]?.length ?? 0;
    if (remaining <= lineLen) {
      cursorLine = i;
      break;
    }
    remaining -= lineLen + 1; // +1 for the \n
  }
  const cursorCol = remaining;

  const isNormal = vim.isNormal;
  const modeColor = isNormal ? "yellow" : "cyan";

  return (
    <Box flexDirection="column">
      {/* Mode indicator — only shown in normal mode */}
      {isNormal && (
        <Box paddingX={1} gap={1}>
          <Text bold color="yellow">
            -- NORMAL --
          </Text>
          {vim.pendingOp && (
            <Text color="yellow" dimColor>
              [{vim.pendingOp}…]
            </Text>
          )}
        </Box>
      )}

      <Box borderStyle="single" borderColor={modeColor} paddingX={1}>
        <Text color={modeColor} bold>
          {"› "}
        </Text>
        <Box flexDirection="column" flexGrow={1}>
          {lines.map((line, i) =>
            i === cursorLine ? (
              <LineWithCursor
                key={i}
                line={line}
                cursorCol={cursorCol}
                isNormal={isNormal}
                isLastLine={i === lines.length - 1}
              />
            ) : (
              <Text key={i}>{line}</Text>
            ),
          )}
        </Box>
      </Box>
    </Box>
  );
}
