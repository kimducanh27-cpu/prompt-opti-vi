import { defineConfig, devices } from '@playwright/test';
import * as os from 'node:os';

/**
 * Playwright E2E 测试配置
 * 用于测试 Web 应用的完整用户流程
 */

// E2E 测试专用端口,避免与开发服务器冲突
const E2E_PORT = process.env.E2E_PORT || 15555;
const BASE_URL = `http://localhost:${E2E_PORT}`;
const E2E_VCR_MODE = process.env.E2E_VCR_MODE || 'auto';
const USE_VCR_PLACEHOLDER_KEYS = E2E_VCR_MODE === 'replay';
const USE_EMPTY_MODEL_CONFIG = process.env.E2E_EMPTY_MODEL_CONFIG === '1';
const MODEL_CREDENTIAL_ENV_KEYS = [
  'VITE_ANTHROPIC_API_KEY',
  'VITE_ARK_API_KEY',
  'VITE_CF_ACCOUNT_ID',
  'VITE_CF_API_TOKEN',
  'VITE_CUSTOM_API_BASE_URL',
  'VITE_CUSTOM_API_HEADERS',
  'VITE_CUSTOM_API_KEY',
  'VITE_CUSTOM_API_MODEL',
  'VITE_DASHSCOPE_API_KEY',
  'VITE_DEEPSEEK_API_KEY',
  'VITE_GEMINI_API_KEY',
  'VITE_GROK_API_KEY',
  'VITE_MIMO_TOKEN_PLAN_API_KEY',
  'VITE_MINIMAX_API_KEY',
  'VITE_MODELSCOPE_API_KEY',
  'VITE_OPENAI_API_KEY',
  'VITE_OPENROUTER_API_KEY',
  'VITE_SEEDREAM_API_KEY',
  'VITE_SILICONFLOW_API_KEY',
  'VITE_XAI_API_KEY',
  'VITE_ZHIPU_API_KEY',
] as const;

export default defineConfig({
  // 测试目录
  testDir: './tests/e2e',

  // 完全并行运行测试
  // 每个测试使用独立的 BrowserContext 和数据库名称，完全隔离
  fullyParallel: true,

  // CI 环境下失败时不重试,本地开发时重试一次
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // CI 环境下使用更少的 worker；本地默认限制并发，避免 Windows/Chromium 在高并发下出现
  // ERR_CONNECTION_RESET / ERR_INSUFFICIENT_RESOURCES / worker crash 等不稳定问题。
  // 如需提速可通过 E2E_WORKERS 覆盖。
  workers: (() => {
    if (process.env.CI) return 1

    const raw = process.env.E2E_WORKERS
    if (raw) {
      const parsed = Number(raw)
      if (Number.isFinite(parsed) && parsed > 0) return Math.floor(parsed)
    }

    // 默认取 2（或更小），在资源紧张机器上更稳。
    return Math.min(2, os.cpus().length || 1)
  })(),

  // 测试报告配置
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  // 共享设置
  use: {
    // 基础 URL
    baseURL: BASE_URL,

    // 收集失败测试的 trace
    trace: 'on-first-retry',

    // 截图配置
    screenshot: 'only-on-failure',

    // 视频配置
    video: 'retain-on-failure',
  },

  // 项目配置 - 不同浏览器
  projects: [
    {
      name: 'chromium',
      // Slice 10: the group runner passes spec paths explicitly, and a
      // project without testMatch matches ANY passed path — so without
      // this, the mobile journey specs would also run on the desktop
      // project (compact UI hidden at desktop width) and fail. The mobile
      // projects are scoped the other way via testMatch.
      testIgnore: 'mobile/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Slice 10 — mobile journey projects (Honor Magic6 viewports).
    // testMatch is scoped to tests/e2e/mobile/ ONLY, so the existing 48
    // desktop specs never run on mobile and the suite does not double.
    // Explicit Chromium options (no iPhone/Pixel device preset): the iPhone
    // preset defaults to WebKit, which is not installed on this VM, and the
    // viewport must be exactly 412x915 / 430x932. isMobile/hasTouch drive
    // pointer:coarse + touch; deviceScaleFactor matches the real phones.
    {
      name: 'mobile-412',
      testMatch: 'mobile/*.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: { width: 412, height: 915 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2.625,
        userAgent:
          'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
      },
    },
    {
      name: 'mobile-430',
      testMatch: 'mobile/*.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: { width: 430, height: 932 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      },
    },

    // 如果需要测试其他浏览器,可以取消注释
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // 自动启动 E2E 测试专用开发服务器
  webServer: {
    // E2E 依赖 workspace 包的 dist 产物（@prompt-optimizer/core/@prompt-optimizer/ui），
    // 先构建再启动 web dev server，避免跑到过期 dist 导致交互/事件异常。
    command: `pnpm -F @prompt-optimizer/core build && pnpm -F @prompt-optimizer/ui build && pnpm -F @prompt-optimizer/web dev --port ${E2E_PORT}`,
    url: BASE_URL,
    // 为 Vite 提供最小的“启用”环境变量：让内置 SiliconFlow 图像模型在 E2E (VCR replay) 下可选，
    // 避免因本机缺少真实 key 而导致 UI 不渲染对应选项，从而无法命中既有 VCR fixtures。
    env: {
      ...process.env,
      ...(USE_EMPTY_MODEL_CONFIG
        ? Object.fromEntries(MODEL_CREDENTIAL_ENV_KEYS.map((key) => [key, '']))
        : {}),
      ...(USE_VCR_PLACEHOLDER_KEYS
        ? {
            VITE_SILICONFLOW_API_KEY: process.env.VITE_SILICONFLOW_API_KEY || 'vcr',
            VITE_DEEPSEEK_API_KEY: process.env.VITE_DEEPSEEK_API_KEY || 'vcr',
            VITE_DASHSCOPE_API_KEY: process.env.VITE_DASHSCOPE_API_KEY || 'vcr',
          }
        : {}),
    },
    // 为了保证每次测试都使用最新构建产物，默认不复用已有 server。
    reuseExistingServer: false,
    // Windows 本地冷启动时，core + ui 构建本身就可能超过 120s，
    // 给到 3 分钟窗口，避免把“构建偏慢”误判成 E2E 失败。
    timeout: 180 * 1000,
  },
});
