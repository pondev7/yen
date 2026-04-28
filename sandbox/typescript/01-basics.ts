// ─────────────────────────────────────────────────────────────
// TOPIC: TypeScript basics — types, inference, const/let
// RUN:   bun run sandbox/typescript/01-basics.ts
// PREREQUISITE: 00-from-python.ts
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 0: TypeScript's type system vs Python's ───────────
// Python has type hints (since 3.5) but they are NOT enforced at runtime:
//   def greet(name: str) -> str:  ← Python just ignores this at runtime
//
// TypeScript types ARE enforced at compile time:
//   function greet(name: string): string  ← error if you pass a number
//
// The difference: Python hints are documentation. TS types are rules.
// This is why TypeScript catches bugs before you even run the code.

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

// ── CONCEPT 6b: Strict equality ===  ─────────────────────────
// Python's == always compares VALUES — it's safe and predictable.
// JavaScript has TWO equality operators:
//   ==   "loose" equality — does type coercion before comparing (AVOID)
//   ===  "strict" equality — same value AND same type (ALWAYS use this)
//
// Examples where == gives surprising results (why we avoid it):
//   0 == false  → true   (!!!)
//   "" == false → true   (!!!)
//   null == undefined → true  (!!!)
//
// With ===, these are all false. Use === everywhere.
// TypeScript + Biome will warn you if you accidentally use ==.

console.log(1 === 1);    // true
console.log(1 === "1");  // false — different types
console.log(0 === false); // false — number vs boolean

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

const model = "claude-sonnet-4-6"
console.log(`The modelis ${model}`)


// EXERCISE 2:
// Declare a `let` variable called `tokenCount` starting at 0
// Add 100 to it, then add 250 to it
// Print the final value (should be 350)
// YOUR CODE:

let tokenCount = 0
tokenCount = tokenCount + 100
tokenCount = tokenCount + 250
console.log(`The token count is ${tokenCount}`)


// EXERCISE 3:
// Create a template literal that prints: "Model: claude-sonnet-4-6, Tokens: 350"
// Using the variables you created above
// YOUR CODE:
console.log(`Model: ${model}, Tokens: ${tokenCount}`)


// EXERCISE 4:
// Declare a variable `apiKey` of type `string | null` set to null
// Use nullish coalescing to print either the key or "no key set"
// YOUR CODE:

const apiKey: string | null = null
console.log(apiKey ?? "no key set")
