<!-- PoToast — the toast provider primitive (design-system §3).
     This component does NOT create a second message provider: it renders the
     existing components/Toast.vue (NMessageProvider + the global useToast
     API) and nothing else. Mount it once at the app root.
     Use the toast API via the usePoToast export (an alias of
     composables/ui/useToast): success / error / info / warning / add / remove.
     Toast position: top-right on desktop, above the bottom nav on mobile
     (handled by the provider's placement — Slice 5 owns the mobile offset).
     Props: none. Slots: default (the app content, rendered inside the provider).
     States: n/a (provider only). -->
<template>
  <Toast>
    <slot />
  </Toast>
</template>

<script setup lang="ts">
import Toast from '../Toast.vue'
</script>
