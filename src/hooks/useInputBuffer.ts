import { useReducer } from "react";

// A "word" character for vim-style word motion
const isWord = (ch: string) => /\w/.test(ch);
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

interface State {
  value: string;
  cursor: number;
  yank: string; // vim register (clipboard)
}

export type BufferAction =
  | { type: "insert"; text: string }
  | { type: "deleteBackward" }
  | { type: "deleteForward" }
  | { type: "deleteWordBackward" }
  | { type: "deleteWordForward" }
  | { type: "deleteToEnd" }
  | { type: "deleteToStart" }
  | { type: "deleteLine"; saveYank?: boolean }
  | { type: "moveLeft"; n?: number }
  | { type: "moveRight"; n?: number }
  | { type: "moveToStart" }
  | { type: "moveToEnd" }
  | { type: "moveWordBackward" }
  | { type: "moveWordForward" }
  | { type: "moveWordEnd" }
  | { type: "yankLine" }
  | { type: "pasteAfter" }
  | { type: "pasteBefore" }
  | { type: "set"; value: string; cursor?: number }
  | { type: "clear" };

// Move cursor left past non-word chars, then past word chars (vim 'b')
function wordBackward(value: string, cursor: number): number {
  let i = cursor;
  while (i > 0 && !isWord(value[i - 1] ?? "")) i--;
  while (i > 0 && isWord(value[i - 1] ?? "")) i--;
  return i;
}

// Move cursor forward past word chars, then past non-word chars (vim 'w')
function wordForward(value: string, cursor: number): number {
  let i = cursor;
  const len = value.length;
  while (i < len && isWord(value[i] ?? "")) i++;
  while (i < len && !isWord(value[i] ?? "")) i++;
  return i;
}

// Move cursor to end of current/next word (vim 'e')
function wordEnd(value: string, cursor: number): number {
  let i = cursor;
  const len = value.length;
  if (i < len - 1) i++;
  while (i < len - 1 && !isWord(value[i] ?? "")) i++;
  while (i < len - 1 && isWord(value[i + 1] ?? "")) i++;
  return i;
}

function reducer(state: State, action: BufferAction): State {
  const { value, cursor, yank } = state;
  const len = value.length;

  switch (action.type) {
    case "insert":
      return {
        ...state,
        value: value.slice(0, cursor) + action.text + value.slice(cursor),
        cursor: cursor + action.text.length,
      };

    case "deleteBackward":
      if (cursor === 0) return state;
      return {
        ...state,
        value: value.slice(0, cursor - 1) + value.slice(cursor),
        cursor: cursor - 1,
      };

    case "deleteForward":
      if (cursor >= len) return state;
      return { ...state, value: value.slice(0, cursor) + value.slice(cursor + 1) };

    case "deleteWordBackward": {
      const newPos = wordBackward(value, cursor);
      return {
        ...state,
        value: value.slice(0, newPos) + value.slice(cursor),
        cursor: newPos,
      };
    }

    case "deleteWordForward": {
      const end = wordForward(value, cursor);
      return { ...state, value: value.slice(0, cursor) + value.slice(end) };
    }

    case "deleteToEnd":
      return { ...state, value: value.slice(0, cursor) };

    case "deleteToStart":
      return { ...state, value: value.slice(cursor), cursor: 0 };

    case "deleteLine":
      return {
        ...state,
        value: "",
        cursor: 0,
        yank: action.saveYank ? value : yank,
      };

    case "moveLeft":
      return { ...state, cursor: clamp(cursor - (action.n ?? 1), 0, len) };

    case "moveRight":
      return { ...state, cursor: clamp(cursor + (action.n ?? 1), 0, len) };

    case "moveToStart":
      return { ...state, cursor: 0 };

    case "moveToEnd":
      return { ...state, cursor: len };

    case "moveWordBackward":
      return { ...state, cursor: wordBackward(value, cursor) };

    case "moveWordForward":
      return { ...state, cursor: wordForward(value, cursor) };

    case "moveWordEnd":
      return { ...state, cursor: wordEnd(value, cursor) };

    case "yankLine":
      return { ...state, yank: value };

    case "pasteAfter": {
      if (!yank) return state;
      const pos = Math.min(cursor + 1, len);
      return {
        ...state,
        value: value.slice(0, pos) + yank + value.slice(pos),
        cursor: pos + yank.length - 1,
      };
    }

    case "pasteBefore":
      if (!yank) return state;
      return {
        ...state,
        value: value.slice(0, cursor) + yank + value.slice(cursor),
        cursor: cursor + yank.length,
      };

    case "set":
      return {
        ...state,
        value: action.value,
        cursor: action.cursor ?? action.value.length,
      };

    case "clear":
      return { ...state, value: "", cursor: 0 };

    default:
      return state;
  }
}

export function useInputBuffer(initial = "") {
  const [state, dispatch] = useReducer(reducer, {
    value: initial,
    cursor: initial.length,
    yank: "",
  });
  return { ...state, dispatch };
}
