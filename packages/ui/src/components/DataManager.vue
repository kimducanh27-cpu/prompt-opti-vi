<template>
  <!-- Slice 7: PoSheet — mobile bottom sheet (max 90dvh), desktop card ≤720px
       (was 960px). The import-code view is a second sheet: while it is open
       the main sheet hides, so only one layer is ever visible and Esc closes
       just the code view; closing it returns to the main sheet. -->
  <PoSheet
    :show="show && !showRemoteImportCode"
    :title="t('dataManager.title')"
    class="data-manager-modal"
    @update:show="(value: boolean) => !value && close()"
  >
    <div
      v-if="remoteProgress.active || isExporting || isImporting"
      class="task-global-progress"
      role="status"
      aria-live="polite"
    >
      <NProgress
        v-if="remoteProgress.active"
        type="line"
        :percentage="remoteProgress.percent"
        :show-indicator="false"
      />
      <NText>{{
        remoteProgress.active
          ? remoteProgress.message
          : t(isExporting ? 'common.exporting' : 'common.importing')
      }}</NText>
    </div>
    <div
      ref="scrollShell"
      class="data-manager-scroll-shell task-stack"
      data-testid="data-manager-overview"
    >
      <DeviceOverview />
      <LocalFilesPanel />
      <CloudBackupsPanel />
    </div>
  </PoSheet>
  <PoSheet
    :show="show && showRemoteImportCode"
    :title="isCompact ? undefined : t('dataManager.remote.importCode.exportTitle')"
    class="data-manager-code-modal"
    @update:show="(value: boolean) => !value && closeImportCode()"
  >
    <!-- R3C-04: Naive Card renders `title` INSTEAD of the #header slot, so
         with :title always set this back button never rendered. The title is
         undefined in compact so the slot shows; desktop keeps its title,
         byte-identical. Same class as the Tool editor back-chevron
         (H3-NEW-01). -->
    <template v-if="isCompact" #header>
      <div class="po-sheet-page-heading">
        <PoButton variant="ghost" @click="closeImportCode">
          <template #icon>
            <UiChevronLeft :size="20" />
          </template>
          {{ t('dataManager.title') }}
        </PoButton>
      </div>
    </template>
    <div class="remote-import-code-panel">
      <NText depth="3">{{ t('dataManager.remote.importCode.secretNotice') }}</NText>
      <NInput
        :value="exportedRemoteImportCode"
        type="textarea"
        readonly
        :autosize="{ minRows: 3, maxRows: 5 }"
        data-testid="remote-import-code-output"
      />
      <PoButton variant="secondary" data-testid="remote-import-code-copy" @click="copyRemoteImportCode">
        {{ t('dataManager.remote.importCode.copy') }}
      </PoButton>
      <NText>{{ t('dataManager.remote.importCode.webAddress') }}</NText>
      <NInput
        v-model:value="remoteImportWebAddress"
        placeholder="https://…"
        data-testid="remote-import-code-web-address"
      />
      <NText depth="3">{{ t('dataManager.remote.importCode.webAddressHelp') }}</NText>
      <div
        v-if="remoteImportQrUrl"
        class="remote-import-code-qr"
        data-testid="remote-import-code-qr"
      >
        <NQrCode
          :value="remoteImportQrUrl"
          :size="256"
          :padding="16"
          type="svg"
          error-correction-level="M"
        />
      </div>
      <NText v-else depth="3">{{ t('dataManager.remote.importCode.qrUnavailable') }}</NText>
    </div>
  </PoSheet>
</template>
<script setup lang="ts">
import { PhCaretLeft as UiChevronLeft } from '@phosphor-icons/vue'
import { provide, reactive, toRefs } from 'vue'
import {
  NText, NProgress, NInput, NQrCode,
} from 'naive-ui'
import PoSheet from './primitives/PoSheet.vue'
import PoButton from './primitives/PoButton.vue'
import DeviceOverview from './data-manager/DeviceOverview.vue'
import LocalFilesPanel from './data-manager/LocalFilesPanel.vue'
import CloudBackupsPanel from './data-manager/CloudBackupsPanel.vue'
import {
  useDataManager,
  type DataManagerProps,
  type DataManagerEmits,
} from './data-manager/useDataManager'
import { dataManagerKey } from './data-manager/context'
import { useWorkspaceLayout } from '../composables/ui/useWorkspaceLayout'
import './data-manager/data-manager.css'
const { isCompact } = useWorkspaceLayout()
const props = defineProps<DataManagerProps>()
const emit = defineEmits<DataManagerEmits>()
const controller = reactive(useDataManager(props, emit))
provide(dataManagerKey, controller)
const {
  t,
  scrollShell,
  isExporting,
  isImporting,
  showRemoteImportCode,
  exportedRemoteImportCode,
  remoteImportWebAddress,
  remoteImportQrUrl,
  remoteProgress,
  copyRemoteImportCode,
  close,
} = toRefs(controller)

// Slice 7: closing the import-code sheet page returns to the main sheet and
// clears the one-time code (same as the old nested modal's update:show).
const closeImportCode = () => {
  showRemoteImportCode.value = false
  exportedRemoteImportCode.value = ''
}
</script>

<style scoped>
.po-sheet-page-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
</style>
