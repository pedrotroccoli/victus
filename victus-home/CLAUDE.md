# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Victus Home is the marketing landing page for Victus, built with Next.js 14 and the App Router.

## Commands

```bash
pnpm dev          # Start dev server on port 3001
pnpm build        # Production build
pnpm lint         # oxlint (Rust-based linter)
pnpm start        # Start production server
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **i18n**: next-intl (pt-BR, en, es)
- **Auth**: Clerk

### Directory Structure

```
src/
├── app/
│   └── [locale]/        # Locale-based routing (next-intl)
├── components/          # UI components
├── i18n/               # next-intl configuration
├── lib/                # Utilities (cn() for Tailwind)
├── providers/          # React context providers
└── middleware.ts       # Locale detection/routing
messages/               # Translation JSON files (en.json, es.json, pt-BR.json)
```

### Key Patterns

**Locale Routing**: Uses next-intl with `[locale]` dynamic segment. Middleware handles locale detection and redirects.

**Components**: Uses shadcn/ui with Radix primitives. CVA for variant styling.
