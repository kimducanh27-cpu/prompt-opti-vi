<template>
  <header class="compact-navigation">
    <NButton quaternary class="compact-main-menu" :aria-label="t('workspace.menu')" data-testid="compact-global-menu"
      @click="menu = true"><template #icon><NIcon size="18"><Menu2 /></NIcon></template>{{ t('workspace.functions') }}</NButton>
    <button type="button" class="compact-mode-button" :aria-label="t('workspace.switchMode')"
      data-testid="compact-mode-select" @click="modes = true">
      <strong>{{ currentLabel }}</strong><NIcon size="14"><ChevronDown /></NIcon>
    </button>
    <div v-show="!isFavorites" id="compact-workspace-tools" />
    <NButton v-if="isFavorites" quaternary circle :aria-label="t('workspace.returnToWorkspace')"
      @click="goWorkspace"><template #icon><NIcon :size="16"><ArrowBackUp /></NIcon></template></NButton>
  </header>
  <!-- Sub-mode switcher (Slice 5, design-system §2.2): a PoSegmented control
       directly under the header — System/User, Multi/Variable or
       Text/Image/Multi for the current function mode. 44px targets,
       scrolls horizontally when it overflows, never wraps to two rows.
       Hidden on Favorites and Arena, which have no sub-mode. -->
  <div v-if="showSubModeStrip" class="compact-mode-strip">
    <PoSegmented
      :model-value="currentSubMode"
      :options="subModeOptions"
      :aria-label="t('workspace.switchMode')"
      @update:model-value="onSubModeChange"
    />
  </div>
  <!-- Mobile bottom tab bar (Slice 5, design-system §2.2): the only
       persistent bottom navigation in the app. Five tabs, 44px targets,
       active tab is accent + semibold label + top indicator + aria-current
       (never colour alone). The Badge is a count only (favourites count,
       when the parent passes one). Fixed to the viewport bottom; the frame
       reserves its height in the content bottom padding (MainLayout). -->
  <nav class="compact-tab-bar" :aria-label="t('workspace.title')">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      :data-testid="`compact-tab-${tab.id}`"
      :aria-current="tab.id === activeTab ? 'page' : undefined"
      @click="selectTab(tab)"
    >
      <NIcon size="20"><component :is="tab.icon" /></NIcon>
      <span>{{ t(tab.label) }}</span>
      <PoBadge
        v-if="tab.id === 'favorites' && showFavoritesBadge"
        class="compact-tab-badge"
        :count="favoritesCount!"
        :aria-label="t('nav.favorites')"
      />
    </button>
  </nav>
  <PoSheet v-model:show="menu" :title="t('workspace.functions')" class="compact-menu-sheet" data-testid="compact-functions-panel">
    <button v-if="isFavorites" type="button" class="compact-menu-row" @click="goWorkspace">
      <NIcon :size="16"><ArrowBackUp /></NIcon><span>{{ t('workspace.returnToWorkspace') }}</span><NIcon :size="16"><ChevronRight /></NIcon>
    </button>
    <div class="compact-function-grid">
      <button v-for="item in entries" :key="item.action" type="button" class="compact-function-tile"
        :data-testid="`compact-menu-${item.action}`" @click="open(item.action)">
        <NIcon :size="20" aria-hidden="true"><component :is="item.icon" /></NIcon><span>{{ t(item.label) }}</span>
        <NBadge v-if="item.action === 'data' && backupReminderDue" dot />
      </button>
    </div>
    <div class="compact-menu-preferences">
      <div class="compact-menu-preference"><span class="compact-menu-preference-label">{{ t('workspace.theme') }}</span><ThemeToggleUI /></div>
      <div class="compact-menu-preference"><span class="compact-menu-preference-label">{{ t('workspace.language') }}</span><LanguageSwitchDropdown /></div>
    </div>
    <details class="compact-menu-help">
      <summary>{{ t('workspace.helpAbout') }}</summary>
      <button type="button" class="compact-menu-row" @click="open('docs')"><NIcon :size="16"><Book /></NIcon><span>{{ t('about.documentation') }}</span><NIcon :size="16"><ExternalLink /></NIcon></button>
      <button type="button" class="compact-menu-row" @click="open('website')"><NIcon :size="16"><World /></NIcon><span>{{ t('about.website') }}</span><NIcon :size="16"><ExternalLink /></NIcon></button>
      <button type="button" class="compact-menu-row" @click="open('github')"><NIcon><BrandGithub /></NIcon><span>GitHub</span><NIcon :size="16"><ExternalLink /></NIcon></button>
      <div class="compact-menu-version">{{ appVersion }}<UpdaterIcon /></div>
    </details>
  </PoSheet>
  <PoSheet v-model:show="modes" :title="t('workspace.switchMode')" class="compact-mode-sheet" data-testid="compact-modes-panel">
    <section v-for="group in modeGroups" :key="group.id" class="compact-mode-group"
      :aria-labelledby="`compact-mode-group-${group.id}`">
      <h3 :id="`compact-mode-group-${group.id}`">{{ t(group.label) }}</h3>
      <div class="compact-mode-grid" :class="{ 'compact-mode-grid--three': group.items.length === 3 }">
        <button v-for="item in group.items" :key="item.path" type="button" class="compact-mode-choice"
          :data-testid="`compact-mode-${item.path.slice(1).replace('/', '-')}`"
          :aria-current="item.path === workspacePath ? 'page' : undefined" @click="selectMode(item.path)">
          <span>{{ t(item.label) }}</span><NIcon v-if="item.path === workspacePath" size="16"><Check /></NIcon>
        </button>
      </div>
    </section>
  </PoSheet>
</template>

<script setup lang="ts">
import BrandGithub from '../icons/GitHubIcon.vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NIcon, NBadge } from 'naive-ui'
import { PhList as Menu2, PhCaretDown as ChevronDown, PhCaretRight as ChevronRight, PhArrowUUpLeft as ArrowBackUp, PhBook as Book, PhGlobe as World, PhArrowSquareOut as ExternalLink, PhCheck as Check, PhPen as PenLine, PhChats as MessagesSquare, PhImage as ImageIcon, PhSword as Swords, PhStar as Star, PhClockCounterClockwise as ClockCounterClockwise, PhFileText as FileText, PhGear as Gear, PhFunction as Function, PhFloppyDisk as FloppyDisk, PhWrench as Wrench } from '@phosphor-icons/vue'
import { router } from '../../router'
import { releaseCompactOverlayHistory } from '../../composables/ui/useCompactModalBack'
import ThemeToggleUI from '../ThemeToggleUI.vue'
import LanguageSwitchDropdown from '../LanguageSwitchDropdown.vue'
import UpdaterIcon from '../UpdaterIcon.vue'
import PoSheet from '../primitives/PoSheet.vue'
import PoSegmented from '../primitives/PoSegmented.vue'
import PoBadge from '../primitives/PoBadge.vue'

const props = defineProps<{ workspacePath: string; appVersion: string; backupReminderDue?: boolean; favoritesCount?: number }>()
const emit = defineEmits<{ action: [value: string] }>()
const { t } = useI18n()
const menu = ref(false)
const modes = ref(false)
const modeGroups = [
  { id: 'arena', label: 'arena.title', items: [{ path: '/arena', label: 'arena.title' }] },
  { id: 'basic', label: 'nav.basicMode', items: [
    { path: '/basic/system', label: 'workspace.systemMode' },
    { path: '/basic/user', label: 'workspace.userMode' },
  ] },
  { id: 'pro', label: 'nav.contextMode', items: [
    { path: '/pro/variable', label: 'contextMode.optimizationMode.variable' },
    { path: '/pro/multi', label: 'contextMode.optimizationMode.message' },
  ] },
  { id: 'image', label: 'nav.imageMode', items: [
    { path: '/image/text2image', label: 'imageMode.text2image' },
    { path: '/image/image2image', label: 'imageMode.image2image' },
    { path: '/image/multiimage', label: 'imageMode.multiimage' },
  ] },
]
const labels: Record<string, string> = {
  '/arena': 'arena.title',
  '/basic/system': 'promptOptimizer.systemPrompt',
  '/basic/user': 'promptOptimizer.userPrompt',
  '/pro/multi': 'contextMode.optimizationMode.message',
  '/pro/variable': 'contextMode.optimizationMode.variable',
  '/image/text2image': 'imageMode.text2image',
  '/image/image2image': 'imageMode.image2image',
  '/image/multiimage': 'imageMode.multiimage',
}
const isFavorites = computed(() => router.currentRoute.value.path === '/favorites')
const currentLabel = computed(() => t(isFavorites.value ? 'nav.favorites' : labels[router.currentRoute.value.path] || labels[props.workspacePath] || 'workspace.title'))
const entries = [
  { action: 'favorites', label: 'nav.favorites', icon: Star },
  { action: 'history', label: 'nav.history', icon: ClockCounterClockwise },
  { action: 'templates', label: 'nav.templates', icon: FileText },
  { action: 'models', label: 'nav.modelManager', icon: Gear },
  { action: 'variables', label: 'nav.variableManager', icon: Function },
  { action: 'data', label: 'nav.dataManager', icon: FloppyDisk },
  { action: 'tools', label: 'contextMode.actions.toolManager', icon: Wrench },
]
const open = async (action: string) => {
  menu.value = false
  if (action === 'favorites') await releaseCompactOverlayHistory()
  emit('action', action)
}
const selectMode = async (path: string) => {
  modes.value = false
  await releaseCompactOverlayHistory()
  if (router.currentRoute.value.path !== path) await router.push(path)
}
const goWorkspace = async () => {
  menu.value = false
  modes.value = false
  await releaseCompactOverlayHistory()
  await router.push(props.workspacePath)
}
watch(() => router.currentRoute.value.fullPath, () => { modes.value = false; menu.value = false })

// ---- Bottom tab bar (design-system §2.2) ----
// Default sub-mode per function mode matches AppCoreNav's defaults.
const tabs = [
  { id: 'basic', label: 'nav.basicMode', path: '/basic/system', icon: PenLine },
  { id: 'pro', label: 'nav.contextMode', path: '/pro/variable', icon: MessagesSquare },
  { id: 'image', label: 'nav.imageMode', path: '/image/text2image', icon: ImageIcon },
  { id: 'arena', label: 'arena.title', path: '/arena', icon: Swords },
  { id: 'favorites', label: 'nav.favoritesShort', path: '/favorites', icon: Star },
] as const
const activeTab = computed(() => {
  const path = router.currentRoute.value.path
  if (path === '/favorites') return 'favorites'
  if (path === '/arena') return 'arena'
  if (path.startsWith('/basic')) return 'basic'
  if (path.startsWith('/pro')) return 'pro'
  if (path.startsWith('/image')) return 'image'
  return 'basic'
})
const showFavoritesBadge = computed(() => typeof props.favoritesCount === 'number' && props.favoritesCount > 0)
const selectTab = async (tab: typeof tabs[number]) => {
  if (tab.id === activeTab.value) return
  // Mirror the menu/return flows: leaving or entering Favorites releases
  // the compact overlay history first.
  if (tab.id === 'favorites' || isFavorites.value) await releaseCompactOverlayHistory()
  if (router.currentRoute.value.path !== tab.path) await router.push(tab.path)
}

// ---- Sub-mode strip (design-system §2.2) ----
const subModeGroups: Record<string, { value: string; label: string; path: string }[]> = {
  basic: [
    { value: 'system', label: 'workspace.systemMode', path: '/basic/system' },
    { value: 'user', label: 'workspace.userMode', path: '/basic/user' },
  ],
  pro: [
    { value: 'variable', label: 'contextMode.optimizationMode.variable', path: '/pro/variable' },
    { value: 'multi', label: 'contextMode.optimizationMode.message', path: '/pro/multi' },
  ],
  image: [
    { value: 'text2image', label: 'imageMode.text2image', path: '/image/text2image' },
    { value: 'image2image', label: 'imageMode.image2image', path: '/image/image2image' },
    { value: 'multiimage', label: 'imageMode.multiimage', path: '/image/multiimage' },
  ],
}
const currentFunctionMode = computed(() => {
  const path = router.currentRoute.value.path
  if (path.startsWith('/basic')) return 'basic'
  if (path.startsWith('/pro')) return 'pro'
  if (path.startsWith('/image')) return 'image'
  return null
})
const showSubModeStrip = computed(() => currentFunctionMode.value !== null && !isFavorites.value)
const subModeOptions = computed(() => {
  const group = currentFunctionMode.value ? subModeGroups[currentFunctionMode.value] : []
  return (group ?? []).map((item) => ({ label: t(item.label), value: item.value }))
})
const currentSubMode = computed(() => {
  const group = currentFunctionMode.value ? subModeGroups[currentFunctionMode.value] : []
  const segment = router.currentRoute.value.path.split('/')[2]
  if ((group ?? []).some((item) => item.value === segment)) return segment
  return group?.[0]?.value
})
const onSubModeChange = async (value: string | number) => {
  const group = currentFunctionMode.value ? subModeGroups[currentFunctionMode.value] : []
  const item = (group ?? []).find((entry) => entry.value === value)
  if (item) await selectMode(item.path)
}
</script>
