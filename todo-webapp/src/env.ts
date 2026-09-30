// Typed read of window._env_, the platform's runtime config channel
// (react-webapp: "Runtime config, not build-time").
//
// This app has no auth dependency, no external-kind dependency and no
// `configurations.env` defaults, so there are no browser-visible keys to
// declare — the sibling todo-api is reached same-origin at /api (src/api.ts),
// never through a window._env_ key. The type stays empty on purpose; do not
// add a key here to read a sibling's address.
type Env = Record<string, never>;

declare global {
  interface Window {
    _env_: Env;
  }
}

if (!window._env_) {
  throw new Error(
    "window._env_ not set — /env-config.js failed to load. " +
      "The platform mounts this file; if you see this locally, host " +
      "/env-config.js from your dev server.",
  );
}

export const env: Env = window._env_;
