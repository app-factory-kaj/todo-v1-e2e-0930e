// mock/handlers.ts — YOURS. One handler per operation in todo-api's
// openapi.yaml, matching its schemas and status codes exactly (the contract
// is the source of truth, never the page code).
//
// Everyone shares one list (no auth, no /me/ paths — this design has none),
// so every operation answers every row. State lives in this module's scope,
// which resets on a full page load: a create shows up in the next list, a
// delete removes it, an edit persists — until the page reloads, by design
// (react-webapp mock-mode.md).
import { http, HttpResponse } from "msw";
import type { components } from "../src/generated/todo-api";

type Todo = components["schemas"]["Todo"];
type NewTodo = components["schemas"]["NewTodo"];
type UpdateTodo = components["schemas"]["UpdateTodo"];
type ApiError = components["schemas"]["Error"];

// Seeded from wireframes.dsl's own TodoList table rows (seed.mjs), oldest
// first — "Buy groceries" (Open) then "Write report" (Done).
let todos: Todo[] = [
  {
    id: "1",
    title: "Buy groceries",
    completed: false,
    createdAt: "2026-09-28T09:00:00.000Z",
  },
  {
    id: "2",
    title: "Write report",
    completed: true,
    createdAt: "2026-09-29T14:30:00.000Z",
  },
];
let nextId = 3;

function errorBody(code: number, message: string): ApiError {
  return { code, message };
}

export const handlers = [
  http.get("/api/todos", ({ request }) => {
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const page = todos.slice(offset, offset + limit);
    return HttpResponse.json({
      count: todos.length,
      next: offset + limit < todos.length ? `/todos?limit=${limit}&offset=${offset + limit}` : null,
      previous: offset > 0 ? `/todos?limit=${limit}&offset=${Math.max(0, offset - limit)}` : null,
      data: page,
    });
  }),

  http.post("/api/todos", async ({ request }) => {
    const body = (await request.json()) as NewTodo;
    const title = body?.title?.trim();
    if (!title) {
      return HttpResponse.json(errorBody(400, "title is required"), { status: 400 });
    }
    const created: Todo = {
      id: String(nextId++),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    todos = [...todos, created];
    return HttpResponse.json(created, { status: 201 });
  }),

  // Most specific path first: /api/todos/:todoId below would otherwise
  // swallow a literal path if one were added later (mock-mode.md).
  http.get("/api/todos/:todoId", ({ params }) => {
    const todo = todos.find((t) => t.id === params.todoId);
    if (!todo) return HttpResponse.json(errorBody(404, "no todo with this id"), { status: 404 });
    return HttpResponse.json(todo);
  }),

  http.put("/api/todos/:todoId", async ({ params, request }) => {
    const todo = todos.find((t) => t.id === params.todoId);
    if (!todo) return HttpResponse.json(errorBody(404, "no todo with this id"), { status: 404 });
    const body = (await request.json()) as UpdateTodo;
    if (body.title !== undefined && body.title.trim() === "") {
      return HttpResponse.json(errorBody(400, "title must not be empty"), { status: 400 });
    }
    const updated: Todo = {
      ...todo,
      ...(body.title !== undefined ? { title: body.title.trim() } : {}),
      ...(body.completed !== undefined ? { completed: body.completed } : {}),
    };
    todos = todos.map((t) => (t.id === updated.id ? updated : t));
    return HttpResponse.json(updated);
  }),

  http.delete("/api/todos/:todoId", ({ params }) => {
    const before = todos.length;
    todos = todos.filter((t) => t.id !== params.todoId);
    if (todos.length === before) {
      return HttpResponse.json(errorBody(404, "no todo with this id"), { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
