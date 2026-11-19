<template>
  <NModal v-bind="$attrs" :show="show" :preset="preset" :close-focusable="true"
    :class="[isCompact ? compactClass : undefined, 'adaptive-modal-enter', enterMarkerClass, { 'adaptive-modal-page': isCompact && presentation === 'page' && preset !== 'dialog',
      'adaptive-modal-picker': isCompact && presentation === 'picker',
      'adaptive-modal-sheet': isCompact && presentation === 'sheet' }]"
    @update:show="$emit('update:show', $event)">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </NModal>
</template>

<script lang="ts">
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

const enterMarkerClass = `adaptive-modal-enter-${++nextAdaptiveModalEnterId}`
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
