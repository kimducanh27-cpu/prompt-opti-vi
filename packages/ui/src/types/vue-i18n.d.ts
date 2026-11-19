import 'vue-i18n'
import type { ComputedRef } from 'vue'

type MessageSchema = typeof import('../i18n/locales/en-US').default

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export function useI18n(): {
    t: (key: string, ...args: unknown[]) => string;
    locale: ComputedRef<string>;
  }
}
