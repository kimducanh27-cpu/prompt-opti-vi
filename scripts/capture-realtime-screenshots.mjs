import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { chromium } from '@playwright/test'

const REPO_ROOT = '/root/workspace/deploy-po/repo'
const WEB_DIST = path.join(REPO_ROOT, 'packages/web/dist')
const SCREENSHOT_DIR = path.join(REPO_ROOT, 'docs/screenshots/honor-magic6')

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })

// Simple static server for packages/web/dist
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json'
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0]
  if (reqPath.startsWith('/prompt-opti-vi/')) {
    reqPath = reqPath.slice('/prompt-opti-vi'.length)
  }
  let filePath = path.join(WEB_DIST, reqPath === '/' ? 'index.html' : reqPath)

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(WEB_DIST, 'index.html')
  }

  const ext = path.extname(filePath)
  const contentType = mimeTypes[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end('Server Error: ' + err.code)
    } else {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content, 'utf-8')
    }
  })
})

const PORT = 18282
server.listen(PORT, async () => {
  console.log(`[Preview Server] Running on http://127.0.0.1:${PORT}/`)
  const timestamp = new Date().toISOString()
  const localTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Saigon' })

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    })

    const context = await browser.newContext({
      viewport: { width: 390, height: 860 },
      deviceScaleFactor: 2.625,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (Linux; Android 14; BVL-AN00 Build/HONORBVL-AN00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    })

    const page = await context.newPage()

    const routes = [
      { name: '01-basic-system-light', path: '/#/basic/system', title: 'Basic System (Light Mode)' },
      { name: '02-pro-multi', path: '/#/pro/multi', title: 'Pro Multi-Context' },
      { name: '03-image-text2image', path: '/#/image/text2image', title: 'Image Mode (Text2Image)' },
      { name: '04-arena', path: '/#/arena', title: 'Arena Mode' }
    ]

    const results = []

    for (const r of routes) {
      console.log(`[Screenshot] Capturing ${r.title}...`)
      await page.goto(`http://127.0.0.1:${PORT}${r.path}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
      await page.waitForTimeout(1000)
      const filename = `${r.name}.png`
      const outPath = path.join(SCREENSHOT_DIR, filename)
      await page.screenshot({ path: outPath, fullPage: false })
      results.push({
        title: r.title,
        route: r.path,
        file: outPath,
        filename
      })
    }

    // Capture dark mode
    console.log('[Screenshot] Capturing Dark Mode...')
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-workspace-theme', 'dark')
    })
    await page.waitForTimeout(500)
    const darkModeFile = '05-basic-system-dark.png'
    const darkOutPath = path.join(SCREENSHOT_DIR, darkModeFile)
    await page.screenshot({ path: darkOutPath, fullPage: false })
    results.push({
      title: 'Basic System (Dark Mode)',
      route: '/#/basic/system (dark)',
      file: darkOutPath,
      filename: darkModeFile
    })

    await browser.close()
    server.close()

    console.log('\n========================================')
    console.log('REAL-TIME ANTHROPIC SCREENSHOT AUDIT REPORT')
    console.log('========================================')
    console.log(`Timestamp (UTC): ${timestamp}`)
    console.log(`Timestamp (Local VN): ${localTime}`)
    console.log(`Target Device: Honor Magic6 (6.78" LTPO OLED 1264x2800)`)
    console.log(`Viewport CSS: 390 x 860 px, DPR: 2.625`)
    console.log(`Browser: Chromium Headless (Android Touch Mobile Emulation)`)
    console.log(`Screenshots Directory: ${SCREENSHOT_DIR}`)
    console.log('----------------------------------------')
    for (const res of results) {
      console.log(`- ${res.title}: ${res.file}`)
    }
    console.log('========================================\n')
  } catch (err) {
    console.error('[Error capturing screenshots]', err)
    server.close()
    process.exit(1)
  }
})
