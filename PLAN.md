# Implementation Plan — Responsive Portfolio Dashboard

## Milestones

### M1 — Project foundation
- Set `changeDetection: OnPush` as default in `angular.json`
- Install and configure Tailwind CSS
- Verify a component picks up Tailwind classes in the browser
- Define `environment.ts` with the mock API base URL (`http://localhost:5179`)
- Create `APP_CONFIG` injection token in `src/app/core/app-config.ts` and provide it in `app.config.ts`

### M2 — Settings service and theming infrastructure
- Create `SettingsService` (`providedIn: 'root'`) owning three signals: `theme` (light/dark/system), `density` (compact/default/comfortable), and `currency` (display preference)
- Apply theme and density CSS classes to `<html>` via a single `effect()` in `SettingsService`
- System theme reads `prefers-color-scheme` media query
- Wire Tailwind's `darkMode: 'class'` to the theme signal
- Define CSS custom properties for light/dark themes and density spacing
- Initialize `SettingsService` eagerly in `app.config.ts` to avoid flash of unstyled content on load
- Write unit tests for `SettingsService` (theme switching, density switching, system preference detection)

### M3 — App shell
- Top nav with links to Dashboard and Settings
- Router outlet renders route stubs
- Verify direct URL navigation works for each route

### M4 — TypeScript models
- Interfaces for `Account`, `Holding`, `Transaction`, `Performance`
- No UI — verify models compile and match API shapes

### M5 — HTTP services and async state helper
- Create `ApiService` in `src/app/core/api.service.ts` — injects `HttpClient` and `APP_CONFIG`, exposes typed `get<T>()` and `post<T>()` methods that prepend the base URL and return plain observables
- Create `toLoadable()` helper in `src/app/core/to-loadable.ts`
- `AccountService`: `getAccounts()`, `getAccount(id)` — injects `ApiService`
- `TransactionService`: `getTransactions(id)`, `createTransaction(id, payload)` — injects `ApiService`
- `HoldingsService`: `getHoldings(id)` — injects `ApiService`
- `PerformanceService`: `getPerformance()` — injects `ApiService`
- Verify each call returns data in the browser network tab
- Write unit tests for `ApiService` (base URL prepending, correct HTTP method delegation)
- Write unit tests for `toLoadable()` (loading state, success state, error state)
- Write unit tests for each domain service (correct endpoint paths, request params, error propagation)

### M6 — Dashboard: accounts list
- Table on desktop, card list on mobile
- Data from `AccountService`
- Loading, empty, and error states
- Verify responsive layout at multiple breakpoints

### M7 — Dashboard: top holdings
- Top 5 holdings by value, sourced from `GET /holdings`
- Loading, empty, and error states
- Verify it renders correctly

### M8 — Dashboard: performance chart
- Area or line chart via `ng-apexcharts`
- Backed by `GET /performance`
- Loading and error states
- Verify chart renders with real data

### M9 — Dashboard: responsive layout
- Combine M6/M7/M8 into a single responsive page layout
- Verify desktop (side-by-side), tablet, and mobile breakpoints

### M10 — Account details: metadata + holdings
- Route `/accounts/:id`
- Account header (name, type, currency, balance)
- Holdings list for the account
- Loading, empty, and error states

### M11 — Account details: transactions list
- Recent transactions table/list
- Loading, empty, and error states
- Verify navigating between accounts loads correct data

### M12 — Account details: performance section
- Area or line chart backed by `GET /accounts/:id/performance`
- Summary figures sourced directly from API data: total holdings value (sum of `marketValue` from holdings), holding count, largest holding by value
- Loading and error states
- Verify chart and figures render correctly

### M13 — Create transaction: form
- Modal (full-screen on mobile, floating on desktop)
- Fields: date, description, amount, type
- Opens and closes correctly, focus trapped inside modal
- Verify keyboard navigation and label associations

### M14 — Create transaction: validation
- Client-side validation rules on all fields
- Errors display per field, submit blocked when invalid
- Verify error messages appear and disappear correctly
- Write component tests for validation error display and submit-blocking behaviour

### M15 — Create transaction: async submit
- Loading state while POST is in flight
- Server-side validation errors surfaced per field
- Success feedback on completion
- Transactions list updates without page reload
- Verify with mock API delay and failure simulation
- Write component tests for loading, success, and server error states

### M16 — Settings page
- Theme toggle: light / dark / system — wired to `SettingsService` from M2
- Density preference: compact / default / comfortable — wired to `SettingsService`
- Currency/display preference — wired to `SettingsService`
- Verify each setting takes effect immediately

