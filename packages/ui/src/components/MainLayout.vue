<template>
  <!-- ToastUI wraps the layout to provide NMessageProvider -->
  <ToastUI>
    <!-- A11Y-L01: skip link — without it, keyboard users Tab 8 times
         through the header/mode controls before reaching main content.
         Visually hidden until focused (see .skip-link below). First
         element in the DOM so it is the first Tab stop on every page.
         VL-D-01: this MUST be a <button>, not an <a href="#main-content">
         — in this hash-routed SPA the anchor replaced the route hash
         with #/main-content, vue-router logged R0004 "No match", and the
         whole workspace unmounted. The button focuses <main> directly
         and leaves the route hash untouched. -->
    <button type="button" class="skip-link" @click="jumpToMainContent">{{ t('common.skipToMainContent') }}</button>
    <!-- App frame (Slice 5): normal document flow — NOT a fixed full-viewport
         box. The old `position: fixed; inset: 0; width: 100vw; height: 100vh`
         + `overflow: hidden` frame fought the browser chrome and the
         keyboard; the page now scrolls instead of trapping scroll in a
         nested overflow container. Height is the token viewport height
         (100svh fallback, 100dvh where supported — tokens.css); the
         `compact-viewport-frame` hook is kept so the existing keyboard
         handling (visualViewport vars in overlay.css) still resizes the
         frame when the IME opens — Slice 6 owns workspace keyboard
         behaviour, this slice only un-traps the frame. Safe-area insets
         apply on all four sides (tokens.css). -->
    <div ref="layoutRoot" class="app-frame compact-viewport-frame" :class="{ 'app-frame--compact': isCompact }">
      <!-- Compact header: mobile nav (menu + mode + workspace tools) -->
      <header v-show="isCompact" class="compact-header"><slot name="mobile-nav" /></header>
      <!-- Desktop header: brand + title + core nav + actions -->
      <header v-show="!isCompact" class="theme-header nav-header-enhanced">
        <div class="nav-content" :lang="locale">
          <!-- Left: logo + title + core navigation -->
          <div class="nav-primary">
            <!-- Logo + title -->
            <NButton
              text
              class="brand-link"
              :aria-label="t('common.appName')"
              :title="t('common.appName')"
              @click="openBrandWebsite"
            >
              <span class="brand-lockup">
                <AppPreviewImage
                  :src="logoSrc"
                  alt="Logo"
                  :width="logoSize"
                  :height="logoSize"
                  object-fit="cover"
                  class="logo-image"
                  :show-toolbar="false"
                  :preview-disabled="true"
                  :fallback-src="fallbackLogoSrc"
                />
                <NText class="text-lg sm:text-xl font-bold theme-title" tag="h2">
                  <slot name="title">{{ t('common.appName') }}</slot>
                </NText>
              </span>
            </NButton>

            <!-- Core navigation -->
            <div class="core-navigation">
              <slot name="core-nav"></slot>
            </div>
          </div>

          <!-- Right: action buttons -->
          <div class="nav-actions" :lang="locale">
            <slot name="actions"></slot>
          </div>
        </div>
      </header>

      <!-- Main content — the page scrolls; no nested overflow container here.
           id + tabindex="-1": the A11Y-L01 skip-link target; tabindex lets
           the skip button move keyboard focus here (a plain <main> is not
           focusable, so focus would stay on the button). -->
      <main id="main-content" class="app-content" tabindex="-1">
        <div ref="contentRoot" class="main-content-wrapper">
          <slot name="main"></slot>
        </div>
      </main>

      <!-- Modals slot -->
      <slot name="modals"></slot>
    </div>
  </ToastUI>
</template>

<script setup lang="ts">
import { useWorkspaceLayout } from '../composables/ui/useWorkspaceLayout'
const { isCompact, containerWidth, contentHeight } = useWorkspaceLayout()
const layoutRoot = ref()
const contentRoot = ref<HTMLElement>()
useResizeObserver(contentRoot, (entries) => {
  const height = entries[0]?.contentRect.height
  if (height) contentHeight.value = height
})
useResizeObserver(layoutRoot, (entries) => {
  const width = entries[0]?.contentRect.width
  if (width) containerWidth.value = width
})

// M4 (step 7): mode / sub-mode / page switches in this app are route
// changes that remount the workspace, so the visible switch fade lives
// here — the whole main content cross-fades (opacity only, 125ms;
// instant when reduced-motion). No slide, so no layout shift mid-switch.
// The try/catch keeps the shell mountable in test harnesses without a
// router; in the real app the route is always present.
let route: ReturnType<typeof useRoute> | null = null
try {
  route = useRoute()
} catch {
  route = null
}
if (route) {
  const currentRoute = route
  watch(() => currentRoute.path, () => {
    void nextTick(() => {
      const el = contentRoot.value
      if (!el) return
      killMotion(el)
      crossfade(el)
    })
  })
  onBeforeUnmount(() => {
    if (contentRoot.value) killMotion(contentRoot.value)
  })
}

import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useResizeObserver } from '@vueuse/core'

import { useI18n } from 'vue-i18n'
import { NButton, NText } from 'naive-ui'
import ToastUI from './Toast.vue'
import logoImage from '../assets/logo.png'
import AppPreviewImage from './media/AppPreviewImage.vue'
import { openExternalUrl } from '../utils/open-external-url'
import { crossfade, killMotion } from '../utils/motion'
import { i18n } from '../plugins/i18n'

const { t } = useI18n()
const locale = computed(() => i18n.global.locale.value)

// Logo图片配置
const logoSrc = logoImage

// 创建简单的SVG fallback logo
// UIUX-N03: the fallback fill mirrors --color-accent (#1f6bd1 light /
// #6d9cfe dark). It must stay a literal: var() cannot be used inside a
// data-URI SVG.
const createFallbackSvg = () => {
  const svg = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#1f6bd1"/>
      <text x="16" y="21" text-anchor="middle" fill="white" font-family="system-ui" font-size="14" font-weight="bold">P</text>
    </svg>
  `)}`
  return svg
}

const fallbackLogoSrc = createFallbackSvg()

// 响应式Logo尺寸 - 使用更智能的检测
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', updateWindowWidth)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth)
  }
})

const logoSize = computed(() => {
  if (windowWidth.value < 480) {
    return 20 // 超小屏幕
  } else if (windowWidth.value < 640) {
    return 24 // 小屏幕
  }
  return 28 // 默认尺寸
})

const openBrandWebsite = async () => {
  await openExternalUrl('https://always200.com', { logPrefix: 'MainLayout' })
}

// VL-D-01 (A11Y-L01 follow-up): skip-link action — focus <main> directly
// instead of navigating. A plain <a href="#main-content"> replaced the
// route hash in this hash-routed SPA (vue-router R0004, workspace gone);
// focus() + scrollIntoView() move keyboard focus without touching the URL.
const jumpToMainContent = () => {
  const main = document.getElementById('main-content')
  if (!main) return
  main.scrollIntoView()
  main.focus()
}
</script>

<style>
/* A11Y-L01: skip link — visually hidden until focused, then a visible
   button pinned to the top-left of the page. Standard pattern: 1px clip
   when idle, full button on :focus-visible. z-index 7000 puts it above
   the toast stack (6000) and modal pages while focused.
   VL-D-01: the element is a <button> (see jumpToMainContent) — a plain
   <a href="#main-content"> would replace the route hash in this
   hash-routed SPA. font/cursor reset below because it is a button. */
.skip-link {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  font: inherit;
  cursor: pointer;
}
.skip-link:focus-visible {
  position: fixed;
  top: var(--spacing-2);
  left: var(--spacing-2);
  z-index: 7000;
  width: auto;
  height: auto;
  margin: 0;
  padding: var(--spacing-2) var(--spacing-4);
  overflow: visible;
  clip: auto;
  white-space: normal;
  background: var(--color-accent);
  color: var(--color-on-accent);
  border-radius: var(--radius-container);
  font-weight: 600;
  text-decoration: none;
}

/* ---- App frame (Slice 5, design-system §2.1) ----
 * Normal document flow: viewport height from the tokens
 * (--viewport-height: 100svh, 100dvh where supported), safe-area padding
 * on all four sides. No fixed positioning, no width: 100vw, no
 * overflow: hidden — overflowing content spills out of the frame box and
 * the document scrolls. The compact keyboard rule in
 * styles/compact/overlay.css still targets .compact-viewport-frame, so the
 * frame keeps shrinking to the visual viewport when the IME opens. */
.app-frame {
  /* Bottom tab bar height, shared with styles/compact/navigation.css:
   * one 44px touch target + 6px padding top and bottom. */
  /* NAV-06 / L-07: the tab bar is NOT 44px + 6px + 6px = 56px tall. The
     tab button's real height is icon 20px + gap 2px + label ~23.38px
     (14px at line-height 1.67) = ~45.38px > the 44px min-height, so the
     bar is ~57.4px (R2-B measured 57px live) and the old 56px reserve
     let the last ~1.4px of content slide under the bar. The +2px makes
     the reserve 58px, covering the real bar with ~0.6px to spare. */
  --compact-tab-bar-height: calc(var(--touch-target-min) + var(--spacing-1-5) + var(--spacing-1-5) + 2px);
  height: var(--viewport-height);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: var(--color-background-body);
  color: var(--color-text-primary);
  padding-top: var(--safe-area-inset-top);
  padding-right: var(--safe-area-inset-right);
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
}

/* ---- Main content ----
 * Desktop: 24px top, clamp(16px, 2vw, 48px) sides, 40px bottom (tokens
 * scale). Mobile: 0 side padding; the bottom reserves the fixed bottom
 * tab bar plus the gesture safe-area so the last content is never hidden
 * behind the bar. No overflow here — the page scrolls. */
.app-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: var(--spacing-6) clamp(var(--spacing-4), 2vw, var(--spacing-12)) var(--spacing-10);
}

.app-frame--compact .app-content {
  padding: 0 0 calc(var(--compact-tab-bar-height) + var(--safe-area-inset-bottom));
}

.main-content-wrapper {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.main-content-wrapper > * {
  flex: 1;
  min-height: 0;
}

/* 增强导航栏样式 */
.nav-header-enhanced {
  /* 64px desktop header (design-system §2.1), expressed in tokens. */
  min-height: calc(var(--spacing-12) + var(--spacing-4));
  flex-shrink: 0;
  padding: var(--spacing-3) var(--spacing-4);
}

.nav-content {
  min-height: var(--spacing-10);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-4);
  width: 100%;
  flex-wrap: nowrap;
}

.nav-actions {
  min-height: var(--spacing-10);
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-1);
  flex-wrap: nowrap;
  container: header-actions / inline-size;
}

.nav-primary {
  min-width: 0;
  max-width: calc(100% - 410px);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: nowrap;
}

.nav-primary .core-navigation,
.nav-primary .core-navigation > * {
  min-width: 0;
}

.nav-actions > * {
  flex-shrink: 0;
}

/* Measure the space left after the brand and mode selectors, not the viewport. */
.nav-header-enhanced .nav-actions .action-button {
  width: var(--nav-action-width, auto);
}

.nav-header-enhanced .nav-actions .action-button-label {
  display: var(--nav-label-display, inline);
}

.nav-header-enhanced .nav-actions .action-button .n-button__icon {
  margin-right: var(--nav-icon-margin, var(--spacing-1-5));
}

.nav-header-enhanced .nav-actions .action-button {
  padding-inline: var(--spacing-1-5);
}

.nav-header-enhanced .nav-actions .modal-action-group,
.nav-header-enhanced .nav-actions .aux-icon-group {
  gap: var(--spacing-1);
}

.nav-header-enhanced .nav-actions .aux-icon-group {
  margin-left: 0;
}

