# Portfolio Dashboard

A responsive portfolio management dashboard built as a take-home assessment for Swimbird.

## Features

- **Dashboard** — accounts list, top holdings, and portfolio performance chart
- **Account detail** — account metadata, holdings breakdown, transaction history, and per-account performance chart
- **Create transaction** — modal form with client-side validation, server error surfacing, and optimistic list update
- **Settings** — theme (light / dark / system), density, and display currency, persisted to `localStorage`
- Light and dark mode, responsive layout (mobile cards → desktop tables)

## Running locally

The app expects the mock API to be running at `http://localhost:5179`.

```bash
npm install
ng serve
```

Open `http://localhost:4200`.

## Tests

```bash
ng test
```

## Architecture

The project uses Angular 21 with signals, `OnPush` change detection, and Tailwind CSS. Key decisions — component structure, state management, HTTP layer, chart library choice, and modal approach — are documented in [PLAN.md](./PLAN.md).

## AI usage

This project was built in collaboration with Claude (Anthropic). Architecture, component design, and key tradeoffs were directed by me; Claude assisted with implementation, caught edge cases, and helped write the test suite. All code was reviewed before being committed.
