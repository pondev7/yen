import { Box, Text, useInput } from "ink";
import { useState } from "react";

interface InputBoxProps {
  onSubmit: (value: string) => void;
  isDisabled?: boolean;
}

export function InputBox({ onSubmit, isDisabled = false }: InputBoxProps) {
  const [value, setValue] = useState("");

  useInput(
    (input, key) => {
      if (key.return) {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
          onSubmit(trimmed);
          setValue("");
        }
        return;
      }

      if (key.backspace || key.delete) {
        setValue((prev) => prev.slice(0, -1));
        return;
      }

      // ignore non-printable control sequences
      if (!key.ctrl && !key.meta && input) {
        setValue((prev) => prev + input);
      }
    },
    { isActive: !isDisabled },
  );

  const displayValue = isDisabled ? "" : value;
  const cursor = isDisabled ? "" : "█";

  return (
    <Box borderStyle="single" borderColor={isDisabled ? "gray" : "cyan"} paddingX={1}>
      <Text color="cyan" bold>
        {"› "}
      </Text>
      <Text>
        {displayValue}
        <Text color="cyan">{cursor}</Text>
      </Text>
    </Box>
  );
}
