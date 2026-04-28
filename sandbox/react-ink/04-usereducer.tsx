// ─────────────────────────────────────────────────────────────
// TOPIC: useReducer — managing complex state in React
// RUN:   bun run sandbox/react-ink/04-usereducer.tsx
// PREREQUISITE: 03-usestate.tsx, typescript/06-reducers.ts
// SEE:   src/hooks/useInputBuffer.ts — useReducer in the real app
// ─────────────────────────────────────────────────────────────

// ── CONCEPT 1: Why useReducer instead of useState? ────────────
// useState works well for simple, independent values.
// useReducer is better when:
//   - state has multiple fields that update together
//   - the next state depends on the previous state
//   - there are many different ways to update the state
//
// useReducer(reducer, initialState) returns [state, dispatch]
//
// dispatch(action) → reducer(currentState, action) → newState

import { useReducer } from "react";
import { Box, Text, render, useInput, useApp } from "ink";

// ── CONCEPT 2: A to-do list with useReducer ───────────────────

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoState {
  todos: Todo[];
  input: string;
  nextId: number;
  cursor: number;  // which todo is selected
}

type TodoAction =
  | { type: "typeChar"; char: string }
  | { type: "backspace" }
  | { type: "submit" }
  | { type: "toggleDone" }
  | { type: "deleteTodo" }
  | { type: "moveUp" }
  | { type: "moveDown" };

const initialState: TodoState = {
  todos: [
    { id: 1, text: "Learn TypeScript", done: true },
    { id: 2, text: "Build yen", done: false },
  ],
  input: "",
  nextId: 3,
  cursor: 0,
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "typeChar":
      return { ...state, input: state.input + action.char };

    case "backspace":
      return { ...state, input: state.input.slice(0, -1) };

    case "submit": {
      if (!state.input.trim()) return state;
      const newTodo: Todo = { id: state.nextId, text: state.input.trim(), done: false };
      return {
        ...state,
        todos: [...state.todos, newTodo],
        input: "",
        nextId: state.nextId + 1,
        cursor: state.todos.length,  // move cursor to new item
      };
    }

    case "toggleDone": {
      const todos = state.todos.map((t, i) =>
        i === state.cursor ? { ...t, done: !t.done } : t
      );
      return { ...state, todos };
    }

    case "deleteTodo": {
      const todos = state.todos.filter((_, i) => i !== state.cursor);
      return {
        ...state,
        todos,
        cursor: Math.min(state.cursor, todos.length - 1),
      };
    }

    case "moveUp":
      return { ...state, cursor: Math.max(0, state.cursor - 1) };

    case "moveDown":
      return { ...state, cursor: Math.min(state.todos.length - 1, state.cursor + 1) };
  }
}

// ── CONCEPT 3: The component using the reducer ────────────────

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  //    ^^^^^^^  ^^^^^^^^   ^^^^^^^^^^^
  //    state    dispatch    hook call
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.ctrl && input === "c") { exit(); return; }

    if (key.return)   { dispatch({ type: "submit" }); return; }
    if (key.upArrow)  { dispatch({ type: "moveUp" }); return; }
    if (key.downArrow){ dispatch({ type: "moveDown" }); return; }
    if (key.backspace){ dispatch({ type: "backspace" }); return; }

    if (input === " " && !state.input) {
      dispatch({ type: "toggleDone" }); return;
    }
    if (input === "d" && !state.input) {
      dispatch({ type: "deleteTodo" }); return;
    }

    if (input && !key.ctrl && !key.meta) {
      dispatch({ type: "typeChar", char: input });
    }
  });

  return (
    <Box flexDirection="column" gap={1} padding={1}>
      <Text bold>Todo List</Text>

      <Box flexDirection="column">
        {state.todos.map((todo, i) => (
          <Box key={todo.id} gap={1}>
            <Text>{i === state.cursor ? "▶" : " "}</Text>
            <Text color={todo.done ? "green" : "white"}>
              {todo.done ? "✓" : "○"} {todo.text}
            </Text>
          </Box>
        ))}
        {state.todos.length === 0 && (
          <Text dimColor>No todos yet</Text>
        )}
      </Box>

      <Box gap={1}>
        <Text dimColor>›</Text>
        <Text>{state.input}</Text>
        <Text inverse> </Text>
      </Box>

      <Box flexDirection="column" gap={0}>
        <Text dimColor>Enter: add  Space: toggle done  d: delete</Text>
        <Text dimColor>↑↓: navigate  Ctrl+C: exit</Text>
      </Box>
    </Box>
  );
}

render(<TodoApp />);

// ── CONCEPT 4: dispatch vs setState ──────────────────────────
// useState:
//   setCount(count + 1)       — you compute the new value
//   setUser({ ...user, name }) — you construct the new object
//
// useReducer:
//   dispatch({ type: "increment" })   — you describe WHAT happened
//   dispatch({ type: "setName", name }) — reducer computes new state
//
// useReducer = better when logic is complex or actions have names

// ── EXERCISES ─────────────────────────────────────────────────

// EXERCISE 1:
// Extend the TodoState with a `filter: "all" | "active" | "done"` field.
// Add a "setFilter" action and update the component to:
//   - Show filtered todos based on the current filter
//   - Let user press f to cycle through filters
// YOUR CODE:


// EXERCISE 2:
// Create a useReducer-based text editor with:
//   State: { lines: string[], cursor: { row: number, col: number } }
//   Actions: insertChar, newline, backspace, moveUp, moveDown, moveLeft, moveRight
// Keep it simple: just display the lines and cursor position
// YOUR CODE:


// EXERCISE 3:
// Build a simple score tracker for a 2-player game:
//   State: { players: { name: string, score: number }[], round: number }
//   Let user press 1/2 to add a point to player 1/2
//   Press n for next round (resets scores, increments round)
// YOUR CODE:
