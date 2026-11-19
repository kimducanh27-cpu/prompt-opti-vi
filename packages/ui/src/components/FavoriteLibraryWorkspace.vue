<template>
  <div
    ref="listRootRef"
    class="favorites-manager-shell"
    :class="{ 'favorites-manager-shell--page': isPageLayout, 'favorites-manager-shell--compact': isMobile }"
  >
    <div class="favorites-manager-toolbar">
      <NSpace vertical :size="isMobile ? 8 : 16">
        <!-- Slice 8: search + category/tag filters live in ONE row. On desktop
             the wrapper is display:contents, so the two rows lay out exactly
             as before; on mobile it wraps (search on line 1, toggle + ⋮ +
             Add on line 2) so every control stays visible without swiping. -->
        <div class="favorites-manager-toolbar-search-controls">
        <div class="favorites-manager-toolbar-row favorites-manager-toolbar-row--search">
          <div v-if="$slots['toolbar-leading']" class="favorites-manager-toolbar-leading">
            <slot name="toolbar-leading" />
          </div>

          <NInput
            ref="searchInputRef"
            v-model:value="searchKeyword"
            :placeholder="t('favorites.manager.searchPlaceholder')"
            clearable
            class="favorites-manager-search"
            @update:value="handleSearch"
            @focus="handleSearchFocus"
          >
            <template #prefix>
              <NIcon :size="16"><Search /></NIcon>
            </template>
          </NInput>

          <NText depth="3" class="favorites-manager-count">
            {{ t('favorites.manager.totalCount', { count: filteredFavorites.length }) }}
          </NText>
        </div>

        <div class="favorites-manager-toolbar-row favorites-manager-toolbar-row--controls">
          <!-- M-C (EU05-02): no :wrap binding — NSpace applies flex-wrap as an
               inline style, so the old :wrap="!isMobile" (nowrap on mobile)
               could not be overridden by any stylesheet rule and squeezed the
               tag select to 38px at 360px. Default wrap=true lets the two
               selects share the row 50/50 (see compact CSS below). -->
          <NSpace v-show="!isMobile || filtersExpanded" :size="12" align="center" class="favorites-manager-filters">
            <CategoryTreeSelect
              v-model="selectedCategory"
              :placeholder="t('favorites.manager.allCategories')"
              show-all-option
              @change="handleFilterChange"
              @category-updated="handleCategoryUpdated"
            />

            <NSelect
              v-model:value="selectedTags"
              :options="tagOptions"
              :placeholder="t('favorites.manager.allTags')"
              :input-props="{ 'aria-label': t('favorites.manager.allTags') }"
              multiple
              clearable
              filterable
              max-tag-count="responsive"
              class="favorites-manager-tag-select"
              @update:value="handleFilterChange"
            />
          </NSpace>

          <NSpace :size="8" align="center" wrap class="favorites-manager-actions">
            <NButton v-if="isMobile" secondary :type="filtersExpanded || selectedCategory || selectedTags.length ? 'primary' : 'default'"
              :aria-expanded="filtersExpanded" data-testid="favorites-manager-filters-toggle" @click="filtersExpanded = !filtersExpanded">
              {{ `${t('favorites.dialog.categoryLabel')} / ${t('favorites.dialog.tagsLabel')}` }}<span v-if="selectedCategory || selectedTags.length"> · {{ (selectedCategory ? 1 : 0) + selectedTags.length }}</span>
            </NButton>
            <NDropdown
              :trigger="isMobile ? 'click' : 'hover'"
              :options="actionMenuOptions"
              :menu-props="dropdownMenuProps"
              :node-props="dropdownNodeProps"
              @select="handleActionMenuSelect"
            >
              <NButton secondary data-testid="favorites-manager-actions">
                <template #icon>
                  <NIcon :size="16"><DotsVertical /></NIcon>
                </template>
              </NButton>
            </NDropdown>

            <NButton v-if="!isMobile" secondary data-testid="favorites-manager-import" @click="openImportPanel">
              <template #icon>
                <NIcon :size="16"><Upload /></NIcon>
              </template>
              <span class="button-text">{{ t('favorites.manager.import') }}</span>
            </NButton>

            <NButton type="primary" data-testid="favorites-manager-add" @click="handleCreateFavorite">
              <template #icon>
                <NIcon :size="16"><Plus /></NIcon>
              </template>
              <span class="button-text">{{ t('favorites.manager.add') }}</span>
            </NButton>
          </NSpace>
        </div>
        </div>

        <div class="favorites-manager-toolbar-row favorites-manager-toolbar-row--discovery">
          <div class="favorites-manager-mode-filter" data-testid="favorites-manager-mode-filter">
            <NButton
              v-for="option in visibleModeFilterOptions"
              :key="option.value"
              size="small"
              :type="selectedModeFilter === option.value ? 'primary' : 'default'"
              :secondary="selectedModeFilter !== option.value"
              :disabled="option.count === 0 && option.value !== selectedModeFilter"
              :data-testid="`favorites-manager-mode-filter-${option.value}`"
              @click="handleModeFilterChange(option.value)"
            >
              <span class="favorites-manager-filter-label">{{ option.label }}</span>
              <span class="favorites-manager-filter-count">{{ option.count }}</span>
            </NButton>
          </div>

          <div
            v-if="popularTagFilters.length > 0"
            v-show="!isMobile || filtersExpanded"
            class="favorites-manager-tag-cloud"
            data-testid="favorites-manager-tag-cloud"
          >
            <NText depth="3" class="favorites-manager-tag-cloud-label">
              {{ t('favorites.manager.popularTags') }}
            </NText>
            <NButton
              v-for="tag in popularTagFilters"
              :key="tag.value"
              size="tiny"
              :type="selectedTags.includes(tag.value) ? 'primary' : 'default'"
              :secondary="!selectedTags.includes(tag.value)"
              :data-testid="`favorites-manager-popular-tag-${tag.value}`"
              @click="handlePopularTagToggle(tag.value)"
            >
              <span class="favorites-manager-filter-label">{{ tag.label }}</span>
              <span class="favorites-manager-filter-count">{{ tag.count }}</span>
            </NButton>
          </div>
        </div>
      </NSpace>
    </div>

    <div
      class="favorites-manager-workspace"
      :class="{
        'favorites-manager-workspace--mobile': isMobile,
        'favorites-manager-workspace--page': isPageLayout,
      }"
      data-testid="favorites-manager-workspace"
    >
      <NCard
        size="small"
        :segmented="{ content: true }"
        class="favorites-manager-pane favorites-manager-pane--list"
        :class="{ 'favorites-manager-pane--library': isPageLayout }"
      >
        <template #header>
          <div class="favorites-manager-pane-header">
            <NText strong>{{ t('favorites.manager.preview.listTitle') }}</NText>
            <NText depth="3">{{ t('favorites.manager.totalCount', { count: filteredFavorites.length }) }}</NText>
          </div>
        </template>

        <NScrollbar class="favorites-manager-scroll">
          <div v-if="paginatedFavorites.length === 0" class="favorites-manager-empty">
            <NEmpty
              :description="searchKeyword ? t('favorites.manager.emptySearchResult') : t('favorites.manager.emptyDescription')"
              size="large"
            >
              <template #extra>
                <NSpace justify="center" :size="8">
                  <NButton secondary @click="openImportPanel">
                    {{ t('favorites.manager.import') }}
                  </NButton>
                  <NButton type="primary" @click="handleCreateFavorite">
                    {{ t('favorites.manager.add') }}
                  </NButton>
                </NSpace>
              </template>
            </NEmpty>
          </div>

          <div v-else-if="isPageLayout" class="favorites-manager-grid">
            <FavoriteWorkspaceListItem
              v-for="favorite in paginatedFavorites"
              :key="favorite.id"
              variant="card"
              :favorite="favorite"
              :category="getCategoryById(favorite.category)"
              :is-selected="selectedFavorite?.id === favorite.id && workspaceMode === 'detail'"
              :show-quick-actions="!isMobile"
              @select="handleSelectFavorite"
              @edit="handleEditFavorite"
              @delete="handleDeleteFavorite"
              @copy="handleCopyFavorite"
              @use="handleUseFavorite"
            />
          </div>

          <NSpace v-else vertical :size="12" class="favorites-manager-list">
            <FavoriteWorkspaceListItem
              v-for="favorite in paginatedFavorites"
              :key="favorite.id"
              :favorite="favorite"
              :category="getCategoryById(favorite.category)"
              :is-selected="selectedFavorite?.id === favorite.id && workspaceMode === 'detail'"
              @select="handleSelectFavorite"
              @edit="handleEditFavorite"
              @delete="handleDeleteFavorite"
            />
          </NSpace>
        </NScrollbar>

        <template v-if="showPagination" #footer>
          <div class="favorites-manager-pagination">
            <NPagination
              v-model:page="currentPage"
              :page-size="pageSize"
              :item-count="filteredFavorites.length"
              :page-slot="5"
              data-testid="favorites-manager-pagination"
              :data-page-size="pageSize"
            />
          </div>
        </template>
      </NCard>
    </div>

    <FavoriteAssetPanelDialog
      v-model:show="assetPanelVisible"
      :mode="workspaceMode"
      :favorite="assetPanelFavorite"
      :category="getCategoryById(assetPanelFavorite?.category)"
      @copy="handleCopyFavorite"
      @use="handleUseFavorite"
      @share="handleShareFavorite"
      @edit="handleEditFavorite"
      @delete="handleDeleteFavorite"
      @favorite-updated="handleFavoriteDetailUpdated"
      @saved="handleEditorSaved"
      @imported="handleImportCompleted"
      @after-leave="handleAssetPanelAfterLeave"
    />

    <FavoriteShareExportDialog
      v-model:show="shareExportVisible"
      :favorite="shareExportFavorite"
    />

    <NModal
      :show="categoryManagerVisible"
      preset="card"
      :title="t('favorites.manager.categoryManager.title')"
      :mask-closable="true"
      :style="{ width: 'min(800px, 90vw)', height: 'min(600px, 80vh)' }"
      @update:show="categoryManagerVisible = $event"
    >
      <CategoryManager @category-updated="handleCategoryUpdated" />
    </NModal>

    <TagManager
      :show="tagManagerVisible"
      @update:show="tagManagerVisible = $event"
      @updated="loadFavorites"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h, inject, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

