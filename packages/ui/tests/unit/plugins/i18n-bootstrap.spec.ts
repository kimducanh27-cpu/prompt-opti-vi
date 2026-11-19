import { afterEach, describe, expect, it, vi } from 'vitest'

import { UI_SETTINGS_KEYS } from '@prompt-optimizer/core'
import zhCN from '../../../src/i18n/locales/zh-CN'
import zhTW from '../../../src/i18n/locales/zh-TW'
import enUS from '../../../src/i18n/locales/en-US'
import viVN from '../../../src/i18n/locales/vi-VN'
import {
  i18n,
  initializeI18nWithStorage,
  resolveDefaultLocale,
  sanitizeSupportedLocale,
  setI18nServices,
} from '../../../src/plugins/i18n'

const setNavigatorLocales = (language: string, languages: string[] = [language]) => {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value: language,
  })

  Object.defineProperty(window.navigator, 'languages', {
    configurable: true,
    value: languages,
  })
}

afterEach(() => {
  i18n.global.locale.value = 'en-US'
  vi.restoreAllMocks()
})

describe('i18n bootstrap helpers', () => {
  it('defaults to vi-VN when browser language is missing', () => {
    expect(resolveDefaultLocale(undefined)).toBe('vi-VN')
    expect(resolveDefaultLocale('')).toBe('vi-VN')
  })

  it('maps Chinese browser languages to supported Chinese locales', () => {
    expect(resolveDefaultLocale('zh-CN')).toBe('zh-CN')
    expect(resolveDefaultLocale('zh-SG')).toBe('zh-CN')
    expect(resolveDefaultLocale('zh-TW')).toBe('zh-TW')
    expect(resolveDefaultLocale('zh-HK')).toBe('zh-TW')
    expect(resolveDefaultLocale('zh-Hant')).toBe('zh-TW')
  })

  it('keeps supported saved locales', () => {
    expect(sanitizeSupportedLocale('zh-CN')).toBe('zh-CN')
    expect(sanitizeSupportedLocale('zh-TW')).toBe('zh-TW')
    expect(sanitizeSupportedLocale('en-US')).toBe('en-US')
    expect(sanitizeSupportedLocale('vi-VN')).toBe('vi-VN')
  })

  it('normalizes legacy short locale values', () => {
    expect(sanitizeSupportedLocale('zh')).toBe('zh-CN')
    expect(sanitizeSupportedLocale('en')).toBe('en-US')
    expect(sanitizeSupportedLocale('vi')).toBe('vi-VN')
  })

  it('falls back to vi-VN for unsupported saved locales', () => {
    expect(sanitizeSupportedLocale('ja-JP')).toBe('vi-VN')
    expect(sanitizeSupportedLocale('')).toBe('vi-VN')
    expect(sanitizeSupportedLocale(undefined)).toBe('vi-VN')
  })

  it('initializes to vi-VN on first run regardless of the browser language', async () => {
    setNavigatorLocales('en-US')

    const get = vi.fn().mockResolvedValue(null)
    const set = vi.fn().mockResolvedValue(undefined)

    setI18nServices({
      preferenceService: {
        get,
        set,
      },
    } as any)

    await initializeI18nWithStorage()

    expect(i18n.global.locale.value).toBe('vi-VN')
    expect(get).toHaveBeenCalledWith(UI_SETTINGS_KEYS.PREFERRED_LANGUAGE, null)
    expect(set).toHaveBeenCalledWith(UI_SETTINGS_KEYS.PREFERRED_LANGUAGE, 'vi-VN')
  })

  it('normalizes legacy zh preference during initialization instead of overwriting it with English', async () => {
    setNavigatorLocales('en-US')

    const get = vi.fn().mockResolvedValue('zh')
    const set = vi.fn().mockResolvedValue(undefined)

    setI18nServices({
      preferenceService: {
        get,
        set,
      },
    } as any)

    await initializeI18nWithStorage()

    expect(i18n.global.locale.value).toBe('zh-CN')
    expect(set).toHaveBeenCalledWith(UI_SETTINGS_KEYS.PREFERRED_LANGUAGE, 'zh-CN')
  })

  it('uses endonyms for language switcher labels in every locale bundle', () => {
    const expected = {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'en-US': 'English',
      'vi-VN': 'Tiếng Việt',
    }

    expect(zhCN.settings.languageSwitcher.languages).toEqual(expected)
    expect(zhTW.settings.languageSwitcher.languages).toEqual(expected)
    expect(enUS.settings.languageSwitcher.languages).toEqual(expected)
    expect(viVN.settings.languageSwitcher.languages).toEqual(expected)
  })
})
