/**
 * Shared motion helper (synchronous, zero-latency replacement).
 *
 * All motion functions execute synchronously with zero latency.
 * Callbacks (such as onComplete) are invoked immediately, and mock
 * Tween objects are returned to maintain API compatibility without
 * any external animation library dependencies.
 */

/** Timing tokens (design system §1.3): fast 125ms / medium 300ms. */
export const MOTION_FAST = 0.125
export const MOTION_MEDIUM = 0.3
/** Reduced-motion fade: opacity only, no movement, no stagger. */
export const MOTION_REDUCED_FADE = 0.15

export const MOTION_EASE = 'power3.out'

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export type TweenTarget = Element | Element[] | NodeListOf<Element> | HTMLElement | string | null | undefined | unknown

export interface MockTween {
  kill: () => MockTween
  revert: () => MockTween
  pause: () => MockTween
  play: () => MockTween
  restart: () => MockTween
  resume: () => MockTween
  progress: (value?: number) => number | MockTween
  totalProgress: (value?: number) => number | MockTween
  time: (value?: number) => number | MockTween
  duration: (value?: number) => number | MockTween
  totalDuration: (value?: number) => number | MockTween
  then: <TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) => Promise<TResult1 | TResult2>
  eventCallback: (type: string, callback?: (...args: any[]) => void) => any
  [key: string]: any
}

export type Tween = MockTween

export function createMockTween(): MockTween {
  const tween: MockTween = {
    kill: () => tween,
    revert: () => tween,
    pause: () => tween,
    play: () => tween,
    restart: () => tween,
    resume: () => tween,
    progress: (val?: number) => (val === undefined ? 1 : tween),
    totalProgress: (val?: number) => (val === undefined ? 1 : tween),
    time: (val?: number) => (val === undefined ? 0 : tween),
    duration: (val?: number) => (val === undefined ? 0 : tween),
    totalDuration: (val?: number) => (val === undefined ? 0 : tween),
    then: (onfulfilled) => Promise.resolve().then(onfulfilled as any),
    eventCallback: (_type: string, cb?: (...args: any[]) => void) => {
      if (typeof cb === 'function') cb()
      return tween
    },
  }
  return tween
}

/** Live reduced-motion state — read at call time, never cached. */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(REDUCE_MOTION_QUERY).matches
}

/** Kill any in-flight animations on the given targets. Synchronous no-op. */
export function killMotion(_targets?: TweenTarget): void {
  // Synchronous no-op
}

export function fromTo(
  _targets?: TweenTarget,
  _fromVars?: Record<string, any>,
  toVars?: Record<string, any>,
): MockTween {
  if (toVars && typeof toVars.onStart === 'function') {
    toVars.onStart()
  }
  if (toVars && typeof toVars.onComplete === 'function') {
    toVars.onComplete()
  }
  return createMockTween()
}

export function from(
  _targets?: TweenTarget,
  vars?: Record<string, any>,
): MockTween {
  if (vars && typeof vars.onStart === 'function') {
    vars.onStart()
  }
  if (vars && typeof vars.onComplete === 'function') {
    vars.onComplete()
  }
  return createMockTween()
}

export function to(
  _targets?: TweenTarget,
  vars?: Record<string, any>,
): MockTween {
  if (vars && typeof vars.onStart === 'function') {
    vars.onStart()
  }
  if (vars && typeof vars.onComplete === 'function') {
    vars.onComplete()
  }
  return createMockTween()
}

export interface EnterSheetOptions {
  duration?: number
  onComplete?: () => void
}

export function enterSheet(
  _card?: TweenTarget,
  options: EnterSheetOptions = {},
): MockTween {
  options.onComplete?.()
  return createMockTween()
}

export interface RevealListOptions {
  duration?: number
  stagger?: number
  maxRows?: number
  onComplete?: () => void
}

export function revealList(
  _rows?: TweenTarget,
  options: RevealListOptions = {},
): MockTween {
  options.onComplete?.()
  return createMockTween()
}

export interface RevealOutputOptions {
  duration?: number
  stagger?: number
  maxAddedDelay?: number
  onComplete?: () => void
}

export function revealOutput(
  _cards?: TweenTarget,
  options: RevealOutputOptions = {},
): MockTween {
  options.onComplete?.()
  return createMockTween()
}

export interface CrossfadeOptions {
  duration?: number
  onComplete?: () => void
}

export function crossfade(
  _content?: TweenTarget,
  options: CrossfadeOptions = {},
): MockTween {
  options.onComplete?.()
  return createMockTween()
}

export interface FadeInOptions {
  duration?: number
  y?: number
  onComplete?: () => void
}

export function fadeIn(
  _el?: TweenTarget,
  options: FadeInOptions = {},
): MockTween {
  options.onComplete?.()
  return createMockTween()
}

export interface FadeOutOptions {
  duration?: number
  onComplete?: () => void
}

export function fadeOut(
  _el?: TweenTarget,
  options: FadeOutOptions = {},
): MockTween {
  options.onComplete?.()
  return createMockTween()
}
