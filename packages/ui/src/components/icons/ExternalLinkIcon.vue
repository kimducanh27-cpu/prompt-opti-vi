<template>
  <UiExternalLink :width="size" :height="size" />
</template>

<script setup lang="ts">
import { PhArrowSquareOut as UiExternalLink } from '@phosphor-icons/vue'
withDefaults(
  defineProps<{
    size?: number | string
  }>(),
  {
    size: 14
  }
)
</script>
