import { describe, expect, it, vi } from 'vitest'

import { i18n } from '../../../src/plugins/i18n'
import { getUserFacingErrorMessage, isJsonSyntaxError } from '../../../src/utils/error'

function setLocale(locale: 'zh-CN' | 'zh-TW' | 'en-US' | 'vi-VN') {
  i18n.global.locale.value = locale
}

describe('L-A plural forms (UIUX-N01 class)', () => {
  it('favorites totalCount uses singular for 1, plural otherwise', () => {
    setLocale('en-US')
    expect(i18n.global.t('favorites.manager.totalCount', { count: 1 })).toBe('1 item')
    expect(i18n.global.t('favorites.manager.totalCount', { count: 2 })).toBe('2 items')
    expect(i18n.global.t('favorites.manager.totalCount', { count: 0 })).toBe('0 items')
  })

  it('sentence forms agree the verb with the count', () => {
    setLocale('en-US')
    expect(i18n.global.t('dataManager.import.resourcesMissing', { count: 1 })).toBe(
      '1 image resource is missing',
    )
    expect(i18n.global.t('dataManager.import.resourcesMissing', { count: 3 })).toBe(
      '3 image resources are missing',
    )
    expect(i18n.global.t('favorites.manager.tagManager.deleteConfirm', { name: 'T', count: 1 })).toContain(
      'from 1 favorite.',
    )
    expect(i18n.global.t('favorites.manager.tagManager.deleteConfirm', { name: 'T', count: 2 })).toContain(
      'from 2 favorites.',
    )
  })

  it('other locales keep a single form (no inflection)', () => {
    setLocale('vi-VN')
    expect(i18n.global.t('favorites.manager.totalCount', { count: 1 })).toBe('1 mục')
    expect(i18n.global.t('favorites.manager.totalCount', { count: 5 })).toBe('5 mục')
  })
})

describe('L-A plain-language errors (EU05-N1 / EU03-05)', () => {
  it('isJsonSyntaxError finds a SyntaxError through an error.cause chain', () => {
    const parseError = new SyntaxError('Expected double-quoted property name in JSON at position 123')
    expect(isJsonSyntaxError(parseError)).toBe(true)
    const wrapped = new Error('Failed to import favorites: ' + parseError.message)
    ;(wrapped as { cause?: unknown }).cause = parseError
    expect(isJsonSyntaxError(wrapped)).toBe(true)
    expect(isJsonSyntaxError(new Error('Network timeout'))).toBe(false)
    expect(isJsonSyntaxError('plain string')).toBe(false)
    expect(isJsonSyntaxError(null)).toBe(false)
  })

  it('getUserFacingErrorMessage keeps coded messages but suppresses raw technical detail', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      setLocale('en-US')
      // Coded error with an i18n key: translated message is kept.
      expect(
        getUserFacingErrorMessage(
          { code: 'error.prompt.optimization', params: { details: 'DETAILS_X' } },
          'Optimization failed',
        ),
      ).toContain('DETAILS_X')
      // Uncoded raw error: fallback only, raw text never shown, but logged.
      const raw = new Error('Expected double-quoted property name in JSON at position 123')
      expect(getUserFacingErrorMessage(raw, 'Something went wrong')).toBe('Something went wrong')
      expect(warn).toHaveBeenCalledWith(
        '[error] suppressed raw error detail:',
        expect.stringContaining('double-quoted property name'),
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('invalidJsonFile key exists in all 4 locales', () => {
    for (const locale of ['en-US', 'vi-VN', 'zh-CN', 'zh-TW'] as const) {
      setLocale(locale)
      const text = String(i18n.global.t('favorites.manager.importDialog.invalidJsonFile'))
      expect(text).not.toBe('favorites.manager.importDialog.invalidJsonFile')
      expect(text.length).toBeGreaterThan(10)
      expect(text).not.toContain('double-quoted')
    }
  })
})

describe('L-A vi-VN mode names (NAV-01 / NAV-02 / R3B-03 / R3B-04)', () => {
  it('mode and image-mode labels are fully Vietnamese in vi-VN', () => {
    setLocale('vi-VN')
    expect(i18n.global.t('promptOptimizer.systemPrompt')).toBe('Tối ưu Prompt hệ thống')
    expect(i18n.global.t('promptOptimizer.userPrompt')).toBe('Tối ưu Prompt người dùng')
    expect(i18n.global.t('workspace.systemMode')).toBe('Prompt hệ thống')
    expect(i18n.global.t('workspace.userMode')).toBe('Prompt người dùng')
    expect(i18n.global.t('imageMode.text2image')).toBe('Văn bản thành ảnh')
    expect(i18n.global.t('imageMode.image2image')).toBe('Ảnh thành ảnh')
    expect(i18n.global.t('imageMode.multiimage')).toBe('Nhiều ảnh')
    expect(i18n.global.t('arena.benchmarks')).toBe('Bài đánh giá')
  })
})
