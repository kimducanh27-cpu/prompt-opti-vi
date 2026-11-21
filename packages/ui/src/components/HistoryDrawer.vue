<template>
  <!-- Slice 7: PoSheet — mobile bottom sheet (max 90dvh), desktop card ≤720px
       (was 90vw / max 1200px / 85vh). The chain-detail view is a sheet page
       inside this one sheet (was a nested modal): opening a chain replaces
       the list, Back returns to it, and the list stays mounted (scroll and
       filter preserved). Closing from the detail page goes back to the list;
       closing from the list closes the drawer. -->
  <PoSheet
    :show="show"
    :title="showDetailPage ? undefined : t('history.title')"
    class="history-manager-sheet"
    @update:show="onSheetUpdateShow"
  >
    <!-- R3C-04: Naive Card renders `title` INSTEAD of the #header slot
         (`mergedChildren = title ? title : children` in Card.mjs), so with
         :title always set this back button never rendered. The title is
         undefined exactly while the detail page is open (the header slot
         only exists then); the list view keeps its title. Same class as the
         Tool editor back-chevron (H3-NEW-01). The #header-extra version
         select still renders — Card renders header-extra independently of
         the title/header choice. -->
    <template v-if="showDetailPage" #header>
      <div class="po-sheet-page-heading">
        <PoButton variant="ghost" data-testid="history-detail-back" @click="mobileChainId = null">
          <template #icon>
            <UiChevronLeft :size="20" />
          </template>
          {{ t('history.title') }}
        </PoButton>
      </div>
    </template>
    <template #header-extra>
      <NSelect v-if="showDetailPage" v-model:value="mobileVersionId" :options="mobileVersionOptions" :aria-label="t('workspace.promptVersion')" />
      <NSpace v-else-if="!isCompact" align="center" :size="12">
        <NInput
          v-model:value="searchQuery"
          :placeholder="t('history.searchPlaceholder')"
          size="small"
          style="width: 200px"
          clearable
        >
          <template #prefix>
            <Search :size="14" />
          </template>
        </NInput>
        <NButton
          v-if="sortedHistory && sortedHistory.length > 0"
          @click="handleClear"
          size="small"
          quaternary
        >
          {{ t('common.clear') }}
        </NButton>
      </NSpace>
    </template>

    <div v-if="isCompact" v-show="!showDetailPage" ref="mobileListRef" class="mobile-history" data-testid="mobile-history-list">
      <div class="mobile-history-filters">
        <NInput v-model:value="searchQuery" :placeholder="t('history.searchPlaceholder')" clearable :aria-label="t('common.search')" />
        <NSelect v-model:value="mobileModeFilter" :options="mobileModeOptions" :placeholder="t('workspace.switchMode')" clearable :aria-label="t('workspace.switchMode')" />
      </div>
      <div class="mobile-history-list-actions">
        <NText depth="3">{{ t('history.title') }} · {{ mobileHistory.length }}</NText>
        <NButton v-if="sortedHistory.length" quaternary size="small" @click="handleClear">{{ t('common.clear') }}</NButton>
      </div>
      <article v-for="chain in visibleMobileHistory" :key="chain.chainId" class="mobile-history-row">
        <button class="mobile-history-open" type="button" @click="openMobileChain(chain, $event)">
          <span class="mobile-history-row-meta">
            <strong>{{ getMobileModeLabel(chain) }}</strong>
            <span>{{ t('common.version', { version: chain.currentRecord.version }) }}</span>
          </span>
          <span class="mobile-history-summary">{{ chain.rootRecord.originalPrompt }}</span>
          <time>{{ formatDate(chain.currentRecord.timestamp) }}</time>
        </button>
        <NDropdown trigger="click" :options="[{ key: 'delete', label: t('common.delete') }]" @select="deleteChain(chain.chainId)">
          <NButton quaternary size="small" :aria-label="t('history.actionsFor', { title: chain.rootRecord.originalPrompt })"><template #icon><Ellipsis /></template></NButton>
        </NDropdown>
      </article>
      <NEmpty v-if="!mobileHistory.length" :description="t('history.noHistory')" role="status" aria-live="polite" />
      <!-- P-003: paginated — "Load more" appends the next 20 chains. The
           label uses common.loadMore (M-G added the key in all 4 locales;
           same string as promptGarden.loadMore). -->
      <NButton v-if="hasMoreHistory" block quaternary @click="loadMoreHistory">{{ t('common.loadMore') }}</NButton>
    </div>
    <NScrollbar v-else ref="desktopScrollRef" style="max-height: 65vh;">
      <NSpace vertical :size="16" v-if="sortedHistory && sortedHistory.length > 0">
        <NCard
          v-for="chain in visibleDesktopHistory"
          :key="chain.chainId"
          class="desktop-history-row"
          hoverable
        >
          <template #header>
            <NSpace justify="space-between" align="center">
              <NSpace align="center" :size="8">
                <NText depth="3" style="font-size: 14px;">
                  {{ t('common.createdAt') }} {{ formatDate(chain.rootRecord.timestamp) }}
                </NText>
                <!-- 功能模式标签 -->
                <NTag
                  :type="getFunctionModeTagType(chain.rootRecord.type)"
                  size="small"
                >
                  {{ getFunctionModeLabel(chain.rootRecord.type) }}
                </NTag>
                <!-- 优化模式标签 -->
                <NTag
                  v-if="chain.rootRecord.type === 'optimize'"
                  type="info"
                  size="small"
                >
                  {{ t('common.system') }}
                </NTag>
                <NTag
                  v-if="chain.rootRecord.type === 'userOptimize'"
                  type="success"
                  size="small"
                >
                  {{ t('common.user') }}
                </NTag>
                <!-- 上下文模式优化标签 -->
                <NTag
                  v-if="isMessageOptimizationType(chain.rootRecord.type)"
                  type="warning"
                  size="small"
                >
                  {{ t('contextMode.optimizationMode.message') }}
                </NTag>
                <NTag
                  v-if="chain.rootRecord.type === 'contextUserOptimize'"
                  type="success"
                  size="small"
                >
                  {{ t('contextMode.optimizationMode.variable') }}
                </NTag>
                <!-- 图像模式优化类型标签 -->
                <NTag
                  v-if="chain.rootRecord.type === 'text2imageOptimize'"
                  type="success"
                  size="small"
                >
                  {{ t('image.capability.text2image') }}
                </NTag>
                <NTag
                  v-if="chain.rootRecord.type === 'image2imageOptimize'"
                  type="warning"
                  size="small"
                >
                  {{ t('image.capability.image2image') }}
                </NTag>
                <NTag
                  v-if="chain.rootRecord.type === 'multiimageOptimize'"
                  type="error"
                  size="small"
                >
                  {{ t('imageMode.multiimage') }}
                </NTag>
                <SourceAssetBadge
                  v-if="getChainSource(chain)"
                  :source="getChainSource(chain)!"
                />
              </NSpace>
              <NButton
                @click="deleteChain(chain.chainId)"
                size="small"
                type="error"
                quaternary
                :title="$t('common.delete')"
              >
                {{ $t('common.delete') }}
              </NButton>
            </NSpace>
          </template>
          
          <NText style="font-size: 14px; word-break: break-all;">
            {{ chain.rootRecord.originalPrompt }}
          </NText>

          
          <!-- 版本列表 -->
          <NDivider style="margin: 16px 0;" />
          <NSpace vertical :size="12">
            <NCollapse
              v-for="record in reversedVersionsByChain.get(chain.chainId) ?? []"
              :key="record.id"
              :default-expanded-names="expandedVersions[record.id] ? [record.id] : []"
              @update:expanded-names="(names: Array<string | number> | null) => expandedVersions[record.id] = Array.isArray(names) && names.includes(record.id)"
            >
              <NCollapseItem
                :name="record.id"
              >
                <template #header>
                  <NSpace align="center" :size="12" style="width: 100%;">
                    <NText strong style="font-size: 14px;">
                      {{ t('common.version', { version: record.version }) }}
                    </NText>
                    <NText depth="3" style="font-size: 12px;">
                      {{ formatDate(record.timestamp) }}
                    </NText>
                    <NText depth="3" style="font-size: 12px;">
                      {{ record.modelName || record.modelKey }}
                    </NText>
                    <NText 
                      v-if="record.type === 'iterate' && record.iterationNote" 
                      depth="3" 
                      style="font-size: 12px;"
                    >
                      - {{ truncateText(record.iterationNote, 30) }}
                    </NText>
                  </NSpace>
                </template>
                
                <template #header-extra>
                  <NSpace @click.stop>
                    <NTag
                      v-if="record.type === 'iterate'"
                      size="small"
                      type="warning"
                    >
                      {{ t('common.iterate') }}
                    </NTag>
                    <NButton
                      @click="reuse(record, chain)"
                      size="small"
                      quaternary
                    >
                      {{ t('common.use') }}
                    </NButton>
                  </NSpace>
                </template>

                <NSpace vertical :size="12">
                  <div v-if="record.iterationNote">
                    <NText strong style="font-size: 12px;">{{ $t('history.iterationNote') }}:</NText>
                    <NText depth="3" style="font-size: 12px; margin-left: 8px;">{{ record.iterationNote }}</NText>
                  </div>
                  
                  <div>
                    <NText depth="3" style="font-size: 12px;">{{ $t('history.optimizedPrompt') }}:</NText>
                    <NText style="font-size: 14px; white-space: pre-wrap; margin-top: 8px; display: block;">
                      {{ record.optimizedPrompt }}
                    </NText>
                  </div>
                  
                  <div style="display: flex; justify-content: flex-end;">
                    <NButton
                      @click="reuse(record, chain)"
                      size="small"
                      type="primary"
                      quaternary
                    >
                      {{ $t('history.useThisVersion') }}
                    </NButton>
                  </div>
                </NSpace>
              </NCollapseItem>
            </NCollapse>
          </NSpace>
        </NCard>
        <!-- P-003: paginated — "Load more" appends the next 20 chains. -->
        <NButton v-if="hasMoreHistory" block @click="loadMoreHistory">{{ t('common.loadMore') }}</NButton>
      </NSpace>
      
      <NEmpty v-else :description="$t('history.noHistory')" role="status" aria-live="polite">
        <template #icon>
          <History :size="48" />
        </template>
      </NEmpty>
    </NScrollbar>

    <!-- Sheet page: the chain detail replaces the list (v-show keeps the list
         mounted, including its scroll position and filter). -->
    <div v-if="showDetailPage && mobileChain && mobileRecord" class="mobile-history-content" data-testid="mobile-history-detail">
        <div class="mobile-history-record-meta">
          <span>{{ mobileRecord.modelName || mobileRecord.modelKey }}</span>
          <time>{{ formatDate(mobileRecord.timestamp) }}</time>
        </div>
        <SourceAssetBadge v-if="getChainSource(mobileChain)" :source="getChainSource(mobileChain)!" />
        <details class="mobile-history-original">
          <summary>{{ t('promptOptimizer.originalPrompt') }}</summary>
          <OutputPlainText :content="mobileChain.rootRecord.originalPrompt" />
        </details>
        <details v-if="mobileRecord.iterationNote" class="mobile-history-original">
          <summary>{{ t('history.iterationNote') }}</summary>
          <OutputPlainText :content="mobileRecord.iterationNote" />
        </details>
        <OutputPlainText class="mobile-history-body" :content="mobileRecord.optimizedPrompt" />
    </div>
    <template v-if="showDetailPage" #footer>
      <div v-if="mobileChain && mobileRecord" class="mobile-history-restore">
        <span>{{ t('workspace.title') }} · {{ getMobileModeLabel(mobileChain, mobileRecord) }}</span>
        <NButton type="primary" @click="reuse(mobileRecord, mobileChain)">{{ t('history.useThisVersion') }}</NButton>
      </div>
    </template>
  </PoSheet>
