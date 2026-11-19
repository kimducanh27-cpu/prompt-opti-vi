<!-- PoBanner — the in-page banner primitive (design-system §3, §5).
     For info / success / warning / error messages INSIDE a page (not a toast).
     Status is never colour alone: every banner has an icon + text, and
     error/warning use role="alert", info/success use role="status".
     Props: type (info | success | warning | error), title, dismissible
       (shows a close button; dismissLabel is then required — warns in dev
       when missing).
     Slots: default (banner body text), title (replaces the title prop).
     Emits: dismiss (when the close button is pressed).
     States: rest / hover (close button) / focus-visible (accent ring).
     No raw hex — status tokens only; the only px value is the 2px focus
     outline (plus a 2px icon alignment offset). -->
<template>
  <div ref="bannerRef" class="po-banner" :class="`po-banner--${type}`" :role="type === 'error' || type === 'warning' ? 'alert' : 'status'">
    <component :is="icon" class="po-banner__icon" aria-hidden="true" />
    <div class="po-banner__body">
      <p v-if="title || $slots.title" class="po-banner__title">
        <slot name="title">{{ title }}</slot>
      </p>
      <div class="po-banner__text">
        <slot />
      </div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="po-banner__close"
      :aria-label="dismissLabel"
      @click="onDismissClick"
    >
      <X class="po-banner__close-icon" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { PhCheckCircle as CircleCheck, PhInfo as Info, PhWarning as TriangleAlert, PhXCircle as CircleX, PhX as X } from '@phosphor-icons/vue'
import { fadeIn, fadeOut, killMotion } from '../../utils/motion'

export type PoBannerType = 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(defineProps<{
  type?: PoBannerType
  /** Bold title line above the body. */
  title?: string
  /** Show a close button (emits dismiss). Requires dismissLabel. */
  dismissible?: boolean
  /** Accessible name of the close button. Required when dismissible is true. */
  dismissLabel?: string
}>(), {
  type: 'info',
  title: undefined,
  dismissible: false,
  dismissLabel: undefined,
})

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

// S7-4 (M2): appear fades + slides 8px over 200ms (opacity-only 150ms
// under reduced motion); dismiss fades out first and only then emits, so
// the parent unmounts a banner that is already invisible. Text is in the
// DOM at t=0 in both directions — only opacity/transform move, never
// autoAlpha. (Today the only caller, ArenaWorkspace, renders the banner
// non-dismissible via v-if; the dismiss path is implemented per the M2
// spec for future callers.)
const bannerRef = ref<HTMLElement | null>(null)
const dismissing = ref(false)

onMounted(() => {
  if (bannerRef.value) fadeIn(bannerRef.value)
})

onBeforeUnmount(() => {
  if (bannerRef.value) killMotion(bannerRef.value)
})

const onDismissClick = () => {
  if (dismissing.value || !bannerRef.value) return
  dismissing.value = true
  fadeOut(bannerRef.value, { onComplete: () => emit('dismiss') })
}

if (props.dismissible && !props.dismissLabel) {
  // Dev guard: a close button without a name is invisible to screen readers.
  console.warn('[PoBanner] dismissible banner requires the dismissLabel prop.')
}

const icon = computed(() => {
  switch (props.type) {
    case 'success': return CircleCheck
    case 'warning': return TriangleAlert
    case 'error': return CircleX
    case 'info':
    default: return Info
  }
})
</script>

<style scoped>
.po-banner {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-element);
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
}

.po-banner--info {
  background: var(--color-status-info-muted);
  color: var(--color-status-info-text);
}

.po-banner--success {
  background: var(--color-status-success-muted);
  color: var(--color-status-success-text);
}

.po-banner--warning {
  background: var(--color-status-warning-muted);
  color: var(--color-status-warning-text);
}

.po-banner--error {
  background: var(--color-status-error-muted);
  color: var(--color-status-error-text);
}

.po-banner__icon {
  flex: 0 0 auto;
  width: var(--text-body);
  height: var(--text-body);
  margin-top: 2px;
}

.po-banner__body {
  flex: 1 1 auto;
  min-width: 0;
}

.po-banner__title {
  margin: 0 0 var(--spacing-1);
  font-weight: 600;
  color: var(--color-text-primary);
}

.po-banner__text {
  color: var(--color-text-primary);
}

.po-banner__close {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--touch-target-min);
  height: var(--touch-target-min);
  margin: calc(var(--spacing-1) * -1) calc(var(--spacing-1) * -1) 0 0;
  border: 0;
  border-radius: var(--radius-element);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.po-banner__close:hover {
  background: var(--color-overlay-hover);
}

.po-banner__close:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.po-banner__close-icon {
  width: var(--text-body);
  height: var(--text-body);
}
</style>
