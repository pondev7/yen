// ─────────────────────────────────────────────────────────────
// TOPIC: Bun.spawn — running shell commands from TypeScript
// RUN:   bun run sandbox/bun/02-spawn-processes.ts
// SEE:   src/components/StatusBar.tsx — getGitBranch() using Bun.spawn
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: Why spawn? ─────────────────────────────────────
// A coding agent needs to run shell commands — git, ls, grep, etc.
// Bun.spawn() runs any command as a child process.
// You get back stdout/stderr as streams you can read.

// ── CONCEPT 2: Basic spawn — run a command, get output ───────

async function run(cmd: string[]): Promise<string> {
  const proc = Bun.spawn(cmd, {
    stdout: "pipe",   // capture stdout
    stderr: "pipe",   // capture stderr
  });

  const stdout = await new Response(proc.stdout).text();
  await proc.exited;  // wait for the process to finish
  return stdout.trim();
}

// Run git commands:
const branch = await run(["git", "branch", "--show-current"]);
console.log("Current branch:", branch);

const status = await run(["git", "status", "--short"]);
console.log("Git status:", status || "(clean)");

const lastCommit = await run(["git", "log", "-1", "--oneline"]);
console.log("Last commit:", lastCommit);

// ── CONCEPT 3: Checking exit code ────────────────────────────

async function runWithStatus(cmd: string[]): Promise<{ output: string; ok: boolean }> {
  const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" });
  const output = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;
  return { output: output.trim(), ok: exitCode === 0 };
}

const result = await runWithStatus(["git", "rev-parse", "--is-inside-work-tree"]);
console.log("Is git repo:", result.ok);

// ── CONCEPT 4: Capturing stderr too ──────────────────────────

async function runFull(cmd: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode };
}

// Try a command that fails:
const fail = await runFull(["git", "log", "--oneline", "nonexistent-branch"]);
if (fail.exitCode !== 0) {
  console.log("Command failed:", fail.stderr.split("\n")[0]);
}

// ── CONCEPT 5: Environment variables ─────────────────────────

const envProc = Bun.spawn(["env"], {
  stdout: "pipe",
  env: {
    ...process.env,                      // inherit current env
    MY_CUSTOM_VAR: "hello from bun",     // add/override vars
  },
});
const envOutput = await new Response(envProc.stdout).text();
const customLine = envOutput.split("\n").find(l => l.startsWith("MY_CUSTOM_VAR"));
console.log("Custom env:", customLine);

// ── CONCEPT 6: Streaming output (for long-running commands) ──
// For commands that produce output over time, read the stream
// chunk by chunk instead of waiting for the whole output.

async function streamingRun(cmd: string[]) {
  const proc = Bun.spawn(cmd, { stdout: "pipe" });

  const reader = proc.stdout.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Process complete lines as they arrive:
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";  // last incomplete line stays in buffer
    for (const line of lines) {
      if (line) process.stdout.write(`[chunk] ${line}\n`);
    }
  }
}

// Show git log line by line as they stream:
console.log("\nStreaming git log:");
await streamingRun(["git", "log", "--oneline", "-5"]);

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Write a function `gitLog(n: number): Promise<string[]>`
// that returns the last n commit messages as an array of strings.
// Use Bun.spawn with git log.
// Test it with n=5.
// YOUR CODE:


// EXERCISE 2:
// Write a function `fileExists(path: string): Promise<boolean>`
// that uses `ls` (or `test -f`) via Bun.spawn to check if a file exists.
// (Yes, Bun.file().exists() is better — this is for practicing spawn)
// YOUR CODE:


// EXERCISE 3:
// Build a `runCommand(cmd: string): Promise<{ ok: boolean; output: string; error: string }>`
// that takes a full shell command string (like "git status --short"),
// splits it into an array, runs it, and returns structured output.
// Handle edge cases: empty command, command not found.
// Test it with 3 different commands.
// YOUR CODE:
