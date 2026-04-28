// ─────────────────────────────────────────────────────────────
// TOPIC: Functions — the full picture
// RUN:   bun run sandbox/typescript/01b-functions.ts
// PREREQUISITE: 00-from-python.ts
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: Two ways to write functions ────────────────────
// TypeScript has two syntaxes for functions. Both are used everywhere.

// Style 1: function declaration (like Python's def)
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Style 2: arrow function (assigned to a variable)
const greetArrow = (name: string): string => {
  return `Hello, ${name}!`;
};

// If the body is a single expression, you can drop the braces and return:
const greetShort = (name: string): string => `Hello, ${name}!`;

console.log(greet("Alice"));       // Hello, Alice!
console.log(greetArrow("Bob"));    // Hello, Bob!
console.log(greetShort("Carol"));  // Hello, Carol!

// When to use which:
// - function declarations: top-level named functions (like Python def)
// - arrow functions: callbacks, short helpers, when passed as arguments

// ── CONCEPT 2: Arrow functions as callbacks ───────────────────
// Arrow functions are most useful when passed INTO another function.
// This is very common in TypeScript — far more than in Python.

const numbers = [1, 2, 3, 4, 5];

// setTimeout calls a function after a delay:
// setTimeout(() => console.log("fired!"), 100);

// Array methods take a function as argument:
numbers.forEach((n) => {
  console.log(n);  // prints each number
});

// ── CONCEPT 3: Array methods — your Python toolkit, TS style ──
// If you know Python's map/filter/reduce, these are the same ideas.

// .map() — transform each element (Python: list comprehension / map())
// Python:  [x * 2 for x in numbers]
// TypeScript: numbers.map(x => x * 2)

const doubled = numbers.map((n) => n * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

// .filter() — keep elements that match a condition
// Python:  [x for x in numbers if x > 2]
// TypeScript: numbers.filter(x => x > 2)

const big = numbers.filter((n) => n > 2);
console.log(big);  // [3, 4, 5]

// .find() — first element that matches (Python: next(x for x in ... if ..., None))
const firstBig = numbers.find((n) => n > 3);
console.log(firstBig);  // 4

// .some() — does any element match? (Python: any(...))
const hasEven = numbers.some((n) => n % 2 === 0);
console.log(hasEven);  // true

// .every() — do all elements match? (Python: all(...))
const allPositive = numbers.every((n) => n > 0);
console.log(allPositive);  // true

// .reduce() — fold array into a single value (Python: functools.reduce)
// Python:  functools.reduce(lambda acc, x: acc + x, numbers, 0)
// TypeScript: numbers.reduce((acc, x) => acc + x, 0)

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum);  // 15

// Chaining — combine methods:
// Python: sum(x * 2 for x in numbers if x > 2)
const result = numbers
  .filter((n) => n > 2)    // [3, 4, 5]
  .map((n) => n * 2)        // [6, 8, 10]
  .reduce((acc, n) => acc + n, 0);  // 24
console.log(result);  // 24

// ── CONCEPT 4: Destructuring ──────────────────────────────────
// Destructuring "unpacks" objects and arrays into variables.
// Python has tuple unpacking: a, b = (1, 2)
// TypeScript extends this to objects too.

// Object destructuring:
const person = { name: "Alice", age: 25, role: "admin" };

// Without destructuring (verbose):
const n1 = person.name;
const a1 = person.age;

// With destructuring:
const { name: personName, age } = person;
//      ^^^^^^^^^^^^^^^^   ^^^
//      rename to avoid    extract as-is
//      conflict with 'name' above
console.log(personName, age);  // Alice 25

// With a default value if the key is missing:
const { role = "user" } = person;
console.log(role);  // admin (exists, so no default used)

// Array destructuring (like Python tuple unpacking):
// Python:  first, second, *rest = my_list
// TypeScript: const [first, second, ...rest] = myList

const [first, second, ...rest2] = [10, 20, 30, 40, 50];
console.log(first);   // 10
console.log(second);  // 20
console.log(rest2);    // [30, 40, 50]