</template>

<script setup lang="ts">
import { PhMagnifyingGlass as Search, PhClockCounterClockwise as History, PhDotsThree as Ellipsis, PhCaretLeft as UiChevronLeft } from '@phosphor-icons/vue'
import OutputPlainText from './OutputPlainText.vue'
import PoSheet from './primitives/PoSheet.vue'
import PoButton from './primitives/PoButton.vue'
import { ref, watch, computed, nextTick, type PropType } from 'vue'

import { useI18n } from 'vue-i18n'
import {
   NScrollbar, NSpace, NCard, NText, NTag, NButton,
  NDivider, NCollapse, NCollapseItem, NEmpty, NInput, NSelect, NDropdown
} from 'naive-ui'
import type { PromptRecord, PromptRecordChain } from '@prompt-optimizer/core'
import { useConfirmDialog } from '../composables/ui/useConfirmDialog'
import { useToast } from '../composables/ui/useToast'
import { useWorkspaceLayout } from '../composables/ui/useWorkspaceLayout'
import { useListReveal } from '../composables/ui/useListReveal'
import { useDebounceThrottle } from '../composables/performance/useDebounceThrottle'
import SourceAssetBadge from './source/SourceAssetBadge.vue'
import { extractHistorySourceBinding } from '../utils/history-source-binding'
import { resolveSourceAssetRef } from '../utils/source-asset'

