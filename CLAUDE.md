# CLAUDE.md

## Core Principles

- Follow user/developer requests exactly; propose improvements, do not implement unasked scope.
- Keep changes minimal, preserve behavior, and prefer refactors over rewrites.
- Ask before adding dependencies, new endpoints, or major UI/UX changes.
- Prefer functional, declarative patterns; avoid classes unless required.
- Remove unused code, logs, and dead paths.
- Keep existing language style in files unless requirements say otherwise.

## Quick Commands

- `npm ci` (or `npm install` locally)
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`

## Nuxt 4 Structure & Aliases

- `app/` — UI (components, pages, composables, assets). Never import `server/` from here.
- `server/` — Nitro API, server-only utils.
- `shared/` — Types, Zod schemas, and pure utils importable from both runtimes via `#shared/…`.
- `test/` — Vitest projects and test helpers.
- `~/` for app code, `~~/` for project root or server paths.

### `shared/` layout

| Path | Purpose |
| --- | --- |
| `shared/schemas/` | Zod schemas for validation, API payloads, and persisted shapes. No barrel `index.ts`. |
| `shared/types/` | TypeScript-only shapes (unions, UI helpers) without runtime validation. |
| `shared/utils/` | Pure cross-runtime helpers. Auto-imported in Nuxt together with `shared/types/`. |
| `shared/data/` | Static label maps and reference data. |
| `shared/config/` | Cross-runtime config. |

## Vue/Nuxt Component Standards

- Always use `<script setup lang="ts">` and Composition API.
- SFC order: `<script>` → `<template>` → `<style>`.
- Script section order:
    1. Imports (external then internal)
    2. Local/internal types (non-exported)
    3. Composables (`useAuth`, `useState`, etc.)
    4. Props/emit definitions
    5. State/refs
    6. Computed
    7. Helpers/methods
    8. Watchers
    9. Lifecycle hooks
- Props: never destructure. Always use
  `const props = withDefaults(defineProps<Props>(), { ... })` and access via `props.x`.
- Use `defineProps` inline for 1–2 props or when it fits on one line; only create a `Props`
  interface when it improves clarity.
- Use `withDefaults` for optional props.
- Use `defineEmits` for typed events.
- Use computed for derived state and watch/watchEffect for side effects.
- Use Vue 3.5 reactive destructuring where it improves clarity (not for props).
- Use auto-imported composables and Vue APIs (no manual import for `ref`, `computed`, etc.).

## Atomic Design & Naming

- Components in `app/components/{Atoms|Molecules|Organisms}`.
- Use subfolders by concern inside each atomic layer; shared/general items may live at the root of
  the layer.
- Naming: PascalCase component files, do not repeat subfolder name in the file name — e.g.
  `Atoms/Basic/Button.vue` (resolves to `<AtomsBasicButton>`); composables `useX` in camelCase
  filenames.
- Import rules: Atoms → none; Molecules → Atoms; Organisms → Atoms + Molecules.

## State Management

- No Pinia/Vuex unless explicitly added.
- `useState` for SSR-hydrated global state; `ref`/`shallowRef` for local UI state.
- Prefer `shallowRef` for objects/arrays; initialize refs with `undefined`.
- Place state logic in `app/composables` with helpers/modifiers together.
- Keep composables focused, reusable, and single-purpose.
- Composables return plain objects of refs (not `reactive` objects).

## Type Management & Validation

- **Schema-first**: Prefer Zod for anything that can be expressed as a schema (validation, API
  payloads, persisted shapes). Derive TypeScript types with `z.infer` when runtime validation
  matters.
- **Types when appropriate**: Standalone TypeScript types or interfaces are fine when a schema adds
  no value (e.g. unions/intersections, compile-only helpers, narrow internal shapes).
- **Locations**: Exported or shared schemas → `shared/schemas/`. Exported or shared types →
  `shared/types/` (import with `import type`). Group by domain when useful.
- **Colocation (strict)**: Non-exported types and schemas may live in the file that uses them.
  **Never** `export type` / `export interface` from implementation files (`server/utils/**`,
  `shared/utils/**`, `app/composables/**`, API routes, Vue SFCs). If another module needs the type,
  move it to `shared/types/` (or derive it with `z.infer` / `Pick` / `schema.pick` from an existing
  schema). Same for schemas: file-local only when private; exported schemas belong in
  `shared/schemas/`.
