// ─────────────────────────────────────────────────────────────
// TOPIC: TypeScript basics — types, inference, const/let
// RUN:   bun run sandbox/typescript/01-basics.ts
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: Explicit type annotations ─────────────────────
// You write a colon after the variable name, then the type.

const name: string = "Alice";
const age: number = 25;
const isActive: boolean = true;

console.log(name, age, isActive);
// Expected: Alice 25 true

// ── CONCEPT 2: Type inference ─────────────────────────────────
// TypeScript is smart — it figures out the type from the value.
// You don't need to write the type if it's obvious.

const city = "Tokyo";       // TypeScript infers: string
const population = 14000000; // TypeScript infers: number
const isCapital = true;      // TypeScript infers: boolean

console.log(city, population, isCapital);
// Expected: Tokyo 14000000 true

// ── CONCEPT 3: const vs let ───────────────────────────────────
// const = cannot be reassigned (use this by default)
// let   = can be reassigned (use only when you need to change it)

const PI = 3.14;
// PI = 3;  // ← uncomment this to see: "Cannot assign to 'PI'"

let score = 0;
score = 10;   // ✅ fine — let allows reassignment
score = 20;
console.log("Score:", score);
// Expected: Score: 20

// ── CONCEPT 4: Template literals ─────────────────────────────
// Use backticks and ${} to embed variables in strings.
// Always prefer this over string concatenation (+).

const firstName = "Bob";
const lastName = "Smith";

const oldWay = "Hello " + firstName + " " + lastName;    // ❌ avoid
const newWay = `Hello ${firstName} ${lastName}`;          // ✅ use this
const withExpression = `2 + 2 = ${2 + 2}`;               // can embed any expression

console.log(newWay);
// Expected: Hello Bob Smith
console.log(withExpression);
// Expected: 2 + 2 = 4

// ── CONCEPT 5: Type errors ────────────────────────────────────
// TypeScript catches mistakes before you run the code.

const message: string = "hello";
// message = 42;  // ← uncomment: Type 'number' is not assignable to type 'string'

// ── CONCEPT 6: Arrays ─────────────────────────────────────────
const scores: number[] = [10, 20, 30];
const names: string[] = ["Alice", "Bob", "Charlie"];

console.log(scores[0]);   // 10
console.log(names.length); // 3

// ── CONCEPT 7: null and undefined ─────────────────────────────
// null = explicitly empty   undefined = not yet assigned

let username: string | null = null;    // can be a string OR null
username = "alice123";                  // now it has a value

let result: string | undefined;        // declared but not yet assigned
result = "done";

// Optional chaining — safely access a value that might be null/undefined
const upper = username?.toUpperCase(); // returns undefined if username is null
console.log(upper);
// Expected: ALICE123

// Nullish coalescing — fallback value if null or undefined
const display = username ?? "Anonymous";
console.log(display);
// Expected: alice123

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Declare a variable `model` with the value "claude-sonnet-4-6"
// Let TypeScript infer its type (don't write `: string`)
// Then print it
// YOUR CODE:


// EXERCISE 2:
// Declare a `let` variable called `tokenCount` starting at 0
// Add 100 to it, then add 250 to it
// Print the final value (should be 350)
// YOUR CODE:


// EXERCISE 3:
// Create a template literal that prints: "Model: claude-sonnet-4-6, Tokens: 350"
// Using the variables you created above
// YOUR CODE:


// EXERCISE 4:
// Declare a variable `apiKey` of type `string | null` set to null
// Use nullish coalescing to print either the key or "no key set"
// YOUR CODE:
