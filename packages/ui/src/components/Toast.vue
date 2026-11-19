<!-- Toast组件 - 基于Naive UI NMessageProvider -->
<template>
    <!-- A11Y-M07: visually-hidden live regions mirroring toasts (WCAG 4.1.3).
         Naive NMessage renders with no role/aria-live, so without these a
         screen reader never hears "Optimization successful" / "Saved to
         favorites". :key per toast re-creates the node so even a repeated
         identical message is announced on insertion. -->
    <div
        class="toast-live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        :key="`toast-status-${announcement.seq}`"
    >{{ statusText }}</div>
    <div
        class="toast-live-region"
        role="alert"
        aria-atomic="true"
        :key="`toast-alert-${announcement.seq}`"
    >{{ errorText }}</div>
    <!-- Naive UI的消息提供者组件 -->
    <!-- EU01-06 / EU03-N1: Naive's default top-right container (top: 20px)
         sits on top of the compact header (64px) — the toast covered the
         mode title in the header and, over a full-screen modal page, its
         title + close X. On compact, drop the stack below the header:
         safe-area + 64px header + 12px gap. The modal page header
         (~44–56px) clears the same line. Desktop keeps the historical
         top: 20px / right: 20px placement untouched. -->
    <NMessageProvider
        placement="top-right"
        :container-style="messageContainerStyle"
    >
        <NDialogProvider>
            <MessageApiInitializer />
            <slot />
        </NDialogProvider>
    </NMessageProvider>
</template>

<script setup lang="ts">
import { computed, onMounted, defineComponent, h } from "vue";
import { NMessageProvider, NDialogProvider, useMessage, useDialog } from "naive-ui";

import { setGlobalMessageApi, useToastAnnouncement } from '../composables/ui/useToast';
import { setGlobalDialogApi } from '../composables/ui/useConfirmDialog';
import { useWorkspaceLayout } from '../composables/ui/useWorkspaceLayout';

// EU01-06 / EU03-N1: toast stack position (see the provider above).
const { isCompact } = useWorkspaceLayout()
const messageContainerStyle = computed(() =>
  isCompact.value
    ? 'position: fixed; top: calc(var(--safe-area-inset-top, 0px) + 76px); right: 12px; left: 12px;'
    : 'position: fixed; top: 20px; right: 20px;',
)

// A11Y-M07: live-region text mirrors the latest toast; errors go to the
// assertive alert region, everything else to the polite status region.
const announcement = useToastAnnouncement()
const statusText = computed(() => (announcement.value.type !== 'error' ? announcement.value.text : ''))
const errorText = computed(() => (announcement.value.type === 'error' ? announcement.value.text : ''))

// 内部组件用于在正确的上下文中初始化消息API
const MessageApiInitializer = defineComponent({
    name: "MessageApiInitializer",
    setup() {
        let messageApi: ReturnType<typeof useMessage> | null = null;
        let dialogApi: ReturnType<typeof useDialog> | null = null;

        try {
            messageApi = useMessage();
            dialogApi = useDialog();
        } catch (error) {
            console.warn(
                "[Toast] Naive UI API initialization failed (this is normal during SSR or when provider is not ready):",
                error,
            );
        }

        onMounted(() => {
            if (messageApi) {
                setGlobalMessageApi(messageApi);
                console.log("[Toast] Message API initialized successfully");
            }
            if (dialogApi) {
                setGlobalDialogApi(dialogApi);
                console.log("[Toast] Dialog API initialized successfully");
            }
        });
        return () => h("div", { style: { display: "none" } });
    },
});
</script>

<style scoped>
/* A11Y-M07: standard visually-hidden pattern — present in the accessibility
   tree (so live regions announce) but takes no space and paints nothing. */
.toast-live-region {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>

<style>
/* EU03-05: Naive's message theme caps a toast at 720px wide, so on a 412px
   viewport a long unbroken error (URL / request hash) forces the toast to
   its min-content width (measured 496px) and spills past both screen edges.
   Cap the toast at the viewport minus margins and let long tokens wrap.
   Non-scoped: Naive teleports the message list to <body>, so no scoped
   :deep() selector from this component can reach it. Selectors are
   qualified with .n-message-container to outrank Naive's own rules
   (css-render injects them at runtime, after this bundle loads). */
.n-message-container .n-message {
    max-width: min(720px, calc(100vw - 32px));
}
.n-message-container .n-message .n-message__content {
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
}
</style>
