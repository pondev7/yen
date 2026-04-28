// ─────────────────────────────────────────────────────────────
// TOPIC: The reducer pattern — predictable state updates
// RUN:   bun run sandbox/typescript/06-reducers.ts
// PREREQUISITE: 01b-functions.ts (spread operator)
// SEE:   src/hooks/useInputBuffer.ts — the full reducer in the app
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 0: The spread operator with objects (quick recap) ─
// Reducers depend heavily on the spread operator.
// See 01b-functions.ts for the full tutorial — quick recap here:
//
// Python equivalent:   { **existing_dict, key: new_value }
// TypeScript:          { ...existingObj, key: newValue }
//
// It COPIES all fields from existingObj, then applies overrides.
// Original object is NEVER modified.

const config = { model: "sonnet", maxTokens: 1024, streaming: false };
const updatedConfig = { ...config, streaming: true };
//                      ^^^^^^^^^ copy all fields, then override streaming
console.log(config.streaming);         // false — original unchanged
console.log(updatedConfig.streaming);  // true  — new object

// ── CONCEPT 1: What is a reducer? ────────────────────────────
// A reducer is a pure function:
//   (currentState, action) => newState
//
// "Pure" means: no side effects, same input → same output, always.
// You never mutate state. You return a new state object.
//
// This pattern is used by React's useReducer hook.
// It's the heart of useInputBuffer.ts in this project.

// ── CONCEPT 2: A minimal counter reducer ─────────────────────

type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "add"; amount: number };

function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case "increment": return state + 1;
    case "decrement": return state - 1;
    case "reset":     return 0;
    case "add":       return state + action.amount;
  }
}

// Simulate a sequence of dispatches:
let count = 0;
count = counterReducer(count, { type: "increment" });   // 1
count = counterReducer(count, { type: "increment" });   // 2
count = counterReducer(count, { type: "add", amount: 10 }); // 12
count = counterReducer(count, { type: "decrement" });   // 11
console.log("Counter:", count); // Expected: 11

// ── CONCEPT 3: State as an object ────────────────────────────
// Real app state is usually an object, not a primitive.
// Use spread { ...state, field: newValue } to update one field.

interface TodoState {
  items: string[];
  filter: "all" | "done" | "pending";
  loading: boolean;
}

type TodoAction =
  | { type: "addItem"; text: string }
  | { type: "setFilter"; filter: TodoState["filter"] }
  | { type: "setLoading"; value: boolean }
  | { type: "clear" };

const initialTodoState: TodoState = {
  items: [],
  filter: "all",
  loading: false,
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "addItem":
      return { ...state, items: [...state.items, action.text] };
      //       ^^^^^^^^  spread keeps all other fields unchanged
      //                          ^^^^^^^^^^^^^^^^^^^^^^^^  new array

    case "setFilter":
      return { ...state, filter: action.filter };

    case "setLoading":
      return { ...state, loading: action.value };

    case "clear":
      return { ...state, items: [] };
  }
}

let todos = initialTodoState;
todos = todoReducer(todos, { type: "addItem", text: "Learn TypeScript" });
todos = todoReducer(todos, { type: "addItem", text: "Build yen" });
todos = todoReducer(todos, { type: "setFilter", filter: "pending" });
console.log("Items:", todos.items);   // ["Learn TypeScript", "Build yen"]
console.log("Filter:", todos.filter); // pending

// ── CONCEPT 4: Why never mutate state ────────────────────────
// Mutating state directly breaks React's change detection.
// React compares object REFERENCES to know if state changed.
// If you mutate in place, same reference → React thinks nothing changed.

// ❌ Wrong — mutates state directly:
// state.items.push("new item");  // same array reference!

// ✅ Correct — returns new array:
// return { ...state, items: [...state.items, "new item"] };

// ── CONCEPT 5: A realistic text buffer reducer ────────────────
// Simplified version of what's in useInputBuffer.ts

interface BufferState {
  value: string;
  cursor: number;
}

type BufferAction =
  | { type: "insert"; text: string }
  | { type: "deleteBackward" }
  | { type: "moveLeft" }
  | { type: "moveRight" }
  | { type: "moveToStart" }
  | { type: "moveToEnd" }
  | { type: "clear" };

const initialBuffer: BufferState = { value: "", cursor: 0 };

function bufferReducer(state: BufferState, action: BufferAction): BufferState {
  const { value, cursor } = state;

  switch (action.type) {
    case "insert": {
      const before = value.slice(0, cursor);
      const after = value.slice(cursor);
      return {
        value: before + action.text + after,
        cursor: cursor + action.text.length,
      };
    }

    case "deleteBackward": {
      if (cursor === 0) return state;
      return {
        value: value.slice(0, cursor - 1) + value.slice(cursor),
        cursor: cursor - 1,
      };
    }

    case "moveLeft":
      return { ...state, cursor: Math.max(0, cursor - 1) };

    case "moveRight":
      return { ...state, cursor: Math.min(value.length, cursor + 1) };

    case "moveToStart":
      return { ...state, cursor: 0 };

    case "moveToEnd":
      return { ...state, cursor: value.length };

    case "clear":
      return initialBuffer;
  }
}

// Test it:
let buf = initialBuffer;
buf = bufferReducer(buf, { type: "insert", text: "hello world" });
buf = bufferReducer(buf, { type: "moveToStart" });
buf = bufferReducer(buf, { type: "moveRight" });
buf = bufferReducer(buf, { type: "moveRight" });
buf = bufferReducer(buf, { type: "insert", text: "!" });
console.log(buf.value);  // Expected: he!llo world
console.log("Cursor:", buf.cursor); // Expected: 3

// ── CONCEPT 6: How React's useReducer wraps this ─────────────
// In React, instead of calling reducer manually, you do:
//
//   const [state, dispatch] = useReducer(bufferReducer, initialBuffer);
//
//   dispatch({ type: "insert", text: "hello" });
//   // React calls bufferReducer(currentState, action) internally
//   // and re-renders with the new state
//
// dispatch() ≈ "send this action to the reducer"
// The reducer handles it and returns new state
// React sees state changed → re-renders the component

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Write a reducer for a simple shopping cart:
//   State: { items: string[], total: number }
//   Actions:
//     - addItem: { name: string, price: number }
//     - removeAll
// Test it by adding 3 items and checking the total
// YOUR CODE:


// EXERCISE 2:
// Write a reducer for a pagination state:
//   State: { page: number, perPage: number, total: number }
//   Actions:
//     - nextPage (don't go past last page)
//     - prevPage (don't go below 1)
//     - setTotal: { count: number }
// The last page is Math.ceil(total / perPage)
// Test it with total=25, perPage=10 — navigating forward and back
// YOUR CODE:


// EXERCISE 3:
// Write a reducer for a notification system:
//   State: { messages: Array<{ id: number; text: string }>, nextId: number }
//   Actions:
//     - add: { text: string }   — uses nextId, increments it
//     - dismiss: { id: number } — removes that message
//     - clearAll
// Test it: add 3 notifications, dismiss the middle one, print remaining
// YOUR CODE:
