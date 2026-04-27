// ─────────────────────────────────────────────────────────────
// TOPIC: Union types and type narrowing
// RUN:   bun run sandbox/typescript/03-unions-narrowing.ts
// SEE:   src/hooks/useInputBuffer.ts — BufferAction discriminated union
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: Union types ────────────────────────────────────
// A union type means "this can be ONE of these types"
// Use the | (pipe) character to combine them

type StringOrNumber = string | number;

function printId(id: StringOrNumber) {
  console.log("ID:", id);
}

printId("abc-123");  // string ✅
printId(42);         // number ✅
// printId(true);    // ← uncomment: boolean is not in the union

// ── CONCEPT 2: Narrowing — figuring out which type it is ──────
// When you have a union type, TypeScript doesn't know WHICH type
// you have until you check. "Narrowing" is how you check.

function processId(id: StringOrNumber) {
  if (typeof id === "string") {
    // inside here, TypeScript KNOWS id is a string
    console.log(id.toUpperCase());   // ✅ string methods available
  } else {
    // inside here, TypeScript KNOWS id is a number
    console.log(id.toFixed(2));      // ✅ number methods available
  }
}

processId("hello");  // HELLO
processId(3.14159);  // 3.14

// ── CONCEPT 3: Literal types ──────────────────────────────────
// A union of string literals — only those exact values are valid.
// This is extremely common in this project.

type Direction = "north" | "south" | "east" | "west";

function move(dir: Direction) {
  console.log(`Moving ${dir}`);
}

move("north");   // ✅
// move("up");   // ← uncomment: "up" is not assignable to type 'Direction'

// ── CONCEPT 4: Discriminated unions ───────────────────────────
// This is the most important pattern in this entire project.
// Each variant has a "type" field that acts as a unique tag.
// TypeScript uses that tag to know which variant you have.

// Each action has a unique "type" tag:
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set"; value: number }    // this one has an extra `value` field
  | { type: "reset" };

function handleAction(state: number, action: Action): number {
  switch (action.type) {
    case "increment":
      return state + 1;       // TypeScript knows: no extra fields

    case "decrement":
      return state - 1;       // TypeScript knows: no extra fields

    case "set":
      return action.value;    // TypeScript knows: action.value exists here!
      //            ^^^^^ only available in the "set" case

    case "reset":
      return 0;
  }
}

let count = 0;
count = handleAction(count, { type: "increment" });
count = handleAction(count, { type: "increment" });
count = handleAction(count, { type: "set", value: 100 });
count = handleAction(count, { type: "decrement" });
console.log(count); // Expected: 99

// ── CONCEPT 5: The real BufferAction from the app ─────────────
// This is exactly the pattern used in src/hooks/useInputBuffer.ts
// Each operation on the text input is a discriminated union action.

type BufferAction =
  | { type: "insert"; text: string }   // insert needs the text to insert
  | { type: "deleteBackward" }          // no extra data needed
  | { type: "moveLeft"; n?: number }    // optional count
  | { type: "set"; value: string; cursor?: number }; // replace whole buffer

interface BufferState {
  value: string;
  cursor: number;
}

function bufferReducer(state: BufferState, action: BufferAction): BufferState {
  switch (action.type) {
    case "insert":
      // TypeScript knows action.text is available
      return {
        value: state.value.slice(0, state.cursor) + action.text + state.value.slice(state.cursor),
        cursor: state.cursor + action.text.length,
      };

    case "deleteBackward":
      if (state.cursor === 0) return state;
      return {
        value: state.value.slice(0, state.cursor - 1) + state.value.slice(state.cursor),
        cursor: state.cursor - 1,
      };

    case "moveLeft":
      // TypeScript knows action.n is `number | undefined`
      return { ...state, cursor: Math.max(0, state.cursor - (action.n ?? 1)) };

    case "set":
      return {
        value: action.value,
        cursor: action.cursor ?? action.value.length,
      };
  }
}

let buf = { value: "", cursor: 0 };
buf = bufferReducer(buf, { type: "insert", text: "hello" });
buf = bufferReducer(buf, { type: "insert", text: " world" });
console.log(buf.value);   // Expected: hello world
buf = bufferReducer(buf, { type: "moveLeft", n: 5 });
buf = bufferReducer(buf, { type: "insert", text: "beautiful " });
console.log(buf.value);   // Expected: hello beautiful world

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Create a union type `Theme` that is either "dark" or "light"
// Write a function `getBackground(theme: Theme): string`
// that returns "#000000" for dark and "#ffffff" for light
// YOUR CODE:


// EXERCISE 2:
// Create a discriminated union `AgentEvent` with 3 variants:
//   - { type: "thinking" }
//   - { type: "tool_call"; toolName: string; input: string }
//   - { type: "response"; content: string }
// Write a function that logs a different message for each variant
// YOUR CODE:


// EXERCISE 3:
// Using your AgentEvent type, create an array of events:
//   1. thinking
//   2. tool_call for "read_file" with input "src/app.tsx"
//   3. response with content "The file has 150 lines"
// Loop over them and call your function from exercise 2
// YOUR CODE:
