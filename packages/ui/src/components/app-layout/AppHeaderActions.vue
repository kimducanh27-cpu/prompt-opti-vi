<template>
    <!--
        App 头部操作按钮组件

        职责:
        - 核心功能按钮: 模板管理、历史记录、模型管理、收藏夹、数据管理
        - 辅助功能: 主题切换、GitHub 链接、语言切换、更新检查

        设计说明:
        - 从 App.vue 的 #actions slot 提取出来
        - 所有操作通过 emits 通知父组件处理
        - 收藏夹是页面型目的地，其余管理入口保持弹窗型交互
        - Slice 5: buttons are PoButton (the only button primitive). The
          `action-button` / `action-button-label` classes are the hook the
          desktop header in MainLayout.vue uses for its container-query
          label collapse — keep them on the PoButton / label span.
    -->
    <!-- 页面型管理入口：会接管主内容区 -->
    <div class="page-destination-group" data-testid="header-page-destinations">
        <PoButton
            class="action-button"
            :class="{ 'page-destination-active': favoritesActive }"
            :variant="favoritesActive ? 'primary' : 'secondary'"
            size="md"
            round
            data-testid="header-favorites-page-action"
            :title="$t('favorites.page.title')"
            :aria-current="favoritesActive ? 'page' : undefined"
            @click="emit('open-favorites')"
        >
            <template #icon><Star aria-hidden="true" class="text-base sm:text-lg" /></template>
            <span class="action-button-label">{{ $t('nav.favorites') }}</span>
        </PoButton>
    </div>

    <!-- 弹窗型管理/配置入口 -->
    <div class="modal-action-group" data-testid="header-modal-actions">
        <PoButton
            class="action-button"
            variant="secondary"
            size="md"
            round
            :title="$t('nav.templates')"
            @click="emit('open-templates')"
        >
            <template #icon><FileText aria-hidden="true" class="text-base sm:text-lg" /></template>
            <span class="action-button-label">{{ $t('nav.templates') }}</span>
        </PoButton>
        <PoButton
            class="action-button"
            variant="secondary"
            size="md"
            round
            :title="$t('nav.history')"
            @click="emit('open-history')"
        >
            <template #icon><ClockCounterClockwise aria-hidden="true" class="text-base sm:text-lg" /></template>
            <span class="action-button-label">{{ $t('nav.history') }}</span>
        </PoButton>
        <PoButton
            class="action-button nav-config-action"
            variant="secondary"
            size="md"
            round
            :title="$t('nav.modelManager')"
            @click="emit('open-model-manager')"
        >
            <template #icon><Gear aria-hidden="true" class="text-base sm:text-lg" /></template>
            <span class="action-button-label">{{ $t('nav.modelManager') }}</span>
        </PoButton>
        <NBadge :show="backupReminderDue" dot processing>
            <PoButton
                class="action-button nav-config-action"
                :class="{ 'backup-reminder-due': backupReminderDue }"
                variant="secondary"
                size="md"
                round
                @click="emit('open-data-manager')"
                :title="backupReminderDue ? $t('dataManager.backupReminder.tooltip') : $t('nav.dataManager')"
            >
                <template #icon><FloppyDisk aria-hidden="true" class="text-base sm:text-lg" /></template>
                <span class="action-button-label">{{ $t('nav.dataManager') }}</span>
            </PoButton>
        </NBadge>
        <PoButton
            class="action-button nav-config-action"
            variant="secondary"
            size="md"
            round
            :title="$t('nav.variableManager')"
            @click="emit('open-variables')"
        >
            <template #icon><Function aria-hidden="true" class="text-base sm:text-lg" /></template>
            <span class="action-button-label">{{ $t('nav.variableManager') }}</span>
        </PoButton>
    </div>
    <!-- 辅助功能区 - 使用简化样式降低视觉权重 -->
    <ThemeToggleUI />
    <div class="aux-icon-group">
        <PoButton
            variant="ghost"
            icon-only
            :aria-label="$t('updater.viewOnGitHub')"
            @click="emit('open-github')"
        >
            <template #icon>
                <GitHubIcon class="w-4 h-4" size="1em" />
            </template>
        </PoButton>
        <NPopover
            v-model:show="showAboutPopover"
            trigger="click"
            placement="bottom-end"
            :show-arrow="false"
        >
            <template #trigger>
                <PoButton
                    variant="ghost"
                    icon-only
                    :aria-label="$t('nav.about')"
                >
                    <template #icon>
                        <UiInfo />
                    </template>
                </PoButton>
            </template>

            <div class="about-panel">
                <div class="about-panel-header">
                    <NTag round size="small" class="about-version-tag">{{ appVersion }}</NTag>
                </div>

                <PoButton variant="ghost" block class="about-link-button" @click="handleOpenWebsite">
                    <span class="about-link-copy">
                        <span class="about-link-label">{{ $t('about.website') }}</span>
                        <span class="about-link-value">{{ $t('about.websiteLabel') }}</span>
                    </span>
                    <UiArrowUpRight class="about-link-icon" aria-hidden="true" />
                </PoButton>

                <PoButton variant="ghost" block class="about-link-button" @click="handleOpenDocs">
                    <span class="about-link-copy">
                        <span class="about-link-label">{{ $t('about.documentation') }}</span>
                        <span class="about-link-value">{{ $t('about.documentationLabel') }}</span>
                    </span>
                    <UiArrowUpRight class="about-link-icon" aria-hidden="true" />
                </PoButton>
            </div>
        </NPopover>
        <LanguageSwitchDropdown />
        <!-- 自动更新组件 - 仅在Electron环境中显示 -->
        <UpdaterIcon />
    </div>
</template>

<script setup lang="ts">
import { PhInfo as UiInfo, PhArrowUpRight as UiArrowUpRight, PhStar as Star, PhFileText as FileText, PhClockCounterClockwise as ClockCounterClockwise, PhGear as Gear, PhFloppyDisk as FloppyDisk, PhFunction as Function } from '@phosphor-icons/vue'
import GitHubIcon from '../icons/GitHubIcon.vue'
/**
 * App 头部操作按钮组件
 *
 * @description
 * 从 App.vue 提取出的头部操作按钮组件，用于 MainLayoutUI 的 #actions slot。
 * 包含核心功能按钮和辅助功能按钮两部分。
 *
 * @features
 * - 核心功能: 模板管理、历史记录、模型管理、收藏夹、数据管理
 * - 辅助功能: 主题切换、GitHub 链接、语言切换、更新检查
 * - 所有操作通过 emits 通知父组件
 *
 * @example
 * ```vue
 * <template #actions>
 *   <AppHeaderActions
 *     @open-templates="openTemplateManager"
 *     @open-history="historyManager.showHistory = true"
 *     @open-model-manager="modelManager.showConfig = true"
 *     @open-favorites="openFavoritesPage"
 *     @open-data-manager="showDataManager = true"
 *     :app-version="appVersion"
 *     @open-website="openOfficialWebsite"
 *     @open-docs="openDocumentationSite"
 *     @open-github="openGithubRepo"
 *   />
 * </template>
 * ```
 */
import { ref } from 'vue'

import PoButton from '../primitives/PoButton.vue'
import ThemeToggleUI from '../ThemeToggleUI.vue'
import LanguageSwitchDropdown from '../LanguageSwitchDropdown.vue'
import UpdaterIcon from '../UpdaterIcon.vue'
import { NBadge, NPopover, NTag } from 'naive-ui'

interface Props {
    appVersion: string
    favoritesActive?: boolean
    backupReminderDue?: boolean
}

withDefaults(defineProps<Props>(), {
    favoritesActive: false,
    backupReminderDue: false,
})

// ========================
// Emits 定义
// ========================
const emit = defineEmits<{
    /** 打开模板管理器 */
    'open-templates': []
    /** 打开历史记录 */
    'open-history': []
    /** 打开模型管理器 */
    'open-model-manager': []
    /** 打开收藏夹 */
    'open-favorites': []
    /** 打开数据管理器 */
    'open-data-manager': []
    /** 打开变量管理器 */
    'open-variables': []
    /** 打开官网 */
    'open-website': []
    /** 打开文档站 */
    'open-docs': []
    /** 打开 GitHub 仓库 */
    'open-github': []
}>()

const showAboutPopover = ref(false)

const handleOpenWebsite = () => {
    showAboutPopover.value = false
    emit('open-website')
}

const handleOpenDocs = () => {
    showAboutPopover.value = false
    emit('open-docs')
}
</script>

<style scoped>
.aux-icon-group {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-1-5);
    margin-left: var(--spacing-1-5);
}

.page-destination-group,
.modal-action-group {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2);
}

.page-destination-group {
    padding-right: var(--spacing-2);
    border-right: 1px solid var(--color-border);
}

.page-destination-active {
    box-shadow: 0 0 0 var(--spacing-0-5) color-mix(in srgb, var(--color-accent) 18%, transparent);
}

/* Stale-backup state (PoButton has no warning variant): a warning border
   plus the NBadge dot — never colour alone, and the title carries the
   tooltip text. */
.backup-reminder-due {
    border-color: var(--color-status-warning-text);
}

.about-panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1-5);
    /* No width token exists for a popover panel; 220–260px is the
       pre-existing panel width, kept. */
    min-width: 220px;
    max-width: 260px;
}

.about-panel-header {
    display: flex;
    justify-content: flex-end;
}

.about-version-tag {
    max-width: 100%;
}

.about-link-button {
    width: 100%;
    justify-content: space-between;
    gap: var(--spacing-3);
}

.about-link-copy {
    display: inline-flex;
    align-items: baseline;
    gap: var(--spacing-2);
    min-width: 0;
    text-align: left;
}

.about-link-label {
    flex-shrink: 0;
    font-size: var(--text-supporting);
    color: var(--color-text-secondary);
}

.about-link-value {
    min-width: 0;
    font-size: var(--text-supporting);
    font-weight: 600;
    color: var(--color-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.about-link-icon {
    width: var(--spacing-3);
    height: var(--spacing-3);
    flex-shrink: 0;
    color: var(--color-text-secondary);
}
</style>
