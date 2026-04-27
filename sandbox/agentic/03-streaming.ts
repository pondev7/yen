// ─────────────────────────────────────────────────────────────
// TOPIC: Streaming responses from the Anthropic API
// RUN:   bun run sandbox/agentic/03-streaming.ts
// NOTE:  Requires ANTHROPIC_API_KEY in environment
//        Set it: export ANTHROPIC_API_KEY=sk-ant-...
// SEE:   Milestone 2 — streaming in the real app
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: Why streaming? ─────────────────────────────────
// Without streaming: you wait 5–30 seconds for the full response,
// then get it all at once. The UI feels frozen.
//
// With streaming: you get the first token in < 1 second,
// and the UI updates as each token arrives. Much better UX.
//
// This is exactly how Claude Code shows responses as they generate.

// ── CONCEPT 2: Streaming event types ─────────────────────────
// The Anthropic streaming API sends Server-Sent Events (SSE).
// Each event has a type. The important ones:
//
//   message_start      — new message begun
//   content_block_start — new text or tool_use block starting
//   content_block_delta — a chunk of text arrived
//     delta.type: "text_delta"    → delta.text (the token)
//     delta.type: "input_json_delta" → delta.partial_json (tool input)
//   content_block_stop  — block finished
//   message_delta      — stop_reason arrived
//   message_stop       — message complete

// ── CONCEPT 3: Simulated streaming (no API key needed) ────────
// We'll simulate the exact same event stream locally.

interface TextDelta {
  type: "text_delta";
  text: string;
}

interface StreamEvent {
  type: string;
  index?: number;
  delta?: TextDelta;
  stop_reason?: string;
}

async function* simulateStream(text: string): AsyncGenerator<StreamEvent> {
  yield { type: "message_start" };
  yield { type: "content_block_start", index: 0 };

  const words = text.split(" ");
  for (const word of words) {
    await new Promise(r => setTimeout(r, 60));  // simulate network latency
    yield {
      type: "content_block_delta",
      index: 0,
      delta: { type: "text_delta", text: word + " " },
    };
  }

  yield { type: "content_block_stop", index: 0 };
  yield { type: "message_delta", stop_reason: "end_turn" };
  yield { type: "message_stop" };
}

// ── CONCEPT 4: Processing the stream ─────────────────────────

async function processStream(stream: AsyncGenerator<StreamEvent>): Promise<string> {
  let fullText = "";

  process.stdout.write("Claude: ");

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta?.type === "text_delta"
    ) {
      const token = event.delta.text;
      fullText += token;
      process.stdout.write(token);  // print immediately as it arrives
    }

    if (event.type === "message_stop") {
      process.stdout.write("\n");
    }
  }

  return fullText;
}

// Run the simulation:
console.log("Simulating streaming response:\n");
const simText = await processStream(
  simulateStream("Hello! I'm Claude, your coding assistant. I can help you write, debug, and understand code.")
);
console.log("\nFull text length:", simText.length, "chars");

// ── CONCEPT 5: Using the real SDK for streaming ───────────────
// The Anthropic SDK makes streaming easy.
// Replace the simulation above with this when you have an API key:

async function streamWithSdk(userMessage: string) {
  // Lazily check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("\n(Skipping real API call — ANTHROPIC_API_KEY not set)");
    console.log("To try the real thing:");
    console.log("  export ANTHROPIC_API_KEY=sk-ant-...");
    console.log("  bun run sandbox/agentic/03-streaming.ts");
    return;
  }

  // Dynamic import so file still runs without the SDK installed
  let Anthropic: typeof import("@anthropic-ai/sdk").default;
  try {
    const mod = await import("@anthropic-ai/sdk");
    Anthropic = mod.default;
  } catch {
    console.log("\n(SDK not installed yet — run: bun add @anthropic-ai/sdk)");
    return;
  }

  const client = new Anthropic({ apiKey });

  console.log("\nReal API streaming:\n");
  process.stdout.write("Claude: ");

  // stream() returns an async iterable of events
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    messages: [{ role: "user", content: userMessage }],
  });

  // Process each streaming event:
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      process.stdout.write(event.delta.text);
    }
  }

  process.stdout.write("\n");

  // Or use the convenience method that handles iteration for you:
  // const finalMessage = await stream.finalMessage();
}

await streamWithSdk("In one sentence, what is TypeScript?");

// ── CONCEPT 6: Streaming + React (Ink) ───────────────────────
// In the real app, we don't process.stdout.write().
// Instead, we accumulate tokens into state and React re-renders:
//
// for await (const event of stream) {
//   if (event.type === "content_block_delta" && ...) {
//     setCurrentResponse(prev => prev + event.delta.text);
//     //                  ^^^^                  ^^^^^^^^^^
//     //                  React state updater   one token
//   }
// }
//
// React sees state changed → re-renders MessageList → user sees tokens.
// This is exactly what Milestone 2 will implement.

// ── CONCEPT 7: Streaming tool use ────────────────────────────
// Tool inputs also stream. You'll get:
//   content_block_start with type: "tool_use"
//   content_block_delta with type: "input_json_delta", partial_json: '{"pa'
//   content_block_delta with type: "input_json_delta", partial_json: 'th":'
//   content_block_delta with type: "input_json_delta", partial_json: '"src"}'
//
// You accumulate partial_json strings and parse the full JSON when the block stops.
// Milestone 3 will handle this.

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Modify processStream() to also track:
//   - Time to first token (ms from start to first text_delta)
//   - Total tokens received
//   - Total time (ms)
// Print a summary after streaming completes.
// YOUR CODE:


// EXERCISE 2:
// Build a `StreamBuffer` class that:
//   - Accepts tokens via add(token: string)
//   - Has a getLines(): string[] method that splits accumulated text into lines
//   - Has a clear(): void method
//   - Has a length: number getter
// Use it to buffer the streamed response and print it line by line.
// YOUR CODE:


// EXERCISE 3:
// Simulate a streaming tool use response:
//   1. The stream yields text: "I'll read the file first."
//   2. Then yields content_block_start with type: "tool_use", name: "read_file"
//   3. Then yields input_json_delta chunks: '{"pa', 'th":', '"src/app.tsx"}'
//   4. Then content_block_stop
// Write code that assembles the tool call from the stream chunks
// and prints: "Tool call: read_file({ path: 'src/app.tsx' })"
// YOUR CODE:
