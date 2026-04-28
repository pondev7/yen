// ─────────────────────────────────────────────────────────────
// TOPIC: TypeScript for Python programmers — the mental shift
// RUN:   bun run sandbox/typescript/00-from-python.ts
// READ THIS FIRST before any other sandbox file.
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: What is TypeScript? ───────────────────────────
// Python:     you write .py files → Python interpreter runs them
// TypeScript: you write .ts files → TypeScript compiles to JavaScript → runs
//
// TypeScript = JavaScript + a type system.
// The types are erased at runtime — only JavaScript runs in the end.
// Bun handles this for us: `bun run file.ts` just works.
//
// JavaScript was originally a browser language.
// Today it runs everywhere: servers (Node/Bun), CLIs, apps.
// TypeScript is how serious projects use JavaScript.

// ── CONCEPT 2: Variables ──────────────────────────────────────
// Python:        x = 5       (just assign — no keyword)
// TypeScript:    const x = 5 (use const or let — always pick one)

// const = cannot be reassigned (like Python's UPPERCASE convention, but enforced)
const greeting = "hello";
// greeting = "world";  // ← error: cannot assign to const

// let = can be reassigned (like a normal Python variable)
let score = 0;
score = 10;  // ✅

// Python has no `const` — TypeScript enforces immutability by default.
// Rule: always use `const` unless you need to reassign → then use `let`.

console.log(greeting, score);  // console.log = Python's print()

// ── CONCEPT 3: Print ─────────────────────────────────────────
// Python:        print("hello", name)
// TypeScript:    console.log("hello", name)   ← same idea

const name = "Alice";
const age = 25;
console.log("Name:", name, "Age:", age);  // Name: Alice Age: 25

// ── CONCEPT 4: Strings ───────────────────────────────────────
// Python:        f"Hello {name}, you are {age}"
// TypeScript:    `Hello ${name}, you are ${age}`   ← backtick + ${}

const msg = `Hello ${name}, you are ${age} years old`;
console.log(msg);  // Hello Alice, you are 25 years old

// Both single and double quotes work the same in TypeScript:
const a = 'hello';
const b = "hello";  // identical — pick one and stay consistent

// ── CONCEPT 5: Booleans ──────────────────────────────────────
// Python:  True / False
// TypeScript: true / false   ← lowercase!

const isActive = true;
const isDone = false;

// Boolean operators:
// Python:  and / or / not
// TypeScript:  && / || / !

console.log(isActive && !isDone);  // true (active AND NOT done)
console.log(isActive || isDone);   // true

// ── CONCEPT 6: None → null and undefined ─────────────────────
// Python has one "nothing" value: None
// TypeScript has TWO: null and undefined
//
// null:       you explicitly set something to "empty"
// undefined:  a variable was declared but never assigned a value
//             OR a key doesn't exist in an object

let city: string | null = null;    // explicitly empty — you chose null
let result: string | undefined;    // declared, but no value yet → undefined

city = "Tokyo";
result = "done";

// null check:
if (city !== null) {
  console.log(city.toUpperCase());  // TOKYO
}

// Optional chaining — safely access values that might be null/undefined:
// Python: city.upper() if city else None   (long way)
// TypeScript: city?.toUpperCase()           (short way — returns undefined if null)

const upper = city?.toUpperCase();
console.log(upper);  // TOKYO

// Nullish coalescing — fallback if null or undefined:
// Python: city or "Unknown"
// TypeScript: city ?? "Unknown"   ← note: ?? is stricter than || (only null/undefined)

const display = city ?? "Unknown";
console.log(display);  // Tokyo

// ── CONCEPT 7: Equality ───────────────────────────────────────
// Python:     ==  checks value equality (always)
// TypeScript: ==  LOOSE equality (avoid! does type coercion)
//             === STRICT equality (always use this)

console.log(1 === 1);    // true
console.log(1 === "1");  // false  (different types)
// Python: 1 == 1  → True,   1 == "1" → False  (Python == is like TS ===)

// Rule: ALWAYS use === in TypeScript, never ==.

// ── CONCEPT 8: Objects = Python dicts ────────────────────────
// A JavaScript/TypeScript object IS like a Python dict, but:
//   - Keys don't need quotes if they're valid identifiers
//   - Access with dot notation (obj.key) instead of only brackets
//   - Used everywhere to represent structured data

// Python:      {"name": "Alice", "age": 25}
// TypeScript:  { name: "Alice", age: 25 }

const user = {
  name: "Alice",
  age: 25,
  active: true,
};

// Access:
console.log(user.name);     // Alice  — dot notation (most common)
console.log(user["age"]);   // 25     — bracket notation (also works)

// Python:  user["name"] or user.name (with dataclass/namedtuple)
// TypeScript: both work, dot notation preferred

// Key doesn't exist → undefined (not KeyError like Python!)
const obj = { x: 1 } as Record<string, number | undefined>;
console.log(obj["z"]);  // undefined  (Python would throw KeyError)

// ── CONCEPT 9: Arrays = Python lists ────────────────────────
// TypeScript arrays work just like Python lists:

const fruits = ["apple", "banana", "cherry"];

console.log(fruits[0]);        // apple
console.log(fruits.length);    // 3  (Python: len(fruits))
fruits.push("date");           // Python: fruits.append("date")
console.log(fruits);

// Slicing:
// Python:  fruits[1:3]
// TypeScript: fruits.slice(1, 3)

console.log(fruits.slice(1, 3));  // ["banana", "cherry"]

// ── CONCEPT 10: if / else if / else ──────────────────────────
// Python:         elif
// TypeScript:  else if

const temp = 22;

if (temp > 30) {
  console.log("hot");
} else if (temp > 20) {
  console.log("warm");   // ← this runs
} else {
  console.log("cool");
}

// ── CONCEPT 11: for loops ─────────────────────────────────────
// Python:         for item in my_list:
// TypeScript:  for (const item of myList)   ← note parentheses and const

const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log(color);
}

// Python:         for i in range(3):
// TypeScript:  for (let i = 0; i < 3; i++)

for (let i = 0; i < 3; i++) {
  console.log(i);  // 0, 1, 2
}

// Iterating object keys and values:
// Python:  for key, value in obj.items():
// TypeScript:  for (const [key, value] of Object.entries(obj))

for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

// ── CONCEPT 12: Functions ─────────────────────────────────────
// Python:  def add(a, b):  return a + b
// TypeScript: function add(a: number, b: number): number { return a + b; }

function add(a: number, b: number): number {
  return a + b;
}
console.log(add(3, 4));  // 7

// Arrow functions — a shorter syntax (very common in TypeScript):
// Python lambda:  lambda a, b: a + b   (limited to one expression)
// TypeScript:     (a, b) => a + b       (can be multi-line too)

const multiply = (a: number, b: number): number => a * b;
console.log(multiply(3, 4));  // 12

// Arrow functions are used everywhere — as callbacks, in arrays, etc.
// See 01b-functions.ts for a full tutorial.

// ── CONCEPT 13: Import / Export ──────────────────────────────
// Python:   from module import function
// TypeScript: import { function } from "./module"

// Named export:
// export function greet(name: string) { ... }

// Named import:
// import { greet } from "./greet"

// Default export:
// export default function App() { ... }

// Default import (no braces):
// import App from "./App"

// We'll see imports everywhere. The { } in imports means "named export".
// Without { } means "default export". They're different things.

// ── CONCEPT 14: The semicolon question ────────────────────────
// Python: no semicolons
// TypeScript: semicolons are OPTIONAL — Bun/TypeScript adds them automatically
// This project uses no semicolons (Biome formats them away).
// You'll see both styles in other codebases — both are valid.

// ── CONCEPT 15: Braces instead of indentation ────────────────
// Python uses indentation to define blocks.
// TypeScript uses braces { } — indentation is just style, not syntax.
// Always indent anyway — unindented code is unreadable.

// Python:
// if x > 0:
//     print("positive")

// TypeScript:
// if (x > 0) {
//   console.log("positive")
// }

// ── SUMMARY: Quick reference ─────────────────────────────────
// Python           → TypeScript
// ─────────────────────────────
// x = 5            → const x = 5
// x = 5 (mutable)  → let x = 5
// print(x)         → console.log(x)
// f"{x}"           → `${x}`
// True / False     → true / false
// None             → null / undefined
// and / or / not   → && / || / !
// ==               → ===
// dict {}          → object {}
// list []          → array []
// elif             → else if
// for x in lst     → for (const x of lst)
// def fn(x):       → function fn(x: T): R { }
// lambda x: x+1   → (x) => x + 1
// from m import f  → import { f } from "./m"

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Translate this Python to TypeScript:
//   name = "Claude"
//   version = 4
//   print(f"Model: {name} {version}")
//   is_streaming = True
//   if is_streaming:
//       print("streaming...")
//   else:
//       print("ready")
// YOUR CODE:


// EXERCISE 2:
// Create an object (like a Python dict) with keys:
//   model (string), maxTokens (number), streaming (boolean)
// Loop over its entries and print each key: value pair.
// YOUR CODE:


// EXERCISE 3:
// Create an array of 5 numbers.
// Loop over them and print only the ones greater than 3.
// Then use .slice() to get the last 2 elements and print them.
// YOUR CODE:
