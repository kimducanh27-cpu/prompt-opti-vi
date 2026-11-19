<template>
    <!-- Slice 7: ONE PoSheet (mobile bottom sheet, max 90dvh; desktop card
         <=720px). The export dialog becomes an in-place sheet page; the
         editor/importer keep their own overlays (open item — hiding the
         parent would spuriously emit close/cancel). Close/cancel are now
         emitted by the localVisible watcher (PoSheet does not forward
         @after-leave). -->
    <PoSheet
        :show="localVisible"
        :mask-closable="!showEditor && !showImporter"
        :title="isCompact && showExportModal ? undefined : (props.title || t('variables.management.title'))"
        class="variable-manager-sheet"
        @update:show="onSheetUpdateShow"
    >
        <!-- R3C-04: Naive Card renders `title` INSTEAD of the #header slot, so
             with :title always set this back button never rendered. The title
             is undefined exactly while the export page is open in compact;
             desktop keeps its title, byte-identical. Same class as the Tool
             editor back-chevron (H3-NEW-01). -->
        <template v-if="isCompact && showExportModal" #header>
            <div class="po-sheet-page-heading">
                <PoButton
                    variant="ghost"
                    icon-only
                    :aria-label="props.title || t('variables.management.title')"
                    @click="showExportModal = false"
                >
                    <template #icon>
                        <UiChevronLeft />
                    </template>
                </PoButton>
                <span class="po-sheet-page-title">{{ t('variables.management.exportTitle') }}</span>
            </div>
        </template>
        <div v-if="!showExportModal">
        <!-- The mobile list owns list actions; editor drafts remain in their existing host. -->
        <div v-if="isCompact" class="variable-list-toolbar">
            <PoButton variant="primary" :disabled="props.disabled || props.readonly || loading" @click="showAddVariable">
                {{ t('variables.management.addVariable') }}
            </PoButton>
            <NDropdown v-if="props.showImportExport !== false" trigger="click" :options="mobileListActions" :menu-props="dropdownMenuProps" :node-props="dropdownNodeProps" @select="handleListAction">
                <PoButton variant="secondary" :disabled="props.disabled || loading" :aria-label="t('workspace.moreOptions')">
                    {{ t('workspace.moreOptions') }}
                </PoButton>
            </NDropdown>
        </div>
        <NSpace v-else justify="space-between">
            <PoButton
                variant="primary"
                @click="showAddVariable"
                :disabled="props.disabled || loading"
                :loading="props.loading"
            >
                <template #icon>
                    <NIcon :size="16">
                        <UiPlus />
                    </NIcon>
                </template>
                {{ t("variables.management.addVariable") }}
            </PoButton>

            <NSpace v-if="props.showImportExport !== false">
                <PoButton
                    variant="secondary"
                    @click="showImportModal"
                    :disabled="props.disabled || props.readonly || loading"
                >
                    {{ t("variables.management.import") }}
                </PoButton>

                <PoButton
                    variant="secondary"
                    @click="showExportModal = true"
                    :disabled="props.disabled || loading"
                >
                    {{ t("variables.management.export") }}
                </PoButton>
            </NSpace>
        </NSpace>
        <NDivider />

        <!-- 变量列表 - 分组显示 -->
        <NSpace vertical :size="16">
            <!-- 预定义变量组（默认折叠：一般只需要编辑自定义变量） -->
            <NCard
                v-if="predefinedVariables.length > 0"
                size="small"
                :content-style="isPredefinedExpanded ? undefined : 'padding: 0'"
            >
                <template #header>
                    <NSpace align="center">
                        <NText strong>{{ t("variables.predefined") }}</NText>
                        <NTag size="small" type="info">{{
                            t("variables.readonly")
                        }}</NTag>
                        <NTag size="small" type="default">{{
                            predefinedVariables.length
                        }}</NTag>
                    </NSpace>
                </template>
                <template #header-extra>
                    <PoButton
                        icon-only
                        variant="ghost"
                        @click="isPredefinedExpanded = !isPredefinedExpanded"
                        :aria-label="
                            isPredefinedExpanded
                                ? t('common.collapse')
                                : t('common.expand')
                        "
                    >
                        <template #icon>
                            <NIcon>
                                <UiChevronUp v-if="isPredefinedExpanded" /><UiChevronDown v-else />
                            </NIcon>
                        </template>
                    </PoButton>
                </template>

                <MobileVariableList
                    v-if="isPredefinedExpanded && isCompact"
                    :variables="predefinedVariables"
                    readonly
                    predefined
                    @copy="copyVariableName"
                />
                <NDataTable
                    v-else-if="isPredefinedExpanded"
                    :columns="predefinedTableColumns"
                    :data="predefinedVariables"
                    :max-height="200"
                    :bordered="false"
                    size="small"
                    :pagination="false"
                />
            </NCard>

            <!-- 自定义变量组 -->
            <NCard size="small">
                <template #header>
                    <NSpace align="center">
                        <NText strong>{{ t("variables.custom") }}</NText>
                        <NTag size="small" type="success">{{
                            customVariables.length
                        }}</NTag>
                    </NSpace>
                </template>

                <!-- 自定义变量表格或空状态 -->
                <div v-if="customVariables.length === 0">
                    <NEmpty :description="t('variables.addFirstVariable')">
                        <template #icon>
                            <NIcon size="48">
                                <UiTag />
                            </NIcon>
                        </template>
                        <template #default>
                            <NText>{{
                                t("variables.noCustomVariables")
                            }}</NText>
                        </template>
                    </NEmpty>
                </div>

                <MobileVariableList
                    v-else-if="isCompact"
                    :variables="customVariables"
                    :readonly="props.readonly"
                    :disabled="props.disabled || loading"
                    @edit="editVariable"
                    @copy="copyVariableName"
                    @delete="deleteVariable"
                />
                <NDataTable
                    v-else
                    :columns="customTableColumns"
                    :data="customVariables"
                    :max-height="300"
                    :bordered="false"
                    size="small"
                    :pagination="false"
                    :loading="props.loading || loading"
                />

                <!-- 快速添加表单 -->
                <template v-if="!isCompact" #footer>
                    <NDivider />
                    <div>
                        <NText
                            strong
                            depth="1"
                            style="display: block; margin-bottom: 12px"
                        >
                            {{ t("variables.addNew") }}
                        </NText>
                        <NGrid cols="12" :x-gap="12" :y-gap="8">
                            <NGridItem span="4">
                                <NInput
                                    v-model:value="quickAddForm.name"
                                    :placeholder="
                                        t('variables.namePlaceholder')
                                    "
                                    size="small"
                                    :disabled="props.readonly || loading"
                                    @keyup.enter="quickAddVariable"
                                />
                            </NGridItem>
                            <NGridItem span="6">
                                <NInput
                                    v-model:value="quickAddForm.value"
                                    :placeholder="
                                        t('variables.valuePlaceholder')
                                    "
                                    size="small"
                                    :disabled="props.readonly || loading"
                                    @keyup.enter="quickAddVariable"
                                />
                            </NGridItem>
                            <NGridItem span="2">
                                <PoButton
                                    variant="primary"
                                    size="sm"
                                    @click="quickAddVariable"
                                    :disabled="
                                        !canQuickAdd ||
                                        props.readonly ||
                                        loading
                                    "
                                    :loading="loading"
                                    block
                                >
                                    {{ t("variables.add") }}
                                </PoButton>
                            </NGridItem>
                        </NGrid>
                    </div>
                </template>
            </NCard>
        </NSpace>
        </div>

        <!-- 导出页 (was a nested modal; now an in-place sheet page) -->
        <div v-if="showExportModal">
            <NSpace vertical>
                <!-- 导出格式选择 -->
                <div>
                    <NText strong style="display: block; margin-bottom: 12px">
                        {{ t("variables.management.exportFormat") }}
                    </NText>
                    <NRadioGroup v-model:value="exportFormat">
                        <NSpace>
                            <NRadioButton value="csv">CSV</NRadioButton>
                            <NRadioButton value="txt">TXT</NRadioButton>
                        </NSpace>
                    </NRadioGroup>
                </div>

                <!-- 导出统计信息 -->
                <NCard size="small" embedded>
                    <NSpace justify="space-between" align="center">
                        <NText depth="2">{{
                            t("variables.management.exportInfo")
                        }}</NText>
                        <NTag type="info"
                            >{{ customVariables.length }}
                            {{ t("variables.management.variables") }}</NTag
                        >
                    </NSpace>
                </NCard>

                <!-- 预览区域 -->
                <div>
                    <NText strong style="display: block; margin-bottom: 12px">
                        {{ t("variables.management.exportPreview") }}
                    </NText>
                    <NInput
                        :value="getExportPreview()"
                        readonly
                        type="textarea"
                        :autosize="{ minRows: 8, maxRows: 12 }"
                        :input-props="{
                            style: 'font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\'Liberation Mono\',\'Courier New\',monospace; font-size: 12px;',
                        }"
                    />
                </div>
            </NSpace>
        </div>

        <template #footer>
            <NSpace v-if="!showExportModal" justify="space-between">
                <NText depth="3">{{
                    t("variables.management.totalCount", {
                        count: allVariables.length,
                    })
                }}</NText>
                <PoButton v-if="isCompact" variant="secondary" @click="handleCancel" :disabled="loading">
                    {{ t('common.close') }}
                </PoButton>
                <NSpace v-else>
                    <PoButton
                        v-if="!props.readonly"
                        variant="primary"
                        @click="handleConfirm"
                        :disabled="props.disabled"
                        :loading="loading"
                    >
                        {{ t("common.confirm") }}
                    </PoButton>
                    <PoButton variant="secondary" @click="handleCancel">
                        {{
                            props.readonly
                                ? t("common.close")
                                : t("common.cancel")
                        }}
                    </PoButton>
                </NSpace>
            </NSpace>
            <NSpace v-else justify="end">
                <PoButton
                    variant="secondary"
                    @click="showExportModal = false"
                    :disabled="loading"
                >
                    {{ t("common.cancel") }}
                </PoButton>
                <PoButton
                    variant="primary"
                    @click="executeExport"
                    :disabled="customVariables.length === 0 || loading"
                    :loading="loading"
                >
                    {{ t("variables.management.download") }}
                </PoButton>
            </NSpace>
        </template>

        <!-- 添加/编辑变量子弹窗 -->
        <VariableEditor
            v-model:show="showEditor"
            :variable="editingVariable"
            :existing-names="existingVariableNames"
            :saving="loading"
            :save-error="editorError"
            @save="onVariableSave"
            @cancel="onEditorCancel"
        />

        <!-- 导入弹窗 -->
        <VariableImporter
            v-model:show="showImporter"
            :saving="loading"
            :save-error="importError"
            @import="onVariablesImport"
        />

    </PoSheet>
</template>

<script setup lang="ts">
import { PhCopy as RenderCopy, PhPencilSimple as RenderSquarePen, PhTrash as RenderTrash2, PhPlus as UiPlus, PhCaretUp as UiChevronUp, PhCaretDown as UiChevronDown, PhCaretLeft as UiChevronLeft, PhTag as UiTag } from '@phosphor-icons/vue'
import PoSheet from "../primitives/PoSheet.vue"
import PoButton from "../primitives/PoButton.vue"
import { useWorkspaceLayout } from '../../composables/ui/useWorkspaceLayout'
const { isCompact } = useWorkspaceLayout()
import { ref, computed, watch, h } from 'vue'

import { useI18n } from "vue-i18n";
import {

    NSpace,
    NTag,
    NDataTable,
    NGrid,
    NGridItem,
    NInput,
    NCard,
    NRadioGroup,
    NRadioButton,
    NText,
    NEmpty,
    NDivider,
    NDropdown,
    NIcon,
    type DataTableColumns,
} from 'naive-ui';
import { useResponsive } from "../../composables/ui/useResponsive";
import { useClipboard } from "../../composables/ui/useClipboard";
import { useConfirmDialog } from "../../composables/ui/useConfirmDialog";
import type {
    VariableManagerModalProps,
} from "../../types/components";
import { isValidVariableName, type VariableSource } from "../../types/variable";
import { dropdownMenuProps, dropdownNodeProps } from '../../utils/dropdown-a11y';
import type { VariableManagerHooks } from '../../composables/prompt/useVariableManager';
import type { VariableExportData, VariableImportOptions } from '@prompt-optimizer/core';
import VariableEditor from "./VariableEditor.vue";
import VariableImporter from "./VariableImporter.vue";
import MobileVariableList from "./MobileVariableList.vue";

const { t } = useI18n();
const { copyText } = useClipboard();
const confirmDialog = useConfirmDialog();

interface VariableRow {
    name: string;
    value: string;
    source: VariableSource;
}

// 响应式配置
const {
    buttonSize: responsiveButtonSize,
} = useResponsive();

// 使用标准化的 Props 接口，但保持向后兼容
interface Props extends Partial<VariableManagerModalProps> {
    visible: boolean;
    variableManager: VariableManagerHooks | null;
    focusVariable?: string;
}

const props = withDefaults(defineProps<Props>(), {
    size: "medium",
    showImportExport: true,
    readonly: false,
    disabled: false,
    loading: false,
    title: undefined,
    width: "90vw",
});

// 使用标准化的 Events 接口
const emit = defineEmits<{
    (event: "update:visible", visible: boolean): void;
    (event: "update:variables", variables: Record<string, string>): void;
    (
        event: "variableChange",
        name: string,
        value: string,
        action: "add" | "update" | "delete",
    ): void;
    (event: "import", data: VariableExportData, options?: VariableImportOptions): void;
    (event: "export"): void;
    (event: "confirm", variables: Record<string, string>): void;
    (event: "cancel"): void;
    (event: "close"): void;
    (event: "ready"): void;
    (event: "error", error: Error): void;
}>();

// 双向绑定本地可见状态
const localVisible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit("update:visible", value),
});

// 状态管理
const loading = ref(false);
const editorError = ref("");
const importError = ref("");
const mobileListActions = computed(() => [
    { key: "import", label: t("variables.management.import"), disabled: props.readonly },
    { key: "export", label: t("variables.management.export") },
]);
const handleListAction = (key: string) => {
    if (key === "import") showImportModal();
    if (key === "export") showExportModal.value = true;
};
const showEditor = ref(false);
const showImporter = ref(false);
const showExportModal = ref(false);
const editingVariable = ref<VariableRow | null>(null);
const exportFormat = ref<"csv" | "txt">("csv");

// 默认折叠预定义变量列表（很少需要查看/编辑）
const isPredefinedExpanded = ref(false);

// 内联编辑状态
const editingRowKey = ref<string | null>(null);
const editingValue = ref("");
const quickAddForm = ref({
    name: "",
    value: "",
});

// 计算属性
const buttonSize = computed(() => {
    return props.size === "small" || responsiveButtonSize.value === "small"
        ? "small"
        : responsiveButtonSize.value;
});

watch(
    () => localVisible.value,
    (visible) => {
        if (visible) {
            isPredefinedExpanded.value = false;
        } else {
            // Slice 7: PoSheet does not forward @after-leave, so the close
            // + cancel signals the old NModal emitted there fire here.
            handleClose();
        }
    },
);

// Slice 7: a close request from the export page goes back to the list;
// only from the list page does it close the manager.
const onSheetUpdateShow = (value: boolean) => {
    if (value) return;
    if (showExportModal.value) {
        showExportModal.value = false;
        return;
    }
    localVisible.value = false;
};

const allVariables = computed<VariableRow[]>(() => {
    const manager = props.variableManager?.variableManager.value;
    if (!manager) return [];

    // 获取所有变量并构建Variable对象
    try {
        const variables = manager.resolveAllVariables();
        return Object.entries(variables).map(([name, value]) => ({
            name,
            value,
            source: manager.getVariableSource(name),
        }));
    } catch (error: unknown) {
        console.error(
            "[VariableManagerModal] Failed to resolve variables:",
            error,
        );
        return [];
    }
});

const existingVariableNames = computed(() => {
    return allVariables.value.map((v) => v.name);
});

// 分组变量
const predefinedVariables = computed(() => {
    return allVariables.value.filter((v) => v.source === "predefined");
});

const customVariables = computed(() => {
    return allVariables.value.filter((v) => v.source === "custom");
});

// 预定义变量表格列配置（只读）
const predefinedTableColumns = computed<DataTableColumns<VariableRow>>(() => [
    {
        title: t("variables.management.variableName"),
        key: "name",
        width: 200,
        render: (row: VariableRow) => {
            return h(
                NTag,
                { size: "small", type: "info" },
                { default: () => formatVariableName(row.name) },
            );
        },
    },
    {
        title: t("variables.management.description"),
        key: "description",
        ellipsis: {
            tooltip: true,
        },
        render: (row: VariableRow) => {
            const descriptionKey = `variables.predefinedDescriptions.${row.name}`;
            const description = t(descriptionKey);
            return h(
                NText,
                { depth: 2 },
                {
                    default: () =>
                        description !== descriptionKey
                            ? description
                            : row.name + " description",
                },
            );
        },
    },
    {
        title: t("common.actions"),
        key: "actions",
        width: 80,
        render: (row: VariableRow) => {
            return h(
                PoButton,
                {
                    size: "sm",
                    iconOnly: true,
                    variant: "ghost",
                    ariaLabel: t("common.copy"),
                    onClick: () => copyVariableName(row.name),
                },
                {
                    icon: () =>
                        h(NIcon, null, {
                            default: () =>
                                h(RenderCopy, { size: 16 }),
                        }),
                },
            );
        },
    },
]);

// 自定义变量表格列配置（支持内联编辑）
const customTableColumns = computed<DataTableColumns<VariableRow>>(() => [
    {
        title: t("variables.management.variableName"),
        key: "name",
        width: 200,
        render: (row: VariableRow) => {
            return h(
                NTag,
                { size: "small", type: "success" },
                { default: () => formatVariableName(row.name) },
            );
        },
    },
    {
        title: t("variables.management.value"),
        key: "value",
        ellipsis: {
            tooltip: true,
        },
        render: (row: VariableRow) => {
            // 如果当前行正在编辑
            if (editingRowKey.value === row.name) {
                return h(NInput, {
                    value: editingValue.value,
                    size: "small",
                    autofocus: true,
                    onUpdateValue: (val: string) => (editingValue.value = val),
                    onKeydown: (e: KeyboardEvent) => {
                        if (e.key === "Enter") {
                            saveInlineEdit(row.name);
                        } else if (e.key === "Escape") {
                            cancelInlineEdit();
                        }
                    },
                    onBlur: () => saveInlineEdit(row.name),
                });
            }

            // 正常显示状态，点击可编辑
            return h(
                "span",
                {
                    class: "cursor-pointer",
                    onClick: () => startInlineEdit(row.name, row.value),
                },
                truncateValue(row.value),
            );
        },
    },
    {
        title: t("common.actions"),
        key: "actions",
        width: 160,
        render: (row: VariableRow) => {
            return h(
                NSpace,
                { size: "small" },
                {
                    default: () => [
                        h(
                            PoButton,
                            {
                                size: "sm",
                                iconOnly: true,
                                variant: "ghost",
                                ariaLabel: t("common.copy"),
                                onClick: () => copyVariableName(row.name),
                            },
                            {
                                icon: () =>
                                    h(NIcon, null, {
                                        default: () =>
                                            h(RenderCopy, { size: 16 }),
                                    }),
                            },
                        ),
                        h(
                            PoButton,
                            {
                                size: "sm",
                                iconOnly: true,
                                variant: "ghost",
                                ariaLabel: t("common.edit"),
                                onClick: () => editVariable(row),
                            },
                            {
                                icon: () =>
                                    h(NIcon, null, {
                                        default: () =>
                                            h(RenderSquarePen, { size: 16 }),
                                    }),
                            },
                        ),
                        h(
                            PoButton,
                            {
                                size: "sm",
                                iconOnly: true,
                                variant: "destructive",
                                ariaLabel: t("common.delete"),
                                onClick: () => deleteVariable(row.name),
                            },
                            {
                                icon: () =>
                                    h(NIcon, null, {
                                        default: () =>
                                            h(RenderTrash2, { size: 16 }),
                                    }),
                            },
                        ),
                    ],
                },
            );
        },
    },
]);

// 工具函数
const truncateValue = (value: string, maxLength: number = 60): string => {
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength) + "...";
};

const formatVariableName = (name: string): string => {
    return `{{${name}}}`;
};

// 复制变量名功能
const copyVariableName = async (name: string) => {
    try {
        const formattedName = formatVariableName(name);
        await copyText(formattedName);
        console.log(
            `[VariableManagerModal] Copied variable name: ${formattedName}`,
        );
    } catch (error) {
        console.error(
            "[VariableManagerModal] Failed to copy variable name:",
            error,
        );
    }
};

const showAddVariable = () => {
    editorError.value = "";
    editingVariable.value = null;
    showEditor.value = true;
};

const editVariable = (variable: VariableRow) => {
    editorError.value = "";
    editingVariable.value = variable;
    showEditor.value = true;
};

// 内联编辑处理函数
const startInlineEdit = (rowKey: string, currentValue: string) => {
    editingRowKey.value = rowKey;
    editingValue.value = currentValue;
};

const saveInlineEdit = async (rowKey: string) => {
    if (!props.variableManager?.variableManager.value) {
        cancelInlineEdit();
        return;
    }

    const trimmedValue = editingValue.value.trim();
    if (!trimmedValue) {
        cancelInlineEdit();
        return;
    }

    try {
        loading.value = true;
        props.variableManager.addVariable(rowKey, trimmedValue);

        // 清空编辑状态
        editingRowKey.value = null;
        editingValue.value = "";

        // 触发变更事件
        handleVariableChange(rowKey, trimmedValue, "update");
    } catch (error: unknown) {
        console.error(
            "[VariableManagerModal] Failed to save inline edit:",
            error,
        );
        emit("error", error instanceof Error ? error : new Error(String(error)));
    } finally {
        loading.value = false;
    }
};

const cancelInlineEdit = () => {
    editingRowKey.value = null;
    editingValue.value = "";
};

// 快速添加功能
const quickAddVariable = async () => {
    if (!props.variableManager?.variableManager.value) return;
    if (!canQuickAdd.value) return;

    try {
        loading.value = true;
        const name = quickAddForm.value.name.trim();
        const value = quickAddForm.value.value.trim();

        props.variableManager.addVariable(name, value);

        // 清空表单
        quickAddForm.value.name = "";
        quickAddForm.value.value = "";

        // 触发变更事件
        handleVariableChange(name, value, "add");
    } catch (error: unknown) {
        console.error(
            "[VariableManagerModal] Failed to quick add variable:",
            error,
        );
        emit("error", error instanceof Error ? error : new Error(String(error)));
    } finally {
        loading.value = false;
    }
};

// 验证快速添加表单
const canQuickAdd = computed(() => {
    const name = quickAddForm.value.name.trim();
    const value = quickAddForm.value.value.trim();

    if (!name || !value) return false;

    // Reuse the shared variable-name contract used by workspaces and storage.
    if (!isValidVariableName(name)) return false;

    // 检查是否与预定义变量重名（标准化）
    if (
        props.variableManager?.variableManager.value?.isPredefinedVariable(name)
    )
        return false;

    // 检查是否与现有变量重名
    if (existingVariableNames.value.includes(name)) return false;

    return true;
});

const deleteVariable = async (name: string) => {
    if (!props.variableManager?.variableManager.value) return;
    if (props.readonly) return;

    const confirmed = await confirmDialog.warning({
        title: t("common.warning"),
        content: t("variables.management.deleteConfirm", { name }),
        positiveText: t("common.confirm"),
        negativeText: t("common.cancel"),
    });
    if (!confirmed) return;

    try {
        loading.value = true;
        props.variableManager.deleteVariable(name);

        // 发送删除事件
        handleVariableChange(name, "", "delete");
    } catch (error: unknown) {
        console.error(
            "[VariableManagerModal] Failed to delete variable:",
            error,
        );
        emit("error", error instanceof Error ? error : new Error(String(error)));
    } finally {
        loading.value = false;
    }
};

const onVariableSave = async (variable: { name: string; value: string }) => {
    if (!props.variableManager?.variableManager.value || loading.value) return;
    editorError.value = "";

    try {
        loading.value = true;
        const isUpdate = allVariables.value.some(
            (v) => v.name === variable.name,
        );

        props.variableManager.addVariable(variable.name, variable.value);
        showEditor.value = false;
        editingVariable.value = null;

        // 发送标准化变更事件
        handleVariableChange(
            variable.name,
            variable.value,
            isUpdate ? "update" : "add",
        );
    } catch (error: unknown) {
        console.error("[VariableManagerModal] Failed to save variable:", error);
        editorError.value = error instanceof Error ? error.message : String(error);
        emit("error", error instanceof Error ? error : new Error(String(error)));
    } finally {
        loading.value = false;
    }
};

const onEditorCancel = () => {
    showEditor.value = false;
    editingVariable.value = null;
};

const showImportModal = () => {
    importError.value = "";
    showImporter.value = true;
};

const onVariablesImport = (variables: Record<string, string>) => {
    if (!props.variableManager || loading.value) return;
    importError.value = "";

    try {
        loading.value = true;
        Object.entries(variables).forEach(([name, value]) => {
            props.variableManager!.addVariable(name, value);
        });
        showImporter.value = false;

        // 发送标准化事件
        emit("import", {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            variables: Object.entries(variables).map(([name, value]) => ({
                name,
                value,
                type: "custom" as const,
                required: false,
            })),
        });
    } catch (error: unknown) {
        console.error(
            "[VariableManagerModal] Failed to import variables:",
            error,
        );
        importError.value = error instanceof Error ? error.message : String(error);
        emit("error", error instanceof Error ? error : new Error(String(error)));
    } finally {
        loading.value = false;
    }
};

// 新增的标准化事件处理函数
const handleClose = () => {
    emit("close");
    emit("cancel");
};

const handleConfirm = () => {
    if (!props.variableManager) return;

    const currentVariables =
        props.variableManager.variableManager.value?.resolveAllVariables() ||
        {};
    emit("confirm", currentVariables);
    emit("update:variables", currentVariables);
    localVisible.value = false;
};

const handleCancel = () => {
    // L-05: emit cancel exactly once. The localVisible watcher below is the
    // single place that emits close/cancel on close (see the file header),
    // so this handler only flips visibility — emitting here too fired
    // `cancel` twice on every Cancel click.
    localVisible.value = false;
};

// 变量变更事件增强
const handleVariableChange = (
    name: string,
    value: string,
    action: "add" | "update" | "delete",
) => {
    emit("variableChange", name, value, action);

    // 同时发送 update:variables 事件
    if (props.variableManager) {
        const allVars =
            props.variableManager.variableManager.value?.resolveAllVariables() ||
            {};
        emit("update:variables", allVars);
    }
};

// 监听visible变化，处理焦点变量
watch(
    () => props.visible,
    (visible) => {
        if (visible && props.focusVariable) {
            // 如果有指定要聚焦的变量，自动打开编辑器
            const targetVariable = allVariables.value.find(
                (v) => v.name === props.focusVariable,
            );
            if (targetVariable) {
                editingVariable.value = targetVariable;
                showEditor.value = true;
            } else {
                // 如果变量不存在，创建新变量
                editingVariable.value = {
                    name: props.focusVariable,
                    value: "",
                    source: "custom",
                };
                showEditor.value = true;
            }
        }

        // 发送ready事件
        if (visible) {
            emit("ready");
        }
    },
);

// 导出预览功能
const getExportPreview = (): string => {
    if (!props.variableManager?.variableManager.value) return "";

    // 使用已有的 customVariables 计算属性，转换为对象格式
    const customVarsObject = customVariables.value.reduce(
        (acc, variable) => {
            acc[variable.name] = variable.value;
            return acc;
        },
        {} as Record<string, string>,
    );

    switch (exportFormat.value) {
        case "csv": {
            const csvLines = ["name,value"];
            for (const [name, value] of Object.entries(customVarsObject)) {
                csvLines.push(`"${name}","${value.replace(/"/g, '""')}"`);
            }
            return csvLines.join("\n");
        }

        case "txt": {
            const txtLines: string[] = [];
            for (const [name, value] of Object.entries(customVarsObject)) {
                txtLines.push(`${name}=${value}`);
            }
            return txtLines.join("\n");
        }

        default: {
            return "";
        }
    }
};

// 执行导出功能
const executeExport = () => {
    if (!props.variableManager?.variableManager.value) return;

    try {
        loading.value = true;
        const content = getExportPreview();
        const timestamp = new Date()
            .toISOString()
            .replace(/[:.]/g, "-")
            .replace("T", "_")
            .split(".")[0];
        const fileName = `variables-${timestamp}.${exportFormat.value}`;

        let mimeType: string;
        switch (exportFormat.value) {
            case "csv": {
                mimeType = "text/csv";
                break;
            }
            case "txt": {
                mimeType = "text/plain";
                break;
            }
            default: {
                mimeType = "text/plain";
            }
        }

        // 发送导出事件
        emit("export");

        // 执行实际导出
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);

        // 关闭弹窗
        showExportModal.value = false;
    } catch (error: unknown) {
        console.error(
            "[VariableManagerModal] Failed to export variables:",
            error,
        );
        emit("error", error instanceof Error ? error : new Error(String(error)));
    } finally {
        loading.value = false;
    }
};

// 删除重复的onVariableSave函数，避免冲突
</script>

<style scoped>
.variable-list-toolbar {
    display: flex;
    justify-content: space-between;
    gap: 8px;
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