// Skip elements with commas:
const [, , third] = [10, 20, 30, 40];
console.log(third);  // 30

// ── CONCEPT 5: Destructuring in function parameters ───────────
// Instead of receiving an object and accessing its fields,
// destructure directly in the parameter list.

// Without destructuring:
function displayUser1(user: { name: string; age: number }) {
  console.log(`${user.name} is ${user.age}`);
}

// With destructuring (cleaner):
function displayUser2({ name: displayName, age }: { name: string; age: number }) {
  console.log(`${displayName} is ${age}`);
}

displayUser2({ name: "Bob", age: 30 });  // Bob is 30

// You'll see this ALL THE TIME in React components:
// function Button({ label, onClick }: ButtonProps) { ... }
//                  ^^^^^^^^^^^^^^
//                  props object is destructured directly

// ── CONCEPT 6: The spread operator ... ───────────────────────
// The ... (spread) operator "spreads" an array or object out.
// Python has *list and **dict — TypeScript uses ... for both.

// Spread in arrays (like Python's *):
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined);  // [1, 2, 3, 4, 5, 6]

// Copy an array:
const copy = [...arr1];  // Python: arr1.copy() or arr1[:]

// Add items:
const withExtra = [...arr1, 99];  // [1, 2, 3, 99]

// Spread in objects (like Python's **):
const base = { x: 1, y: 2 };
const extended = { ...base, z: 3 };
console.log(extended);  // { x: 1, y: 2, z: 3 }

// Override a field while keeping the rest:
const updated = { ...base, y: 99 };
console.log(updated);  // { x: 1, y: 99 }
//                              ^^ overrides the spread value

// This is CRITICAL for reducers — updating state without mutating:
// return { ...state, loading: true };   ← keep all fields, change one

// ── CONCEPT 7: Rest parameters ────────────────────────────────
// Rest collects "the remaining" into an array.
// Python: def fn(*args):

function sum2(...nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

console.log(sum2(1, 2, 3));      // 6
console.log(sum2(1, 2, 3, 4, 5)); // 15

// ── CONCEPT 8: Default parameters ────────────────────────────
// Python: def greet(name="World"):
// TypeScript: function greet(name = "World"):

function greetDefault(name = "World"): string {
  return `Hello, ${name}!`;
}

console.log(greetDefault());         // Hello, World!
console.log(greetDefault("Alice"));  // Hello, Alice!

// ── CONCEPT 9: Higher-order functions ────────────────────────
// A function that takes or returns another function.
// Python has this too — decorators are a form of it.

// Takes a function as argument:
function applyTwice(fn: (x: number) => number, value: number): number {
  return fn(fn(value));
}

console.log(applyTwice((x) => x * 2, 3));  // 12  (3*2=6, 6*2=12)

// Returns a function:
function makeMultiplier(factor: number): (x: number) => number {
  return (x) => x * factor;  // "closes over" factor
}

const triple = makeMultiplier(3);
console.log(triple(5));  // 15
console.log(triple(10)); // 30

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Write an arrow function `capitalize` that takes a string
// and returns it with the first letter uppercased.
// Then use .map() to capitalize all strings in an array.
// YOUR CODE:


// EXERCISE 2:
// Given this array of objects:
//   const people = [
//     { name: "Alice", score: 85 },
//     { name: "Bob", score: 42 },
//     { name: "Carol", score: 91 },
//     { name: "Dave", score: 67 },
//   ]
// Using destructuring + array methods (no for loops):
//   1. Filter to keep only scores >= 70
//   2. Extract just the names (map)
//   3. Print the passing names
// YOUR CODE:


// EXERCISE 3:
// Using the spread operator:
//   1. Create a base config object: { model: "sonnet", maxTokens: 1024 }
//   2. Create a "streaming config" that extends it with streaming: true
//   3. Create a "fast config" that extends it with maxTokens: 256
//   4. None of the originals should be mutated
// Print all three and verify.
// YOUR CODE:
