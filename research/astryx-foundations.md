# Astryx Foundations — Research for prompt-optimizer (Vue 3, mobile-first)

> Researched 2026-11-17. Read-only research; no code in the cloned repo or the
> Astryx demo was changed. One new file only: this one, under
> `~/workspace/prompt-optimizer/research/`.
>
> **Headline constraint:** Astryx is **React 19+ only** (`react`/`react-dom`
> `>=19.0.0` and `@stylexjs/stylex ^0.19.0` are peer dependencies of
> `@astryxdesign/core`). It **cannot be installed into the Vue 3
> prompt-optimizer app**. What transfers is the token system, the type/spacing/
> radius/motion scales, the responsive-theme idea, the component/pattern
> shapes, and the accessibility rules — re-implemented with Naive UI + Tailwind 4.
>
> **How values were obtained:** token values below are copied verbatim from
> the published npm tarballs `@astryxdesign/core@0.7.16`
> (`dist/astryx.css`) and `@astryxdesign/theme-neutral@0.7.16`
> (`dist/theme.css`, `src/neutralTheme.ts`, `palette.config.json`), downloaded
> from registry.npmjs.org and inspected in `/tmp` on 2026-11-17. Contrast
> ratios in §1.7 were computed by me from those published token values with
> the WCAG formula — they are **not** Meta-published ratios. Anything I could
> not verify in an official source is marked **UNVERIFIED**.

## Sources

- Repo: https://github.com/meta/astryx — public, MIT, default branch `main`,
  HEAD `a9c3c85e747a52a887a296b13948ed54072c1aef`, 8,150 commits, 29,968 stars,
  2,337 forks, 52 releases, 126 tags (GitHub page crawled 2026-11-17 15:15 UTC).
