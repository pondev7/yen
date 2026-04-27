// ─────────────────────────────────────────────────────────────
// TOPIC: Generics — reusable code that works with any type
// RUN:   bun run sandbox/typescript/04-generics.ts
// SEE:   src/hooks/useInputBuffer.ts — useReducer<State, Action>
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: The problem generics solve ─────────────────────
// Without generics, you'd need separate functions for each type:

function firstString(arr: string[]): string {
  return arr[0] ?? "";
}
function firstNumber(arr: number[]): number {
  return arr[0] ?? 0;
}

// That's repetitive. Generics let you write it once:

// ── CONCEPT 2: Generic functions ──────────────────────────────
// The <T> is a type parameter — a placeholder for "whatever type you pass in"

function first<T>(arr: T[]): T | undefined {
  //          ^            ^
  //          │            └── return type is the same T
  //          └── "T" is a placeholder name (convention: single capital letter)
  return arr[0];
}

// TypeScript infers T from the argument:
const str = first(["a", "b", "c"]);  // T = string, returns string | undefined
const num = first([1, 2, 3]);        // T = number, returns number | undefined
const bool = first([true, false]);   // T = boolean

console.log(str);  // a
console.log(num);  // 1

// You can also specify T explicitly:
const explicit = first<string>(["x", "y"]);

// ── CONCEPT 3: Generic with multiple type parameters ──────────

function pair<K, V>(key: K, value: V): { key: K; value: V } {
  return { key, value };
}

const p1 = pair("name", "Alice");     // K=string, V=string
const p2 = pair("age", 25);           // K=string, V=number
const p3 = pair(1, true);             // K=number, V=boolean

console.log(p1, p2, p3);

// ── CONCEPT 4: Generic interfaces ─────────────────────────────

// A generic interface — works for any value type
interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

// Now use it with specific types:
interface User { name: string; age: number }
interface Message { content: string; role: string }

const userResponse: ApiResponse<User> = {
  data: { name: "Alice", age: 25 },
  error: null,
  loading: false,
};

const messageResponse: ApiResponse<Message> = {
  data: { content: "hello", role: "user" },
  error: null,
  loading: false,
};

console.log(userResponse.data.name);      // Alice
console.log(messageResponse.data.content); // hello

// ── CONCEPT 5: Constraints — T must have certain properties ───

// Without constraint: T could be anything, can't access .length
function logLength<T extends { length: number }>(item: T): void {
  //                  ^^^^^^^^^^^^^^^^^^^^^^
  //                  T must have a .length property
  console.log(`Length: ${item.length}`);
}

logLength("hello");        // Length: 5  (strings have .length)
logLength([1, 2, 3]);      // Length: 3  (arrays have .length)
// logLength(42);           // ← uncomment: number doesn't have .length

// ── CONCEPT 6: Where you see generics in this project ─────────

// React's useState<T>:
// const [messages, setMessages] = useState<ChatMessage[]>([])
//                                          ^^^^^^^^^^^^^
//                                          T = ChatMessage[]

// React's useReducer<State, Action>:
// const [state, dispatch] = useReducer<State, Action>(reducer, initialState)

// Anthropic SDK types:
// const messages: MessageParam[] = []   (MessageParam is a generic SDK type)

// Simple generic utility used in the real app:
function clamp<T extends number>(value: T, min: T, max: T): T {
  return Math.max(min, Math.min(max, value)) as T;
}

console.log(clamp(150, 0, 100));  // 100
console.log(clamp(-5, 0, 100));   // 0
console.log(clamp(50, 0, 100));   // 50

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Write a generic function `last<T>` that returns the last item
// in an array, or undefined if the array is empty
// Test it with a string array and a number array
// YOUR CODE:


// EXERCISE 2:
// Write a generic function `wrap<T>` that takes a value and
// returns it wrapped in an object: { value: T, wrappedAt: Date }
// Test it with a string and a number
// YOUR CODE:


// EXERCISE 3:
// Write a generic interface `Stack<T>` with:
//   - items: T[]
//   - push(item: T): void
//   - pop(): T | undefined
//   - peek(): T | undefined
//   - size: number
// Then implement it as a class or object for numbers
// YOUR CODE:
