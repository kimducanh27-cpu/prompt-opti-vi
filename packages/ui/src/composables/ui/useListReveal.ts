import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { killMotion, revealList } from '../../utils/motion'

/**
 * M5/M7 (step 7): reveal a list's rows once, on first mount with content.
 *
 * The caller supplies a row getter (scoped to its own list container, so a
 * row is never picked up from another list on the same page) and a
 * has-items getter. The reveal fires exactly once — the first time items
 * are present — and never again: not on scroll, not on pagination /
 * "Load more", not on filter changes, not when a drawer re-opens.
 *
 * All animation goes through `revealList` in `utils/motion.ts` (D10:
 * opacity-only fade 150ms, zero spatial movement, no stagger when
 * reduced-motion is on; 300ms stagger ≤ 0.55s total otherwise).
 */
export function useListReveal(
  getRows: () => Element[],
  hasItems: () => boolean,
): void {
  const revealed = ref(false)
  let revealedRows: Element[] = []

  const revealOnce = () => {
    if (revealed.value) return
    revealed.value = true
    void nextTick(() => {
      const rows = getRows()
      if (!rows.length) return
      revealedRows = rows
      revealList(rows)
    })
  }

  watch(hasItems, (ready) => {
    if (ready) revealOnce()
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (revealedRows.length) killMotion(revealedRows)
  })
}
