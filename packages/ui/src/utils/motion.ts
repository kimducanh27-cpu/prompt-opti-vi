/**
 * Shared GSAP motion helper (step 7, PLAN §4.4.1).
 *
 * Thesis (impeccable `animate.md`, Operate mode): this is a tool UI, so motion
 * serves feedback, state, and continuity — routine transitions stay fast.
 * The ONE authored sequence is the Optimize run → output reveal (`revealOutput`,
 * M3). Everything else is quiet continuity (`enterSheet`, `revealList`,
 * `crossfade`, `fadeIn`). No page-load choreography, no loops, no
 * ScrollTrigger (D12), no button-press scale (D7), toasts stay Naive (D9).
 *
 * Rules every helper enforces:
 * - Transforms + opacity only; never layout props, never `autoAlpha`
 *   (`autoAlpha` sets `visibility:hidden`, which breaks E2E `toBeVisible()`
 *   assertions — text stays in the DOM at t=0 and only opacity moves).
 * - `overwrite: 'auto'` so repeat runs never stack tweens on the same
 *   elements; `clearProps` on complete so GSAP never leaves a `transform`
 *   behind (PoSheet drag-to-close reads the card's transform).
 * - `prefers-reduced-motion` (D10): opacity-only fade at the fast token
 *   (150ms), zero spatial movement, no stagger. `isReducedMotion()` reads
 *   `window.matchMedia` live at call time, so toggling the OS setting
 *   mid-session takes effect on the next animation.
 *
 * All GSAP calls in the app go through this module — no ad-hoc `gsap.to`
 * scattered across components. Wired in S7-4 / S7-5 into `AdaptiveModal`,
 * `PoBanner`, `OutputDisplayCore`, tabs, and lists.
 */
import gsap from 'gsap'

/** Timing tokens (design system §1.3): fast 125ms / medium 300ms. */
export const MOTION_FAST = 0.125
export const MOTION_MEDIUM = 0.3
/** Reduced-motion fade (D10): opacity only, no movement, no stagger. */
export const MOTION_REDUCED_FADE = 0.15

export const MOTION_EASE = 'power3.out'

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

gsap.defaults({ duration: MOTION_MEDIUM, ease: MOTION_EASE })

/** Live reduced-motion state — read at call time, never cached. */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(REDUCE_MOTION_QUERY).matches
}

/** Kill any in-flight tweens on the given targets (repeat-run safety). */
export function killMotion(targets: gsap.TweenTarget): void {
  gsap.killTweensOf(targets)
}

function toElementArray(targets: gsap.TweenTarget): Element[] {
  return gsap.utils.toArray<Element>(targets as never)
}

export interface EnterSheetOptions {
  duration?: number
}

/**
 * M1 — sheet / modal card entrance (GSAP enter-only, D8; Naive owns the exit).
 * Normal: `y:24 → 0` + scale .5→1 + opacity over 300ms. Reduced: opacity-only 150ms.
 *
 * Uses `fromTo` (not `from`) with EXPLICIT end values on purpose: Naive's
 * `fade-in-scale-up-transition-enter-from` class sets `opacity: 0` and
 * `scale(.5)` on the card while it mounts, so `gsap.from()` would read its
 * end values from computed style (opacity 0, scale .5) and tween opacity
 * 0 → 0, ending at scale .5 before `clearProps` popped it to 1. `fromTo`
 * is immune to that mount-timing race. The matching CSS override in
 * `AdaptiveModal.vue` kills Naive's enter-active transition (leave intact),
 * so GSAP's inline writes are never transitioned by Naive's CSS.
 *
 * Scale is part of the fromTo on purpose (S7-MOTION-01): Naive's modal
 * enter is `fadeInScaleUpTransition({ enterScale: '.5' })`
 * (`naive-ui/es/modal/src/styles/index.cssr.mjs`), NOT the function's
 * `.9` default — the earlier `.9` claim in this comment was wrong. Without
 * scale in the tween, GSAP preserved the computed scale .5 for the whole
 * enter and `clearProps` popped it to 1 in a single frame. Animating
 * scale .5→1 matches Naive's native grow and removes the pop.
 */
export function enterSheet(
  card: gsap.TweenTarget,
  options: EnterSheetOptions = {},
): gsap.core.Tween {
  const duration = options.duration ?? MOTION_MEDIUM
  if (isReducedMotion()) {
    return gsap.fromTo(
      card,
      { opacity: 0 },
      {
        opacity: 1,
        duration: MOTION_REDUCED_FADE,
        overwrite: 'auto',
        clearProps: 'opacity',
      },
    )
  }
  return gsap.fromTo(
    card,
    { y: 24, scale: 0.5, opacity: 0 },
    {
      y: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease: MOTION_EASE,
      overwrite: 'auto',
      clearProps: 'transform,opacity',
    },
  )
}

export interface RevealListOptions {
  duration?: number
  stagger?: number
  maxRows?: number
}

