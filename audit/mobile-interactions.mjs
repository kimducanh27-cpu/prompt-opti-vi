import { chromium } from '@playwright/test'
import fs from 'node:fs'
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'vi-VN' })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', e => errors.push(String(e)))
const out = { steps: [] }
await page.goto(`${process.env.BASE_URL || 'http://127.0.0.1:18181'}/#/basic/user`, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2500)

await page.click('[data-testid="compact-global-menu"]')
await page.waitForTimeout(600)
const langBtn = page.locator('button[aria-label^="Chuyển ngôn ngữ"]:visible')
await langBtn.last().click()
await page.waitForTimeout(500)
await page.getByText('English', { exact: true }).last().click()
await page.waitForTimeout(1500)
out.afterEnglish = await page.evaluate(() => ({ lang: document.documentElement.lang, nav: document.querySelector('.compact-navigation')?.innerText.trim().slice(0,50), stored: localStorage.getItem('prompt-optimizer-preferences')?.slice(0,120) }))
await page.screenshot({ path: 'audit/shots/menu-sheet-english.png' })

const langBtn2 = page.locator('button[aria-label^="Switch language"]:visible')
out.enTrigger = await langBtn2.count()
if (await langBtn2.count()) {
  await langBtn2.last().click(); await page.waitForTimeout(400)
  await page.getByText('Tiếng Việt', { exact: true }).last().click(); await page.waitForTimeout(1200)
}
out.backToVi = await page.evaluate(() => ({ lang: document.documentElement.lang }))

// theme -> dark
await page.keyboard.press('Escape'); await page.waitForTimeout(300)
await page.click('[data-testid="compact-global-menu"]'); await page.waitForTimeout(500)
const themeBtn = page.locator('.theme-toggle:visible')
await themeBtn.last().click(); await page.waitForTimeout(400)
await page.getByText('Tối', { exact: true }).last().click()
await page.waitForTimeout(1200)
out.theme = await page.evaluate(() => ({ attr: document.documentElement.getAttribute('data-workspace-theme'), cls: document.documentElement.className, bg: getComputedStyle(document.body).backgroundColor }))
await page.screenshot({ path: 'audit/shots/menu-sheet-dark.png' })
out.errors = errors.slice(0, 5)
console.log(JSON.stringify(out, null, 2))
fs.writeFileSync('audit/mobile-interactions.json', JSON.stringify(out, null, 2))
await browser.close()
