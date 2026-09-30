import createClient from "openapi-fetch";
import type { paths } from "./generated/todo-api";

// Same-origin: nginx (production) / the mock worker (dev:mock) both answer at
// /api, and neither the gateway address nor the direct one is ever a browser
// key — see react-webapp's Constraints.
export const todoApi = createClient<paths>({ baseUrl: "/api" });
