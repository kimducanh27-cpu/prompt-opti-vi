#!/usr/bin/env node
import { spawnSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const detectScript = '/root/.agents/skills/avoid-ai-design/scripts/detect.mjs'

console.log('[Anti-Slop Lint] Scanning packages/ui/src/styles for AI design tells...')

const result = spawnSync(
  process.execPath,
  [detectScript, path.join(rootDir, 'packages/ui/src/styles')],
  { stdio: 'inherit' }
)

if (result.status !== 0) {
  console.error('[Anti-Slop Lint] FAILED: AI design tells detected.')
  process.exit(result.status || 1)
}

console.log('[Anti-Slop Lint] PASSED: 0 P0/P1 findings.')
process.exit(0)
