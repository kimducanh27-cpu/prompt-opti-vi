# DESIGN.md — Prompt Optimizer Mobile-First Design System (`v2.15.2-vi`)

## 1. Design System Overview & References

This document specifies the complete Mobile-First Design System for **Prompt Optimizer** ([linshenkx/prompt-optimizer](https://github.com/linshenkx/prompt-optimizer)), tailored for Vietnamese-speaking users (`vi-VN`) and optimized for modern high-DPI smartphones — with primary reference calibration for the **Honor Magic 6** (`BVL-AN00`, 1264×2800 physical resolution, `~412×915` to `421×933` CSS px viewport, 120Hz LTPO OLED, punch-hole top cutout, and gesture navigation bar) alongside mainstream mobile viewports (`360×669`, `393×852`, `430×932`) while preserving 100% of the desktop split-pane layout (`>= 1024px`).

### Explicit Design Borrowings & Rationale

| Source Repository / Spec | Borrowed Artifacts | Technical Rationale |
| :--- | :--- | :--- |
| **[Meta Astryx](https://github.com/meta/astryx)** ([Tokens Reference](https://astryx.atmeta.com/docs/tokens), [Color](https://astryx.atmeta.com/docs/color), [Typography](https://astryx.atmeta.com/docs/typography), [Spacing](https://astryx.atmeta.com/docs/spacing)) | 1. **Layered Surface Hierarchy**: `body → surface → card → popover`<br>2. **15-Step 4px Spacing Scale**: `--po-space-0` (`0rem`) to `--po-space-12` (`3rem`)<br>3. **Geometric Type Scale & 4px Grid Leading**: Base `14px` (`0.875rem`) with `16px` mobile input floor<br>4. **4dp Radius Scale**: `--po-radius-inner` (`8px`), `--po-radius-element` (`12px`), `--po-radius-container` (`16px`), `--po-radius-sheet` (`18px`)<br>5. **Motion Tokens**: `--po-duration-fast` (`175ms`), `--po-duration-medium` (`300ms`), `--po-ease-standard` (`cubic-bezier(0.24, 1, 0.4, 1)`), `--po-ease-exit` (`cubic-bezier(0.3, 0, 0.6, 0.6)`) | Eliminates disconnected hex values across `naive-theme.ts`, `tailwind.config.js`, and `compact/*.css`. Enforces a strict `16px` font-size floor on `<input>` and `<textarea>` so mobile browsers never trigger involuntary viewport zoom on focus. |
| **[GitHub Primer Primitives](https://github.com/primer/primitives/blob/main/DESIGN_TOKENS_GUIDE.md)** | 1. **Semantic Foreground/Background Pairing Matrix**: WCAG AA contrast (`>= 4.5:1` normal text, `>= 3.0:1` large text & UI controls)<br>2. **Shadow ↔ Z-Index Alignment**: Strict pairing between elevation shadows and stacking layers (`sticky`, `dropdown`, `overlay`, `modal`, `popover`)<br>3. **5 Mandatory Interactive States**: `Rest`, `Hover`, `:focus-visible` (never `:focus` alone), `Active`, `Disabled` (never via `opacity` alone)<br>4. **Reduced Motion Guard**: `@media (prefers-reduced-motion: reduce)` | Prevents Naive UI teleported overlays (select menus, bottom sheets, fullscreen editors) from colliding when the mobile virtual keyboard (`visualViewport`) opens, and guarantees keyboard/screen-reader accessibility. |

---

## 2. Design Tokens (`packages/ui/src/styles/tokens.css`)

### 2.1. Color & Layered Surface Tokens (All 5 Themes)

Every component consumes semantic CSS Custom Properties (`--po-color-*`) mapped across all 5 application themes (`light`, `dark`, `blue`, `green`, `purple`). Legacy `--compact-*` and Tailwind `--color-*` variables alias directly to these tokens for zero-regression compatibility.

| Token Name | Semantic Role | Light (Default) | Dark | Blue (Ocean) | Green (Emerald) | Purple (Royal) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--po-color-bg-body` | App canvas background | `#f5f6f8` | `#0f172a` | `#f0f7ff` | `#f0fdf9` | `#faf5ff` |
| `--po-color-bg-surface` | Primary workspace pane | `#ffffff` | `#182030` | `#f8fbff` | `#f7fefa` | `#fcfaff` |
| `--po-color-bg-card` | Elevated card / container | `#ffffff` | `#1e293b` | `#ffffff` | `#ffffff` | `#ffffff` |
| `--po-color-bg-popover` | Dropdown / sheet / modal | `#ffffff` | `#243044` | `#ffffff` | `#ffffff` | `#ffffff` |
| `--po-color-bg-muted` | Input fill / subtle pill | `#f4f6f9` | `#293548` | `#e8f2ff` | `#e6f9f1` | `#f3e8ff` |
| `--po-color-text-primary` | Primary body & headings | `#1f2933` | `#f1f5f9` | `#0f2942` | `#063626` | `#2e1065` |
| `--po-color-text-secondary`| Labels & supporting copy | `#4b5563` | `#cbd5e1` | `#3b5978` | `#2d5a4c` | `#5b3e85` |
| `--po-color-text-muted` | Placeholders & captions | `#687587` | `#94a3b8` | `#5e7a99` | `#527d6f` | `#7c63a3` |
| `--po-color-text-disabled` | Disabled control text | `#9ca3af` | `#64748b` | `#94a9c4` | `#8ab0a3` | `#a896c4` |
| `--po-color-accent` | Primary brand / active CTA | `#3b4859` | `#3b82f6` | `#0284c7` | `#059669` | `#7c3aed` |
| `--po-color-accent-hover` | Hover state for accent | `#2d3748` | `#60a5fa` | `#0369a1` | `#047857` | `#6d28d9` |
| `--po-color-accent-pressed`| Active/pressed accent | `#1f2933` | `#2563eb` | `#075985` | `#065f46` | `#5b21b6` |
| `--po-color-accent-muted` | Subtle active tint | `rgba(59,72,89,0.10)` | `rgba(59,130,246,0.16)` | `rgba(2,132,199,0.12)` | `rgba(5,150,105,0.12)` | `rgba(124,58,237,0.12)` |
| `--po-color-on-accent` | Foreground on accent fill | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` |
| `--po-color-border` | Hairline divider / border | `#e5e7eb` | `#334155` | `#d8e8f8` | `#d1fae5` | `#e9d5ff` |
| `--po-color-border-strong` | Emphasized input/card edge| `#cbd5e1` | `#475569` | `#93c5fd` | `#6ee7b7` | `#c4b5fd` |
| `--po-color-info` | Info semantic status | `#0284c7` | `#38bdf8` | `#0284c7` | `#0284c7` | `#0284c7` |
| `--po-color-success` | Success semantic status | `#059669` | `#10b981` | `#059669` | `#059669` | `#059669` |
| `--po-color-warning` | Warning semantic status | `#d97706` | `#f59e0b` | `#d97706` | `#d97706` | `#d97706` |
| `--po-color-error` | Error / destructive status| `#dc2626` | `#f87171` | `#dc2626` | `#dc2626` | `#dc2626` |

### 2.2. Typography Tokens (Vietnamese Diacritic-Safe)

Vietnamese uses stacked diacritics (`ấ`, `ệ`, `ử`, `ẵ`) that clip when rendered with CJK-first font stacks or tight line-heights (`< 1.35`).

* **Font Stacks**:
  * `--po-font-sans`: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans', 'Helvetica Neue', Arial, sans-serif`
  * `--po-font-mono`: `'JetBrains Mono', 'SF Mono', 'Cascadia Code', Consolas, 'Liberation Mono', monospace`
* **Type Scale & Line-Height (4px Grid Aligned)**:
  * `--po-text-2xs`: `0.6875rem` (`11px`) / `line-height: 16px` (`1.45`) — Micro badges & shortcuts
  * `--po-text-xs`: `0.75rem` (`12px`) / `line-height: 16px` (`1.33`) — Metadata, timestamps, status labels
  * `--po-text-sm`: `0.8125rem` (`13px`) / `line-height: 20px` (`1.54`) — Secondary controls, compact tags, form hints
  * `--po-text-base`: `0.875rem` (`14px`) / `line-height: 20px` (`1.43`) — Default UI body & buttons
  * `--po-text-input-mobile`: `1rem` (`16px`) / `line-height: 24px` (`1.50`) — **Mandatory mobile input/textarea floor**
  * `--po-text-lg`: `1.0625rem` (`17px`) / `line-height: 24px` (`1.41`) — Sheet & card titles
  * `--po-text-xl`: `1.25rem` (`20px`) / `line-height: 28px` (`1.40`) — Page headings

### 2.3. Spacing, Radius, Size, Elevation & Motion Tokens

* **Spacing Scale (4px base unit)**:
  * `--po-space-0`: `0px`
  * `--po-space-0-5`: `2px` (`0.125rem`)
  * `--po-space-1`: `4px` (`0.25rem`)
  * `--po-space-1-5`: `6px` (`0.375rem`)
  * `--po-space-2`: `8px` (`0.5rem`)
  * `--po-space-2-5`: `10px` (`0.625rem`)
  * `--po-space-3`: `12px` (`0.75rem`)
  * `--po-space-4`: `16px` (`1rem`)
  * `--po-space-5`: `20px` (`1.25rem`)
  * `--po-space-6`: `24px` (`1.5rem`)
  * `--po-space-8`: `32px` (`2rem`)
  * `--po-space-10`: `40px` (`2.5rem`)
  * `--po-space-12`: `48px` (`3rem`)
* **Radius Scale**:
  * `--po-radius-none`: `0px`
  * `--po-radius-sm`: `8px` (inner badges, code blocks, tags)
  * `--po-radius-md`: `10px` (buttons, inputs, selects)
  * `--po-radius-lg`: `12px` (cards, panels, region switch pills)
  * `--po-radius-xl`: `16px` (dialogs, floating cards)
  * `--po-radius-sheet`: `18px 18px 0 0` (mobile bottom sheets)
  * `--po-radius-full`: `9999px` (pills, status dots, circular icon buttons)
* **Interactive Control Sizes & Touch Targets**:
  * `--po-size-control-sm`: `32px` (Desktop compact only)
  * `--po-size-control-md`: `38px` (Desktop default)
  * `--po-touch-target`: `44px` (**Minimum mobile hit target for all buttons, selects, and icons**)
  * `--po-touch-target-lg`: `48px` (**Primary mobile CTA, bottom region switch, and sheet list rows**)
* **Elevation & Z-Index Pairing**:
  * `--po-z-sticky: 20` ↔ `--po-shadow-resting: 0 1px 2px rgba(15, 23, 42, 0.06)`
  * `--po-z-dropdown: 1000` ↔ `--po-shadow-floating-sm: 0 4px 12px rgba(15, 23, 42, 0.10)`
  * `--po-z-sheet: 2000` ↔ `--po-shadow-floating-md: 0 -4px 24px rgba(15, 23, 42, 0.14)`
  * `--po-z-modal: 2100` ↔ `--po-shadow-floating-lg: 0 12px 36px rgba(15, 23, 42, 0.20)`
  * `--po-z-toast: 3000`
* **Motion & Focus Tokens**:
  * `--po-duration-micro`: `100ms`
  * `--po-duration-fast`: `175ms`
  * `--po-duration-medium`: `300ms`
  * `--po-ease-standard`: `cubic-bezier(0.24, 1, 0.4, 1)`
  * `--po-ease-exit`: `cubic-bezier(0.3, 0, 0.6, 0.6)`
  * `--po-focus-ring`: `2px solid var(--po-color-accent)`
  * `--po-focus-offset`: `2px`

---

## 3. Core Component Specifications

1. **Buttons (`NButton`, `.compact-main-menu`, `.workspace-utility-button`, `.compact-mode-choice`)**:
   - Mobile minimum hit area: `min-height: var(--po-touch-target)` (`44px`), `min-width: var(--po-touch-target)` (`44px`) for icon buttons.
   - Interactive states: `Rest`, `:hover`, `:focus-visible` (`outline: var(--po-focus-ring)`), `:active` (`transform: scale(0.98)`), `:disabled` (semantic disabled tokens, `cursor: not-allowed`).
   - Touch optimization: `touch-action: manipulation; -webkit-tap-highlight-color: transparent`.
2. **Inputs & Selects (`NInput`, `NSelect`, `InputPanel`, `VariableAwareInput`)**:
   - Mobile font size strictly `var(--po-text-input-mobile)` (`16px`), `line-height: 1.5` (`24px`), `border-radius: var(--po-radius-md)` (`10px`).
   - Select triggers on mobile (`isCompact`): `min-height: var(--po-touch-target)` (`44px`) across all workspaces (removing the conflicting `36px` override in `workspace.css`).
3. **Cards & Workspaces (`NCard`, `OptimizeWorkspaceLayout`, `TestWorkspaceLayout`, `ArenaWorkspace`)**:
   - Mobile workspace panes maximize vertical reading space with `padding: 0 var(--po-space-4) var(--po-space-2)` (`16px` horizontal, `12px` on `< 360px`).
   - **Arena Mode Mobile Adaptation (`ArenaWorkspace.vue`)**: On `< 1024px`, contestant columns use horizontal CSS scroll-snap (`scroll-snap-type: x mandatory; --arena-column-min-width: min(86vw, 360px)`) with `44px` touch-friendly toolbar buttons and model selectors so users on an Honor Magic 6 (`~412px` width) can swipe cleanly between Model A / Model B columns without crushed controls.
4. **Modals, Sheets & Overlays (`AdaptiveModal.vue`, `overlay.css`)**:
   - `presentation="page"`: Fullscreen mobile surface (`100vw × var(--compact-viewport-height, 100dvh)`), header padded with `max(14px, env(safe-area-inset-top))`, footer padded with `max(16px, env(safe-area-inset-bottom))`.
   - `presentation="sheet"`: Bottom-anchored sheet (`border-radius: var(--po-radius-sheet)`, `max-height: calc(var(--compact-viewport-height, 100dvh) - 16px)`, `overscroll-behavior: contain`).
   - `presentation="picker"`: Centered selection modal (`width: min(94vw, 520px)`).
5. **Navigation (`CompactNavigation.vue`, `WorkspaceRegionSwitch.vue`)**:
   - Top bar (`CompactNavigation`): `min-height: 56px` plus `padding-top: max(6px, env(safe-area-inset-top))` so punch-hole cameras / status bars never clip the header.
   - Mode Switcher Sheet (`.compact-mode-grid--three`): Uses `grid-template-columns: repeat(auto-fit, minmax(112px, 1fr))` on narrow viewports so multi-word Vietnamese mode labels (*"Văn bản sang Ảnh"*, *"Ảnh sang Ảnh"*, *"Đa hình ảnh"*) wrap cleanly without horizontal overflow.
   - Bottom Region Switch (`WorkspaceRegionSwitch`): 2-column sticky bottom bar (`min-height: 48px` buttons) with `padding-bottom: max(8px, env(safe-area-inset-bottom))` for Android/iOS gesture bars.
6. **Toasts, Alerts & Form States (`Toast.vue`, `NAlert`, `NFormItem`, `NEmpty`)**:
   - Error banners use semantic `--po-color-error` border/text with `role="alert"`.
   - Empty states provide clear localized Vietnamese guidance and a primary action button (`>= 44px` height).

---

## 4. Mobile-First Responsive Rules & Viewport Matrix

### Unified Breakpoints (`useResponsive.ts` & `useWorkspaceLayout.ts`)

| Breakpoint Tier | Width Range | Layout Mode | Target Devices |
| :--- | :--- | :--- | :--- |
| **`xs`** | `< 360px` | Compact Mobile (Single-column fallback grids) | Compact phones, split-screen mobile windows |
| **`sm`** | `360px – 639px` | **Primary Mobile-First Target (`isCompact = true`)** | **Honor Magic 6 (`390–421px` CSS width)**, iPhone 15/16 (`393–430px`), Pixel 7/8 (`412px`) |
| **`md`** | `640px – 1023px`| Compact Tablet / Foldable (`isCompact = true`, 2-col test cards) | Honor Magic V2/V3 inner/landscape, iPad Mini portrait |
| **`lg`** | `1024px – 1279px`| Desktop Split-Pane (`isCompact = false`, 2–3 test columns) | Laptops, tablets in landscape |
| **`xl`** | `>= 1280px` | Wide Desktop Split-Pane (`isCompact = false`, up to 4 test columns)| Desktop monitors (`1440p+`) |

### Virtual Keyboard & Safe-Area Handling
- **`visualViewport` Tracking**: `useWorkspaceLayout.ts` monitors `window.visualViewport.height` and `offsetTop`, shrinking `--compact-viewport-height` when the IME keyboard opens (`height delta > 150px` at `scale ≈ 1`) while keeping pinch-to-zoom intact.
- **Safe-Area Insets**: `viewport-fit=cover` in `packages/web/index.html` paired with `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)`, and `env(safe-area-inset-right)` across `navigation.css` and `overlay.css`.
