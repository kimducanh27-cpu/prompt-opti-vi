<!-- PoButton — the only button primitive (design-system §3).
     Wraps Naive NButton + the tokens (tokens.css). App code must use this,
     not NButton directly and not raw <button>, for buttons.
     Props: variant primary | secondary | ghost | destructive;
       size sm | md | lg (Naive small | medium | large).
       iconOnly buttons REQUIRE the ariaLabel prop (warns in dev when missing).
       loading sets aria-busy and disables the button (no double-activation).
       loadingText prop and/or loading-text slot supply the text shown while
       loading (slot wins); otherwise the default slot stays visible.
     Slots: default (label), icon, loading-text.
     Emits: click (never fired while loading or disabled).
     States: rest / hover / focus-visible (accent ring, 3:1) / active /
       loading / disabled. Min height 36px desktop, 44px on coarse pointers
       (design-system §1.4); icon-only buttons also get 44px min-WIDTH on
       coarse pointers (UIUX-L03 — the 36px min-width was the coarse
       floor's blind spot). Under prefers-reduced-motion the transition
       is 0s (A11Y-N01 — it was 125ms, design-system §1.3). Sizes use the
       token scale; the only px value is the 2px focus outline. -->
<template>
  <NButton
    :type="naiveType"
    :size="naiveSize"
    :ghost="variant === 'ghost'"
    :loading="loading"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel"
    :attr-type="attrType"
    :round="round"
    :block="block"
    class="po-button"
    :class="{ 'po-button--icon-only': iconOnly }"
    @click="onClick"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="loading">
      <!-- loading-text slot wins; then the loadingText prop; then the label
           stays visible (spinner + label, no layout shift). -->
      <slot name="loading-text">
        <template v-if="loadingText">{{ loadingText }}</template>
        <slot v-else />
      </slot>
    </template>
    <slot v-else />
  </NButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'

export type PoButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
export type PoButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  /** Visual variant. destructive maps to Naive type="error". */
  variant?: PoButtonVariant
  /** sm -> Naive small, md -> medium, lg -> large. Min height is enforced by CSS, not by size. */
  size?: PoButtonSize
  /** Shows the spinner, sets aria-busy, and blocks clicks (no double-activation). */
  loading?: boolean
  /** Text shown while loading (the loading-text slot wins when provided). */
  loadingText?: string
  disabled?: boolean
  /** Icon-only button: renders only the icon slot. REQUIRES ariaLabel. */
  iconOnly?: boolean
  /** Accessible name. Required when iconOnly is true; optional otherwise. */
  ariaLabel?: string
  /** Native button type. */
  attrType?: 'button' | 'submit' | 'reset'
  round?: boolean
  block?: boolean
}>(), {
  variant: 'secondary',
  size: 'md',
  loading: false,
  loadingText: undefined,
  disabled: false,
  iconOnly: false,
  ariaLabel: undefined,
  attrType: 'button',
  round: false,
  block: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

if (props.iconOnly && !props.ariaLabel) {
  // Dev guard: an icon-only button without a name is invisible to screen readers.
  console.warn('[PoButton] icon-only button requires the ariaLabel prop.')
}

const naiveType = computed(() => {
  switch (props.variant) {
    case 'primary': return 'primary'
    case 'destructive': return 'error'
    case 'ghost': return 'tertiary'
    case 'secondary':
    default: return 'default'
  }
})

const naiveSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'small'
    case 'lg': return 'large'
    case 'md':
    default: return 'medium'
  }
})

const onClick = (event: MouseEvent) => {
  if (props.loading || props.disabled) return
  emit('click', event)
}
</script>

<style scoped>
.po-button {
  /* Desktop floor (theme heightMedium is the same value); coarse-pointer
     rule below raises it to the 44px touch target. */
  min-height: var(--spacing-9);
  min-width: var(--spacing-9);
}

.po-button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (pointer: coarse) {
  .po-button {
    min-height: var(--touch-target-min);
  }
  /* UIUX-L03: the coarse floor raised min-HEIGHT to 44px but left
     min-width at 36px, so icon-only buttons stayed 36px wide on touch.
     Icon-only PoButtons get the 44px floor on width too; labelled
     buttons keep their content-driven width. */
  .po-button--icon-only {
    min-width: var(--touch-target-min);
  }
}

@media (prefers-reduced-motion: reduce) {
  /* A11Y-N01: was transition-duration: var(--duration-fast) = 125ms —
     still animating under reduced-motion (design-system §1.3 wants 0).
     The 0s applies to this button's own transitions only; Naive's inner
     spinner animation is unaffected (not inherited). */
  .po-button {
    transition-duration: 0s;
  }
}
</style>