- Docs: https://astryx.atmeta.com — Principles
  (https://astryx.atmeta.com/docs/principles), v0.6.0 blog
  (https://astryx.atmeta.com/blog/astryx-v0-6-0), Mobile Type sandbox
  (https://astryx.atmeta.com/sandbox/pages/mobile-type/), changelog/releases
  (https://github.com/meta/astryx/releases).
- npm (registry check 2026-11-17): `@astryxdesign/core` 0.7.16, MIT;
  `@astryxdesign/theme-neutral` 0.7.16, MIT; `@astryxdesign/cli` 0.7.16, MIT;
  `@astryxdesign/build` 0.7.16, MIT; `@stylexjs/stylex` 0.19.2, MIT.
- Accessibility checklist (GitHub wiki, secondary — official repo wiki):
  https://github.com/facebook/astryx/wiki/Accessibility-Checklist
  (note: some secondary sources cite the repo as `facebook/astryx`; the
  canonical repo per npm and GitHub is `meta/astryx` — the former appears to
  be an old name/redirect).
- Local prior art: `~/workspace/astryx-demo` (v0.7.15, theme Neutral,
  2026-11-14; dashboard "Thịnh Phố Núi — Quản lý giếng khoan", Vite + React 19
  + TS; `astryx doctor --built` 21 pass / 2 warn / 0 fail).

## 1. Foundations

### 1.1 Principles (official, docs/principles)

1. Components over primitives — use a component for everything it covers
   before reaching for raw HTML.
2. Semantic tokens over hardcoded values — colors, spacing, radii named by
   purpose, not appearance. Never raw hex/px in app code.
3. Theme-agnostic code — app code never references specific colors or
   measurements, so themes and dark mode work automatically.
4. Open internals — every primitive is exported and composable.
5. Frame-first page layout — pick the shell and budget regions before writing
   content (`astryx docs layout`).
6. Dense data renders as rows (`Table`, `List`/`Item`), edge-to-edge with
   dividers; `Card` is for widgets, galleries, settings groups — not for
   wrapping every list item/section.
7. Form inputs are controlled (`value` + `onChange`).
8. Navigation via `useLinkComponent()` + `LinkProvider` so the router is
   pluggable (React-only mechanism — see §5).
9. `Badge` is for counts and enumerated states only; use `StatusDot` or
   `Token` for status. (Tension to note: Neutral still ships coloured badge
   variants — see §3. The docs' rule is "reserve Badge for counts"; the
   earlier demo used Badge as status per its docs. For prompt-optimizer, use
   Badge for counts, StatusDot/Token-style chips for status.)

### 1.2 Color system — how themes work

- A theme is a **set of CSS custom property overrides**. `defineTheme()` in
  `@astryxdesign/core/theme` takes `typography`, `motion`, `tokens`
  (`[light, dark]` pairs), `adaptations`, `syntax`, `localTokens`.
- Every colour token is emitted as `light-dark(<light>, <dark>)` and follows
  the page `color-scheme` (`:root { color-scheme: light dark; }`,
  `html[data-theme="light"|"dark"]`). No `prefers-color-scheme` media query
  in app code.
- Surface hierarchy: `body` → `surface` → `card` → `popover`.
- Neutral's palette is generated, not hand-picked: recipe `astryx-oklch-v1`,
  vibrancy 50, 21 stops (0–100 step 5) per family, dark-chroma taper
  (stops 5–25 at 50% chroma, recovering by stop 60; yellow 65%). Seeds
  (`palette.config.json`): neutral `#777777`, red `#d62830`, orange
  `#d57113`, yellow `#f8c723`, green `#358a3a`, teal `#0c7365`, cyan
  `#0c6f82`, blue `#0074e2`, purple `#980fb2`, pink `#b10e69`.
- Seven ready-made themes: neutral, butter, chocolate, matcha, stone, gothic,
  y2k. Neutral is described as "muted, minimal aesthetic with Figtree
  typography, Lucide icons" and is the reference implementation for
  palette-aware themes. (Gothic being dark-only is **UNVERIFIED** in the
  official sources checked — it comes from a secondary summary.)

**Neutral semantic colours** (`--color-*`, `light-dark(light, dark)`,
from `theme-neutral@0.7.16/dist/theme.css`):

| Token | Light | Dark |
|---|---|---|
| `--color-background-body` | `#f1f1f1` | `#1b1b1b` |
| `--color-background-surface` | `#ffffff` | `#262626` |
| `--color-background-card` | `#ffffff` | `#1b1b1b` |
| `--color-background-popover` | `#ffffff` | `#1b1b1b` |
| `--color-background-muted` | `#f1f1f1` | `#1b1b1b` |
| `--color-accent` | `#1b1b1b` | `#f1f1f1` |
| `--color-accent-muted` | `#d4d4d4` | `#474747` |
| `--color-text-primary` | `#000000` | `#ffffff` |
| `--color-text-secondary` | `#474747` | `#9e9e9e` |
| `--color-text-disabled` | `#919191` | `#525252` |
| `--color-text-accent` | `#1b1b1b` | `#f1f1f1` |
| `--color-on-accent` | `#ffffff` | `#111111` |
| `--color-border` | `#00000014` | `#ffffff1A` |
| `--color-border-emphasized` | `#d4d4d4` | `#525252` |
| `--color-overlay` (scrim) | `#00000080` | `#000000CC` |
| `--color-overlay-hover` | `#0000000D` | `#ffffff0D` |
| `--color-overlay-pressed` | `#0000001A` | `#ffffff1A` |
| `--color-neutral` | `#0000000F` | `#ffffff1A` |
| `--color-skeleton` | `#f1f1f1` | `#525252` |
| `--color-shadow` | `#0000001A` | `#0000004D` |

Status roles (light / dark):

| Role | base | muted | text (`--color-text-*`) | on-muted |
|---|---|---|---|---|
| info | `#0074e2` / `#6d9cfe` | `#b9d7ff` / `#88bcff3D` | `#0067ce` / `#a1caff` | `#003978` / `#a1caff` |
| success | `#198100` / `#64af4c` | `#bce0bb` / `#90ca903D` | `#2f7d33` / `#90ca90` | `#00490b` / `#90ca90` |
| warning | `#ffce2f` (both) | `#fae19e` / `#e2b6233D` | `#836700` / `#eec448` | `#4b3900` / `#eec448` |
| error | `#c9303a` / `#ff705d` | `#ffc4be` / `#ff98903D` | `#c0262c` / `#ffaea7` | `#76000c` / `#ffaea7` |

`--color-on-success` / `--color-on-error` / `--color-on-info` are
`#ffffff` light / `#111111` dark; `--color-on-warning` is `#111111` both modes.
Icon tokens mirror text tokens (`--color-icon-primary/secondary/disabled/
accent/info/success/warning/error`).

Categorical families — each has `background / border / icon / text` in light
and dark (e.g. blue bg `#b9d7ff`/`#253c5a`, border `#a1caff`/`#5aa0f8`,
icon `#003978`/`#88bcff`, text `#003978`/`#a1caff`). Families: red, orange,
yellow, green, teal, cyan, blue, purple, pink, gray. Full values are in the
shipped `dist/theme.css` — do not re-type them from memory; copy from that file.

Syntax colours (for code/markdown output) are also themed, e.g. keyword
`#6b187c`/`#efa8ff`, string `#0b5615`/`#a4d6a3`, comment `#525252`/`#b9b9b9`,
background `#ffffff`/`#111111`.

**Note — Neutral's accent is near-monochrome:** `--color-accent` is
`#1b1b1b` light / `#f1f1f1` dark (i.e. the accent *is* the ink colour), with
info blue `#0074e2` used for links/status. Do not copy Neutral's accent
expecting a colourful brand: for prompt-optimizer, keep the existing brand
accent and map it onto the `--color-accent` *role* instead.

### 1.3 Typography

- Geometric scale: `size = round(14 × 1.2^step)`, base 14px, ratio 1.2
  (Neutral `typography.scale = {base: 14, ratio: 1.2}`).
- Font-size steps (core `astryx.css`, rem @ 16px root): 4xs 6px (0.375rem),
  3xs 7px, 2xs 8px, xs 10px, sm 12px, base 14px (0.875rem), lg 17px,
  xl 20px, 2xl 24px, 3xl 29px, 4xl 35px, 5xl 42px (2.625rem).
- Families (Neutral): body + heading `Figtree, -apple-system,
  BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  code `ui-monospace, "SF Mono", Monaco, Consolas, "Liberation Mono",
  "Courier New", monospace`.
- Weights: normal 400, medium 500, semibold 600, bold 700.
- Semantic levels (Neutral, size / weight / leading): display-1 42px /
  normal / 1.2381; display-2 35px / normal / 1.2571; display-3 29px / normal /
  1.3793; heading-1 24px / semibold / 1.3333; heading-2 20px / semibold / 1.4;
  heading-3 17px / bold / 1.4118; heading-4 14px / bold / 1.4286; heading-5
  12px / semibold / 1.6667; heading-6 10px / semibold / 1.6; body 14px /
  normal / 1.4286; large 17px / semibold / 1.4118; label 14px / medium /
  1.4286; code 14px / normal / 1.4286; supporting 12px / normal / 1.6667.
  (Core defaults differ slightly: heading-3/4 semibold not bold, display-3
  leading 1.2414 — Neutral overrides them.)
- Use `Heading`/`Text` components in Astryx; in Vue, map these levels to
  Naive UI typography / Tailwind classes — do not set raw font-size in
  components.

### 1.4 Spacing

- 4px base unit. Core `--spacing-*` (rem): 0 = 0; 0.5 = 2px; 1 = 4px;
  1.5 = 6px; 2 = 8px; 3 = 12px; 4 = 16px; 5 = 20px; 6 = 24px; 7 = 28px;
  8 = 32px; 9 = 36px; 10 = 40px; 11 = 44px; 12 = 48px.
- Guidance from secondary summaries of the docs: `--spacing-4` (16px) inside
  a group, `--spacing-6` (24px) between sections, `--spacing-8` (32px)
  between major groups. (Treat as guidance, not a verified verbatim quote.)
- Component `gap` props accept step values 0–12.
- Astryx also auto-corrects double-padding from nested components
  ("context-aware spacing compensation") — a behaviour, not a token; in Vue
  this must be handled by layout discipline, not copied.

### 1.5 Radii

- Core defaults: none 0, inner 4px, element 8px, container 12px, page 28px,
  chat 28px, full 9999px.
- Neutral overrides: inner 6px (0.375rem), element 10px (0.625rem),
  container 12px (0.75rem), page 28px (1.75rem), full 9999px.
- Derived in core: button radius = `radius-element − spacing-1`; dialog/
  popover/dropdown radius = `radius-container`; card radius =
  `radius-container`; field radius = `radius-element`.

### 1.6 Elevation / shadows

- Core defaults: `--shadow-low` `0 1px 1px rgba(0,0,0,.1), 0 2px 8px
  rgba(0,0,0,.1)`; `--shadow-med` `0 1px 2px rgba(0,0,0,.1), 0 2px 12px
  rgba(0,0,0,.1)`; `--shadow-high` `0 2px 2px rgba(0,0,0,.1), 0 8px 24px
  rgba(0,0,0,.1)` (dark variants raise alpha to .2/.3); plus
  `--shadow-inset-hover/selected/success/warning/error` (2px inset rings).
- Neutral overrides (oklch + dark inset ring), verbatim from
  `theme.css`:
  - low: `0 2px 4px light-dark(oklch(0 0 0/5%), oklch(0 0 0/25%)), 0 4px 8px
    light-dark(oklch(0 0 0/10%), oklch(0 0 0/40%)), inset 0 0 0 1px
    light-dark(transparent, oklch(1 0 0/8%))`
  - med: `0 2px 4px …/5%|35%, 0 4px 12px …/10%|50%, inset …/12%`
  - high: `0 4px 6px …/10%|50%, 0 12px 24px …/15%|70%, inset …/15%`
  - inset-hover `#0074e24D`, inset-selected `#0074e280`,
    inset-success `#2f7d334D`, inset-warning `#f8d36a4D`,
    inset-error `#de47454D`.
- Card elevation maps to low/med/high by variant in core.

### 1.7 Motion / duration

- Core defaults: fast 175ms (min 130 / max 230), medium 410ms (310/550),
  slow 975ms (730/1300); `--duration-exit: var(--duration-fast)`.
- Neutral overrides (snappier, "to match shadcn/Tailwind conventions",
  `motion: {fast: 125, medium: 300, slow: 700, ratio: 0.75}`): fast 125ms
  (95/165), medium 300ms (225/400), slow 700ms (525/935).
- Reduced motion is a theme adaptation: the v0.6 blog example sets
  `--duration-medium: 0ms` when `{motion: 'reduce'}`. Respect
  `prefers-reduced-motion` in the Vue build too.

### 1.8 Breakpoints / responsive behaviour

- Breakpoints are **theme-owned**, not a Tailwind-style utility system.
  The v0.6 example: `widthBreakpoints: {sm: 640, md: 768, lg: 1024}`.
  `AppShell` uses the same width map for its named mobile-navigation
  breakpoints, "including the new `xl` and `2xl` values" — **xl/2xl pixel
  values are UNVERIFIED** (not stated in the sources checked).
- A theme can adapt tokens, component styles, typography, colour, radius
  and motion to named viewport widths, pointer precision (`coarse`/`fine`),
  contrast preference, and reduced-motion preference. Rules can combine
  conditions (e.g. small screen + touch pointer); later rules win; the
  result is plain CSS, so the browser adapts without a JS layout loop.
- At an `AppShell` mobile breakpoint, the exact boundary renders the wider
  layout; mobile mode applies only *below* it.
- **Adaptive selection:** `Selector`/`MultiSelector` ship
  `presentation="adaptive"` (v0.6.0): on a compact surface the choice opens
  as a modal bottom sheet with touch-sized rows; on a wider surface it stays
  an anchored popover. Same options and selected values either way.
- Overlays use the native **Popover API + CSS anchor positioning**, not a JS
  positioning library. Consequence (secondary review, rushis.com): full
  fidelity needs modern browsers — Chrome/Edge 125+, Safari 26+,
  Firefox 147+; functional (overlays may mis-anchor) on Chrome/Edge 114+,
  Safari 17+, Firefox 125+; Astryx ships no polyfill and no `light-dark()`
  fallback. **UNVERIFIED in official docs checked** — treat as a caution,
  not a quoted requirement. For the Vue app this is a reason *not* to copy
  the overlay mechanism; Naive UI's JS-positioned overlays are the safer
  equivalent.

### 1.9 Accessibility rules

- Policy (Accessibility Checklist wiki + per-component docs, e.g.
  ButtonGroup): **WCAG 2.2 Level AA in every colour mode and theme** —
  4.5:1 normal text, 3:1 large text, 3:1 non-text UI / meaningful graphics /
  visible control boundaries / keyboard focus indicator (focus outline ≥3:1
  vs its surroundings). Disabled controls are exempt. Every state must be
  checked: rest, hover, focus-visible, active/pressed, selected/current,
  loading, read-only, each status value.
- Keyboard: full WAI-ARIA APG support per pattern (shared focus hooks,
  RTL arrow-key flipping). Overlays trap focus while open and restore it on
  close (`useFocusTrap`); focus is never dropped to `<body>`; focus ring
  visible in every theme. Loading actions expose `aria-busy`, stay
  focusable, block duplicate activation via `aria-disabled` + guarded
  handlers. State reaches assistive tech as text, not colour alone
  (indicator glyphs `aria-hidden` + `VisuallyHidden` text).
- Announced empty states on selectors; `isReadOnly` keeps values focusable
  and form-submittable without editing controls.
- i18n: every visible and AT-facing string is a namespaced key
  (`@astryx.*`) resolved through `useTranslator()`; ICU interpolation.
- Lab → core promotion is gated on the Component Audit Rubric
  (0 open BLOCKs, overall ≥ B, every Accessibility Checklist item verified)
  plus real assistive-technology evidence (record AST-009).

**Contrast spot-check — computed by me from the published Neutral token
values (WCAG formula), light/dark:**

| Pair | Ratio | AA normal text (4.5:1) |
|---|---|---|
| text-primary on body | 18.59 / 17.22 | pass |
| text-secondary on body | 8.23 / 6.43 | pass |
| text-info on surface/body | 5.48 / 10.18 | pass |
| text-success on surface/body | 5.12 / 9.05 | pass |
| text-error on surface/body | 5.91 / 9.73 | pass |
| text-warning on surface | 5.38 (light) | pass |
| on-accent on accent (light) | 17.22 | pass |
| info/success/error fills on white (non-text, 3:1) | 4.57 / 5.02 / 5.29 | pass |

These are spot checks only — a full contrast profile per component/state
is still required in the Vue build (Astryx requires one per component).

## 2. Components / patterns that map to prompt-optimizer mobile

`@astryxdesign/core@0.7.16` exports 176 entry points (≈150+ components;
the demo's CLI reported 174 components at v0.7.15). Mapping to the Vue app
(Naive UI equivalents are the implementation vehicle; the Astryx column is
the *behaviour* to copy):

| Prompt-optimizer need | Astryx component / pattern | Notes |
|---|---|---|
| Primary/secondary/destructive actions; model "Optimize" CTA | `Button`, `ButtonGroup`, `IconButton`, `ToggleButton` | Variants + sizes sm/md/lg map to `--size-element-*`; destructive uses error-muted bg + on-error-muted text in Neutral |
| Prompt input, model params | `TextInput`, `TextArea`, `NumberInput`, `Field`, `FieldStatus`, `InputGroup`, `FormLayout` | Controlled inputs; `FieldStatus` = inline error/help; `FormLayout` carries `defaultEntryErrorBehavior` (when a field shows its entry error) |
| Model / template / language pickers | `Selector`, `MultiSelector`, `ComplexSelector`, `Typeahead`, `DropdownMenu`, `MoreMenu` | **Key mobile pattern:** `presentation="adaptive"` → bottom sheet with touch-sized rows on compact screens, anchored popover on desktop |
| Workspace cards, favorites | `Card`, `Section`, `ClickableCard`, `SelectableCard` | Card = widgets/settings groups only; dense data = rows |
| Model manager, settings, confirmations | `Dialog`, `AlertDialog`, `Drawer`, `BottomSheet`, `Popover`, `HoverCard` | Focus trap + restore; BottomSheet is the mobile form of Dialog/Selector |
| History, favorites, templates lists | `Table`, `List`, `Item`, `TreeList`, `EmptyState`, `Skeleton`, `Pagination` | Table supports infinite loading (`useTableInfiniteScroll` in 0.7.16); dense rows edge-to-edge with dividers |
| Mode switch Basic/Pro/Image/Arena | `TabList`, `SegmentedControl` | SegmentedControl item height = element size − 8px |
| Toasts / inline feedback | `Toast`, `Banner`, `StatusDot`, `Token`, `Badge` | Toast slides by `--spacing-2`; Banner for info/success/warning/error; Badge = counts only |
| Toggles (dark mode, advanced mode) | `Switch`, `CheckboxInput`, `RadioList`, `CheckboxList` | Rich labels/descriptions produce correct accessible names |
| Optimize / test progress | `ProgressBar`, `Spinner`, `Timer`, `Skeleton` | Status fills share Neutral local tokens across badges, dots, Stepper, progress bars |
| App frame + mobile nav | `AppShell`, `TopNav`, `SideNav`, `MobileNav`, `NavMenu`, `Breadcrumbs`, `Toolbar`, `CommandPalette`, `PowerSearch` | AppShell owns the mobile-navigation breakpoint from the theme width map |
| Prompt output (markdown, code, diff) | `Markdown`, `CodeBlock`, `Code`, `TextDiff` (n/a — no TextDiff export; use Markdown + CodeBlock), `Citation`, `Lightbox` | Syntax colours are themed (§1.2); Lightbox caption band is 2 lines tall in 0.7.16 |
| Optimize flow steps | `Stepper` (+ wizard templates) | Promoted lab → core; graded 88.3/B under rubric v1.2.1, re-graded under v1.5 |
| Multi-turn / variable test inputs | `Chat`, `Tokenizer` | Tokenizer usable inside `InputGroup` since 0.7.14 — relevant to variable chips |

**Page patterns (README + v0.6 blog):** table pages, detail page layouts,
form wizards, navigation patterns, data entry flows. Wizard templates
shipped in 0.6.0: Checkout Wizard, Form Wizard (full-page, one step at full
width), Dialog Wizard (keeps page in context), Inline Wizard (accordion,
completed steps collapse), Vertical Wizard (long-form, persistent progress),
plus Work Item Detail (tracked item: subtasks, properties, attachments,
activity). For prompt-optimizer: Form Wizard ≈ the optimize flow;
Work Item Detail ≈ a favorite/prompt detail page; Table page ≈
favorites/history library.

**No BottomNav component exists** in Astryx core exports — the mobile
navigation pieces are `MobileNav` + `AppShell` + `BottomSheet`. A bottom tab
bar for the Vue app must be designed from those patterns, not copied from a
named component.

## 3. Theme Neutral tokens — exact values (see §1 for the full tables)

Verbatim from `@astryxdesign/theme-neutral@0.7.16`:

- **Type scale:** base 14, ratio 1.2; font sizes 6/7/8/10/12/14/17/20/24/29/
  35/42px; Figtree body + heading; ui-monospace code stack; weights
  400/500/600/700.
- **Motion:** fast 125ms (95–165), medium 300ms (225–400), slow 700ms
  (525–935), ratio 0.75.
- **Radii:** inner 6px, element 10px, container 12px, page 28px, full 9999px.
- **Spacing:** 0–48px in 4px steps (§1.4).
- **Element sizes (core):** sm 28px, md 32px, lg 36px.
- **Colour roles:** full light/dark table in §1.2; categorical families
  red/orange/yellow/green/teal/cyan/blue/purple/pink/gray with
  background/border/icon/text per mode; syntax palette in §1.2.
- **Shadows:** Neutral oklch low/med/high + inset rings (§1.6).
- **Theme CSS import:** `@import '@astryxdesign/theme-neutral/theme.css';`
  plus `@astryxdesign/core/reset.css` + `@astryxdesign/core/astryx.css`,
  wrapped in `<Theme theme={neutralTheme}>` (React-only wiring).
- **Palette provenance:** `palette.config.json` (recipe `astryx-oklch-v1`),
  generated stops in `src/neutralPalettes.generated.ts` + receipt JSON;
  CLI regeneration is not yet a supported release workflow — treat the
  generated module as a reviewed artifact, don't hand-edit it.

## 4. Version / license / status / known limits

- **Current version: 0.7.16** (npm `latest` + GitHub release "Astryx 0.7.16 —
  all `@astryxdesign/*` packages ship at this version", 2026-11-17 check).
  Upgrade pattern: pin *every* `@astryxdesign/*` package to the same
  version, then `npx @astryxdesign/cli upgrade --from <old> --apply`.
  The local demo is pinned at **0.7.15** (2026-11-14) — one release behind.
  v0.7.15 (2026-11-12) notes record a known Safari/WebKit issue (a tall
  tooltip briefly covering its trigger on first entrance) fixed in 0.7.16.
- **License: MIT** (repo LICENSE + all npm packages).
- **Status: public Beta, 0.x, no 1.0.** Public release 18 June 2026; 8 years
  internal at Meta, 13,000+ apps. Releases land several times a week, with
  breaking changes per minor (v0.6.0 changed CSS selectors to `data-*`
  attributes, changed Stepper APIs, moved an import path). Do not treat any
  0.7.x API as stable.
- **Requirements:** React 19+, Node 22+ (contributors), pnpm 11
  (contributors). Contributors' stack is not the consumer's stack, but the
  React 19 floor is.
- **Charts: canary-only, no stable release.** `@astryxdesign/vega`
  (Vega/Vega-Lite wrapper) and `@astryxdesign/charts` publish only under the
  `@canary` dist-tag. `@astryxdesign/lab` (experimental components) is
  internal and not published to npm.
- **Templates: known issues.** In the 2026-11-14 demo the official dashboard
  template did **not** build intact (missing recharts + heroicons); the App
  had to be written by hand. `astryx doctor --built` is the gate before
  delivering a build (demo: 21 pass / 2 warn / 0 fail; warns were Figtree
  font warnings).
- **Other limits:** no stable charts; `swizzle` ejects component source to
  own it (a fork, not an upgrade path); MCP server at
  `https://astryx.atmeta.com/mcp` (search/get tools) is for agent lookup;
  the unscoped npm package `astryx` is an unrelated project — the CLI is
  `@astryxdesign/cli` (`npx @astryxdesign/cli`, not `npx astryx`); bundle
  cost in the demo: JS 940KB (gzip 301KB), node_modules 330MB, dist 1.4MB.

## 5. ADAPT vs DO NOT COPY (Vue 3 + Naive UI + Tailwind 4 target)

### ADAPT (transferable, no React needed)

- Semantic token naming and discipline: `--color-*` / `--spacing-*` /
  `--radius-*` / `--text-*` / `--size-element-*` / `--duration-*`, no raw
  hex/px in components. Map onto Tailwind 4 `@theme` + Naive UI theme
  overrides (`n-config-provider` theme vars).
- Surface hierarchy body → surface → card → popover; `light-dark()` for
  light/dark pairs (Tailwind 4 supports `light-dark()` in custom properties).
- Type scale formula (14 × 1.2^step) and the semantic level table (§1.3).
- Spacing 4px scale; radii (inner 6 / element 10 / container 12 / page 28);
  duration scale (125/300/700) + reduced-motion rule.
- Frame-first layout; dense data as rows, cards only for widgets/settings.
- Adaptive Selector: popover on desktop → bottom sheet with touch-sized rows
  on mobile (Naive UI `n-drawer placement="bottom"` is the vehicle).
- Mobile type floor (§6); touch-sized controls via theme adaptation rules.
- Accessibility policy: WCAG 2.2 AA 4.5:1 / 3:1, focus-visible ≥3:1,
  focus trap + restore in modals, `aria-busy` + `aria-disabled` on loading
  actions, state as text not colour alone, announced empty states.
- Status-dot / token chips for status; Badge reserved for counts.
- Wizard/detail/table page shapes (§2).

### DO NOT COPY

- Any `@astryxdesign/*` package, React component, hook, or prop API
  (`defineTheme`, `<Theme>`, `useLinkComponent`/`LinkProvider`,
  `xstyle`/`stylex.create()`, `swizzle`, `astryx theme add/eject`).
- StyleX as a styling system (the Vue app uses Tailwind 4 + Naive UI;
  Astryx's own docs say Tailwind is first-class for *consumers*, but the
  StyleX-authored internals, `data-*` selector changes, and build plugins
  do not transfer).
- The Popover API + CSS anchor positioning overlay mechanism (modern-browser
  floor, no polyfill) — use Naive UI overlays instead.
- Figtree as a mandatory font (Neutral's choice; the demo only warned about
  it). Prompt-optimizer already ships a system + CJK stack; keep it unless a
  brand decision says otherwise. (Note: prompt-optimizer already depends on
  `@lucide/vue`, so Neutral's Lucide iconography *is* compatible in spirit —
  icon *names*, not the React icon components, transfer.)
- Neutral's near-monochrome accent (`#1b1b1b`/`#f1f1f1`) as a brand colour;
  copy the *role*, keep prompt-optimizer's own accent.
- Charts (`@astryxdesign/charts`/`vega`, canary-only), lab components
  (unpublished), CLI templates (dashboard template known broken), and the
  MCP server as a runtime dependency.
- The demo AGENTS.md rule "Badge = counts only" vs the docs' coloured badge
  variants: follow the docs' *rule* (counts), not the coloured variants.

## 6. Mobile-specific guidance from Astryx

- **16px input floor (verified, shipped):** "Astryx inputs already jump to
  16px under `@media (pointer: coarse)` to block mobile zoom-on-focus"
  (sandbox Mobile Type page). Neutral v0.7.0 release notes: "Phone
  typography starts at 16px in four themes".
- **Mobile type adaptation (verified, shipped in Neutral 0.7.16):**
  when `{pointer: coarse, width: {below: 'lg'}}` (compiled theme.css:
  `@media (width < 1024px) and (pointer: coarse)`), the type scale
  re-bases to 16px with ratio 1.1736 so Display 1 stays 42px: body 14→16px,
  large 17→19px, heading-1 24→26px, heading-2 20→22px, heading-3 17→19px,
  heading-4 14→16px, heading-5 12→14px, heading-6 10→12px, supporting
  12→14px, display-2 35→36px, display-3 29→30px; body leading 1.4286→1.5.
- **⚠️ Sandbox discrepancy (flagged, do not copy blindly):** the sandbox
  Mobile Type page shows a *different* formula, `size = round(16 × 1.2^step)`
  (Display 1 48px, Heading 1 28px). That page is a sandbox experiment
  ("New v2.4 · Design system"); the shipped Neutral 0.7.16 `theme.css`
  uses ratio 1.1736 with Display 1 pinned at 42px. Use the shipped values.
- **Touch-sized controls (adaptation example, not a Neutral default):**
  the v0.6 blog example sets `--size-element-md: 44px` when
  `{width: {below: 'md'}, pointer: 'coarse'}`. The shipped Neutral 0.7.16
  theme.css does **not** override `--size-element-md` in its mobile block —
  core default stays sm 28 / md 32 / lg 36px. So: Astryx documents 44px as
  the touch adaptation to *opt into*; it is not the out-of-box size.
  (For reference only: WCAG 2.2 AA minimum target is 24×24 CSS px;
  Apple HIG is 44pt; Material is 48dp — none of these numbers are Astryx's.)
- **Press, not hold:** since v0.7.14, DropdownMenu/MoreMenu triggers open on
  press under a finger or pen instead of after a 500ms hold.
- **AppShell mobile layout** is learned from the theme width map; a fix in
  0.7.16 stops the shell flashing its desktop layout on phones right after
  hydration.
- **Safe-area / `100dvh`:** **UNVERIFIED — no Astryx documentation found**
  in the sources checked covering safe-area insets or `100dvh`. Treat
  safe-area/`100dvh` as a prompt-optimizer decision (standard mobile-web
  practice), not an Astryx prescription.
- **No documented mobile breakpoint set for layout utilities:** the only
  verified numbers are the theme adaptation map sm 640 / md 768 / lg 1024
  (v0.6 example) and the mobile-type condition `width < 1024px +
  pointer: coarse`. The prompt-optimizer design system should define its
  own breakpoints (e.g. 360/390/430 handsets, 768 tablet) and use Astryx's
  *capability-based* idea (pointer: coarse) rather than copying its numbers
  as layout breakpoints.

## 7. What this means for the prompt-optimizer design system (one paragraph)

Take Astryx's *system shape* — semantic tokens, `light-dark()` colour pairs,
surface hierarchy, 14×1.2^step type with a 16px coarse-pointer floor,
4px spacing, 6/10/12/28 radii, 125/300/700 motion with a reduced-motion
rule, frame-first layout, rows-not-cards for dense data, adaptive
Selector-as-bottom-sheet, and the WCAG 2.2 AA + focus-trap discipline —
and re-express it in Tailwind 4 `@theme` tokens + Naive UI theme overrides
for Vue 3. Do not import anything from `@astryxdesign/*`, do not copy
Neutral's monochrome accent or Figtree, and verify contrast per
component/state in the Vue build (spot checks in §1.7 pass AA, but they are
not a substitute for the per-component contrast profiles Astryx itself
requires).
