<!-- PoModal — the general dialog primitive (design-system §3, §2.4).
     Wraps components/common/AdaptiveModal.vue (the de-facto modal standard,
     28 importers) — never NModal directly.
     Mobile (compact): bottom sheet, max 90dvh, 44px close, sticky header
       (presentation="sheet" + the po-modal--compact hook below).
     Desktop: centred card, max 720px wide.
     Focus: Naive NModal traps focus while open (trap-focus); this component
       restores focus to the element that opened it when the modal closes
       (after-leave). Closes on Esc, mask click (maskClosable), and the
       compact back gesture (useCompactModalBack, via AdaptiveModal).
     NO nested modals: an editor opens as a NEW sheet page with Back
       (Slice 7 implements that flow) — never a modal inside a modal.
     Props: show (v-model), title, maskClosable (default true), closable
       (default true), maxWidth (default 720px).
     Slots: header, default, footer, action (all forwarded to NModal card).
     Emits: update:show.
     States: open / closed. No raw hex — tokens only; the 720px cap is the
     design-system §2.4 desktop maximum, documented here. -->
<template>
  <AdaptiveModal
    :show="show"
    preset="card"
    :presentation="isCompact ? 'sheet' : 'page'"
    compact-class="po-modal--compact"
    :title="title"
    :mask-closable="maskClosable"
    :closable="closable"
    :style="{ width: `min(${maxWidth}, calc(100vw - 32px))` }"
    @update:show="onUpdateShow"
    @after-leave="restoreFocus"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </AdaptiveModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AdaptiveModal from '../common/AdaptiveModal.vue'
import { useWorkspaceLayout } from '../../composables/ui/useWorkspaceLayout'

const props = withDefaults(defineProps<{
  /** v-model: whether the modal is open. */
  show?: boolean
  /** Card title. */
  title?: string
  /** Clicking the mask closes the modal. */
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
}>()

const { isCompact } = useWorkspaceLayout()

// Focus restore: remember what opened the modal, give focus back on close.
const lastFocused = ref<Element | null>(null)
watch(
  () => props.show,
  (next) => {
    if (next) lastFocused.value = document.activeElement
  },
  { immediate: true },
)

const onUpdateShow = (value: boolean) => {
  emit('update:show', value)
}

const restoreFocus = () => {
  const el = lastFocused.value
  lastFocused.value = null
  if (el instanceof HTMLElement && document.contains(el)) {
    el.focus()
  }
}
</script>

<style>
/* Non-scoped: the teleported NModal card has no parent scope id, so the
   compact hook class (see AdaptiveModal compactClass) is the only selector
   that reaches it. Mobile sheet cap: 90dvh (design-system §2.4). */
.workspace-compact .po-modal--compact.n-card {
  max-height: 90dvh;
}

.workspace-compact .po-modal--compact > .n-card-header > .n-base-close {
  width: var(--touch-target-min);
  height: var(--touch-target-min);
}
</style>
