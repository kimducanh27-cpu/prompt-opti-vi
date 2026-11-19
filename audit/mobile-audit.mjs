import { chromium } from '@playwright/test'
import fs from 'node:fs'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:18181'
const VIEWPORTS = [
  { name: 'honor-magic6', width: 412, height: 915, dsf: 3 },
  { name: 'honor-magic6-expanded', width: 421, height: 933, dsf: 3 },
  { name: 'small-360', width: 360, height: 669, dsf: 2 },
  { name: 'iphone-393', width: 393, height: 852, dsf: 3 },
  { name: 'desktop-1440', width: 1440, height: 900, dsf: 1, desktop: true },
]

const ROUTES = [
  ['home', '/'],
  ['basic-user', '/basic/user'],
  ['basic-system', '/basic/system'],
  ['pro-variable', '/pro/variable'],
  ['pro-multi', '/pro/multi'],
  ['image-text2image', '/image/text2image'],
  ['image-image2image', '/image/image2image'],
  ['image-multi', '/image/multi'],
  ['arena', '/arena'],
]

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const report = []

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf,
    isMobile: !vp.desktop,
    hasTouch: !vp.desktop,
    locale: 'vi-VN',
    userAgent: vp.desktop
      ? undefined
      : 'Mozilla/5.0 (Linux; Android 14; BVL-AN00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  })
  const page = await context.newPage()
  const consoleErrors = []
  page.on('pageerror', (e) => consoleErrors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })

  for (const [routeName, path] of ROUTES) {
    await page.goto(`${BASE}/#${path}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2200)
    const metrics = await page.evaluate(() => {
      const vw = window.innerWidth
      const doc = document.documentElement
      const body = document.body
      const visible = (el) => {
        const r = el.getBoundingClientRect()
        const s = getComputedStyle(el)
        return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && r.bottom > 0 && r.top < window.innerHeight
      }
      const interactive = [...document.querySelectorAll('button, a[href], input, textarea, select, [role="button"]')].filter(visible)
      const small = interactive
        .map((el) => {
          const r = el.getBoundingClientRect()
          return {
            tag: el.tagName.toLowerCase(),
            text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40),
            w: Math.round(r.width),
            h: Math.round(r.height),
          }
        })
        .filter((x) => x.h < 44 || x.w < 44)
      const inputs = [...document.querySelectorAll('input, textarea, select')]
        .filter(visible)
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          type: el.getAttribute('type') || '',
          font: parseFloat(getComputedStyle(el).fontSize),
          w: Math.round(el.getBoundingClientRect().width),
        }))
      const overflowers = [...document.querySelectorAll('body *')]
        .filter(visible)
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.right > vw + 1 || r.left < -1)
        .slice(0, 8)
        .map(({ el, r }) => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60), left: Math.round(r.left), right: Math.round(r.right) }))
      const nav = document.querySelector('.compact-navigation')?.getBoundingClientRect()
      const bodyText = body.innerText || ''
      return {
        vw,
        scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
        docHeight: doc.scrollHeight,
        hasCompactNav: !!nav,
        nav: nav ? { top: Math.round(nav.top), height: Math.round(nav.height) } : null,
        interactiveCount: interactive.length,
        smallTargets: small.slice(0, 8),
        smallTargetCount: small.length,
        inputCount: inputs.length,
        sub16Inputs: inputs.filter((i) => i.font > 0 && i.font < 16),
        overflowers,
        hasVietnamese: /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i.test(bodyText),
        title: document.title,
        lang: doc.lang,
      }
    })
    report.push({ viewport: vp.name, route: routeName, ...metrics, consoleErrors: consoleErrors.slice(0, 4) })
    if (vp.name === 'honor-magic6' || vp.name === 'desktop-1440') {
      await page.screenshot({ path: `audit/shots/${vp.name}-${routeName}.png` })
    }
  }
  await context.close()
}

await browser.close()
fs.writeFileSync('audit/mobile-audit.json', JSON.stringify(report, null, 2))
for (const r of report) {
  console.log([
    r.viewport.padEnd(20),
    r.route.padEnd(18),
    `sw=${r.scrollWidth}/${r.vw}`,
    `nav=${r.hasCompactNav}`,
    `small=${r.smallTargetCount}`,
    `sub16=${r.sub16Inputs.length}`,
    `overflow=${r.overflowers.length}`,
    `vi=${r.hasVietnamese}`,
    `lang=${r.lang}`,
    r.consoleErrors.length ? `err=${r.consoleErrors.length}` : '',
  ].join(' '))
}
