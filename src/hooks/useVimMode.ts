import { useState } from "react";

export type VimMode = "insert" | "normal";

// Tracks vim modal state + pending operator (for dd, dw, cc, etc.)
export function useVimMode() {
  const [mode, setMode] = useState<VimMode>("insert");
  const [pendingOp, setPendingOp] = useState<string | null>(null);

  return {
    mode,
    isInsert: mode === "insert",
    isNormal: mode === "normal",
    pendingOp,

    toInsert() {
      setMode("insert");
      setPendingOp(null);
    },

    toNormal() {
      setMode("normal");
      setPendingOp(null);
    },

    setPendingOp,
  };
}
