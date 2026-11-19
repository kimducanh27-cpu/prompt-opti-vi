/** Shared icon defaults for web and extension surfaces.
 *
 * Step 7 migrated Lucide → Phosphor (`@phosphor-icons/vue`).
 * - `PHOSPHOR_ICON_DEFAULTS` is the Phosphor global default, applied via
 *   Vue `provide('size', …)` / `provide('weight', …)` in
 *   `PromptOptimizerApp.vue` — Phosphor icons read these through
 *   `inject()` and fall back to `size: "1em"`, `weight: "regular"`,
 *   `color: "currentColor"` when no provider is above them.
 *
 * Sizes: 14px for inline hints, 16px for actions, 18px for toolbar entries.
 * Larger illustrations/empty states keep their explicit size.
 * NIcon owns the size of wrapped icons; direct icons use the size prop.
 * Navigation emoji and third-party brand marks are intentionally independent.
 */

/** Phosphor global default — size 16, weight regular (D2). */
export const PHOSPHOR_ICON_DEFAULTS = {
  size: 16,
  weight: 'regular',
} as const
