// L-08: registry of open PoSheet instances, in open order.
//
// Module-level on purpose: `<script setup>` state is per-instance, so the
// registry must live outside the component to be shared. Drag-to-close
// must only close the TOPMOST sheet: the shared document pointerdown
// listener fans a header pointerdown out to every mounted PoSheet
// instance, and `closest('.po-sheet--compact > .n-card-header')` finds the
// SAME (inner) header for each of them — without a topmost check every
// open instance would start a drag on that card and close on release, so
// a drag on a nested sheet would close both sheets. Today there is no live
// nesting (PoSheet's own header comment: "NO nested modals"), so this is a
// latent guard; single-sheet behaviour is unchanged because the only open
// sheet IS the topmost one.

const openSheetIds: number[] = []

let nextId = 0

/** Unique id for one PoSheet instance (the counter is module-level so ids never collide across instances). */
export const nextOpenPoSheetId = (): number => {
  nextId += 1
  return nextId
}

/** Record that a sheet opened (kept in open order; a re-open of an already-open sheet is a no-op). */
export const registerOpenPoSheet = (id: number): void => {
  if (!openSheetIds.includes(id)) openSheetIds.push(id)
}

/** Record that a sheet closed or unmounted. */
export const unregisterOpenPoSheet = (id: number): void => {
  const index = openSheetIds.indexOf(id)
  if (index !== -1) openSheetIds.splice(index, 1)
}

/** True when this sheet is the most recently opened sheet still open (or the only one). */
export const isTopmostOpenPoSheet = (id: number): boolean =>
  openSheetIds.length > 0 && openSheetIds[openSheetIds.length - 1] === id
