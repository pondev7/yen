import { useRef } from "react";

// Command history — stored in a ref so it doesn't trigger re-renders
export function useHistory() {
  const entries = useRef<string[]>([]);
  const index = useRef(-1); // -1 = not currently navigating
  const saved = useRef(""); // saves the draft before navigating

  return {
    // Call after submitting — adds entry and resets navigation
    add(entry: string) {
      const trimmed = entry.trim();
      if (trimmed && trimmed !== entries.current[0]) {
        entries.current.unshift(trimmed);
      }
      index.current = -1;
    },

    // Move backward in history (Up arrow). Returns the entry or undefined.
    prev(current: string): string | undefined {
      if (index.current === -1) saved.current = current;
      const next = index.current + 1;
      if (next < entries.current.length) {
        index.current = next;
        return entries.current[next];
      }
      return undefined;
    },

    // Move forward in history (Down arrow). Returns the entry or the saved draft.
    next(): string | undefined {
      if (index.current === -1) return undefined;
      const prev = index.current - 1;
      if (prev < 0) {
        index.current = -1;
        return saved.current;
      }
      index.current = prev;
      return entries.current[prev];
    },
  };
}