- **DRY shapes**: Do not re-declare fields that already exist on a domain schema. Prefer
  `schema.pick({ … })` for Zod subsets and `Pick<ExistingType, …>` for compile-only subsets.
- **Schema export names**: Prefer short, role-based names: `schema`, `createRequestSchema`,
  `recordSchema`, `QuerySchema`, `ParamSchema`, `RequestSchema`, `ResponseSchema`. Import from the
  leaf module only — no barrel `index.ts` re-exports.
- **Inferred types**: Always export `export type Foo = z.infer<typeof fooSchema>` **immediately
  after** the schema it infers.
- Prefer `type` for object shapes and unions/intersections unless an `interface` is required for
  declaration merging.
- Avoid `any`; use `unknown` when needed and narrow explicitly.
- Use explicit type annotations for function params/returns when not obvious.
- Use `as const` for literal types where appropriate.
- Avoid `as unknown as` casts.

## Zod Practices

- Follow schema-first rules above; derive types via `z.infer` instead of duplicating shapes.
- Use `.safeParse()` for controlled errors and `.parse()` when exceptions are desired.
- Keep schemas modular/reusable; avoid duplicating shapes — prefer `.pick()` / `.omit()` /
  `.extend()` over copying field lists.
- Use validators and transforms (`.email()`, `.min()`, `.trim()`, `.toLowerCase()`).

## Data Fetching (Nuxt)

- Prefer `useFetch`/`useAsyncData` in setup for SSR/caching.
- Always set a unique key for `useAsyncData`.
- Use `$fetch` in event handlers or when SSR benefits are not needed.
- Use `server: false` or `<ClientOnly>` for client-only APIs.
- Use `useHead`/`useSeoMeta` for SEO.

## Server/API (Nitro)

- API routes in `server/api/` as `{path}.{method}.ts`.
- Place server logic in `server/api`, `server/middleware`, or `server/utils`.
- Use `defineEventHandler` and h3 utilities.
- Validate body/query/params with Zod schemas (`shared/schemas` or colocated).
- Normalize Zod errors; throw / return `createError` with consistent shape.
- Prefer async/await; do not mix `.then()` chains.
- Set headers when needed (cache, content-type, security).
- Never trust identity or ownership fields from the client. Fill them from the authenticated context
  after Zod parsing; the client only sends domain payload.

## Styling & UI

- TailwindCSS + Nuxt UI; avoid inline styles.
- Customize UI in `app/app.config.ts`.
- Use `<NuxtImage>`/`<NuxtPicture>` for images and `<UIcon>` for icons when available.
- Pick one icon set and stick to it; validate icon names exist before adding.
- Add `<style scoped>` only when utilities are insufficient.

## Localization

- User-facing text and errors in the project locale unless requirements say otherwise.
- Comments and code in English.

## Code Quality & Performance

- Use optional chaining and nullish coalescing where appropriate.
- Use destructuring where it improves readability (never for props).
- Avoid nested ternaries; prefer early returns.
- Keep functions focused; extract reusable logic to composables/utils.
- Prefer compact single-statement control flow without braces when readable.
- Use proper `key` in `v-for` loops.
- Lazy-load components when appropriate (e.g. `LazyComponent` or `defineAsyncComponent`).

## Testing

- Import test helpers from dedicated support modules — no barrel file.
- In tests, mirror Nuxt import aliases: `#shared/...` for shared code, `~~/server/...` for server
  utilities, `~/...` for app code in Nuxt tests.
- Group related unit tests in subfolders.
- Prefer tests for critical paths; 100% coverage is not required.
- Keep code testable and follow Nuxt testing best practices.
- Keep tests isolated; avoid reliance on execution order.

## Non-trivial Changes

- Clarify requirements before implementation.
- Document key decisions, edge cases, and test plan briefly.
- Align with existing patterns before introducing new ones.

## Output Expectations

- Return clean, production-ready code with consistent formatting.
- Preserve business logic and behavior.
- Add brief inline comments only for non-obvious logic.