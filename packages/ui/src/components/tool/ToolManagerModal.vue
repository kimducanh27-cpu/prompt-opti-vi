<template>
    <!-- Slice 7: ONE PoSheet (mobile bottom sheet, max 90dvh; desktop card
         <=720px). The editor is a sibling sheet (swap), never a second modal
         stacked on the first. -->
    <PoSheet
        :show="localVisible && !showEditor"
        :title="title || t('contextEditor.toolsTab')"
        class="tool-manager-sheet"
        @update:show="handleVisibilityChange"
    >
        <!-- 工具列表 -->
        <div class="tools-panel">
            <NEmpty
                v-if="localTools.length === 0"
                :description="t('contextEditor.noTools')"
            >
                <template #icon>
                    <UiSettings :size="48" />
                </template>
                <template #extra>
                    <PoButton
                        variant="primary"
                        @click="addTool"
                        :disabled="disabled"
                    >
                        {{ t('contextEditor.addFirstTool') }}
                    </PoButton>
                </template>
            </NEmpty>

            <div v-else class="tool-list">
                <PoRow
                    v-for="(tool, index) in localTools"
                    :key="`tool-${index}`"
                    :title="tool.function.name"
                    :meta="toolMeta(tool)"
                    :chevron="false"
                >
                    <template #action>
                        <NSpace :size="4">
                            <PoButton
                                icon-only
                                variant="ghost"
                                :aria-label="t('common.edit')"
                                :disabled="disabled"
                                @click="editTool(index)"
                            >
                                <template #icon>
                                    <UiSquarePen :size="14" />
                                </template>
                            </PoButton>
                            <PoButton
                                icon-only
                                variant="destructive"
                                :aria-label="t('common.delete')"
                                :disabled="disabled"
                                @click="deleteTool(index)"
                            >
                                <template #icon>
                                    <UiTrash2 :size="14" />
                                </template>
                            </PoButton>
                        </NSpace>
                    </template>
                </PoRow>
            </div>

            <!-- 添加工具按钮 -->
            <div v-if="localTools.length > 0" class="mt-4">
                <PoButton
                    variant="primary"
                    block
                    @click="addTool"
                    :disabled="disabled"
                >
                    <template #icon>
                        <UiPlus />
                    </template>
                    {{ t('contextEditor.addTool') }}
                </PoButton>
            </div>
        </div>

        <!-- 底部操作栏 -->
        <template #action>
            <NSpace justify="end">
                <PoButton variant="secondary" @click="handleCancel" :disabled="loading">
                    {{ t('common.cancel') }}
                </PoButton>
                <PoButton
                    variant="primary"
                    @click="handleConfirm"
                    :loading="loading"
                >
                    {{ t('common.save') }}
                </PoButton>
            </NSpace>
        </template>
    </PoSheet>

    <!-- 工具编辑器 (sibling sheet page; the list sheet hides while open) -->
    <PoSheet
        :show="localVisible && showEditor"
        :title="
            isCompact
                ? undefined
                : editingIndex !== null
                  ? t('contextEditor.editTool')
                  : t('contextEditor.addTool')
        "
        class="tool-editor-sheet"
        @update:show="(value) => !value && closeToolEditor()"
    >
        <!-- H3-NEW-01: Naive Card renders `title` INSTEAD of the #header slot
             (`mergedChildren = title ? title : children`), so with :title
             always set this back-chevron header never rendered. Mirror
             TextModelEditModal: title undefined in compact so the slot shows. -->
        <template v-if="isCompact" #header>
            <div class="po-sheet-page-heading">
                <PoButton
                    variant="ghost"
                    icon-only
                    :aria-label="title || t('contextEditor.toolsTab')"
                    @click="closeToolEditor"
                >
                    <template #icon>
                        <UiChevronLeft />
                    </template>
                </PoButton>
                <span class="po-sheet-page-title">{{
                    editingIndex !== null
                        ? t('contextEditor.editTool')
                        : t('contextEditor.addTool')
                }}</span>
            </div>
        </template>
        <NSpace vertical>
            <!-- 示例提示 -->
            <NAlert
                v-if="editingIndex === null"
                type="info"
                :title="t('contextEditor.exampleTemplate')"
            >
                {{ t('contextEditor.exampleTemplateDesc') }}
            </NAlert>

            <!-- 基本信息 -->
            <NCard size="small" :title="t('contextEditor.basicInfo')">
                <NSpace vertical v-if="editingTool">
                    <NInput
                        v-model:value="editingTool.function.name"
                        :placeholder="t('contextEditor.toolNamePlaceholder')"
                    />
                    <NInput
                        v-model:value="editingTool.function.description"
                        type="textarea"
                        :placeholder="t('contextEditor.toolDescPlaceholder')"
                    />
                </NSpace>
            </NCard>

            <!-- 参数配置 -->
            <NCard size="small" :title="t('contextEditor.parameters')">
                <NInput
                    v-model:value="parametersJson"
                    type="textarea"
                    :autosize="{ minRows: 8, maxRows: 12 }"
                    :placeholder="defaultParametersJson"
                    style="font-family: ui-monospace, monospace"
                />
                <NText v-if="jsonError" type="error" class="mt-2">
                    {{ t('contextEditor.invalidJson') }}: {{ jsonError }}
                </NText>
            </NCard>
        </NSpace>

        <template #action>
            <NSpace>
                <PoButton variant="secondary" @click="closeToolEditor">
                    {{ t('common.cancel') }}
                </PoButton>
                <PoButton
                    variant="secondary"
                    @click="useWeatherExample"
                    v-if="editingIndex === null"
                >
                    {{ t('contextEditor.useExample') }}
                </PoButton>
                <PoButton
                    variant="secondary"
                    @click="useEmptyTemplate"
                    v-if="editingIndex === null"
                >
                    {{ t('contextEditor.startEmpty') }}
                </PoButton>
                <PoButton
                    variant="primary"
                    @click="saveTool"
                    :disabled="!isValidTool"
                >
                    {{ t('common.save') }}
                </PoButton>
            </NSpace>
        </template>
    </PoSheet>
</template>

<script setup lang="ts">
import { PhGear as UiSettings, PhPencilSimple as UiSquarePen, PhTrash as UiTrash2, PhPlus as UiPlus, PhCaretLeft as UiChevronLeft } from '@phosphor-icons/vue'
import PoSheet from '../primitives/PoSheet.vue'
import PoRow from '../primitives/PoRow.vue'
import PoButton from '../primitives/PoButton.vue'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {

    NCard,
    NSpace,
    NEmpty,
    NInput,
    NText,
    NAlert,
} from 'naive-ui'
import type { ToolDefinition } from '@prompt-optimizer/core'
import type {
    ToolManagerModalProps,
} from '../../types/components'
import { useConfirmDialog } from '../../composables/ui/useConfirmDialog'
import { useWorkspaceLayout } from '../../composables/ui/useWorkspaceLayout'

const { t } = useI18n()
const confirmDialog = useConfirmDialog()
const { isCompact } = useWorkspaceLayout()

const props = withDefaults(defineProps<ToolManagerModalProps>(), {
    disabled: false,
    readonly: false,
    loading: false,
    size: 'medium',
    width: '800px',
})

const emit = defineEmits<{
    'update:visible': [visible: boolean]
    'update:tools': [tools: ToolDefinition[]]
    toolChange: [
        tools: ToolDefinition[],
        action: 'add' | 'update' | 'delete',
        index: number,
    ]
    confirm: [tools: ToolDefinition[]]
    cancel: []
}>()

// Slice 7: the row's single meta line carries the old description +
// parameters-count tags as text.
const toolMeta = (tool: ToolDefinition) => [
  tool.function.description || t('contextEditor.noDescription'),
  t('contextEditor.parametersCount', { count: getParametersCount(tool) }),
].filter(Boolean).join(' · ')

const getParametersCount = (tool: ToolDefinition): number => {
    const params = tool.function.parameters
    if (!params || typeof params !== 'object') return 0

    const properties = (params as { properties?: unknown }).properties
    if (!properties || typeof properties !== 'object') return 0

    return Object.keys(properties as Record<string, unknown>).length
}

// 本地状态
const localVisible = ref(props.visible)
const localTools = ref<ToolDefinition[]>([])
const showEditor = ref(false)
const editingIndex = ref<number | null>(null)
const editingTool = ref<ToolDefinition | null>(null)
const parametersJson = ref('')
const jsonError = ref('')

// EU10-03/L-02: the editor used to wipe the whole draft on every close path
// (back chevron, Cancel, mask tap, Esc, X) with no dirty check. Same pattern
// as the Variable Editor (TemplateManager requestCancelEdit): snapshot the
// draft when the editor opens, and ask before discarding unsaved changes.
const toolDraftBaseline = ref('')
let confirmingToolClose = false

const snapshotToolDraft = () => {
    toolDraftBaseline.value = JSON.stringify({
        tool: editingTool.value,
        parametersJson: parametersJson.value,
    })
}

const hasUnsavedToolChanges = () => {
    if (!editingTool.value) return false
    return JSON.stringify({
        tool: editingTool.value,
        parametersJson: parametersJson.value,
    }) !== toolDraftBaseline.value
}

// 默认参数
const defaultParametersJson = `{
  "type": "object",
  "properties": {},
  "required": []
}`

const defaultParametersObject = {
    type: 'object',
    properties: {},
    required: [],
}

// 工具模板
const createWeatherToolTemplate = (): ToolDefinition => ({
    type: 'function',
    function: {
        name: 'get_weather',
        description: 'Get current weather information for a specific location',
        parameters: {
            type: 'object',
            properties: {
                location: {
                    type: 'string',
                    description: 'The location to get weather for',
                },
                unit: {
                    type: 'string',
                    enum: ['celsius', 'fahrenheit'],
                    default: 'celsius',
                },
            },
            required: ['location'],
        },
    },
})

