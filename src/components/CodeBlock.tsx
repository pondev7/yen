import { Box, Text } from "ink";

// Basic keyword sets per language for simple terminal highlighting
const KEYWORDS: Record<string, string[]> = {
  ts: [
    "const",
    "let",
    "var",
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "class",
    "interface",
    "type",
    "import",
    "export",
    "from",
    "async",
    "await",
    "new",
    "this",
    "extends",
    "implements",
    "void",
    "null",
    "undefined",
    "true",
    "false",
    "typeof",
    "instanceof",
    "default",
    "switch",
    "case",
    "break",
    "throw",
    "try",
    "catch",
  ],
  js: [],
  tsx: [],
  jsx: [],
  py: [
    "def",
    "class",
    "return",
    "if",
    "elif",
    "else",
    "for",
    "while",
    "import",
    "from",
    "as",
    "in",
    "not",
    "and",
    "or",
    "True",
    "False",
    "None",
    "lambda",
    "with",
    "pass",
    "raise",
    "try",
    "except",
    "finally",
    "async",
    "await",
    "yield",
  ],
  bash: ["if", "then", "else", "fi", "for", "do", "done", "while", "echo", "export", "local"],
};
// JS/TSX/JSX share TS keywords
const JS_KEYWORDS = KEYWORDS.ts ?? [];
KEYWORDS.js = JS_KEYWORDS;
KEYWORDS.tsx = JS_KEYWORDS;
KEYWORDS.jsx = JS_KEYWORDS;

// Tokenise one line into alternating plain/keyword/string/comment spans
type Span = { text: string; kind: "plain" | "keyword" | "string" | "comment" | "number" };

function tokenise(line: string, lang: string): Span[] {
  const keywords = new Set(KEYWORDS[lang] ?? []);
  const spans: Span[] = [];

  const isSlashLang = ["ts", "js", "tsx", "jsx"].includes(lang);
  const commentStart = isSlashLang ? "//" : lang === "py" || lang === "bash" ? "#" : null;

  if (commentStart && line.trimStart().startsWith(commentStart)) {
    return [{ text: line, kind: "comment" }];
  }

  // Simple word-by-word scan
  const wordRe =
    /(\b[a-zA-Z_]\w*\b|\d+(?:\.\d+)?|"[^"]*"|'[^']*'|`[^`]*`|\/\/.*$|#.*$|[^\w\d"'`]+)/g;

  for (const match of line.matchAll(wordRe)) {
    const token = match[0];
    if (keywords.has(token)) {
      spans.push({ text: token, kind: "keyword" });
    } else if (/^\d/.test(token)) {
      spans.push({ text: token, kind: "number" });
    } else if (/^["'`]/.test(token)) {
      spans.push({ text: token, kind: "string" });
    } else if (token.startsWith("//") || token.startsWith("#")) {
      spans.push({ text: token, kind: "comment" });
    } else {
      spans.push({ text: token, kind: "plain" });
    }
  }

  return spans.length > 0 ? spans : [{ text: line, kind: "plain" as const }];
}

function SpanText({ span }: { span: Span }) {
  switch (span.kind) {
    case "keyword":
      return (
        <Text color="blue" bold>
          {span.text}
        </Text>
      );
    case "string":
      return <Text color="green">{span.text}</Text>;
    case "comment":
      return (
        <Text color="gray" dimColor>
          {span.text}
        </Text>
      );
    case "number":
      return <Text color="yellow">{span.text}</Text>;
    default:
      return <Text>{span.text}</Text>;
  }
}

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export function CodeBlock({ code, lang = "" }: CodeBlockProps) {
  const normalised = lang.toLowerCase();
  const lines = code.split("\n");

  return (
    <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1} marginY={0}>
      {lang && (
        <Text dimColor color="cyan">
          {lang}
        </Text>
      )}
      {lines.map((line, i) => (
        <Box key={i}>
          <Text dimColor>{String(i + 1).padStart(3, " ")} </Text>
          {tokenise(line, normalised).map((span, j) => (
            <SpanText key={j} span={span} />
          ))}
        </Box>
      ))}
    </Box>
  );
}