/**
 * M5 / M7 — list mount stagger (favorites / history / templates / models /
 * arena rows). First mount only, never on scroll. Normal: `y:8 → 0` +
 * opacity, stagger 0.03, first 10 rows only. Reduced: opacity-only, no stagger.
 */
export function revealList(
  rows: gsap.TweenTarget,
  options: RevealListOptions = {},
): gsap.core.Tween {
  const duration = options.duration ?? MOTION_MEDIUM
  const maxRows = options.maxRows ?? 10
  const targets = toElementArray(rows).slice(0, maxRows)
  if (isReducedMotion()) {
    return gsap.from(targets, {
      opacity: 0,
      duration: MOTION_REDUCED_FADE,
      overwrite: 'auto',
      clearProps: 'opacity',
    })
  }
  return gsap.from(targets, {
    y: 8,
    opacity: 0,
    duration,
    ease: MOTION_EASE,
    stagger: options.stagger ?? 0.03,
    overwrite: 'auto',
    clearProps: 'transform,opacity',
  })
}

export interface RevealOutputOptions {
  duration?: number
  stagger?: number
  maxAddedDelay?: number
}

/**
 * M3 — FOCAL: optimize output reveal (the output content area in
 * `OutputDisplayCore` — S7-5 re-scoped M3: there are no version cards).
 * Normal: `y:8 → 0` + opacity, stagger 0.05 (0 for a single target),
 * total added delay capped at 0.25s. Reduced: opacity-only, no stagger,
 * all at once.
 */
export function revealOutput(
  cards: gsap.TweenTarget,
  options: RevealOutputOptions = {},
): gsap.core.Tween {
  const duration = options.duration ?? MOTION_MEDIUM
  const targets = toElementArray(cards)
  if (isReducedMotion()) {
    return gsap.from(targets, {
      opacity: 0,
      duration: MOTION_REDUCED_FADE,
      overwrite: 'auto',
      clearProps: 'opacity',
    })
  }
  const each = options.stagger ?? 0.05
  const maxAddedDelay = options.maxAddedDelay ?? 0.25
  const stagger =
    targets.length > 1 ? Math.min(each, maxAddedDelay / (targets.length - 1)) : 0
  return gsap.from(targets, {
    y: 8,
    opacity: 0,
    duration,
    ease: MOTION_EASE,
    stagger,
    overwrite: 'auto',
    clearProps: 'transform,opacity',
  })
}

export interface CrossfadeOptions {
  duration?: number
}

/**
 * M4 — tab / segmented switch: incoming content cross-fades (opacity only,
 * no slide — avoids layout shift mid-switch). Reduced: instant (duration 0).
 */
export function crossfade(
  content: gsap.TweenTarget,
  options: CrossfadeOptions = {},
): gsap.core.Tween {
  const duration = isReducedMotion() ? 0 : (options.duration ?? MOTION_FAST)
  return gsap.fromTo(
    content,
    { opacity: 0 },
    {
      opacity: 1,
      duration,
      ease: MOTION_EASE,
      overwrite: 'auto',
      clearProps: 'opacity',
    },
  )
}

export interface FadeInOptions {
  duration?: number
  y?: number
}

/**
 * M2 / M6 — banner appear (`PoBanner`) and compare / evaluation reveal.
 * Normal: fade + `y:8 → 0` over 200ms. Reduced: opacity-only 150ms.
 */
export function fadeIn(
  el: gsap.TweenTarget,
  options: FadeInOptions = {},
): gsap.core.Tween {
  const duration = options.duration ?? 0.2
  if (isReducedMotion()) {
    return gsap.from(el, {
      opacity: 0,
      duration: MOTION_REDUCED_FADE,
      overwrite: 'auto',
      clearProps: 'opacity',
    })
  }
  return gsap.from(el, {
    y: options.y ?? 8,
    opacity: 0,
    duration,
    ease: MOTION_EASE,
    overwrite: 'auto',
    clearProps: 'transform,opacity',
  })
}

export interface FadeOutOptions {
  duration?: number
  onComplete?: () => void
}

/**
 * M2 dismiss — banner (or any in-page element) fade-out. Exit is ~⅔ of the
 * 200ms enter (≈130ms); reduced-motion fades opacity-only at 150ms (D10).
 * `clearProps` restores opacity afterwards, so a `v-show` parent that
 * re-shows the element later sees it fully visible again. Never `autoAlpha`.
 */
export function fadeOut(
  el: gsap.TweenTarget,
  options: FadeOutOptions = {},
): gsap.core.Tween {
  const duration = options.duration ?? 0.13
  if (isReducedMotion()) {
    return gsap.to(el, {
      opacity: 0,
      duration: MOTION_REDUCED_FADE,
      overwrite: 'auto',
      clearProps: 'opacity',
      onComplete: options.onComplete,
    })
  }
  return gsap.to(el, {
    opacity: 0,
    duration,
    ease: MOTION_EASE,
    overwrite: 'auto',
    clearProps: 'opacity',
    onComplete: options.onComplete,
  })
}