import { useDebounceFn } from '@vueuse/core'
import {
  NButton,
  NCard,
  NDropdown,
  NEmpty,
  NIcon,
  NInput,
  NPagination,
  NScrollbar,
  NSelect,
  NSpace,
  NText,
} from 'naive-ui'
import { PhDotsThreeVertical as DotsVertical, PhDownload as Download, PhFolder as Folder, PhPlus as Plus, PhMagnifyingGlass as Search, PhTag as Tags, PhTrash as Trash, PhUpload as Upload } from '@phosphor-icons/vue'
import { useI18n } from 'vue-i18n'
import type { FavoriteCategory, FavoritePrompt } from '@prompt-optimizer/core'

import { useFavoriteInitializer } from '../composables/storage/useFavoriteInitializer'
import { useListReveal } from '../composables/ui/useListReveal'
import { useConfirmDialog } from '../composables/ui/useConfirmDialog'
import { useToast } from '../composables/ui/useToast'
import type { AppServices } from '../types/services'
import { getUserFacingErrorMessage } from '../utils/error'
import {
  FAVORITE_UPDATED_EVENT,
  getFavoriteUpdatedEventDetail,
} from '../utils/favorite-events'
import { normalizeFavoriteFunctionMode, type NormalizedFavoriteFunctionMode } from '../utils/favorite-mode'
import { dropdownMenuProps, dropdownNodeProps } from '../utils/dropdown-a11y'
import { createFavoriteResourcePackage } from '../utils/favorite-resource-package'
import CategoryManager from './CategoryManager.vue'
import NModal from './common/AdaptiveModal.vue'
import CategoryTreeSelect from './CategoryTreeSelect.vue'
import FavoriteAssetPanelDialog from './favorites/FavoriteAssetPanelDialog.vue'
import FavoriteShareExportDialog from './favorites/FavoriteShareExportDialog.vue'
import FavoriteWorkspaceListItem from './FavoriteWorkspaceListItem.vue'
import TagManager from './TagManager.vue'

type WorkspaceMode = 'detail' | 'edit' | 'create' | 'import'
type LibraryLayout = 'modal' | 'page'
type FavoriteModeFilterKey =
  | 'all'
  | 'basic-system'
  | 'basic-user'
  | 'context-system'
  | 'context-user'
  | 'image-text2image'
  | 'image-image2image'
  | 'image-multiimage'

interface FavoriteModeFilterDefinition {
  value: Exclude<FavoriteModeFilterKey, 'all'>
  functionMode: NormalizedFavoriteFunctionMode
  optimizationMode?: FavoritePrompt['optimizationMode']
  imageSubMode?: FavoritePrompt['imageSubMode']
}

const favoriteModeFilterDefinitions: FavoriteModeFilterDefinition[] = [
  { value: 'basic-system', functionMode: 'basic', optimizationMode: 'system' },
  { value: 'basic-user', functionMode: 'basic', optimizationMode: 'user' },
  { value: 'context-system', functionMode: 'context', optimizationMode: 'system' },
  { value: 'context-user', functionMode: 'context', optimizationMode: 'user' },
  { value: 'image-text2image', functionMode: 'image', imageSubMode: 'text2image' },
  { value: 'image-image2image', functionMode: 'image', imageSubMode: 'image2image' },
  { value: 'image-multiimage', functionMode: 'image', imageSubMode: 'multiimage' },
]

const favoriteModeFilterKeys = new Set<FavoriteModeFilterKey>([
  'all',
  ...favoriteModeFilterDefinitions.map((definition) => definition.value),
])

const isFavoriteModeFilterKey = (value: unknown): value is FavoriteModeFilterKey =>
  typeof value === 'string' && favoriteModeFilterKeys.has(value as FavoriteModeFilterKey)

const { t } = useI18n()

const props = withDefaults(defineProps<{
  active?: boolean
  layout?: LibraryLayout
  initialModeFilter?: FavoriteModeFilterKey
  useFavorite?: (favorite: FavoritePrompt, options?: { applyExample?: boolean; exampleId?: string; exampleIndex?: number }) => boolean | Promise<boolean>
}>(), {
  active: true,
  layout: 'modal',
  initialModeFilter: 'all',
})

const emit = defineEmits<{
  'use-favorite': [favorite: FavoritePrompt, options?: { applyExample?: boolean; exampleId?: string; exampleIndex?: number }]
}>()

const services = inject<Ref<AppServices | null> | null>('services', null)
const message = useToast()
const confirmDialog = useConfirmDialog()

let ensuredDefaultCategoryManager: NonNullable<AppServices['favoriteManager']> | null = null

const ensureDefaultCategoriesForManager = async (
  manager = services?.value?.favoriteManager,
) => {
  if (!manager || manager === ensuredDefaultCategoryManager) return

  const { ensureDefaultCategories } = useFavoriteInitializer(manager)
  await ensureDefaultCategories()
  ensuredDefaultCategoryManager = manager
}

const favorites = ref<FavoritePrompt[]>([])
const categories = ref<FavoriteCategory[]>([])
const currentPage = ref(1)
const searchKeyword = ref('')
const selectedModeFilter = ref<FavoriteModeFilterKey>('all')
const selectedCategory = ref<string>('')
const selectedTags = ref<string[]>([])
const selectedFavorite = ref<FavoritePrompt | null>(null)
const workspaceMode = ref<WorkspaceMode>('detail')
const taskFavorite = ref<FavoritePrompt | null>(null)
const assetPanelVisible = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)

const filtersExpanded = ref(false)
const categoryManagerVisible = ref(false)
const tagManagerVisible = ref(false)
const shareExportVisible = ref(false)
const shareExportFavorite = ref<FavoritePrompt | null>(null)

const isPageLayout = computed(() => props.layout === 'page')
const isMobile = computed(() => viewportWidth.value < 1024)

const pageSize = computed(() => {
  if (isPageLayout.value) {
    if (viewportWidth.value < 768) return 6
    if (viewportWidth.value < 1280) return 8
    return 10
  }

  if (viewportWidth.value < 768) return 3
  if (viewportWidth.value < 1280) return 4
  return 6
})

const getModeFilterLabel = (definition: FavoriteModeFilterDefinition) => {
  if (definition.functionMode === 'basic') {
    return `${t('favorites.manager.card.functionMode.basic')}-${t(`favorites.manager.card.optimizationMode.${definition.optimizationMode}`)}`
  }

  if (definition.functionMode === 'context') {
    const contextModeLabel = definition.optimizationMode === 'system'
      ? t('contextMode.optimizationMode.message')
      : t('contextMode.optimizationMode.variable')
    return `${t('favorites.manager.card.functionMode.context')}-${contextModeLabel}`
  }

  return `${t('favorites.manager.card.functionMode.image')}-${t(`favorites.manager.card.imageSubMode.${definition.imageSubMode}`)}`
}

const favoriteMatchesModeFilter = (favorite: FavoritePrompt, filter: FavoriteModeFilterKey) => {
  if (filter === 'all') return true

  const definition = favoriteModeFilterDefinitions.find((item) => item.value === filter)
  if (!definition) return true

  if (normalizeFavoriteFunctionMode(favorite.functionMode) !== definition.functionMode) return false

  if (definition.functionMode === 'image') {
    return favorite.imageSubMode === definition.imageSubMode
  }

  return favorite.optimizationMode === definition.optimizationMode
}

const favoriteMatchesCategoryFilter = (favorite: FavoritePrompt) => {
  const categoryIds = selectedCategoryIds.value
  if (!categoryIds) return true

  return !!favorite.category && categoryIds.has(favorite.category)
}

const favoriteMatchesSearchFilter = (favorite: FavoritePrompt) => {
  if (!searchKeyword.value) return true

  const keyword = searchKeyword.value.toLowerCase()
  return favorite.title.toLowerCase().includes(keyword)
    || favorite.content.toLowerCase().includes(keyword)
    || (favorite.description?.toLowerCase().includes(keyword) ?? false)
}

const baseFilteredFavorites = computed(() => favorites.value.filter((favorite) =>
  favoriteMatchesModeFilter(favorite, selectedModeFilter.value)
  && favoriteMatchesCategoryFilter(favorite)
  && favoriteMatchesSearchFilter(favorite),
))

const filteredFavorites = computed(() => {
  if (selectedTags.value.length === 0) {
    return baseFilteredFavorites.value
  }

  return baseFilteredFavorites.value.filter((favorite) =>
    selectedTags.value.every((tag) => favorite.tags.includes(tag)),
  )
})

const modeFilterOptions = computed(() => {
  const allOption = {
    value: 'all' as FavoriteModeFilterKey,
    label: t('favorites.manager.allModes'),
    count: favorites.value.length,
  }

  const options = favoriteModeFilterDefinitions.map((definition) => ({
    value: definition.value,
    label: getModeFilterLabel(definition),
    count: favorites.value.filter((favorite) => favoriteMatchesModeFilter(favorite, definition.value)).length,
  }))

  return [allOption, ...options]
})

const visibleModeFilterOptions = computed(() =>
  modeFilterOptions.value.filter((option) =>
    option.value === 'all'
    || option.count > 0
    || option.value === selectedModeFilter.value,
  ),
)

const popularTagFilters = computed(() => {
  const tagCountMap = new Map<string, number>()

  baseFilteredFavorites.value.forEach((favorite) => {
    favorite.tags.forEach((tag) => {
      tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagCountMap.entries())
    .sort(([tagA, countA], [tagB, countB]) => countB - countA || tagA.localeCompare(tagB))
    .slice(0, 10)
    .map(([tag, count]) => ({
      label: tag,
      value: tag,
      count,
    }))
})

const categoryChildrenByParent = computed(() => {
  const map = new Map<string, FavoriteCategory[]>()
  categories.value.forEach((category) => {
    if (!category.parentId) return

    const siblings = map.get(category.parentId) || []
    siblings.push(category)
    map.set(category.parentId, siblings)
  })
  return map
})

const selectedCategoryIds = computed(() => {
  if (!selectedCategory.value) return null
  return new Set(getCategoryWithDescendants(selectedCategory.value))
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredFavorites.value.length / pageSize.value)))

const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredFavorites.value.slice(start, start + pageSize.value)
})

const paginatedFavoriteIdSignature = computed(() => paginatedFavorites.value.map((favorite) => favorite.id).join('|'))

// M5 (step 7): rows stagger in once, on first mount with content — never
// on scroll, pagination, or filter change. The row roots carry no bound
// inline :style, so revealList's clearProps cannot strip anything.
const listRootRef = ref<HTMLElement | null>(null)
useListReveal(
  () => [...(listRootRef.value?.querySelectorAll('.favorite-workspace-list-item') ?? [])],
  () => paginatedFavorites.value.length > 0,
)

const showPagination = computed(() => filteredFavorites.value.length > pageSize.value)

const tagOptions = computed(() => {
  const allTags = new Set<string>()
  favorites.value.forEach((favorite) => {
    favorite.tags.forEach((tag) => allTags.add(tag))
  })
  return Array.from(allTags)
    .sort()
    .map((tag) => ({
      label: tag,
      value: tag,
    }))
})

const actionMenuOptions = computed(() => [
  ...(isMobile.value ? [{ label: t('favorites.manager.import'), key: 'import', icon: () => h(NIcon, null, { default: () => h(Upload) }) }] : []),
  {
    label: () => h('span', { 'data-testid': 'favorites-manager-action-manage-tags' }, t('favorites.manager.actions.manageTags')),
    key: 'manageTags',
    icon: () => h(NIcon, null, { default: () => h(Tags) }),
  },
  {
    label: () => h('span', { 'data-testid': 'favorites-manager-action-manage-categories' }, t('favorites.manager.actions.manageCategories')),
    key: 'manageCategories',
    icon: () => h(NIcon, null, { default: () => h(Folder) }),
  },
  {
    type: 'divider',
  },
  {
    label: () => h('span', { 'data-testid': 'favorites-manager-action-export' }, t('favorites.manager.actions.export')),
    key: 'export',
    icon: () => h(NIcon, null, { default: () => h(Download) }),
  },
  {
    type: 'divider',
  },
  {
    label: () => h('span', { 'data-testid': 'favorites-manager-action-clear' }, t('favorites.manager.actions.clear')),
    key: 'clear',
    icon: () => h(NIcon, null, { default: () => h(Trash) }),
  },
])

const assetPanelFavorite = computed(() => {
  if (workspaceMode.value === 'edit') {
    return taskFavorite.value
  }
  if (workspaceMode.value === 'detail') {
    return selectedFavorite.value
  }
  return null
})

const syncSelectionWithCurrentView = () => {
  if (!props.active) return

  if (currentPage.value > pageCount.value) {
    currentPage.value = pageCount.value
    return
  }

  if (filteredFavorites.value.length === 0) {
    if (workspaceMode.value === 'detail') {
      selectedFavorite.value = null
      assetPanelVisible.value = false
    }
    return
  }

  if (workspaceMode.value !== 'detail') {
    return
  }

  const selectedId = selectedFavorite.value?.id
  const selectedInFiltered = selectedId
    ? filteredFavorites.value.some((favorite) => favorite.id === selectedId)
    : false
  const selectedInPage = selectedId
    ? paginatedFavorites.value.some((favorite) => favorite.id === selectedId)
    : false

  if (!selectedInFiltered) {
    selectedFavorite.value = null
    if (workspaceMode.value === 'detail') {
      assetPanelVisible.value = false
    }
    return
  }

  if (selectedInPage) {
    selectedFavorite.value = paginatedFavorites.value.find((favorite) => favorite.id === selectedId) || selectedFavorite.value
  }
}

watch(
  () => [
    paginatedFavoriteIdSignature.value,
    filteredFavorites.value.length,
    currentPage.value,
    isMobile.value,
    props.active,
    workspaceMode.value,
  ],
  () => {
    syncSelectionWithCurrentView()
  },
)

watch(
  () => props.initialModeFilter,
  (value) => {
    selectedModeFilter.value = isFavoriteModeFilterKey(value) ? value : 'all'
    currentPage.value = 1
  },
  { immediate: true },
)

watch(
  () => props.active,
  (active) => {
    if (!active) {
      assetPanelVisible.value = false
      workspaceMode.value = 'detail'
      taskFavorite.value = null
      return
    }

    if (!isMobile.value) {
      syncSelectionWithCurrentView()
    }
  },
  { immediate: true },
)

watch(
  () => props.active,
  async (active) => {
    if (!active || !services?.value?.favoriteManager) return

    await Promise.all([loadFavorites(), loadCategories()])
    if (!isMobile.value) {
      syncSelectionWithCurrentView()
    }
  },
  { immediate: false },
)

const getCategoryWithDescendants = (categoryId: string): string[] => {
  if (!categoryId) return []

  const result: string[] = [categoryId]
  const findChildren = (parentId: string) => {
    const children = categoryChildrenByParent.value.get(parentId) || []
    children.forEach((child) => {
      result.push(child.id)
      findChildren(child.id)
    })
  }

  findChildren(categoryId)
  return result
}

const buildErrorMessage = (summary: string, error: unknown) => {
  const fallback = t('common.error')
  const detail = getUserFacingErrorMessage(error, fallback)
  return detail === fallback ? summary : `${summary}: ${detail}`
}

const tryCopyToClipboard = async (text: string, successMessage: string) => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    message.success(successMessage)
    return true
  } catch (error) {
    console.error('[FavoriteManager] Failed to copy favorite content:', error)
    message.error(t('favorites.manager.actions.copyFailed'))
    return false
  }
}

const openPanel = (mode: WorkspaceMode, favorite?: FavoritePrompt | null) => {
  workspaceMode.value = mode

  if (mode === 'detail') {
    taskFavorite.value = null
    if (favorite) {
      selectedFavorite.value = favorite
    }
  } else if (mode === 'edit') {
    taskFavorite.value = favorite || selectedFavorite.value
    if (favorite) {
      selectedFavorite.value = favorite
    }
  } else {
    taskFavorite.value = null
  }

  assetPanelVisible.value = mode !== 'detail' || Boolean(selectedFavorite.value)
}

const handleCategoryUpdated = async () => {
  await loadCategories()
}

const handleCreateFavorite = () => {
  openPanel('create')
}

const openImportPanel = () => {
  openPanel('import')
}

const handleEditorSaved = async (favoriteId: string) => {
  await loadFavorites()
  const updatedFavorite = favorites.value.find((favorite) => favorite.id === favoriteId) || null
  selectedFavorite.value = updatedFavorite
  workspaceMode.value = 'detail'
  taskFavorite.value = null
  assetPanelVisible.value = Boolean(updatedFavorite)
}

const handleImportCompleted = async () => {
  await loadFavorites()

  if (!selectedFavorite.value && filteredFavorites.value.length > 0) {
    selectedFavorite.value = filteredFavorites.value[0]
  }

  workspaceMode.value = 'detail'
  taskFavorite.value = null
  assetPanelVisible.value = false
}

const handleSelectFavorite = (favorite: FavoritePrompt) => openPanel('detail', favorite)

const handleFavoriteDetailUpdated = async (favoriteId: string) => {
  await loadFavorites()
  const updatedFavorite = favorites.value.find((favorite) => favorite.id === favoriteId) || null
  if (updatedFavorite) {
    selectedFavorite.value = updatedFavorite
    taskFavorite.value = workspaceMode.value === 'edit' ? updatedFavorite : taskFavorite.value
  }
}

const handleExternalFavoriteUpdated = (event: Event) => {
  if (!props.active) return

  const detail = getFavoriteUpdatedEventDetail(event)
  if (!detail) return

  void loadFavorites()
}

const handleEditFavorite = (favorite: FavoritePrompt) => {
  openPanel('edit', favorite)
}

const bumpUseCountLocally = (id: string) => {
  const index = favorites.value.findIndex((favorite) => favorite.id === id)
  if (index !== -1) {
    const updated = {
      ...favorites.value[index],
      useCount: favorites.value[index].useCount + 1,
      updatedAt: Date.now(),
    }
    favorites.value.splice(index, 1, updated)

    if (selectedFavorite.value?.id === id) {
      selectedFavorite.value = updated
    }

    if (taskFavorite.value?.id === id) {
      taskFavorite.value = updated
    }
  }
}

const loadFavorites = async () => {
  const servicesValue = services?.value
  if (!servicesValue?.favoriteManager) {
    console.warn(t('favorites.manager.messages.managerNotInitialized'))
    return
  }

  try {
    const data = await servicesValue.favoriteManager.getFavorites()
    favorites.value = data

    if (selectedFavorite.value) {
      selectedFavorite.value = data.find((item) => item.id === selectedFavorite.value?.id) || null
    }

    if (taskFavorite.value) {
      taskFavorite.value = data.find((item) => item.id === taskFavorite.value?.id) || null
    }
  } catch (error) {
    console.error('[FavoriteManager] Failed to load favorites:', error)
    message.error(buildErrorMessage(t('favorites.manager.messages.loadFailed'), error))
  }
}

const loadCategories = async () => {
  const servicesValue = services?.value
  if (!servicesValue?.favoriteManager) {
    console.warn(t('favorites.manager.messages.managerNotInitialized'))
    return
  }

  try {
    categories.value = await servicesValue.favoriteManager.getCategories()
  } catch (error) {
    console.error('[FavoriteManager] Failed to load categories:', error)
    message.error(buildErrorMessage(t('favorites.manager.messages.loadCategoryFailed'), error))
  }
}

const getCategoryById = (id?: string): FavoriteCategory | undefined => {
  if (!id) return undefined
  return categories.value.find((category) => category.id === id)
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const handleModeFilterChange = (value: FavoriteModeFilterKey) => {
  selectedModeFilter.value = value
  handleFilterChange()
}

const handlePopularTagToggle = (tag: string) => {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter((selectedTag) => selectedTag !== tag)
    : [...selectedTags.value, tag]
  handleFilterChange()
}

const handleSearch = () => {
  currentPage.value = 1
}

// EU05-03: typing in the search while the detail sheet is open loses the
// text — the sheet is a modal (NModal) whose focus trap pulls focus back
// inside the sheet the moment the input is focused, so the keystrokes never
// land (a real tap hits the mask and closes the sheet instead, which is
// why this only bites programmatic/keyboard focus). Fix: focusing the
// search dismisses the sheet, and once the sheet is fully closed
// (after-leave, trap released) focus returns to the search input.
const searchInputRef = ref<InstanceType<typeof NInput> | null>(null)
const pendingSearchFocus = ref(false)

const handleSearchFocus = () => {
  if (!assetPanelVisible.value) return
  pendingSearchFocus.value = true
  assetPanelVisible.value = false
}

const handleAssetPanelAfterLeave = () => {
  if (!pendingSearchFocus.value) return
  pendingSearchFocus.value = false
  // EU05-03 (fix 2): the refocus must be deferred past Naive's focus-trap
  // teardown — the trap restores focus to the sheet opener (the list item)
  // after after-leave fires, so a synchronous focus() here loses. A short
  // macrotask delay lets the trap finish first; the search input is the
  // only sensible focus target at that point (the user just tapped it).
  window.setTimeout(() => {
    searchInputRef.value?.focus()
  }, 50)
}

const handleCopyFavorite = async (favorite: FavoritePrompt) => {
  const copied = await tryCopyToClipboard(favorite.content, t('favorites.manager.actions.copySuccess'))
  if (!copied) return

  await incrementFavoriteUseCount(favorite.id)
}

const handleShareFavorite = (favorite: FavoritePrompt) => {
  shareExportFavorite.value = favorite
  shareExportVisible.value = true
}

const incrementFavoriteUseCount = async (id: string) => {
  const servicesValue = services?.value
  if (servicesValue?.favoriteManager) {
    await servicesValue.favoriteManager.incrementUseCount(id)
  }
  bumpUseCountLocally(id)
}

const handleDeleteFavorite = async (favorite: FavoritePrompt) => {
  const deletingOpenFavorite = selectedFavorite.value?.id === favorite.id || taskFavorite.value?.id === favorite.id
  const confirmed = await confirmDialog.warning({
    title: t('common.warning'),
    content: t('favorites.manager.actions.deleteConfirm', { title: favorite.title }),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
  })

  if (!confirmed) return

  try {
    const servicesValue = services?.value
    if (servicesValue?.favoriteManager) {
      await servicesValue.favoriteManager.deleteFavorite(favorite.id)
      message.success(t('favorites.manager.actions.deleteSuccess'))
      await loadFavorites()
    } else {
      message.warning(t('favorites.manager.messages.unavailable'))
    }
  } catch (error) {
    message.error(buildErrorMessage(t('favorites.manager.actions.deleteFailed'), error))
  }

  if (selectedFavorite.value?.id === favorite.id) {
    selectedFavorite.value = null
  }

  if (taskFavorite.value?.id === favorite.id) {
    taskFavorite.value = null
    workspaceMode.value = 'detail'
  }

  if (deletingOpenFavorite) {
    assetPanelVisible.value = false
    workspaceMode.value = 'detail'
    taskFavorite.value = null
  }
}

const handleUseFavorite = async (
  favorite: FavoritePrompt,
  options?: { applyExample?: boolean; exampleId?: string; exampleIndex?: number },
) => {
  let used = true

  try {
    if (props.useFavorite) {
      used = await props.useFavorite(favorite, options)
    } else {
      emit('use-favorite', favorite, options)
    }
  } catch (error) {
    console.error('[FavoriteManager] Failed to use favorite:', error)
    return
  }

  if (!used) return

  try {
    await incrementFavoriteUseCount(favorite.id)
  } catch (error) {
    console.error('[FavoriteManager] Failed to increment favorite usage count:', error)
  }
}

const handleActionMenuSelect = async (key: string) => {
  switch (key) {
    case 'import':
      openImportPanel()
      break
    case 'manageTags':
      tagManagerVisible.value = true
      break
    case 'manageCategories':
      categoryManagerVisible.value = true
      break
    case 'export':
      handleExportFavorites()
      break
    case 'clear': {
      const confirmed = await confirmDialog.warning({
        title: t('common.warning'),
        content: t('favorites.manager.actions.clearConfirm'),
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
      })

      if (!confirmed) {
        break
      }

      try {
        const servicesValue = services?.value
        if (servicesValue?.favoriteManager) {
          const allIds = favorites.value.map((favorite) => favorite.id)
          await servicesValue.favoriteManager.deleteFavorites(allIds)
          message.success(t('favorites.manager.actions.clearSuccess'))
          await loadFavorites()
        } else {
          message.warning(t('favorites.manager.messages.unavailable'))
        }
      } catch (error) {
        message.error(buildErrorMessage(t('favorites.manager.actions.clearFailed'), error))
      }
      break
    }
  }
}

const handleExportFavorites = async () => {
  try {
    const servicesValue = services?.value
    if (servicesValue?.favoriteManager) {
      const exportPackage = await createFavoriteResourcePackage({
        favoriteManager: servicesValue.favoriteManager,
        imageStorageServices: [
          servicesValue.favoriteImageStorageService,
          servicesValue.imageStorageService,
        ],
      })
      const url = URL.createObjectURL(exportPackage.blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `favorites_${new Date().toISOString().split('T')[0]}.po-favorites.zip`
      anchor.click()
      URL.revokeObjectURL(url)

      if (exportPackage.missingResourceIds.length > 0) {
        message.warning(t('favorites.manager.actions.exportPartialSuccess', {
          count: exportPackage.missingResourceIds.length,
        }))
      } else {
        message.success(t('favorites.manager.actions.exportSuccess'))
      }
    } else {
      message.warning(t('favorites.manager.messages.unavailable'))
    }
  } catch (error) {
    message.error(buildErrorMessage(t('favorites.manager.actions.exportFailed'), error))
  }
}

const updateViewportWidth = () => {
  if (typeof window !== 'undefined') {
    viewportWidth.value = window.innerWidth
  }
}

const debouncedViewportUpdate = useDebounceFn(updateViewportWidth, 120)

onMounted(() => {
  updateViewportWidth()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', debouncedViewportUpdate)
    window.addEventListener(FAVORITE_UPDATED_EVENT, handleExternalFavoriteUpdated)
  }
})

watch(
  () => services?.value?.favoriteManager,
  async (manager) => {
    if (!manager || manager === ensuredDefaultCategoryManager) return

    try {
      await ensureDefaultCategoriesForManager(manager)
      await Promise.all([loadFavorites(), loadCategories()])
    } catch (error) {
      console.warn('[FavoriteLibraryWorkspace] Failed to initialize favorite manager:', error)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', debouncedViewportUpdate)
    window.removeEventListener(FAVORITE_UPDATED_EVENT, handleExternalFavoriteUpdated)
  }
})
</script>

<style scoped>
.favorites-manager-shell {
  display: flex;
  height: min(90vh, 920px);
  min-height: 620px;
  flex-direction: column;
  gap: 18px;
  overflow: hidden;
  padding: 20px;
}

.favorites-manager-shell--page {
  height: 100%;
  min-height: 0;
  padding: 0;
}

.favorites-manager-toolbar {
  flex: 0 0 auto;
}

.favorites-manager-toolbar-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.favorites-manager-toolbar-row--search {
  align-items: stretch;
}

.favorites-manager-toolbar-leading {
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
}

.favorites-manager-toolbar-row--controls {
  flex-wrap: wrap;
}

.favorites-manager-toolbar-row--discovery {
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
}

.favorites-manager-search {
  flex: 1;
  min-width: 240px;
}

.favorites-manager-count {
  min-width: max-content;
  padding-top: 10px;
}

.favorites-manager-filters {
  flex: 1;
}

.favorites-manager-tag-select {
  width: 220px;
  min-width: 220px;
}

.favorites-manager-actions {
  flex-shrink: 0;
}

.favorites-manager-mode-filter,
.favorites-manager-tag-cloud {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.favorites-manager-tag-cloud {
  justify-content: flex-end;
}

.favorites-manager-tag-cloud-label {
  flex: 0 0 auto;
}

.favorites-manager-filter-label,
.favorites-manager-filter-count {
  display: inline-flex;
  align-items: center;
}

.favorites-manager-filter-count {
  margin-left: 6px;
  opacity: 0.7;
}

.favorites-manager-workspace {
  display: block;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.favorites-manager-workspace--mobile {
  display: block;
}

.favorites-manager-pane {
  display: flex;
  overflow: hidden;
  min-height: 0;
  flex-direction: column;
}

.favorites-manager-pane--list,
.favorites-manager-pane--detail {
  height: 100%;
}

.favorites-manager-pane--library {
  width: 100%;
}

.favorites-manager-pane :deep(.n-card-header),
.favorites-manager-pane :deep(.n-card__header) {
  flex: 0 0 auto;
}

.favorites-manager-pane :deep(.n-card-content),
.favorites-manager-pane :deep(.n-card__content) {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}

.favorites-manager-pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.favorites-manager-scroll {
  flex: 1 1 auto;
  height: auto;
  min-height: 0;
}

.favorites-manager-list {
  min-height: 0;
}

.favorites-manager-grid {
  display: grid;
  min-height: 0;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: 184px;
  gap: 12px;
  align-items: stretch;
}

.favorites-manager-empty {
  display: flex;
  height: 100%;
  min-height: 320px;
  align-items: center;
  justify-content: center;
}

.favorites-manager-pagination {
  display: flex;
  justify-content: center;
  padding-top: 4px;
}

@media (max-width: 1023px) {
  .favorites-manager-shell {
    height: min(88vh, 960px);
    min-height: 540px;
    padding: 16px;
  }

  .favorites-manager-toolbar-row,
  .favorites-manager-pane-header {
    align-items: stretch;
    flex-direction: column;
  }

  .favorites-manager-mode-filter,
  .favorites-manager-tag-cloud {
    justify-content: flex-start;
  }

  .favorites-manager-toolbar-leading {
    width: 100%;
  }

  .favorites-manager-count {
    padding-top: 0;
  }

  .favorites-manager-tag-select {
    width: 100%;
    min-width: 0;
  }

  .favorites-manager-shell--page {
    height: auto;
    min-height: 0;
    overflow: visible;
    padding: 0;
  }

  .favorites-manager-shell--page .favorites-manager-workspace,
  .favorites-manager-shell--page .favorites-manager-pane {
    overflow: visible;
  }

  .favorites-manager-shell--page .favorites-manager-pane--list,
  .favorites-manager-shell--page .favorites-manager-pane--detail {
    height: auto;
  }

  .favorites-manager-shell--page .favorites-manager-pane :deep(.n-card-content),
  .favorites-manager-shell--page .favorites-manager-pane :deep(.n-card__content) {
    overflow: visible;
  }

  .favorites-manager-shell--page .favorites-manager-scroll {
    flex: 0 1 auto;
    height: auto;
  }
}

@media (max-width: 767px) {
  .favorites-manager-filters {
    width: 100%;
  }

  .favorites-manager-filters :deep(> div) {
    flex: 1 1 calc(50% - 6px);
    min-width: 0;
  }

  .favorites-manager-filters :deep(.n-tree-select),
  .favorites-manager-tag-select {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 1023px) {
  .favorites-manager-shell--compact {
    min-height: 0;
    height: 100%;
    padding: 10px;
    gap: 10px;
  }
  .favorites-manager-shell--compact .favorites-manager-toolbar-row--search {
    flex-direction: row;
    align-items: center;
  }
  .favorites-manager-shell--compact .favorites-manager-count {
    display: none;
  }
  .favorites-manager-shell--compact .favorites-manager-toolbar-row--controls {
    gap: 8px;
  }
  .favorites-manager-shell--compact .favorites-manager-actions {
    order: -1;
  }
  .favorites-manager-shell--compact .favorites-manager-mode-filter {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 2px;
  }
  .favorites-manager-shell--compact .favorites-manager-mode-filter :deep(.n-button) {
    flex: none;
  }
  .favorites-manager-shell--compact .favorites-manager-pane-header {
    flex-direction: row;
    align-items: center;
    font-size: 12px;
  }
  .favorites-manager-shell--compact .favorites-manager-grid {
    grid-template-columns: minmax(0, 1fr);
    grid-auto-rows: auto;
    gap: 8px;
  }
  .favorites-manager-shell--compact .favorites-manager-empty {
    min-height: 160px;
  }
  .favorites-manager-shell--compact.favorites-manager-shell--page {
    height: auto;
    padding: 0;
  }
}
/* Slice 8: search + filters share ONE row. Desktop: the wrapper is
   display:contents, so the two rows lay out exactly as before. Mobile
   (compact): the wrapper wraps — search on line 1, actions on line 2 —
   so the ⋮ button is never pushed off-screen (see favorites-fix-11). */
.favorites-manager-toolbar-search-controls {
  display: contents;
}
@media (max-width: 1023px) {
  /* Belt-and-braces: the grid is 1 column on mobile even if the compact
     class is absent — the 320px minmax must never force 2 columns. */
  .favorites-manager-grid {
    grid-template-columns: minmax(0, 1fr);
    grid-auto-rows: auto;
  }
  .favorites-manager-shell--compact .favorites-manager-toolbar-search-controls {
    /* Fix (favorites-fix-11): the row used to be ONE horizontally scrolling
       strip (nowrap + overflow-x:auto). At <=412px search (200px basis) +
       the "Category / Tags" toggle already filled the 370px content width,
       so the ⋮ actions button and Add were pushed off-screen with no scroll
       cue — unreachable by touch. Wrap instead: search takes line 1 full
       width, toggle + ⋮ + Add sit on line 2, all visible without swiping. */
    display: flex;
    flex-wrap: wrap;
    overflow-x: visible;
    gap: 8px;
    align-items: center;
  }
  .favorites-manager-shell--compact .favorites-manager-toolbar-search-controls > .favorites-manager-toolbar-row {
    display: contents;
  }
  .favorites-manager-shell--compact .favorites-manager-search {
    flex: 1 0 200px;
    min-width: 0;
  }
  /* M-C (EU05-02): the tag filter was squeezed to 38px at 360px — only the
     chevron showed, "All Tags" unreadable. The nowrap row + fixed 200px
     widths overflowed the ~340px row, so the tag select collapsed. Let the
     two selects share the row 50/50 (same as the ≤767px rule) and wrap if
     narrower, so each select keeps its label readable. */
  .favorites-manager-shell--compact .favorites-manager-filters {
    flex: 0 0 auto;
    flex-wrap: wrap;
    overflow-x: visible;
  }
  .favorites-manager-shell--compact .favorites-manager-filters :deep(> div) {
    flex: 1 1 calc(50% - 6px);
    min-width: 0;
  }
  .favorites-manager-shell--compact .favorites-manager-tag-select {
    width: 100%;
    min-width: 0;
  }
  /* V-C-FIX (EU05-02 residual): at 360px the category tree-select measured
     180px and its border crossed the tag field by ~10px. The cause is the
     inline min-width: 180px from CategoryTreeSelect's default style prop
     (CategoryTreeSelect.vue) — inline beats every stylesheet rule, so the
     50/50 flex basis could not shrink it. Override the inline min-width
     (!important beats inline) so the control honors its flex share. The
     label only needs ~136px at 14px, so "All Categories" still reads in
     full at 158px (and would still fit even at 16px, ~150px). Desktop is
     untouched (compact scope only); at 412px the basis is 184px, so the
     control just grows 4px. */
  .favorites-manager-shell--compact .favorites-manager-filters :deep(.n-tree-select) {
    min-width: 0 !important;
  }
  .favorites-manager-shell--compact .favorites-manager-actions {
    flex: 0 0 auto;
    order: 0;
  }
  /* Fix (favorites-fix-12): the ⋮ actions button measured 46x36px — below
     the design system's 44px minimum touch target. Floor it to 44x44px
     on compact/mobile only; width was already 46px, so this only adds
     height. Scoped to this button so the wrap fix above is untouched. */
  .favorites-manager-shell--compact .favorites-manager-actions :deep([data-testid="favorites-manager-actions"]) {
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }
  .favorites-manager-shell--compact .favorites-manager-tag-cloud {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 2px;
  }
  .favorites-manager-shell--compact .favorites-manager-tag-cloud :deep(.n-button) {
    flex: none;
  }
  .favorites-manager-shell--compact.favorites-manager-shell--page {
    height: auto;
    padding: 0;
  }
}
</style>
