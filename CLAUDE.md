# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test runner is configured yet.

## Architecture

This is a drag-and-drop HTML dashboard builder (table-based, email-compatible output). The stack is React 19 + TypeScript + Vite + Tailwind CSS 4 + SASS.

The project follows **Feature-Sliced Design (FSD)**:

```
src/
  app/        # Entry point, global styles
  pages/      # Route-level components
  widgets/    # Composite UI blocks
  features/   # User interaction logic
  entities/   # Business domain models
  shared/     # Reusable primitives (ui, lib, etc.)
```

**Import rules:**
- Layers can only import from layers below them: `app → pages → widgets → features → entities → shared`
- Use the `@/` alias for all cross-layer imports (e.g. `import { X } from "@/shared/ui/Tab"`)
- Relative imports (`../`) are only allowed within `shared/`

## Key Conventions

**ESLint enforces:**
- No relative imports outside `shared/` — always use `@/`
- Import order: builtin → external → internal (`@/`) → parent → sibling → type → styles
- Self-closing JSX components where possible
- No unused variables

**Prettier config** (`.prettierrc`): double quotes, semicolons, trailing commas, 2-space indent, `prettier-plugin-tailwindcss` for class sorting.

## Path Alias

`@/` maps to `./src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Project Status

Early-stage MVP. Scaffolding and base components (`SplitLayout`, `Tab`) are complete. Phase 1 features (block palette, drag-and-drop canvas, HTML generation) are not yet implemented. See `docs/` for PRD, FSD structure plan, and feature breakdown.
