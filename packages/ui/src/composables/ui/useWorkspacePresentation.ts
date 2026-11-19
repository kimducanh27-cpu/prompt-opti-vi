import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { OptimizeWorkspaceHandle, WorkspaceScrollHandle } from '../../types/workspacePresentation'
import { useWorkspaceLayout } from './useWorkspaceLayout'
import { useWorkspaceViewState, type WorkspaceViewMode } from './useWorkspaceViewState'

/** Shared presentation orchestration for all seven workspaces. */

// P-008: wait for Naive's html scroll lock (inline overflow:hidden on
// <html>, held until a leaving modal's transition ends) to clear — via a
// MutationObserver on the style attribute, not a setTimeout polling loop.
// Resolves immediately when no lock is held, and at most once after a 1s
// fallback if the lock never clears via mutation.
const waitForScrollLockClear = () => new Promise<void>((resolve) => {
  if (typeof document === 'undefined' || document.documentElement.style.overflow !== 'hidden') {
    resolve()
    return
  }
  let settled = false
  const done = () => {
    if (settled) return
    settled = true
    observer.disconnect()
    clearTimeout(timer)
    resolve()
  }
  const observer = new MutationObserver(() => {
    if (document.documentElement.style.overflow !== 'hidden') done()
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
  const timer = setTimeout(done, 1000)
})

export function useWorkspacePresentation(mode: WorkspaceViewMode) {
  const { isCompact, compactInputRows } = useWorkspaceLayout()
  const state = useWorkspaceViewState(mode)
  const { region, configExpanded, optimizeScrollTop, testScrollTop } = state
  const optimizeLayoutRef = ref<OptimizeWorkspaceHandle | null>(null)
  const testLayoutRef = ref<WorkspaceScrollHandle | null>(null)
  let restoring = false
  let pendingRestore: Promise<void> | undefined
  let frame = 0
  let disposed = false
  const sources = [region, isCompact] as const

  const rememberOptimizeScroll = (event: Event) => {
    if (!restoring) optimizeScrollTop.value = (event.target as HTMLElement).scrollTop
  }
  const rememberTestScroll = (event: Event) => {
    if (!restoring) testScrollTop.value = (event.target as HTMLElement).scrollTop
  }

  // Capture the outgoing pane before v-show can clamp its scroll position.
  watch(sources, (_next, [oldRegion, compact]) => {
    if (!restoring) {
      if (optimizeLayoutRef.value && (!compact || oldRegion === 'optimize')) {
        optimizeScrollTop.value = optimizeLayoutRef.value.getScrollTop()
      }
      if (testLayoutRef.value && compact && oldRegion === 'test') {
        testScrollTop.value = testLayoutRef.value.getScrollTop()
      }
    }
    restoring = true
  }, { flush: 'sync' })

  const restoreScroll = () => {
    // A region change and an explicit navigation can request restoration in the
    // same Vue flush. Share that operation so a later watcher cannot undo a jump.
    if (pendingRestore) return pendingRestore
    restoring = true
    pendingRestore = (async () => {
      await nextTick()
      if (!disposed) {
        // PF1-NEW-01: the first set can clamp to the mount-time max because
        // content height grows after mount (async panes): desktop 150 was
        // restored as 76, while 50 restored exactly. Re-apply the SAME saved
        // value on successive frames and stop as soon as the read-back shows
        // it landed — no new value is ever invented. Bounded to 5 attempts
        // (first set + 4 retries); `restoring` stays true throughout so the
        // scroll events from the retries cannot overwrite the saved value
        // with a clamped intermediate. No interval is left running.
        const maxAttempts = 5
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          optimizeLayoutRef.value?.setScrollTop(optimizeScrollTop.value)
          testLayoutRef.value?.setScrollTop(testScrollTop.value)
          const optimizeLanded = !optimizeLayoutRef.value
            || optimizeLayoutRef.value.getScrollTop() >= optimizeScrollTop.value
          const testLanded = !testLayoutRef.value
            || testLayoutRef.value.getScrollTop() >= testScrollTop.value
          if (optimizeLanded && testLanded) break
          if (attempt < maxAttempts - 1) {
            // Wait one frame for layout to grow, then re-apply the same
            // value. The 100ms timeout is a fallback for a cancelled frame
            // (unmount) or a background tab (rAF paused) — the promise
            // always resolves.
            await new Promise<void>((resolve) => {
              let done = false
              const finish = () => {
                if (done) return
                done = true
                clearTimeout(timer)
                resolve()
              }
              frame = requestAnimationFrame(finish)
              const timer = setTimeout(finish, 100)
            })
            if (disposed) break
          }
        }
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => { restoring = false })
      }
      pendingRestore = undefined
    })()
    return pendingRestore
  }
  watch(sources, restoreScroll, { flush: 'post' })
  onMounted(restoreScroll)
  onUnmounted(() => {
    disposed = true
    cancelAnimationFrame(frame)
  })

  const resetTestScroll = () => {
    testScrollTop.value = 0
    testLayoutRef.value?.setScrollTop(0)
  }
  const showOptimization = () => {
    if (!isCompact.value) return
    region.value = 'optimize'
    optimizeScrollTop.value = 0
    void restoreScroll()
  }
  const showOptimizationSection = async (
    section: 'original' | 'workspace',
    anchor: 'section' | 'content' = 'section',
  ) => {
    if (!isCompact.value) return
    region.value = 'optimize'
    // Wait for v-show, unfolding and the shared reading-position restoration.
    await restoreScroll()
    if (disposed || !isCompact.value || region.value !== 'optimize') return
    const layout = optimizeLayoutRef.value
    if (!layout) return
    layout.scrollToSection(section, anchor)
    // The scroll event may still be suppressed while restoration is settling.
    // Save the new position explicitly for the next region or mode transition.
    optimizeScrollTop.value = layout.getScrollTop()
    // Slice 6a: with the stacked page-scroll layout, scrollIntoView scrolls
    // the document — but a leaving source-preview modal still holds Naive's
    // html scroll lock (inline overflow:hidden until its leave transition
    // ends, see naive-ui useLockHtmlScroll), which clamps this first scroll
    // to the current position. Only when that lock is actually held, wait
    // for it to clear and scroll again so the section lands at the
    // viewport top. When no modal is open the lock is clear and this block
    // is skipped entirely (a single scrollIntoView).
    if (
      typeof document !== 'undefined' &&
      document.documentElement.style.overflow === 'hidden'
    ) {
      await waitForScrollLockClear()
      if (!disposed && isCompact.value && region.value === 'optimize') {
        layout.scrollToSection(section, anchor)
        optimizeScrollTop.value = layout.getScrollTop()
      }
    }
  }
  const showTestResult = (id: 'a' | 'b' | 'c' | 'd', batch = false) => {
    // Later batch groups must not move the reader or override a manual expansion.
    if (!isCompact.value || (batch && id !== 'a')) return
    region.value = 'test'
    configExpanded.value = false
    testScrollTop.value = 0
    void restoreScroll()
  }

  const revealTestPane = async () => {
    // Slice 13: in the stacked compact layout the test pane sits below the
    // optimize pane in normal page flow, so a run that finishes below the
    // fold is invisible until the user scrolls. After a run completes,
    // scroll the test pane into view — but only when it is not already
    // fully visible, so a run started from the test pane itself never
    // yanks the page. Desktop is untouched (two-pane split, both visible).
    // No region switch: the stacked layout has no hidden pane.
    if (!isCompact.value || disposed || typeof document === 'undefined') return
    const isFullyVisible = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      return rect.top >= 0 && rect.bottom <= window.innerHeight
    }
    const scrollOnce = () => {
      const pane = document.querySelector('.compact-test-region')
      if (!(pane instanceof HTMLElement) || isFullyVisible(pane)) return
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth'
      pane.scrollIntoView({ behavior, block: 'start' })
    }
    scrollOnce()
    // Same Naive html-scroll-lock caveat as showOptimizationSection: a
    // leaving modal can clamp this first scroll; retry once it clears.
    if (document.documentElement.style.overflow === 'hidden') {
      await waitForScrollLockClear()
      if (!disposed && isCompact.value) scrollOnce()
    }
  }

  // L-09 (retained by design — do NOT delete this export or the scroll
  // machinery above): `mobileRegion` has exactly one consumer, the unit
  // spec `tests/unit/composables/useWorkspacePresentation.spec.ts`, whose
  // harness drives region-based v-show with it and asserts pane scroll
  // retention (140/320px) across region switches, responsive changes and
  // remounts. No production template reads it — the 7 workspaces render
  // both panes stacked on mobile (page scrolls; see the "No hidden pane,
  // no Optimize/Test region switch" comment in BasicSystemWorkspace.vue),
  // so a region switch is invisible there and `restoreScroll` is a no-op
  // on mobile (V-H runtime proof: scroll 160px → nav away/back → 0). On
  // desktop the machinery is LIVE: panes scroll internally
  // (`.optimize-workspace-layout { overflow: auto }` with definite
  // heights), `remember*Scroll` records real scrollTop and `restoreScroll`
  // restores it. Deleting it would regress desktop scroll retention and
  // break the spec.
  return {
    isCompact, compactInputRows, optimizeLayoutRef, testLayoutRef,
    mobileRegion: region, testConfigExpanded: configExpanded,
    inputCollapsed: state.inputCollapsed,
    rememberOptimizeScroll, rememberTestScroll,
    resetTestScroll, showOptimization, showOptimizationSection, showTestResult, revealTestPane, resetMobileView: state.resetView,
  }
}
