// ─────────────────────────────────────────────────────────────
// TOPIC: Async/await, Promises, for await...of (streaming)
// RUN:   bun run sandbox/typescript/05-async-await.ts
// PREREQUISITE: 00-from-python.ts, 01b-functions.ts
// SEE:   src/components/StatusBar.tsx — getGitBranch()
//        Milestone 2 — streaming Claude responses
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 0: JavaScript's concurrency model ─────────────────
// Python has two concurrency models:
//   - threading: true parallel threads (OS-level)
//   - asyncio:   single-threaded, cooperative multitasking (event loop)
//
// JavaScript/TypeScript ONLY has the event loop — no real threads.
// This means:
//   - One thing runs at a time
//   - But while WAITING for I/O (file, network), other code can run
//   - You never deal with race conditions on shared memory
//
// Python asyncio and JavaScript async/await are the same CONCEPT,
// but different syntax. If you know asyncio, this will feel familiar.
//
// Key difference: in Python you must explicitly run the event loop.
//   asyncio.run(main())
// In JavaScript/Bun, the event loop runs automatically.
// Any `await` at top level just works.

// ── CONCEPT 0b: setTimeout — the JS equivalent of time.sleep ──
// Python: time.sleep(0.1)   — blocks for 0.1 seconds
// JavaScript: setTimeout(callback, ms)   — calls callback after ms milliseconds
//
// setTimeout does NOT block — it schedules a callback for later.
// This is why we wrap it in a Promise (see Concept 2 below).
//
// Example: setTimeout(() => console.log("later!"), 100)
//          → prints "later!" after 100ms
//          → does NOT pause the current code

// ── CONCEPT 1: Why async exists ───────────────────────────────
// Some operations take time: reading a file, calling an API, running a command.
// JavaScript is single-threaded — if you wait for them synchronously,
// the whole program freezes. Async lets you "wait without blocking".

// ── CONCEPT 2: Promises ───────────────────────────────────────
// A Promise is a value that will be available "eventually".
// It's either: pending → fulfilled (success) or rejected (error)

function delay(ms: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Done after ${ms}ms`), ms);
  });
}

// Using .then() — old style (avoid)
delay(100).then((result) => console.log(result));

// ── CONCEPT 3: async/await — clean syntax for Promises ────────
// async makes a function return a Promise.
// await pauses execution until the Promise resolves.

async function runDelay() {
  const result = await delay(100);   // wait here until delay resolves
  console.log(result);               // then continue
}

await runDelay();
// Expected: Done after 100ms

// ── CONCEPT 4: async functions always return a Promise ────────

async function getName(): Promise<string> {
  return "Alice";   // automatically wrapped in Promise.resolve("Alice")
}

const name = await getName();  // unwraps the Promise
console.log(name);             // Alice

// ── CONCEPT 5: Error handling with try/catch ──────────────────

async function riskyOperation(): Promise<number> {
  throw new Error("Something went wrong");
}

try {
  const value = await riskyOperation();
  console.log(value);
} catch (error) {
  if (error instanceof Error) {
    console.log("Caught:", error.message);
  }
}
// Expected: Caught: Something went wrong

// ── CONCEPT 6: Running async tasks in parallel ────────────────
// await one-at-a-time = slow (sequential)
// Promise.all = run all at once, wait for all to finish

async function fetchA() { await delay(100); return "A"; }
async function fetchB() { await delay(100); return "B"; }
async function fetchC() { await delay(100); return "C"; }

// Sequential — takes ~300ms total:
const start1 = Date.now();
const a = await fetchA();
const b = await fetchB();
const c = await fetchC();
console.log(`Sequential: ${a}${b}${c} in ${Date.now() - start1}ms`);

// Parallel — takes ~100ms total:
const start2 = Date.now();
const [d, e, f] = await Promise.all([fetchA(), fetchB(), fetchC()]);
console.log(`Parallel: ${d}${e}${f} in ${Date.now() - start2}ms`);

// ── CONCEPT 7: for await...of — async iteration ───────────────
// This is how we'll read streaming responses from Claude.
// Instead of getting the whole response at once, you get it chunk by chunk.

// A simple async generator — yields values over time
async function* countdown(from: number): AsyncGenerator<number> {
  //           ^  "generator" function — yields multiple values over time
  for (let i = from; i >= 0; i--) {
    await delay(50);    // simulate delay between chunks
    yield i;            // "yield" sends the next value to the caller
  }
}

// for await...of processes each yielded value as it arrives
process.stdout.write("Countdown: ");
for await (const num of countdown(5)) {
  process.stdout.write(`${num} `);
}
console.log("🚀");
// Expected: Countdown: 5 4 3 2 1 0 🚀

// ── CONCEPT 8: Simulated streaming (like Claude API) ──────────
// This is exactly how Milestone 2 will work.
// Claude sends tokens one at a time — you display each as it arrives.

async function* simulateClaudeStream(text: string): AsyncGenerator<string> {
  const tokens = text.split(" ");
  for (const token of tokens) {
    await delay(80);
    yield token + " ";
  }
}

process.stdout.write("Claude: ");
for await (const token of simulateClaudeStream("Hello I am your coding agent")) {
  process.stdout.write(token);  // print each token immediately
}
console.log("\n");
// Expected: Claude: Hello I am your coding agent

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Write an async function `wait(ms: number): Promise<void>`
// that resolves after `ms` milliseconds
// Then write another async function that:
//   1. Logs "starting..."
//   2. Waits 200ms
//   3. Logs "done!"
// YOUR CODE:


// EXERCISE 2:
// Write an async function `readJsonFile(path: string)` that:
//   - Uses Bun.file(path).text() to read a file
//   - Parses it as JSON with JSON.parse()
//   - Returns the parsed object
//   - Handles errors with try/catch (log the error, return null)
// Test it by reading package.json and printing the "name" field
// YOUR CODE:


// EXERCISE 3:
// Write an async generator `tokenize(sentence: string)`
// that yields one word at a time with a 50ms delay between words
// Use it with for await...of to print each word on the same line
// YOUR CODE:
