# Quickstart: prompt-optimizer UI Rewrite

## Prerequisites
- Node.js 24.22.1+
- pnpm 10.6.1+
- Git with worktree support

## Setup
```bash
cd /root/workspace/prompt-optimizer/Promlt\ opti
pnpm install
```

## Baseline Verification
```bash
# Verify current build passes
pnpm build

# Verify current tests pass
pnpm test:unit

# Verify locale parity
pnpm check:locale

# Verify no Chinese runtime
pnpm check:no-chinese-runtime

# Verify mobile design system
node scripts/verify-mobile-design-system.mjs
```

## Development Workflow

### 1. Foundation Phase (Sequential)
```bash
# Install impeccable design system
cd packages/ui
pnpm add -D @impeccable/audit @impeccable/adapt @impeccable/layout @impeccable/typeset @impeccable/distill @impeccable/harden @impeccable/polish

# Run impeccable pipeline
npx impeccable-audit
npx impeccable-adapt --viewport=412x915 --safe-area
npx impeccable-layout --breakpoint=1024
npx impeccable-typeset --base-size=16
npx impeccable-distill
npx impeccable-harden
npx impeccable-polish

# Setup avoid-ai-design scanner
git clone https://github.com/funboy322/avoid-ai-design.git ~/.agents/skills/avoid-ai-design
# Add to package.json scripts: "scan:ai-design": "avoid-ai-design scan packages/ui packages/web"

# Run baseline scan
pnpm scan:ai-design
```

### 2. Create Worktree for a Task
```bash
# Using worktree manager script
./scripts/worktree-manager.sh create T026 "US1 PromptInput"
# Creates worktree at ../worktrees/ui-rewrite/T026-US1-PromptInput
# Creates branch ui-rewrite/T026-US1-PromptInput
```

### 3. TDD Cycle (Red-Green-Refactor)
```bash
# In worktree directory
# 1. Write RED test (confirm it fails)
pnpm test:unit -- packages/ui/tests/unit/components/PromptInput.spec.ts

# 2. Implement GREEN (make test pass)
# Edit component files

# 3. Verify test passes
pnpm test:unit -- packages/ui/tests/unit/components/PromptInput.spec.ts

# 4. REFACTOR
# Clean up, optimize

# 5. Run verification
pnpm lint && pnpm typecheck && pnpm test:unit
pnpm scan:ai-design
```

### 4. Screenshot QA
```bash
# Run Playwright screenshot QA
pnpm test:e2e:qa
# Or specific viewport
npx playwright test --project=honor-magic-6-412x915
```

### 5. Merge Worktree
```bash
# After verification passes
./scripts/worktree-manager.sh merge T026
# Merges branch to main, removes worktree
```

## Full Verification Pipeline
```bash
# Run all checks
pnpm build && pnpm lint && pnpm typecheck && pnpm test:unit
pnpm check:locale && pnpm check:no-chinese-runtime
node scripts/verify-mobile-design-system.mjs
pnpm scan:ai-design
pnpm test:e2e:qa
```

## Viewport Testing Matrix
| Viewport | Device | Safe Area | Test Command |
|----------|--------|-----------|--------------|
| 412×915 | Honor Magic 6 | top: 32px, bottom: 24px | `--project=honor-412` |
| 421×933 | Honor Magic 6 | top: 32px, bottom: 24px | `--project=honor-421` |
| 1280×720 | Desktop | none | `--project=desktop-1280` |
| 1920×1080 | Desktop | none | `--project=desktop-1920` |

## DOM Measurement Thresholds
- `scrollWidth <= innerWidth` (no horizontal overflow)
- `input font-size >= 16px`
- `tap target >= 44×44px`
- `animationDuration == 0s && transitionDuration == 0s`

## Two-Stage Review
1. **Tier 1**: Fresh-context reviewer verifies 100% spec/parity match
2. **Tier 2**: 3-5 parallel reviewers hunt bugs, jury vote, label `[Important|Nit|Pre-existing]`
3. Max 3 revision rounds for Important findings

## Human Approval Gate
- PR packaged with: Testing evidence, Risk assessment, How-to-revert, Feature Parity Matrix, Screenshots, Review summary, Scanner output
- Explicit human approval required before merge
- No auto-merge
