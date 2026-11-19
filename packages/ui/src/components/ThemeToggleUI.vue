<template>
  <NDropdown
    :options="dropdownOptions"
    :menu-props="dropdownMenuProps"
    :node-props="dropdownNodeProps"
    @select="handleThemeSelect"
    placement="bottom-end"
    trigger="click"
  >
    <NButton 
      quaternary 
      size="small"
      class="theme-toggle flex items-center justify-center gap-1"
      :aria-label="currentThemeLabel"
      :title="currentThemeLabel"
    >
      <template #icon>
        <component :is="currentThemeIcon" />
      </template>
      <span class="theme-toggle-label text-sm max-md:hidden truncate">{{ currentThemeLabel }}</span>
    </NButton>
  </NDropdown>
</template>
  
<script setup lang="ts">
import { PhSun as Sun, PhMoon as Moon, PhCircleHalf as SunMoon } from '@phosphor-icons/vue'
import { computed, h } from 'vue'

import { useI18n } from 'vue-i18n'
import { NButton, NDropdown, type DropdownOption } from 'naive-ui'
import { useNaiveTheme } from '../composables/ui/useNaiveTheme'
import { dropdownMenuProps, dropdownNodeProps } from '../utils/dropdown-a11y'

const { t } = useI18n()

// 使用新的主题系统
const { 
  themeId, 
  availableThemes, 
  changeTheme 
} = useNaiveTheme()

// Theme choices share Phosphor geometry and retain their identifying colours
// (sun / moon / half-sun). The colours live in the CSS classes at the
// bottom of this file, sourced from the design tokens (UIUX-L01) — not hex
// literals: the Phosphor `color` prop becomes an SVG presentation attribute,
// which cannot resolve var(), so the colour rides on a class instead
// (Phosphor strokes use currentColor). Slice 3: only Light / Dark / Auto
// remain (blue/classic/green/purple removed).
const themeIcons = {
  light: Sun,
  dark: Moon,
  auto: SunMoon,
}
const createThemeIcon = (id: string) => {
  const icon = themeIcons[id as keyof typeof themeIcons]
  if (!icon) return null
  return h(icon, { size: 16, class: `theme-toggle-icon theme-toggle-icon--${id}`, 'aria-hidden': true })
}

// 当前主题的图标
const currentThemeIcon = computed(() => createThemeIcon(themeId.value))

// 当前主题的标签（使用国际化）
const currentThemeLabel = computed(() => {
  return t(`theme.${themeId.value}`)
})

// 为Naive UI Dropdown创建选项: Light / Dark (from the theme configs) + Auto
// (a selection, not a theme — it resolves to light/dark via the OS preference).
const dropdownOptions = computed<DropdownOption[]>(() => {
  const options: DropdownOption[] = availableThemes.map(theme => ({
    key: theme.id,
    label: t(`theme.${theme.id}`),
    icon: () => createThemeIcon(theme.id)
  }))
  options.push({
    key: 'auto',
    label: t('theme.auto'),
    icon: () => createThemeIcon('auto')
  })
  return options
})

// 处理主题选择
const handleThemeSelect = (key: string) => {
  changeTheme(key)
}
</script>

<style>
/* UIUX-L01: theme-icon identifying colours from the design tokens
   (tokens.css). Non-scoped on purpose: the dropdown menu is teleported to
   <body>, so a scoped rule would not reach the option icons. */
.theme-toggle-icon--light { color: var(--color-status-warning); }
.theme-toggle-icon--dark { color: var(--color-accent); }
.theme-toggle-icon--auto { color: var(--color-text-tertiary); }
</style>