const props = defineProps({
  show: Boolean,
  history: {
    type: Array as PropType<PromptRecordChain[]>,
    default: () => []
  }
})

const { t } = useI18n()
const { isCompact } = useWorkspaceLayout()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'reuse', context: {
    record: PromptRecord,
    chainId: string,
    rootPrompt: string,
    chain: PromptRecordChain
  }): void
  (e: 'clear'): void
  (e: 'deleteChain', chainId: string): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _toast = useToast()
const confirmDialog = useConfirmDialog()
const expandedVersions = ref<Record<string, boolean>>({})
const searchQuery = ref('')
// P-002: the search input feeds filteredHistory, which full-text scans every
// chain + version per keystroke. Debounce the applied query so typing only
// re-filters 200ms after the last keystroke (reuse useDebounceThrottle —
// do not add a second debounce helper).
const debouncedSearchQuery = ref('')
const { debounce, cancel: cancelDebouncedSearch } = useDebounceThrottle()
const applySearchQuery = debounce((value: string) => {
  debouncedSearchQuery.value = value
}, 200, false, 'history-search')
watch(searchQuery, (value) => applySearchQuery(value))
const mobileModeFilter = ref<string | null>(null)
const mobileChainId = ref<string | null>(null)
const mobileVersionId = ref<string | null>(null)
const mobileChain = computed(() => props.history.find(chain => chain.chainId === mobileChainId.value))
const mobileRecord = computed(() => mobileChain.value?.versions.find(record => record.id === mobileVersionId.value)
  ?? mobileChain.value?.currentRecord)
const mobileVersionOptions = computed(() => (mobileChain.value?.versions ?? []).slice().reverse().map(record => ({
  label: t('common.version', { version: record.version }), value: record.id,
})))
// Slice 7: the chain-detail sheet page (compact only; desktop keeps the
// inline card list with its version tree).
const showDetailPage = computed(() => isCompact.value && !!mobileChain.value)
const mobileModeOptions = computed(() => [
  { value: 'system', label: t('workspace.systemMode') },
  { value: 'user', label: t('workspace.userMode') },
  { value: 'multi', label: t('contextMode.optimizationMode.message') },
  { value: 'variable', label: t('contextMode.optimizationMode.variable') },
  { value: 'text2image', label: t('image.capability.text2image') },
  { value: 'image2image', label: t('image.capability.image2image') },
  { value: 'multiimage', label: t('imageMode.multiimage') },
])

// Match the existing restore destination, including old image records' metadata.
const getMobileMode = (chain: PromptRecordChain, record = chain.currentRecord): string => {
  const type = chain.rootRecord.type as string
  if (type === 'userOptimize') return 'user'
  if (type === 'conversationMessageOptimize') return 'multi'
  if (type === 'contextUserOptimize') return 'variable'
  if (type === 'contextSystemOptimize' || type === 'contextIterate') {
    return chain.rootRecord.metadata?.optimizationMode === 'user' ? 'variable' : 'multi'
  }
  if (type === 'multiimageOptimize') return 'multiimage'
  if (type === 'image2imageOptimize') return 'image2image'
  if (type === 'text2imageOptimize') return 'text2image'
  if (['imageOptimize', 'contextImageOptimize', 'imageIterate'].includes(type)) {
    const metadata = record.metadata ?? chain.rootRecord.metadata
    return metadata?.hasInputImage === true ? 'image2image' : 'text2image'
  }
  return type !== 'optimize' && chain.rootRecord.metadata?.optimizationMode === 'user' ? 'user' : 'system'
}
const getMobileModeLabel = (chain: PromptRecordChain, record = chain.currentRecord) =>
  mobileModeOptions.value.find(option => option.value === getMobileMode(chain, record))?.label ?? ''
const mobileHistory = computed(() => filteredHistory.value.filter(chain =>
  !mobileModeFilter.value || getMobileMode(chain) === mobileModeFilter.value))
// P-014: the desktop version tree reversed the versions array inline in
// the template on every render for every chain. Cache one reversed copy
// per chain id; the computed rebuilds only when props.history changes.
const reversedVersionsByChain = computed(() => {
  const map = new Map<string, PromptRecord[]>()
  for (const chain of props.history) map.set(chain.chainId, [...chain.versions].reverse())
  return map
})
// R3C-02 (a)/(b): the detail page is a sheet-internal page transition, so
// no PoSheet mechanism can move focus. Remember the row button that opened
// the detail; focus the back button on open, and return focus to the row
// on the way back (back button, or Esc which goes back to the list first).
const lastOpenedRowButton = ref<HTMLElement | null>(null)
const openMobileChain = (chain: PromptRecordChain, event?: MouseEvent | KeyboardEvent) => {
  if (event?.currentTarget instanceof HTMLElement) lastOpenedRowButton.value = event.currentTarget
  mobileVersionId.value = chain.currentRecord.id
  mobileChainId.value = chain.chainId
}
watch(showDetailPage, (isDetail, wasDetail) => {
  if (isDetail) {
    nextTick(() => {
      document.querySelector<HTMLElement>('[data-testid="history-detail-back"]')?.focus()
    })
  } else if (wasDetail) {
    // R3C-02(b): the list is v-show="!showDetailPage", so the row is still
    // display:none when this watcher fires — focus() on a hidden element is
    // a no-op and focus ends up on BODY. A single nextTick is NOT enough
    // (V-F diag7: focus still BODY after Back, Back +1s and Esc) — the
    // v-show flip / sheet page transition hasn't landed when it runs.
    // Retry on animation frames until the row is actually visible, bounded
    // to 500ms so a row that never becomes visible can't spin forever.
    // Re-check containment every attempt: if the sheet closed in the
    // meantime the row is gone (or PoSheet's restoreFocus owns focus) and
    // we must not steal focus back. props.show guards the same window —
    // once the drawer starts closing, stop retrying.
    const row = lastOpenedRowButton.value
    if (row && document.contains(row)) focusRowWhenVisible(row)
  }
})

// R3C-02(b) helper: focus the row only once it is actually visible
// (display:none elements have offsetParent === null and no client rects, so
// focus() on them no-ops). Bounded retry — 500ms covers the sheet page
// transition with margin; after that, give up quietly rather than fighting
// PoSheet's own focus restore.
const focusRowWhenVisible = (row: HTMLElement, deadline = Date.now() + 500) => {
  if (!props.show || !document.contains(row)) return
  if (row.offsetParent !== null && row.getClientRects().length > 0) {
    row.focus()
    return
  }
  if (Date.now() >= deadline) return
  requestAnimationFrame(() => focusRowWhenVisible(row, deadline))
}

// --- Close Logic ---
const close = () => {
  emit('update:show', false)
}

// Slice 7: closing the sheet from the detail page goes back to the list;
// closing from the list closes the drawer.
const onSheetUpdateShow = (value: boolean) => {
  if (value) return
  if (showDetailPage.value) mobileChainId.value = null
  else close()
}

// 修改排序后的历史记录计算属性，使用props.history而不是直接调用historyManager.getAllChains()
// 按照最后修改时间排序，与getAllChains()保持一致
const sortedHistory = computed(() => {
  // P-001: sort a COPY — sorting props.history in place mutated the parent
  // store's array (a prop mutation; the list is shared with the app).
  return [...props.history].sort((a, b) => b.currentRecord.timestamp - a.currentRecord.timestamp)
})

const filteredHistory = computed(() => {
  if (!debouncedSearchQuery.value) return sortedHistory.value

  const query = debouncedSearchQuery.value.toLowerCase()
  return sortedHistory.value.filter(chain => {
    // 匹配原始提示词
    if (chain.rootRecord.originalPrompt.toLowerCase().includes(query)) return true
    
    // 匹配版本中的内容
    return chain.versions.some(record => {
      if (record.optimizedPrompt.toLowerCase().includes(query)) return true
      if (record.iterationNote && record.iterationNote.toLowerCase().includes(query)) return true
      return false
    })
  })
})

// P-003: the history list rendered EVERY chain (desktop cards with full
// version trees, mobile rows) with no cap. Fixed-height virtualization
// (useVirtualScroll) does not fit: rows/cards are variable-height (desktop
// cards range ~150-600px+ with collapsible version trees; mobile rows have
// 1-2 line summaries), and the composable takes a non-reactive plain array
// + fixed itemHeight, so it would mis-position items and not update when
// the filter changes. Paginate instead: render 20 at a time, "Load more"
// appends the next page.
const HISTORY_PAGE_SIZE = 20
const visibleHistoryCount = ref(HISTORY_PAGE_SIZE)
const visibleMobileHistory = computed(() => mobileHistory.value.slice(0, visibleHistoryCount.value))
const visibleDesktopHistory = computed(() => filteredHistory.value.slice(0, visibleHistoryCount.value))

// M5 (step 7): rows stagger in once, on first open with content — never
// on scroll or "Load more". Gated on props.show: the sheet's list content
// stays mounted while closed, so an ungated reveal would run unseen.
// Desktop rows get their own class: Naive NCard rows have no
// distinguishing class, and the mobile rows already carry
// .mobile-history-row. Neither row root binds inline :style, so
// revealList's clearProps cannot strip anything.
const mobileListRef = ref<HTMLElement | null>(null)
const desktopScrollRef = ref<{ $el?: Node } | null>(null)
useListReveal(
  () => {
    // S7-MOTION-02 class: an NScrollbar's $el can be a text node when the
    // content fits (Naive returns slot content), so guard nodeType before
    // calling querySelectorAll. (Proven unreachable in the current template
    // — the gate implies the NSpace renders — but the guard is the class fix.)
    const desktopEl = desktopScrollRef.value?.$el
    const desktopRows =
      desktopEl && desktopEl.nodeType === 1
        ? (desktopEl as Element).querySelectorAll('.desktop-history-row')
        : []
    return [
      ...(mobileListRef.value?.querySelectorAll('.mobile-history-row') ?? []),
      ...desktopRows,
    ]
  },
  () => props.show && (visibleMobileHistory.value.length > 0 || visibleDesktopHistory.value.length > 0),
)
const hasMoreHistory = computed(() => (isCompact.value ? mobileHistory.value.length : filteredHistory.value.length) > visibleHistoryCount.value)
const loadMoreHistory = () => {
  visibleHistoryCount.value += HISTORY_PAGE_SIZE
}
const resetHistoryPagination = () => {
  visibleHistoryCount.value = HISTORY_PAGE_SIZE
}
watch(debouncedSearchQuery, resetHistoryPagination)
watch(mobileModeFilter, resetHistoryPagination)

// 切换版本展开/收起状态
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _toggleVersion = (recordId: string) => {
  expandedVersions.value = {
    ...expandedVersions.value,
    [recordId]: !expandedVersions.value[recordId]
  }
}

// 清空历史记录
const handleClear = async () => {
  const confirmed = await confirmDialog.warning({
    title: t('common.warning'),
    content: t('history.confirmClear'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
  })
  if (!confirmed) return

  emit('clear')
  // 不需要强制刷新，因为现在使用props.history
}

// 监听显示状态变化
watch(() => props.show, (newShow) => {
  if (!newShow) {
    // 关闭时重置所有展开状态和搜索词
    expandedVersions.value = {}
    searchQuery.value = ''
    // P-002: cancel any pending debounced apply and clear the applied
    // query immediately, so reopening never shows a stale filter.
    cancelDebouncedSearch('history-search')
    debouncedSearchQuery.value = ''
    mobileModeFilter.value = null
    mobileChainId.value = null
    mobileVersionId.value = null
    // P-003: back to the first page.
    resetHistoryPagination()
  }
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const reuse = (record: PromptRecord, chain: PromptRecordChain) => {
  emit('reuse', {
    record,
    chainId: chain.chainId,
    rootPrompt: chain.rootRecord.originalPrompt,
    chain
  })
  emit('update:show', false)
}

// 添加文本截断函数
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...'
}

const isMessageOptimizationType = (recordType: string) => {
  return recordType === 'conversationMessageOptimize' || recordType === 'contextSystemOptimize'
}

const getChainSource = (chain: PromptRecordChain) => {
  const source = extractHistorySourceBinding(chain.rootRecord, chain)
  return resolveSourceAssetRef(source.origin, source.assetBinding)
}

// 获取功能模式标签类型
const getFunctionModeTagType = (recordType: string) => {
  if (recordType.includes('image')) {
    return 'warning'
  } else if (recordType.includes('context')) {
    return 'primary'
  } else {
    return 'default'
  }
}

// 获取功能模式标签文本
const getFunctionModeLabel = (recordType: string) => {
  // 图像模式类型
  const imageTypes = ['imageOptimize', 'contextImageOptimize', 'imageIterate', 'text2imageOptimize', 'image2imageOptimize', 'multiimageOptimize']
  // 上下文模式类型（包含新旧类型名以支持向后兼容）
  const contextTypes = ['conversationMessageOptimize', 'contextSystemOptimize', 'contextUserOptimize', 'contextIterate']

  if (imageTypes.includes(recordType)) {
    return t('nav.imageMode')
  } else if (contextTypes.includes(recordType)) {
    return t('nav.contextMode')
  } else {
    return t('nav.basicMode')
  }
}

// 添加删除单条记录的方法
const deleteChain = async (chainId: string) => {
  const confirmed = await confirmDialog.warning({
    title: t('common.warning'),
    content: t('history.confirmDeleteChain'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
  })
  if (!confirmed) return

  emit('deleteChain', chainId)
  // 不需要强制刷新，因为现在使用props.history
}
</script>

<style scoped>
/* Slice 7: PoSheet card hook — the class falls through PoSheet → AdaptiveModal
   → card. */
:global(.workspace-compact .history-manager-sheet.po-sheet--compact.adaptive-modal-sheet > .n-card-header) {
  padding: 10px 12px;
  gap: 8px;
}
:global(.workspace-compact .history-manager-sheet.po-sheet--compact.adaptive-modal-sheet > .n-card-content) {
  padding: 12px !important;
}
:global(.workspace-compact .history-manager-sheet.po-sheet--compact.adaptive-modal-sheet > .n-card__footer) {
  padding: 10px 12px max(10px, env(safe-area-inset-bottom));
}
.po-sheet-page-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.mobile-history-filters {
  display: grid;
  gap: 8px;
}
.mobile-history-list-actions, .mobile-history-row-meta, .mobile-history-record-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.mobile-history-list-actions {
  margin: 4px 0;
}
.mobile-history-row {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  border-bottom: 1px solid var(--compact-border);
}
.mobile-history-open {
  appearance: none;
  border: 0;
  padding: 12px 0;
  background: transparent;
  color: inherit;
  text-align: left;
  min-width: 0;
  flex: 1;
  cursor: pointer;
  font: inherit;
}
.mobile-history-row-meta {
  font-size: 12px;
  color: var(--compact-muted);
}
.mobile-history-row-meta strong {
  color: var(--compact-ink);
  font-weight: 600;
}
.mobile-history-summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  overflow-wrap: anywhere;
  line-height: 1.6;
  margin: 6px 0;
  font-size: 14px;
}
.mobile-history-open time, .mobile-history-record-meta {
  color: var(--compact-muted);
  /* EU07-03: design-system §1.2 — 12px is the minimum body text size; 11px was below it. */
  font-size: 12px;
}
.mobile-history-row > :deep(.n-button) {
  margin-top: 4px;
}
.mobile-history-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.mobile-history-original {
  border-bottom: 1px solid var(--compact-border);
  padding-bottom: 8px;
}
.mobile-history-original summary {
  cursor: pointer;
  color: var(--compact-muted);
  font-size: 12px;
}
.mobile-history-content pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font: inherit;
  font-size: 14px;
  line-height: 1.65;
  margin: 0;
}
.mobile-history-original pre {
  margin-top: 8px;
  font-size: 13px;
}
.mobile-history-restore {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}
.mobile-history-restore > span {
  min-width: 0;
  font-size: 12px;
  color: var(--compact-muted);
}
.mobile-history-restore > :deep(.n-button) {
  flex-shrink: 0;
}
</style> 
