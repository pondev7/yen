// ─────────────────────────────────────────────────────────────
// TOPIC: fetch, HTTP requests, JSON APIs
// RUN:   bun run sandbox/bun/03-fetch-http.ts
// SEE:   Milestone 2 — calling the Anthropic API
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: fetch — making HTTP requests ───────────────────
// Bun has fetch() built in — same API as browsers.
// It returns a Promise<Response>. You then call .json() or .text()
// on the response to get the body.

// ── CONCEPT 2: GET request ────────────────────────────────────

// Public API — no auth needed
const response = await fetch("https://httpbin.org/get?param=hello");

if (!response.ok) {
  console.error("Request failed:", response.status, response.statusText);
  process.exit(1);
}

const data = await response.json() as Record<string, unknown>;
console.log("Status:", response.status);
console.log("URL called:", (data.url as string));
console.log("Query params:", JSON.stringify(data.args));

// ── CONCEPT 3: POST request with JSON body ────────────────────
// Most APIs (including Anthropic) use POST with JSON.
// You need Content-Type: application/json header.

const postResponse = await fetch("https://httpbin.org/post", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  body: JSON.stringify({
    message: "hello from yen",
    timestamp: new Date().toISOString(),
  }),
});

const postData = await postResponse.json() as Record<string, unknown>;
const sentJson = postData.json as Record<string, unknown>;
console.log("Sent and received back:", sentJson.message);

// ── CONCEPT 4: Response headers and status ────────────────────

console.log("\nResponse headers:");
console.log("Content-Type:", response.headers.get("content-type"));
console.log("Server:", response.headers.get("server"));

// Status codes:
// 200 OK
// 201 Created
// 400 Bad Request
// 401 Unauthorized
// 403 Forbidden
// 404 Not Found
// 429 Too Many Requests (rate limit)
// 500 Internal Server Error

// ── CONCEPT 5: Error handling ─────────────────────────────────
// fetch() only rejects on NETWORK errors (no connection, DNS fail).
// HTTP error codes (4xx, 5xx) still RESOLVE — you must check .ok

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      console.error(`HTTP error ${res.status}: ${res.statusText}`);
      return null;
    }

    return await res.json() as T;
  } catch (error) {
    // Network error, timeout, etc.
    console.error("Network error:", error instanceof Error ? error.message : String(error));
    return null;
  }
}

const result = await safeFetch<Record<string, unknown>>("https://httpbin.org/status/404");
console.log("404 result:", result);  // null

// ── CONCEPT 6: What the Anthropic API call looks like ─────────
// This is what Milestone 2 will do (simplified):
//
// const response = await fetch("https://api.anthropic.com/v1/messages", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "x-api-key": process.env.ANTHROPIC_API_KEY,
//     "anthropic-version": "2023-06-01",
//   },
//   body: JSON.stringify({
//     model: "claude-sonnet-4-6",
//     max_tokens: 1024,
//     messages: [{ role: "user", content: "Hello" }],
//   }),
// });
//
// const data = await response.json();
// console.log(data.content[0].text);

// ── CONCEPT 7: Using the Anthropic SDK (the better way) ───────
// The SDK wraps fetch with type safety and streaming support.
//
// import Anthropic from "@anthropic-ai/sdk";
// const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
//
// const message = await client.messages.create({
//   model: "claude-sonnet-4-6",
//   max_tokens: 1024,
//   messages: [{ role: "user", content: "Hello" }],
// });
//
// We'll use the SDK in Milestone 2 — it handles auth, retries, types.

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Fetch the GitHub API for a user's repos:
//   GET https://api.github.com/users/{username}/repos
// Print the names of the first 5 public repos.
// (Use any public GitHub username)
// YOUR CODE:


// EXERCISE 2:
// Write a `retry<T>(fn: () => Promise<T>, maxAttempts: number): Promise<T>`
// function that retries a failing async operation up to N times.
// Add a delay between retries (use delay() from 05-async-await patterns).
// Test it by simulating a function that fails the first 2 times.
// YOUR CODE:


// EXERCISE 3:
// Write a `fetchWithTimeout<T>(url: string, timeoutMs: number): Promise<T | null>`
// function that cancels the request if it takes longer than timeoutMs.
// Use AbortController and AbortSignal:
//   const controller = new AbortController();
//   setTimeout(() => controller.abort(), timeoutMs);
//   fetch(url, { signal: controller.signal })
// Test it with a short timeout (100ms) on a slow endpoint.
// YOUR CODE:
