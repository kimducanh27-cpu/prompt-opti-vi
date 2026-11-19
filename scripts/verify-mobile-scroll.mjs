import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs'
import { chromium } from '@playwright/test'

const REPO_ROOT = '/root/workspace/deploy-po/repo'
const WEB_DIST = path.join(REPO_ROOT, 'packages/web/dist')

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

const PORT = 19293
server.listen(PORT, async () => {
  console.log(`[Test Server] Running on http://127.0.0.1:${PORT}/`)
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
    page.on('console', msg => console.log('PAGE LOG:', msg.text()))
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message))

    await page.goto(`http://127.0.0.1:${PORT}/#/basic/system`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
    
    // Wait for the main layout to mount (past loading spinner)
    console.log('Waiting for #main-content or .compact-navigation...')
    try {
      await page.waitForSelector('.compact-navigation', { timeout: 8000 })
      console.log('Found .compact-navigation!')
    } catch {
      console.log('Timed out waiting for .compact-navigation, checking current HTML...')
    }

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      const body = document.body
      const header = document.querySelector('.compact-header')
      const headerBox = header ? header.getBoundingClientRect() : null
      const tabBar = document.querySelector('.compact-tab-bar')
      const tabBarBox = tabBar ? tabBar.getBoundingClientRect() : null
      const pane = document.querySelector('.compact-workspace-pane')
      const paneStyle = pane ? window.getComputedStyle(pane) : null

      return {
        scrollHeight: doc.scrollHeight,
        clientHeight: doc.clientHeight,
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        headerHeight: headerBox ? headerBox.height : null,
        tabBarBottom: tabBarBox ? tabBarBox.bottom : null,
        tabBarHeight: tabBarBox ? tabBarBox.height : null,
        panePaddingLeft: paneStyle ? paneStyle.paddingLeft : null,
        panePaddingRight: paneStyle ? paneStyle.paddingRight : null
      }
    })

    console.log('\n--- Initial Metrics ---')
    console.log(JSON.stringify(metrics, null, 2))

    // Perform CDP Touch Scroll / swipe
    const client = await context.newCDPSession(page)
    console.log('\nPerforming CDP Touch Scroll (swipe up from y:600 to y:200)...')
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 195, y: 600 }]
    })
    for (let y = 600; y >= 200; y -= 40) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: 195, y }]
      })
      await new Promise(r => setTimeout(r, 20))
    }
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: []
    })

    await page.waitForTimeout(500)

    const scrollY = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop)
    console.log(`Window ScrollY after swipe: ${scrollY}px`)

    await browser.close()
    server.close()
  } catch (err) {
    console.error('Error during test:', err)
    server.close()
  }
})
