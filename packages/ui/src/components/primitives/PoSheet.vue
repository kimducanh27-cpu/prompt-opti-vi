<!-- PoSheet — the bottom-sheet primitive (design-system §3, §2.4).
     Wraps components/common/AdaptiveModal.vue with presentation="sheet" —
     never NModal directly, and never a second overlay mechanism.
     Mobile (compact): bottom sheet, max 90dvh, 44px close, sticky header
       (header is flex-shrink: 0, content scrolls — see compact/overlay.css),
       safe-area bottom padding. Drag-to-close: a pointer drag from the
       sheet header pulls the card down and releases past 120px to close
       (Slice 5); close is also via the 44px button, Esc, mask tap, or the
       back gesture (useCompactModalBack, via AdaptiveModal).
     Desktop: centred card, max 720px wide (same cap as PoModal).
     Use PoSheet for pickers, menus, and short flows; PoModal for dialogs
     and editor pages. PoSelect's mobile branch reuses this component.
     Focus: Naive NModal traps focus while open; focus is restored to the
       element that opened the sheet when it closes (after-leave).
     NO nested modals: an editor opens as a NEW sheet page with Back
       (Slice 7 implements that flow) — never a sheet inside a sheet.
     Props: show (v-model), title, maskClosable (default true), closable
       (default true), maxWidth (default 720px).
     Slots: header, default, footer (forwarded to NModal card).
     Emits: update:show.
     States: open / closed. No raw hex — tokens only. -->
<template>
  <AdaptiveModal
    :show="show"
    preset="card"
    presentation="sheet"
    compact-class="po-sheet--compact"
    :title="title"
    :mask-closable="maskClosable"
    :closable="closable"
    :style="{ width: `min(${maxWidth}, calc(100vw - 32px))` }"
    @update:show="onUpdateShow"
    @after-leave="onAfterLeave"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </AdaptiveModal>
</template>

<script lang="ts">
// P-011: ONE shared document pointerdown listener for all PoSheet
// instances — module scope, NOT <script setup> scope. <script setup>
// executes once per component instance, so a Set/flag declared there is
// per-instance: each mounted sheet added its OWN document listener and
// every tap ran N identical `closest()` walks (one per mounted sheet).
// Declared here, in the plain <script> block, the set, the flag and the
// dispatcher are shared by every instance: the single document listener
// fans out to all registered per-instance handlers, so each tap runs
// exactly ONE `closest()` walk per handler, and the listener is attached
// once no matter how many sheets are mounted. Each instance still
// registers its own handler in the set (setup code below) and unregisters
// on unmount; the listener detaches when the set empties.
const dragPointerHandlers = new Set<(event: PointerEvent) => void>()
let sharedPointerDownAttached = false

const onSharedPointerDown = (event: PointerEvent) => {
  dragPointerHandlers.forEach((handler) => handler(event))
}

const attachSharedPointerDown = () => {
  if (sharedPointerDownAttached || typeof document === 'undefined') return
  document.addEventListener('pointerdown', onSharedPointerDown)
  sharedPointerDownAttached = true
}

