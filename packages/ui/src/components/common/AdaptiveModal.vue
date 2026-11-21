<template>
  <NModal v-bind="$attrs" :show="show" :preset="preset" :close-focusable="true"
    :class="[isCompact ? compactClass : undefined, 'adaptive-modal-gsap-enter', enterMarkerClass, { 'adaptive-modal-page': isCompact && presentation === 'page' && preset !== 'dialog',
      'adaptive-modal-picker': isCompact && presentation === 'picker',
      'adaptive-modal-sheet': isCompact && presentation === 'sheet' }]"
    @update:show="$emit('update:show', $event)">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </NModal>
</template>

<script lang="ts">
// S7-4 (M1): module-scope counter for the per-instance enter marker class
// (same pattern as PoSheet's module-scope drag machinery — <script setup>
// runs once per instance, so the counter must live outside it).
let nextAdaptiveModalEnterId = 0
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, watch } from 'vue'
import { toRef } from 'vue'
import { NModal, type ModalProps } from 'naive-ui'
import { useWorkspaceLayout } from '../../composables/ui/useWorkspaceLayout'
import { useCompactModalBack } from '../../composables/ui/useCompactModalBack'
import { enterSheet, killMotion } from '../../utils/motion'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  show?: boolean
  preset?: ModalProps['preset']
  presentation?: 'page' | 'picker' | 'dialog' | 'sheet'
  /** Opt-in mobile surface hook; Naive's teleported card has no parent scope ID. */
  compactClass?: string
}>(), { show: false, preset: 'card', presentation: 'page' })
const emit = defineEmits<{ 'update:show': [value: boolean] }>()
const { isCompact } = useWorkspaceLayout()
useCompactModalBack(toRef(props, 'show'), isCompact, () => emit('update:show', false))

// S7-4 (M1) — GSAP enter-only (D8): the card slides up + fades on open
// (300ms); Naive owns the exit, untouched. The card is teleported, so the
// per-instance marker class below is how this instance finds its own card:
// the module-scope counter is stable per instance, so a second modal
// opening while the first is still leaving can never animate the wrong card. `enterSheet`
// uses fromTo with explicit ends (see motion.ts) because Naive's
// enter-from class (opacity 0 / scale .5) is still applied at mount, and
// the CSS override below kills Naive's enter transition (leave intact) so
// GSAP's inline writes are never transitioned by Naive's CSS.
const enterMarkerClass = `adaptive-modal-gsap-enter-${++nextAdaptiveModalEnterId}`
let enterCard: HTMLElement | null = null

const animateEnter = async () => {
  await nextTick()
  const card = document.querySelector<HTMLElement>(`.n-modal.${enterMarkerClass}`)
  if (!card) return
  enterCard = card
  enterSheet(card)
}

watch(
  () => props.show,
  (next) => {
    if (next) void animateEnter()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (enterCard) killMotion(enterCard)
})
</script>

<style>
/* S7-4 (M1) — GSAP owns the card ENTER on AdaptiveModal cards only.
   Naive's `fade-in-scale-up-transition` would otherwise fight the GSAP
   enter tween: its enter-active transition (opacity + transform, .2s)
   transitions every inline write GSAP makes, smearing the tween, and its
   enter-from class (opacity 0 / scale .5) is what `enterSheet`'s fromTo
   is written against (scale .5→1, S7-MOTION-01). Killing ONLY the enter-active transition leaves
   Naive's leave transition (same classes, leave-active) fully intact, so
   close still fades + scales out as before. Non-scoped: the teleported
   card has no parent scope ID. */
.n-modal.adaptive-modal-gsap-enter.fade-in-scale-up-transition-enter-active {
  transition: none !important;
}
</style>