.nav-header-enhanced .nav-actions .page-destination-group {
  padding-right: var(--spacing-1);
}

@container header-actions (max-width: 1000px) {
  .nav-header-enhanced .nav-actions .theme-toggle {
    width: var(--spacing-9);
    padding: 0;
  }
  .nav-header-enhanced .nav-actions .theme-toggle-label {
    display: none;
  }
  .nav-header-enhanced .nav-actions .theme-toggle .n-button__icon {
    margin-right: 0;
  }
}

/* Configuration labels yield before the frequent favorites/templates/history. */
@container header-actions (max-width: 1000px) {
  .nav-header-enhanced .nav-actions:lang(en) .nav-config-action {
    --nav-label-display: none;
    --nav-icon-margin: 0;
    --nav-action-width: var(--spacing-9);
  }
}

@container header-actions (max-width: 740px) {
  .nav-header-enhanced .nav-actions .nav-config-action {
    --nav-label-display: none;
    --nav-icon-margin: 0;
    --nav-action-width: var(--spacing-9);
  }
}

@container header-actions (max-width: 680px) {
  .nav-header-enhanced .nav-actions:lang(en) .modal-action-group {
    --nav-label-display: none;
    --nav-icon-margin: 0;
    --nav-action-width: var(--spacing-9);
  }
}

@container header-actions (max-width: 555px) {
  .nav-header-enhanced .nav-actions .modal-action-group {
    --nav-label-display: none;
    --nav-icon-margin: 0;
    --nav-action-width: var(--spacing-9);
  }
}

@container header-actions (max-width: 500px) {
  .nav-header-enhanced .nav-actions .page-destination-group {
    --nav-label-display: none;
    --nav-icon-margin: 0;
    --nav-action-width: var(--spacing-9);
  }
}

/* Long English mode names need the brand's text space at the desktop minimum.
   The logo keeps its name/tooltip; mode selectors can use their existing wrap. */
@media (max-width: 1280px) {
  .nav-content:lang(en) .theme-title {
    display: none;
  }
}

.brand-link {
  align-items: center;
  padding: var(--spacing-1-5) var(--spacing-3) var(--spacing-1-5) var(--spacing-1-5);
  border-radius: var(--radius-container);
  color: inherit;
  transition:
    background-color var(--duration-medium) ease-in-out,
    box-shadow var(--duration-medium) ease-in-out,
    transform var(--duration-medium) ease-in-out;
}

.brand-lockup {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-wrap: nowrap;
}

.brand-link:hover {
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  transform: translateY(-1px);
}

.brand-link:hover .logo-image {
  transform: scale(1.05);
}

.brand-link:hover .theme-title {
  opacity: 0.88;
}

.brand-link:focus-visible {
  outline: none;
  background: color-mix(in srgb, var(--color-accent) 14%, transparent);
  box-shadow: 0 0 0 var(--spacing-0-5) color-mix(in srgb, var(--color-accent) 28%, transparent);
}

/* Logo样式优化 */
.logo-image {
  border-radius: var(--radius-inner);
  transition: transform var(--duration-medium) ease-in-out;
  flex-shrink: 0;
}

/* 标题文字对齐优化 */
.theme-title {
  line-height: 1.2;
  margin: 0;
  white-space: nowrap;
  transition: opacity var(--duration-medium) ease-in-out;
}

/* 核心导航样式 */
.core-navigation {
  display: flex;
  align-items: center;
  margin-left: var(--spacing-4);
  padding-left: var(--spacing-4);
  border-left: 1px solid var(--color-border);
  min-height: var(--spacing-8);
}

/* 响应式优化 */
@media (max-width: 639px) {
  .logo-image {
    border-radius: var(--spacing-1);
  }

  .core-navigation {
    margin-left: var(--spacing-2);
    padding-left: var(--spacing-2);
  }
}

.custom-select {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  background-image: none !important;
}

.custom-select::-ms-expand {
  display: none;
}
</style>