const detachSharedPointerDown = () => {
  if (!sharedPointerDownAttached || typeof document === 'undefined') return
  document.removeEventListener('pointerdown', onSharedPointerDown)
  sharedPointerDownAttached = false
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import AdaptiveModal from '../common/AdaptiveModal.vue'
import { killMotion } from '../../utils/motion'
import { isTopmostOpenPoSheet, nextOpenPoSheetId, registerOpenPoSheet, unregisterOpenPoSheet } from '../../utils/po-sheet-stack'

const props = withDefaults(defineProps<{
  /** v-model: whether the sheet is open. */
  show?: boolean
  /** Sheet title. */
  title?: string
  /** Tapping the mask closes the sheet. */
  maskClosable?: boolean
  /** Show the close button. */
  closable?: boolean
  /** Desktop card max width (design-system §2.4 caps it at 720px). */
  maxWidth?: string
}>(), {
  show: false,
  title: undefined,
  maskClosable: true,
  closable: true,
  maxWidth: '720px',
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'after-leave'): void
}>()

// EU05-03: forward the modal's after-leave so a caller can act once the
// sheet is fully closed (focus trap released). Purely additive — existing
// callers are unaffected.
const onAfterLeave = () => {
  restoreFocus()
  emit('after-leave')
}

// Focus restore: remember what opened the sheet, give focus back on close.
const lastFocused = ref<Element | null>(null)
// L-08: unique id for this instance, registered in open order while the
// sheet is open (see po-sheet-stack.ts).
const poSheetId = nextOpenPoSheetId()
watch(
  () => props.show,
  (next) => {
    if (next) {
      lastFocused.value = document.activeElement
      registerOpenPoSheet(poSheetId)
    } else {
      unregisterOpenPoSheet(poSheetId)
    }
  },
  { immediate: true },
)

const onUpdateShow = (value: boolean) => {
  emit('update:show', value)
}

// P-011: the shared listener machinery (handler set, attached flag,
// dispatcher, attach/detach) lives in the plain <script> block above, in
// module scope, so all instances share ONE document listener. Each
// mounted instance registers its own handler in that set below.

// ---- Drag-to-close (Slice 5, design-system §2.4) ----
// Pointer drag from the sheet header pulls the card down; releasing past
// the threshold closes it. Header-only, so content scrolling is untouched.
// The card is teleported (NModal), so the pointerdown is caught by
// delegation on document — no per-open query, no mount-timing race. When
// the sheet is a desktop card (no .po-sheet--compact hook) or the
// AdaptiveModal test stub renders, no header matches and this is a no-op.
const DRAG_CLOSE_THRESHOLD = 120
let dragState: { startY: number; currentY: number; card: HTMLElement } | null = null

const onDragMove = (event: PointerEvent) => {
  if (!dragState) return
  const deltaY = Math.max(0, event.clientY - dragState.startY)
  dragState.currentY = deltaY
  dragState.card.style.transform = deltaY > 0 ? `translateY(${deltaY}px)` : ''
}

const onDragEnd = () => {
  if (!dragState) return
  const { currentY, card } = dragState
  dragState = null
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', onDragEnd)
    window.removeEventListener('pointercancel', onDragEnd)
  }
  card.style.transform = ''
  if (currentY > DRAG_CLOSE_THRESHOLD) emit('update:show', false)
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!props.show) return
  // L-08: only the topmost open sheet may start a drag-to-close. The
  // document listener fans a header pointerdown out to every mounted
  // instance, and `closest()` finds the SAME (inner) header for each of
  // them — without this guard every open instance would start a drag on
  // that card and close on release, so a nested-sheet drag would close
  // both sheets. Single-sheet behaviour is unchanged: the only open sheet
  // IS the topmost one.
  if (!isTopmostOpenPoSheet(poSheetId)) return
  if (event.button !== undefined && event.button !== 0) return
  const target = event.target instanceof Element ? event.target : null
  const header = target?.closest('.po-sheet--compact > .n-card-header') as HTMLElement | null
  if (!header) return
  const card = header.closest('.po-sheet--compact') as HTMLElement | null
  if (!card) return
  // S7-4 (M1): a drag starting inside the enter window would fight
  // any enter motion — kill motion first; the drag then owns the transform outright.
  // then owns the transform outright. Killing mid-tween skips the tween's
  // clearProps, so also clear the inline opacity here — otherwise a kill
  // at opacity 0.4 would leave the card semi-transparent after the drag
  // (transform self-heals: onDragMove rewrites it every move and onDragEnd
  // resets it to '').
  killMotion(card)
  card.style.opacity = ''
  dragState = { startY: event.clientY, currentY: 0, card }
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragEnd)
  window.addEventListener('pointercancel', onDragEnd)
}

if (typeof document !== 'undefined') {
  dragPointerHandlers.add(onDocumentPointerDown)
  attachSharedPointerDown()
}

const detachDrag = () => {
  if (dragState) {
    dragState.card.style.transform = ''
    dragState = null
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', onDragEnd)
    window.removeEventListener('pointercancel', onDragEnd)
  }
}

onBeforeUnmount(() => {
  detachDrag()
  dragPointerHandlers.delete(onDocumentPointerDown)
  if (dragPointerHandlers.size === 0) detachSharedPointerDown()
  // L-08: unmounting while open must not leave a stale entry behind.
  unregisterOpenPoSheet(poSheetId)
})

const restoreFocus = () => {
  const el = lastFocused.value
  lastFocused.value = null
  if (el instanceof HTMLElement && el !== document.body && document.contains(el)) {
    el.focus()
    return
  }
  // R3C-02: the opener is often already unmounted when the sheet closes
  // (e.g. the History menu item inside the menu sheet, which closed when
  // History opened) — restoring to a dead node drops focus to <body>.
  // Fall back to the global Menu button, the stable entry point the menu
  // opened from (the same target Model Manager's Esc already lands on).
  // No-op on desktop, where the compact menu button doesn't exist.
  const menuButton = document.querySelector<HTMLElement>('[data-testid="compact-global-menu"]')
  menuButton?.focus()
}
</script>

<style>
/* Non-scoped: the teleported NModal card has no parent scope id, so the
   compact hook class (see AdaptiveModal compactClass) is the only selector
   that reaches it. Mobile sheet cap: 90dvh (design-system §2.4). */
.workspace-compact .po-sheet--compact.n-card {
  max-height: 90dvh;
}

/* The header is the drag-to-close handle: do not let the browser claim a
   touch drag starting here as a scroll gesture, or the pointer events the
   drag listens for never arrive (they end as pointercancel instead). */
.workspace-compact .po-sheet--compact > .n-card-header {
  touch-action: none;
}

.workspace-compact .po-sheet--compact > .n-card-header > .n-base-close {
  width: var(--touch-target-min);
  height: var(--touch-target-min);
}
</style>
