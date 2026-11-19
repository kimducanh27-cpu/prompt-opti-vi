import { test, expect } from '../fixtures'
import { navigateToMode, waitForAppReady } from '../helpers/common'
import { selectModelConfiguration } from '../helpers/model-selector'
import {
  fillOriginalPrompt,
  clickOptimizeButton,
  expectOptimizedResultNotEmpty,
  verifyOptimizeButtonDisabledWhenEmpty
} from '../helpers/optimize'

const MODE = 'basic-user' as const
const FAVORITE_TITLE = 'E2E Desktop Favorite'

test.describe('Basic User - 提示词优化', () => {
  test('优化提示词并生成优化结果', async ({ page }) => {
    test.setTimeout(180000)

    await navigateToMode(page, 'basic', 'user')
    // Pin the recorded provider so built-in default-model updates do not invalidate VCR replay.
    await selectModelConfiguration(page, page.getByTestId('basic-user-model-select'), /deepseek/i)

    await fillOriginalPrompt(page, MODE, '帮我写一封邮件，关于项目进度汇报')
    await clickOptimizeButton(page, MODE)

    await expectOptimizedResultNotEmpty(page, MODE)

    // Slice 10: SAVE FAVORITE — the step missing from all optimize specs.
    // Reuses the workspace save flow (favorite-management.spec.ts pattern).
    await page.getByTestId('basic-user-output-favorite').click()
    const titleField = page.locator('[data-testid="favorite-editor-title"] input')
    await expect(titleField).toBeVisible({ timeout: 10000 })
    await titleField.fill(FAVORITE_TITLE)
    await page.getByTestId('favorite-editor-save').click()
    await expect(titleField).toBeHidden({ timeout: 15000 })

    // Assert the favorite is stored and listed on the Favorites page.
    await page.goto('/#/favorites', { waitUntil: 'domcontentloaded' })
    await waitForAppReady(page)
    await expect(page.getByTestId('favorites-manager-add')).toBeVisible({ timeout: 20000 })
    const listItem = page.getByTestId('favorite-workspace-list-item').filter({ hasText: FAVORITE_TITLE }).first()
    await expect(listItem).toBeVisible({ timeout: 10000 })
  })

  test('验证优化按钮在没有提示词时禁用', async ({ page }) => {
    await navigateToMode(page, 'basic', 'user')
    await verifyOptimizeButtonDisabledWhenEmpty(page, MODE)
  })
})
