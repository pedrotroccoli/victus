# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Victus is a personal assistant and all-in-one organizer built with React, TypeScript, and Vite.

## Commands

```bash
pnpm dev          # Start dev server on port 5275
pnpm build        # TypeScript compile + Vite build
pnpm lint         # ESLint with zero warnings threshold
pnpm preview      # Preview production build
```

## Architecture

### Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: TanStack Router (file-based, auto-generated `routeTree.gen.ts`)
- **Data Fetching**: TanStack Query
- **Styling**: Tailwind CSS + shadcn/ui components
- **i18n**: i18next (pt-BR, en, es)
- **Auth**: Google OAuth + JWT + World App MiniKit

### Directory Structure

```
src/
├── components/           # Shared UI components (atomic design)
│   ├── atoms/           # Basic inputs (datepicker, select, timer-clock)
│   ├── ions/            # Simple composed elements (buttons, progress)
│   ├── molecules/       # Small component groups
│   ├── organisms/       # Complex component assemblies
│   └── ui/              # shadcn/ui primitives
├── features/            # Feature modules with local components
│   └── {feature}/
│       ├── components/  # Feature-specific components (same atomic structure)
│       └── utils/
├── services/            # API layer
│   ├── api.ts          # Axios instance with auth interceptors
│   └── {domain}/
│       ├── services.ts  # API call functions
│       ├── hooks.ts     # TanStack Query hooks
│       └── types.ts     # TypeScript interfaces
├── routes/              # TanStack Router file-based routes
│   ├── (public)/       # Public routes (auth pages)
│   └── _private/       # Authenticated routes (redirect to sign-in if no token)
├── pages/               # Page-level layout components
├── lib/
│   ├── i18n/           # Translations (en, es, pt-br JSON files)
│   └── utils.ts        # cn() utility for Tailwind class merging
└── globals/            # App-wide constants (storage keys)
```

### Key Patterns

**Service Layer**: Each domain (habits, auth, checkout, etc.) follows this structure:
- `services.ts`: Raw API calls using `baseApi`
- `hooks.ts`: React Query wrappers (`useGetHabits`, `useCreateHabit`, etc.) with optimistic cache updates
- `types.ts`: Request/response TypeScript types

**Route Guards**: `_private.tsx` handles auth checks via `beforeLoad`, redirecting to `/sign-in` or `/world-sign-in` based on MiniKit availability.

**Translations**: Namespaced JSON files per language. Default namespace is `dashboard`. Access via `useTranslation()` hook.

### Path Alias

`@/` maps to `./src/` (configured in vite.config.ts and tsconfig)

### Environment Variables

Required: `VITE_API_URL` - Backend API base URL
