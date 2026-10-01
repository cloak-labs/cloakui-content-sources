# `@cloakui/content-sources`

Register and look up **content sources** — CMS backends (WordPress, Sanity, etc.) with their URLs, paths, and client — from anywhere in a decoupled frontend.

A **content source** is a named config for one backend: environment-aware base URLs, admin/API/asset path helpers, an optional query client, and plugins. A singleton **registry** lets app code and shared packages retrieve those sources without hardcoding how they were bootstrapped.

```bash
npm i @cloakui/content-sources
```

---

## Quick start

```ts
import { ContentSource, ContentSourceRegistry } from "@cloakui/content-sources";

const wp = new ContentSource({
  name: "wp",
  url: {
    local: "http://localhost",
    staging: "https://staging.example.com",
    production: "https://example.com",
  },
  activeEnvironment: "local",
  projectPath: "/my-site",
  adminPath: "/wp-admin",
  apiPath: "/wp-json",
  assetsPath: "/wp-content/uploads",
  client: () => createMyWpClient(),
});

await wp.applyPlugins();
ContentSourceRegistry.register(wp);

// Later, from any package:
const source = ContentSourceRegistry.get("wp");
source.getActiveUrl(); // "http://localhost/mysite"
source.getApiUrl(); // "http://localhost/mysite/wp-json"
source.client(); // your WP client
```

Or register from config in one step:

```ts
await ContentSourceRegistry.registerFromConfig({
  name: "wp",
  url: "https://example.com",
  activeEnvironment: "production",
  projectPath: "/",
  adminPath: "/wp-admin",
  apiPath: "/wp-json",
  assetsPath: "/wp-content/uploads",
  client: () => createMyWpClient(),
});
```

---

## Concepts

### `ContentSource`

One backend instance. Holds config and helpers for:

| Concern | Examples                                                                      |
| ------- | ----------------------------------------------------------------------------- |
| URLs    | `getActiveUrl()`, per-environment URL maps                                    |
| Paths   | `projectPath`, `adminPath`, `apiPath`, `assetsPath` → joined URL helpers      |
| Client  | Opaque `client()` — whatever ORM/SDK you use for interacting with that source |
| Plugins | Transform config via `@kaelan/with-plugins` before registration               |

### `ContentSourceRegistry`

Process-wide singleton:

- `register` / `registerFromConfig` / `registerMultiple…`
- `get(name?)` — named source, or the default (first registered)
- `getAll()`, `has()`, `setDefault()`, `clear()`

Shared UI and tooling can depend on the registry without knowing your app’s bootstrap code.

### Plugins

Each plugin receives a `ContentSourceConfig` and returns a modified config. Use them for reusable setup (e.g. attach a client only on the server, inject auth headers config, etc.).

---

## Notes

- Framework-agnostic — no React or Next.js dependency, for example.
- The scope is **source registration and lookup**, not rendering or data fetching. Pair with `@cloakui/block-renderer` (and your fetch layer) outside this package via `source.client()`.
