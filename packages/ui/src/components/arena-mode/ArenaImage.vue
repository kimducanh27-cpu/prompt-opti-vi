<template>
  <AppPreviewImage v-if="src" :src="src" :alt="label" :width="width" />
  <NText v-else-if="missing" type="error">{{ t('arena.missingImage') }}</NText>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { getPiniaServices } from '../../plugins/pinia'
import AppPreviewImage from '../media/AppPreviewImage.vue'
const props = withDefaults(defineProps<{ assetId: string; label: string; width?: number }>(), { width: 160 })
const { t } = useI18n()
const src = ref('')
const missing = ref(false)

// P-005: the stored image can be far larger than the 56px (input) / 280px
// (result) it is displayed at, yet the old code handed the browser the
// full-resolution base64 bitmap (~33% base64 bloat + a full-res decode per
// image). Decode at display size instead: convert the stored base64 to a
// Blob, let createImageBitmap resize WHILE decoding, then re-encode the
// small bitmap to an object URL. Animated GIFs keep the full data URL so
// animation is preserved; any failure falls back to the full data URL.
const targetDisplayWidth = () =>
  Math.max(1, Math.round(props.width * Math.min(window.devicePixelRatio || 1, 2)))

const base64ToBlob = (b64: string, mimeType: string): Blob => {
  const bytes = atob(b64)
  const buffer = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i += 1) buffer[i] = bytes.charCodeAt(i)
  return new Blob([buffer], { type: mimeType })
}

const downscaleToObjectUrl = async (b64: string, mimeType: string): Promise<string | null> => {
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return null
  const blob = base64ToBlob(b64, mimeType)
  const bitmap = await createImageBitmap(blob, { resizeWidth: targetDisplayWidth() })
  try {
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const context = canvas.getContext('2d')
    if (!context) return null
    context.drawImage(bitmap, 0, 0)
    const out = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, 0.85))
    return out ? URL.createObjectURL(out) : null
  } finally {
    bitmap.close()
  }
}

let currentObjectUrl = ''
const revokeCurrentObjectUrl = () => {
  if (currentObjectUrl) { URL.revokeObjectURL(currentObjectUrl); currentObjectUrl = '' }
}
onBeforeUnmount(revokeCurrentObjectUrl)

watch(() => props.assetId, async (id, _, cleanup) => {
  let active = true
  cleanup(() => { active = false })
  src.value = ''; missing.value = false
  revokeCurrentObjectUrl()
  try {
    const image = await getPiniaServices()?.imageStorageService?.getImage(id)
    if (!active) return
    if (!image) { missing.value = true; return }
    const fullDataUrl = `data:${image.metadata.mimeType};base64,${image.data}`
    if (image.metadata.mimeType === 'image/gif') { src.value = fullDataUrl; return }
    const downscaled = await downscaleToObjectUrl(image.data, image.metadata.mimeType).catch(() => null)
    if (!active) { if (downscaled) URL.revokeObjectURL(downscaled); return }
    if (downscaled) { currentObjectUrl = downscaled; src.value = downscaled }
    else src.value = fullDataUrl
  } catch { if (active) missing.value = true }
}, { immediate: true })
</script>
