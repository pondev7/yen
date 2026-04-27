// ─────────────────────────────────────────────────────────────
// TOPIC: The agentic loop — how LLM agents work
// RUN:   bun run sandbox/agentic/02-agentic-loop.ts
// NOTE:  Requires ANTHROPIC_API_KEY in environment
//        Set it: export ANTHROPIC_API_KEY=sk-ant-...
// SEE:   Milestone 2/3 — the real agent loop
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: What is an agentic loop? ──────────────────────
// A simple LLM call is:   prompt → response → done.
// An agentic loop is:
//
//   messages = [user_prompt]
//   while true:
//     response = call_llm(messages)
//     if response.stop_reason == "end_turn":  break
//     if response.stop_reason == "tool_use":
//       results = execute_all_tools(response.tool_calls)
//       messages.append(response)
//       messages.append(tool_results)
//       continue   ← loop back, let model see results
//
// The model keeps calling tools until it has enough information
// to give a final answer. That's what makes it an "agent".

// ── CONCEPT 2: Types we'll need ───────────────────────────────

type MessageRole = "user" | "assistant";

interface TextBlock {
  type: "text";
  text: string;
}

interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

interface ToolResultBlock {
  type: "tool_result";
  tool_use_id: string;
  content: string;
}

type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

interface Message {
  role: MessageRole;
  content: string | ContentBlock[];
}

// ── CONCEPT 3: Simulating the agentic loop (without API) ──────
// We'll simulate what the API would return to understand the flow.

interface SimulatedResponse {
  stop_reason: "end_turn" | "tool_use";
  content: ContentBlock[];
}

// Simulated model that "decides" to call tools:
function simulateModel(messages: Message[]): SimulatedResponse {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) return { stop_reason: "end_turn", content: [] };

  const lastContent = typeof lastMessage.content === "string"
    ? lastMessage.content
    : lastMessage.content.map(b => b.type === "text" ? b.text : "").join("");

  // If this is the first user message, "decide" to read a file
  if (lastMessage.role === "user" && messages.length === 1) {
    return {
      stop_reason: "tool_use",
      content: [
        { type: "text", text: "I'll check the package.json to see the project setup." },
        { type: "tool_use", id: "call_001", name: "read_file", input: { path: "package.json" } },
      ],
    };
  }

  // After getting tool results, give a final answer
  const toolResults = messages.filter(m =>
    Array.isArray(m.content) && m.content.some(b => b.type === "tool_result")
  );

  if (toolResults.length > 0) {
    const pkgContent = (
      (toolResults[0]?.content as ContentBlock[])?.find(b => b.type === "tool_result") as ToolResultBlock
    )?.content ?? "";

    let name = "unknown";
    try { name = (JSON.parse(pkgContent) as { name: string }).name; } catch { /* ignore */ }

    return {
      stop_reason: "end_turn",
      content: [
        {
          type: "text",
          text: `The project is called "${name}". It uses Bun as the runtime and Ink for the terminal UI.`,
        },
      ],
    };
  }

  return {
    stop_reason: "end_turn",
    content: [{ type: "text", text: "I don't have enough context to answer that." }],
  };
}

// ── CONCEPT 4: The tool executor ─────────────────────────────

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
      const proc = Bun.spawn(command.split(" "), { stdout: "pipe", stderr: "pipe" });
      const output = await new Response(proc.stdout).text();
      return output.trim();
    }

    default:
      return `Unknown tool: ${call.name}`;
  }
}

// ── CONCEPT 5: The agentic loop itself ───────────────────────

async function agentLoop(userMessage: string): Promise<string> {
  const messages: Message[] = [
    { role: "user", content: userMessage },
  ];

  let iteration = 0;
  const MAX_ITERATIONS = 10;  // prevent infinite loops

  while (iteration < MAX_ITERATIONS) {
    iteration++;
    console.log(`\n── Iteration ${iteration} ──`);

    const response = simulateModel(messages);

    // Show what the model "said":
    for (const block of response.content) {
      if (block.type === "text") {
        console.log("Model:", block.text);
      } else if (block.type === "tool_use") {
        console.log(`Tool call: ${block.name}(${JSON.stringify(block.input)})`);
      }
    }

    // If the model is done, extract and return the final text:
    if (response.stop_reason === "end_turn") {
      const finalText = response.content
        .filter((b): b is TextBlock => b.type === "text")
        .map(b => b.text)
        .join("\n");
      return finalText;
    }

    // Model wants to use tools — execute them all:
    const toolCalls = response.content.filter((b): b is ToolUseBlock => b.type === "tool_use");
    const toolResults: ToolResultBlock[] = [];

    for (const call of toolCalls) {
      const result = await executeTool(call);
      console.log(`Tool result: ${result.slice(0, 100)}...`);
      toolResults.push({
        type: "tool_result",
        tool_use_id: call.id,
        content: result,
      });
    }

    // Add assistant response and tool results to message history:
    messages.push({ role: "assistant", content: response.content });
    messages.push({ role: "user", content: toolResults });
  }

  return "Max iterations reached — agent did not complete.";
}

// ── CONCEPT 6: Run the loop ───────────────────────────────────

const answer = await agentLoop("What project is this and what does it use?");
console.log("\n═══ Final Answer ═══");
console.log(answer);

// ── CONCEPT 7: The real API version ──────────────────────────
// When using the real Anthropic SDK, the loop looks identical.
// The only difference is `simulateModel()` is replaced by:
//
//   const response = await client.messages.create({
//     model: "claude-sonnet-4-6",
//     max_tokens: 4096,
//     tools: ALL_TOOLS,
//     messages: messages,
//   });
//
// And `response.stop_reason` / `response.content` work the same.
// We implement this in 03-streaming.ts and Milestone 2.

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Add a "run_command" step to the simulated agent:
//   After reading package.json, it should also run "git log --oneline -3"
//   Then incorporate both results into the final answer.
// Modify simulateModel() to add this second tool call.
// YOUR CODE:


// EXERCISE 2:
// Add iteration tracking and a log to the agentLoop:
//   - Print "Starting agent..." at the beginning
//   - Print "Agent completed in N iterations" at the end
//   - Return an object: { answer: string, iterations: number, toolsUsed: string[] }
// YOUR CODE:


// EXERCISE 3:
// Implement a "planning" agent:
//   1. User asks: "How many TypeScript files are in the sandbox?"
//   2. Agent uses run_command with "find sandbox -name '*.ts' | wc -l"
//   3. Agent returns the count in a friendly message
// Simulate this full conversation (no real API needed).
// YOUR CODE:
