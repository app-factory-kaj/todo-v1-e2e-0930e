// mock/env.ts — YOURS. mockEnv carries the keys the platform actually emits
// for this component, and only those. This app declares no auth dependency,
// no external-kind dependency and no `configurations.env` defaults, so
// src/env.ts declares no keys and this stays empty — never add a sibling's
// address here (the todo-api sibling is same-origin /api, see src/api.ts).
export const mockEnv = {};