const createEmptyToolTemplate = (): ToolDefinition => ({
    type: 'function',
    function: {
        name: '',
        description: '',
        parameters: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
})

// 工具验证
const isValidTool = computed(() => {
    if (!editingTool.value) return false
    const name = editingTool.value.function?.name?.trim()
    if (!name) return false
    try {
        const parsed = parametersJson.value
            ? JSON.parse(parametersJson.value)
            : defaultParametersObject
        return parsed && typeof parsed === 'object'
    } catch {
        return false
    }
})

// 初始化本地副本
watch(
    () => props.visible,
    (visible) => {
        localVisible.value = visible
        if (visible) {
            localTools.value = JSON.parse(JSON.stringify(props.tools))
        }
    }
)

watch(
    () => props.tools,
    (newTools) => {
        if (props.visible) {
            localTools.value = JSON.parse(JSON.stringify(newTools))
        }
    },
    { deep: true }
)

// 事件处理
const handleVisibilityChange = (visible: boolean) => {
    localVisible.value = visible
    emit('update:visible', visible)
}

const handleConfirm = () => {
    emit('confirm', [...localTools.value])
    emit('update:tools', [...localTools.value])
    emit('update:visible', false)
}

const handleCancel = () => {
    emit('cancel')
    emit('update:visible', false)
}

// 工具管理
const addTool = () => {
    editingIndex.value = null
    editingTool.value = createWeatherToolTemplate()
    syncParametersJsonFromTool(editingTool.value)
    snapshotToolDraft()
    showEditor.value = true
}

const editTool = (index: number) => {
    if (index < 0 || index >= localTools.value.length) return
    editingIndex.value = index
    editingTool.value = JSON.parse(JSON.stringify(localTools.value[index]))
    syncParametersJsonFromTool(editingTool.value)
    snapshotToolDraft()
    showEditor.value = true
}

const deleteTool = async (index: number) => {
    const tool = localTools.value[index]
    const confirmed = await confirmDialog.warning({
        title: t('common.warning'),
        content: t('contextEditor.deleteToolConfirm', {
            name: tool?.function?.name || '',
        }),
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
    })
    if (!confirmed) return
    localTools.value.splice(index, 1)
    emit('toolChange', [...localTools.value], 'delete', index)
}

const saveTool = () => {
    if (!editingTool.value) return
    try {
        const parsed = parametersJson.value
            ? JSON.parse(parametersJson.value)
            : defaultParametersObject
        editingTool.value.function.parameters = parsed

        if (editingIndex.value !== null) {
            localTools.value[editingIndex.value] = editingTool.value
            emit(
                'toolChange',
                [...localTools.value],
                'update',
                editingIndex.value
            )
        } else {
            localTools.value.push(editingTool.value)
            emit(
                'toolChange',
                [...localTools.value],
                'add',
                localTools.value.length - 1
            )
        }
        // Saved — wipe without the discard confirm (the draft is persisted).
        discardToolEditor()
    } catch (e) {
        jsonError.value =
            e instanceof Error ? e.message : t('contextEditor.invalidJson')
    }
}

// The unguarded wipe — used after a successful save (the draft is persisted,
// so no confirm is needed) and by the guarded close below.
const discardToolEditor = () => {
    showEditor.value = false
    editingIndex.value = null
    editingTool.value = null
    parametersJson.value = ''
    jsonError.value = ''
    toolDraftBaseline.value = ''
}

const closeToolEditor = async () => {
    if (confirmingToolClose) return
    // Same guard as the Variable Editor: only mobile edit sessions ask;
    // a pristine draft closes silently.
    if (isCompact.value && hasUnsavedToolChanges()) {
        confirmingToolClose = true
        try {
            const discard = await confirmDialog.warning({
                title: t('common.confirm'),
                content: t('workspace.unsavedForm'),
                positiveText: t('common.confirm'),
                negativeText: t('common.cancel'),
            })
            if (!discard) return
        } finally {
            confirmingToolClose = false
        }
    }
    discardToolEditor()
}

const useWeatherExample = () => {
    editingTool.value = createWeatherToolTemplate()
    syncParametersJsonFromTool(editingTool.value)
}

const useEmptyTemplate = () => {
    editingTool.value = createEmptyToolTemplate()
    syncParametersJsonFromTool(editingTool.value)
}

const syncParametersJsonFromTool = (tool: ToolDefinition | null) => {
    if (!tool) {
        parametersJson.value = ''
        jsonError.value = ''
        return
    }
    try {
        parametersJson.value = JSON.stringify(
            tool.function?.parameters ?? defaultParametersObject,
            null,
            2
        )
        jsonError.value = ''
    } catch (e) {
        jsonError.value =
            e instanceof Error ? e.message : 'JSON stringify error'
    }
}
</script>

<style scoped>
.tools-panel {
    max-height: 60vh;
    overflow-y: auto;
}

.po-sheet-page-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.po-sheet-page-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
}
</style>
