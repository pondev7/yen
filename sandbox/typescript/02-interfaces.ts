// ─────────────────────────────────────────────────────────────
// TOPIC: Interfaces and types — describing object shapes
// RUN:   bun run sandbox/typescript/02-interfaces.ts
// SEE:   src/types.ts — every interface used in the real app
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: interface — describing an object ───────────────
// An interface defines the SHAPE of an object.
// It says: "any object of this type must have these fields."

interface User {
  id: string;
  name: string;
  age: number;
}

const alice: User = {
  id: "1",
  name: "Alice",
  age: 25,
};

console.log(alice.name); // Alice

// TypeScript protects you from mistakes:
// alice.score = 100;     // ← uncomment: Property 'score' does not exist
// const bob: User = { id: "2", name: "Bob" }; // ← missing 'age', TypeScript errors

// ── CONCEPT 2: Optional properties with ? ─────────────────────
// Add ? after a property name to make it optional.

interface Message {
  id: string;
  content: string;
  author?: string;   // optional — may or may not be present
}

const msg1: Message = { id: "1", content: "Hello" };              // ✅ no author
const msg2: Message = { id: "2", content: "Hi", author: "Bob" };  // ✅ with author

// Accessing optional properties safely:
console.log(msg1.author?.toUpperCase()); // undefined (no crash)
console.log(msg2.author?.toUpperCase()); // BOB

// ── CONCEPT 3: readonly — prevent mutation ────────────────────
// readonly means the property can be set once but never changed.

interface Config {
  readonly apiKey: string;
  model: string;
}

const config: Config = { apiKey: "sk-123", model: "claude-sonnet-4-6" };
config.model = "claude-opus-4-7";   // ✅ fine — model is not readonly
// config.apiKey = "sk-456";         // ← uncomment: Cannot assign to 'apiKey'

// ── CONCEPT 4: type — for unions and aliases ──────────────────
// Use `type` when you want to describe a union (OR) or give a type a name.

type Role = "user" | "assistant" | "system";    // only these 3 strings are valid
type Status = "pending" | "streaming" | "done" | "error";

const role: Role = "user";
// const bad: Role = "admin";  // ← uncomment: not assignable to type 'Role'

// type can also alias primitive types
type MessageId = string;
type TokenCount = number;

const id: MessageId = "abc-123";
const tokens: TokenCount = 1500;
console.log(id, tokens);

// ── CONCEPT 5: interface vs type — practical difference ───────

// interface: best for objects, can be extended
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}
const rex: Dog = { name: "Rex", breed: "Labrador" };
console.log(rex.name, rex.breed);

// type: best for unions, primitives, and combinations
type StringOrNumber = string | number;
type Callback = () => void;
type Pair = [string, number];   // tuple type

const pair: Pair = ["hello", 42];
console.log(pair[0], pair[1]);

// ── CONCEPT 6: Combining interfaces ───────────────────────────
// Real app pattern: a ChatMessage is used throughout src/types.ts

interface BaseMessage {
  id: string;
  timestamp: Date;
}

interface ChatMessage extends BaseMessage {
  role: Role;      // reusing our Role type from above
  content: string;
  status: Status;  // reusing our Status type
}

const chatMsg: ChatMessage = {
  id: crypto.randomUUID(),
  timestamp: new Date(),
  role: "user",
  content: "Hello Claude",
  status: "done",
};

console.log(`[${chatMsg.role}] ${chatMsg.content}`);
// Expected: [user] Hello Claude

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Define an interface `Model` with:
//   - name: string (required)
//   - contextWindow: number (required)
//   - supportsVision: boolean (optional)
// Create two Model objects: one with vision, one without
// YOUR CODE:


// EXERCISE 2:
// Define a type `PermissionMode` that can only be one of:
//   "ask" | "auto" | "acceptEdits" | "bypassAll"
// Declare a variable of that type and assign it a value
// Try assigning an invalid value and see the error
// YOUR CODE:


// EXERCISE 3:
// Define an interface `ToolCall` with:
//   - id: string (readonly — can't change after creation)
//   - name: string
//   - input: string
//   - result?: string (optional — might not have a result yet)
// Create one ToolCall without a result, then add the result
// YOUR CODE:
