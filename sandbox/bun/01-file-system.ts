// ─────────────────────────────────────────────────────────────
// TOPIC: Bun file system APIs — reading, writing, watching files
// RUN:   bun run sandbox/bun/01-file-system.ts
// SEE:   src/hooks/useHistory.ts — Bun.file() for persistence (future)
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: Why Bun has its own file APIs ──────────────────
// Node.js has `fs` module — verbose, callback-based (old style).
// Bun provides cleaner, Promise-based APIs built into the runtime.
// No imports needed for the basics — just use Bun.file(), Bun.write().

// ── CONCEPT 2: Reading files ─────────────────────────────────

// Read as text:
const pkgText = await Bun.file("package.json").text();
const pkg = JSON.parse(pkgText);
console.log("Package name:", pkg.name);
console.log("Package version:", pkg.version);

// Read as JSON directly:
const pkgJson = await Bun.file("package.json").json();
console.log("Dependencies:", Object.keys(pkgJson.dependencies ?? {}));

// Read as bytes (for binary files):
// const bytes = await Bun.file("image.png").bytes();

// Check if file exists:
const exists = await Bun.file("package.json").exists();
const missing = await Bun.file("does-not-exist.txt").exists();
console.log("package.json exists:", exists);   // true
console.log("missing.txt exists:", missing);    // false

// ── CONCEPT 3: Writing files ──────────────────────────────────

// Write a string:
await Bun.write("/tmp/yen-sandbox-test.txt", "Hello from Bun!\n");
console.log("Wrote text file");

// Write JSON:
const data = { timestamp: new Date().toISOString(), items: [1, 2, 3] };
await Bun.write("/tmp/yen-sandbox-data.json", JSON.stringify(data, null, 2));
console.log("Wrote JSON file");

// Read it back:
const readBack = await Bun.file("/tmp/yen-sandbox-data.json").json();
console.log("Read back:", readBack.timestamp);

// Write multiple things at once (appending chunks):
const file = Bun.file("/tmp/yen-sandbox-log.txt");
await Bun.write(file, "Line 1\nLine 2\nLine 3\n");

// ── CONCEPT 4: File metadata ──────────────────────────────────

const f = Bun.file("package.json");
console.log("Size:", f.size, "bytes");
console.log("MIME:", f.type);
console.log("Last modified:", new Date(f.lastModified).toLocaleString());

// ── CONCEPT 5: import.meta — the current file ────────────────
// Bun gives you metadata about the running file via import.meta

console.log("Current file:", import.meta.path);
console.log("Current dir:", import.meta.dir);
console.log("Filename:", import.meta.file);

// Useful for building paths relative to the current file:
const configPath = `${import.meta.dir}/../../package.json`;
const configExists = await Bun.file(configPath).exists();
console.log("Config found via relative path:", configExists);

// ── CONCEPT 6: Glob — finding files by pattern ───────────────
// Bun.Glob lets you find files matching patterns.

const glob = new Bun.Glob("**/*.ts");
const tsFiles: string[] = [];
for await (const file of glob.scan({ cwd: "sandbox/typescript" })) {
  tsFiles.push(file);
}
console.log("TypeScript sandbox files:", tsFiles.sort());

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Write a function `readJsonOrDefault<T>(path: string, fallback: T): Promise<T>`
// that reads a JSON file and returns its contents,
// or returns the fallback value if the file doesn't exist or can't be parsed.
// Test it with an existing file and a non-existent path.
// YOUR CODE:


// EXERCISE 2:
// Create a simple key-value store backed by a JSON file:
//   - get(key: string): Promise<string | undefined>
//   - set(key: string, value: string): Promise<void>
//   - delete(key: string): Promise<void>
//   - list(): Promise<string[]>
// Store it at /tmp/yen-kv-store.json
// Test all 4 operations.
// YOUR CODE:


// EXERCISE 3:
// Write a function `findFiles(dir: string, ext: string): Promise<string[]>`
// that returns all files with the given extension in the given directory (recursive).
// Use Bun.Glob. Test it to find all .ts files in the sandbox folder.
// YOUR CODE:
