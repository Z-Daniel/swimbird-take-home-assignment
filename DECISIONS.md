# Design Decisions & Tradeoffs

Running log of deliberate choices made during development. Intended as source material for the architecture writeup.

---

## Template signal reads — `@let`

When a signal is read more than once in a template, we declare a local variable using Angular's `@let` syntax at the top of the template:

```html
@let a = account();
<h1>{{ a.name }}</h1>
<p>{{ a.type }} · {{ a.currency }}</p>
```

Each signal call (`account()`) is a function invocation. Repeating it is wasteful and obscures intent. `@let` reads the signal once, names the result clearly, and lets the rest of the template work with a plain object. This applies to both signal inputs and computed signals — anything that is called as a function in the template.

---

## Dashboard — Accounts table

### Currency column

The wireframe includes a dedicated **Currency** column (`Name | Type | Currency | Value | 1D%`). We kept it to match the spec, even though the **Value** column already contains the currency code (e.g. `1,245,600 SEK`). An argument could be made to drop the column and rely solely on the formatted balance — it reduces visual clutter and avoids the repetition. The counter-argument is that the currency column makes filtering and scanning by currency easier when accounts are mixed (SEK, USD, EUR).

On mobile, the currency is combined with the account type in the card subtitle (`Investment · SEK`) rather than shown as a separate column, since horizontal space is constrained.

### YTD% column

The wireframe shows a **YTD%** column alongside **1D%**. The mock API does not expose a YTD return field on the account object. Deriving it from the per-account performance series (`GET /accounts/:id/performance`) would require one extra HTTP call per account on the dashboard — an N+1 problem. We omitted the YTD column rather than introduce that cost. If the API were extended to include YTD on the account summary endpoint, adding it would be a one-line change.