### M17 — Settings persistence
- Read initial values from `localStorage` in `SettingsService` on startup
- Write back to `localStorage` in the same `effect()` that applies DOM classes
- Verify all three preferences survive a page refresh

### M18 — Accessibility and theming pass
- Both themes verified across all pages
- All interactive elements keyboard-reachable
- All form inputs have associated labels
- Focus management on modal open/close
- Verify with keyboard-only navigation

### M19 — README and writeup
- One-command run instructions
- Architecture and tradeoff explanation
- AI usage note

## Architectural decisions

> Coding style, component API conventions, state management primitives, and template syntax follow the rules defined in `.claude/CLAUDE.md`. The decisions below cover choices not addressed there.

- **Smart/dumb component pattern** — smart (container) components own data fetching, state, and event handling; dumb (presentational) components receive data via `input()` and emit events via `output()`. This improves reusability, testability, and separation of concerns.
- **Domain-driven folder structure** — the app is organized by domain, each domain contains a `features/` folder for smart components and a `ui/` folder for dumb components. A top-level `core/` holds app-wide services, interceptors, and guards. A top-level `shared/ui/` holds truly generic presentational components reused across domains.

```
src/app/
├── core/                  # App-wide services, interceptors, guards
├── shared/
│   └── ui/                # Generic dumb components (e.g. spinner, error-message)
├── dashboard/
│   ├── features/          # Smart components (data fetching, state)
│   └── ui/                # Dumb components specific to dashboard
├── accounts/
│   ├── features/
│   └── ui/
└── settings/
    ├── features/
    └── ui/
```

- **`ApiService` as HTTP base layer** — a single `core/api.service.ts` injects `HttpClient` and the `APP_CONFIG` token and exposes typed `get<T>()` and `post<T>()` methods that prepend the base URL. Domain services inject `ApiService` rather than `HttpClient` directly, keeping the base URL and HTTP concerns out of domain code and making domain services easier to test.
- **`HttpClient` + `toSignal()` for data fetching** — services wrap `HttpClient` calls and expose observables; components consume them via a `toLoadable()` helper that produces a single `{ status: 'loading' | 'success' | 'error', data?, error? }` signal using `startWith`/`catchError`/`toSignal()`. Both `HttpClient` and `toSignal()` are stable. `httpResource` was considered but skipped — developer preview in v21, API may change between minor versions.
- **`toLoadable()` helper for eager reads** — a small utility in `src/app/core/to-loadable.ts` that wraps a GET observable into a `{ status: 'loading' | 'success' | 'error', data?, error? }` signal using `startWith`/`catchError`/`toSignal()`. Called at field initialization time (valid injection context). Scoped to read operations that trigger on component creation.
- **Manual signals for event-driven writes** — POST/PUT/DELETE operations triggered by user events (e.g. form submission) use explicit `submitting = signal(false)` and `error = signal<string | null>(null)` signals managed in the event handler via `.subscribe()` + `takeUntilDestroyed()`. Attempting to use `toLoadable()` here is invalid — `toSignal()` cannot be called outside an injection context.
- **Reactive forms (`FormGroup` / `FormControl`)** — used for all form state. Stable, well-documented, and sufficient for the single create-transaction form in scope. Signal Forms (`@angular/forms/signals`) were considered but skipped — also experimental in v21.
- **Route-based lazy loading** — each route loads its component via `loadComponent`. No preload strategy — the app has three routes and startup cost is negligible, so `PreloadAllModules` would add complexity with no measurable benefit.
- **`withComponentInputBinding()`** — added to `provideRouter()` in `app.config.ts` so route parameters and query params are bound directly to component inputs, avoiding manual `ActivatedRoute` injection.
- **Environment config for API URL** — the mock API base URL (`http://localhost:5179`) is defined in `src/environments/environment.ts` and injected via an `APP_CONFIG` token. Services never hardcode the URL.
- **`ng-apexcharts` for charts** — used for the portfolio performance chart (dashboard) and per-account performance chart (account details). Chosen because its declarative config object pairs cleanly with OnPush (replace the object to trigger a re-render), built-in `theme: { mode }` responds directly to `ThemeService` via a `computed()`, and area charts are first-class with no extra config. Tradeoff: ~200KB gzipped bundle for a simple time-series — `Chart.js` would be lighter but requires manual dark-mode colour rebuilding and resize handling.

## Notes

- Critical path: M1 → M2 → M3 → M4 → M5, then M6–M9 (dashboard) and M10–M15 (account details) as two independent streams — sequential for a solo developer, but neither blocks the other
- Modal form is full-screen on mobile (`w-full h-full`), constrained floating dialog on desktop
