// ─────────────────────────────────────────────────────────────
// TOPIC: Tool use — giving an LLM tools to call
// RUN:   bun run sandbox/agentic/01-tool-schemas.ts
// SEE:   Milestone 3 — tool definitions in the real agent
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: What is tool use? ─────────────────────────────
// An LLM can only generate text. But we need it to take actions:
// read files, run commands, search the web, write code.
//
// Tool use lets us give the model a "menu" of actions it can request.
// The model says "I want to call read_file with path=src/app.tsx".
// Our code executes that, and sends the result back to the model.
// The model then continues its response with the real file contents.
//
// This is the core of what makes Claude Code work.

// ── CONCEPT 2: Defining a tool schema ────────────────────────
// The Anthropic API uses JSON Schema to describe each tool.
// The model reads the name, description, and input_schema
// to understand when and how to call the tool.

interface ToolInputProperty {
  type: string;
  description: string;
  enum?: string[];
}

interface ToolSchema {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, ToolInputProperty>;
    required: string[];
  };
}

// ── CONCEPT 3: Real tool definitions ─────────────────────────
// These are similar to the tools we'll add in Milestone 3.

const READ_FILE: ToolSchema = {
  name: "read_file",
  description: "Read the contents of a file at the given path. Use this to examine source code, configuration files, or any text file.",
  input_schema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The file path to read, relative to the project root",
      },
    },
    required: ["path"],
  },
};

const WRITE_FILE: ToolSchema = {
  name: "write_file",
  description: "Write content to a file, creating it if it doesn't exist or overwriting if it does.",
  input_schema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The file path to write to",
      },
      content: {
        type: "string",
        description: "The content to write to the file",
      },
    },
    required: ["path", "content"],
  },
};

const RUN_COMMAND: ToolSchema = {
  name: "run_command",
  description: "Execute a shell command and return its output. Use for git operations, running tests, listing directories.",
  input_schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The shell command to execute",
      },
      cwd: {
        type: "string",
        description: "Working directory for the command (optional, defaults to project root)",
      },
    },
    required: ["command"],
  },
};

const SEARCH_FILES: ToolSchema = {
  name: "search_files",
  description: "Search for text in files using a pattern. Returns matching lines with file paths and line numbers.",
  input_schema: {
    type: "object",
    properties: {
      pattern: {
        type: "string",
        description: "The text or regex pattern to search for",
      },
      path: {
        type: "string",
        description: "Directory or file to search in (optional, defaults to current directory)",
      },
      filePattern: {
        type: "string",
        description: "Glob pattern for files to search (e.g. '*.ts', '**/*.tsx')",
      },
    },
    required: ["pattern"],
  },
};

// ── CONCEPT 4: How the model uses tools ──────────────────────
// In an API response, the model's stop_reason will be "tool_use"
// and the content will contain ToolUseBlock(s):

interface ToolUseBlock {
  type: "tool_use";
  id: string;          // unique ID for this call
  name: string;        // which tool
  input: Record<string, unknown>;  // the arguments
}

// Example — what the model might respond with:
const exampleToolUse: ToolUseBlock = {
  type: "tool_use",
  id: "toolu_01XYZ",
  name: "read_file",
  input: { path: "src/app.tsx" },
};

console.log("Example tool call:");
console.log(JSON.stringify(exampleToolUse, null, 2));

// ── CONCEPT 5: Executing the tool ────────────────────────────
// After the model requests a tool, our code runs it:

async function executeTool(call: ToolUseBlock): Promise<string> {
  switch (call.name) {
    case "read_file": {
      const { path } = call.input as { path: string };
      try {
        return await Bun.file(path).text();
      } catch {
        return `Error: file not found: ${path}`;
      }
    }

    case "run_command": {
      const { command } = call.input as { command: string };
      const args = command.split(" ");
      const proc = Bun.spawn(args, { stdout: "pipe", stderr: "pipe" });
      const [stdout, exitCode] = await Promise.all([
        new Response(proc.stdout).text(),
        proc.exited,
      ]);
      return exitCode === 0 ? stdout.trim() : `Exit ${exitCode}: ${stdout.trim()}`;
    }

    default:
      return `Unknown tool: ${call.name}`;
  }
}

// Test our executor:
const readResult = await executeTool({
  type: "tool_use",
  id: "test_1",
  name: "read_file",
  input: { path: "package.json" },
});
const parsedPkg = JSON.parse(readResult) as { name: string };
console.log("\nRead package.json via tool:", parsedPkg.name);

const cmdResult = await executeTool({
  type: "tool_use",
  id: "test_2",
  name: "run_command",
  input: { command: "git log --oneline -3" },
});
console.log("\nGit log via tool:\n" + cmdResult);

// ── CONCEPT 6: Sending tool results back ─────────────────────
// After executing, we send the result back to the API as a
// "tool_result" message. The model then continues.
//
// The conversation flow:
//   1. We send: [{ role: "user", content: "Fix the bug in app.tsx" }]
//   2. Model responds: [ToolUseBlock(read_file, "src/app.tsx")]
//   3. We execute: read "src/app.tsx" → get file contents
//   4. We send back:
//      [
//        { role: "assistant", content: [ToolUseBlock] },
//        { role: "user", content: [{ type: "tool_result", tool_use_id: id, content: fileContents }] }
//      ]
//   5. Model sees the file, generates the fix.

// We'll implement this loop fully in 02-agentic-loop.ts

// All our tools:
const ALL_TOOLS = [READ_FILE, WRITE_FILE, RUN_COMMAND, SEARCH_FILES];
console.log("\nAvailable tools:", ALL_TOOLS.map(t => t.name));

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Define a tool schema for `list_directory`:
//   - Input: path (string, optional — defaults to ".")
//   - Returns a list of files and directories
// Then implement it using Bun.
// YOUR CODE:


// EXERCISE 2:
// Define a tool schema for `replace_in_file`:
//   - Inputs: path, oldText, newText
//   - Reads the file, replaces first occurrence of oldText with newText, writes it back
//   - Returns: "replaced" or "not found" or an error message
// Implement and test it on a temp file.
// YOUR CODE:


// EXERCISE 3:
// Create a `ToolRegistry` class that:
//   - Holds a map of tool name → (schema, executor function)
//   - Has register(schema, fn) and execute(name, input) methods
//   - Returns the schemas array for the Anthropic API
// Register read_file and run_command, then execute both.
// YOUR CODE:
