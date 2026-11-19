# Orchestration Report: Complete UI Rewrite for prompt-optimizer

**Generated**: 2026-11-19 | **Phase**: Pre-flight & WHAT/WHY (Spec Kit) Complete

---

## Executive Summary

Successfully completed the **Pre-flight** and **WHAT & WHY (Spec Kit)** phases for the complete UI rewrite of `prompt-optimizer`. The repository has been initialized with Spec Kit, constitution established, feature specification created with 10 user stories, implementation plan designed, feature parity matrix mapped (100% of features to stores/composables/services), data model documented, and tasks generated for TDD execution.

**Baseline avoid-ai-design scan**: 493 files scanned, **P0=1, P1=48, P2=20** (69 total findings). Target: **P0=0, P1=0, stack score < 6**.

---

## Phase Status

### ✅ Phase 0: Pre-flight & Self-Install (COMPLETE)
- [x] Spec Kit CLI (`specify`) installed via `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git` (v1.4.3.dev0)
- [x] Git repository initialized in `/root/workspace/prompt-optimizer/Promlt opti`
- [x] `avoid-ai-design` scanner cloned to `~/.agents/skills/avoid-ai-design`
- [x] Baseline avoid-ai-design scan completed (results above)
- [x] Existing design system tokens documented (`packages/ui/src/styles/tokens.css`)

### ✅ Phase 1: WHAT & WHY - Spec Kit (COMPLETE)
- [x] **Constitution** (`.specify/constitution.md`): 10 non-negotiable principles established
- [x] **Feature Specification** (`.specify/spec.md`): 10 user stories (P1), requirements, success criteria, assumptions
- [x] **Feature Parity Matrix** (`.specify/feature-parity-matrix.md`): 100% mapping of all features to stores/composables/services with 70+ Test IDs
- [x] **Data Model** (`.specify/data-model.md`): 10 entities with relationships and preserved API contracts
- [x] **Implementation Plan** (`.specify/plan.md`): 5 phases, 240+ tasks, parallel opportunities identified
- [x] **Tasks** (`.specify/tasks.md`): Full TDD task breakdown by user story
- [x] **Quickstart** (`.specify/quickstart.md`): Developer workflow documentation
- [x] **Worktree Manager** (`scripts/worktree-manager.sh`): Automation for isolated worktrees

---

## Baseline Metrics

| Metric | Current | Target |
|--------|---------|--------|
| avoid-ai-design P0 | 1 | 0 |
| avoid-ai-design P1 | 48 | 0 |
| avoid-ai-design P2 | 20 | N/A |
| Stack score (max) | 3 (ImageMultiImageWorkspace) | < 6 |
| Files scanned | 493 | N/A |
| User stories mapped | 10/10 | 10/10 |
| Test IDs defined | 70+ | 70+ |
| Components to rewrite | ~200 | 0 |

### Key avoid-ai-design Findings (Sample)
- **P1 K7**: No visible keyboard focus (:focus-visible missing) — 15+ components
- **P1 I3**: Worn Lucide set / sparkle-for-AI glyph — ContextSystemWorkspace, ContextUserWorkspace
- **P1 C2**: Indigo/violet primary buttons (defaulted accent) — TemplateManager
- **P1 K3**: Glassmorphism (backdrop-blur) — OutputDisplay, ImageMultiImageWorkspace
- **P1 M6**: Motion without prefers-reduced-motion — TestVariantSourceTag
- **P2 M8**: Every card lifts on hover — ConversationManager, ImageMultiImageWorkspace
- **P2 C5**: Colored glow shadows — ImageMultiImageWorkspace
- **P1 T7**: Typeface declared but never shipped (SFMono-Regular) — MarkdownRenderer, XmlRenderer
- **P1 I2**: Emoji as interface icons — AppHeaderActions

---

## Architecture Decisions Documented

### Backend Preservation (Constitution Principle I)
**PRESERVED** - No changes allowed:
- `packages/core` - All services, adapters, evaluation engine
- `packages/mcp-server` - MCP protocol server
- `packages/desktop` - Electron main/preload
- `packages/extension` - Chrome extension wrapper
- `packages/ui/src/composables` (107 files) - All business logic composables
- `packages/ui/src/stores` (20 files) - All Pinia stores
- `packages/ui/src/router` - Vue Router config
- `packages/ui/src/i18n` - All 4 locales
- `packages/ui/src/plugins` - Naive UI, i18n plugins

### Rewriting Target (Constitution Principle III)
**REWRITE** - Complete replacement:
- `packages/ui/src/components` (~200 Vue components)
- `packages/ui/src/views` (page-level views)
- `packages/ui/src/styles` (design system tokens, global styles)
- `packages/ui/src/utils` (utility functions)
- `packages/web/src/App.vue` - Root app shell
- `packages/web/src/main.ts` - App bootstrap
- `packages/tests/e2e` - E2E tests (Playwright)

### Design System Strategy
Using existing `tokens.css` as foundation (already has Meta Astryx + GitHub Primer tokens) rather than installing `@impeccable/*` packages (not on npm). Will implement impeccable principles manually:
- Audit → Adapt → Layout → Typeset → Distill → Harden → Polish
- **FORBIDDEN**: animate, delight (zero animation policy)

---

## Next Steps (Phase 2: HOW - Superpowers Execution)

### Immediate Actions Required

1. **Create Foundation Worktree** (T005-T025)
   ```bash
   ./scripts/worktree-manager.sh create FDN foundation
   cd ../worktrees/ui-rewrite/FDN-foundation
   # Execute foundation tasks sequentially
   ```

2. **Foundation Tasks (Sequential - Blocking)**
   - T005-T014: Implement impeccable pipeline manually using existing tokens
   - T015-T018: Integrate avoid-ai-design CLI into package.json scripts
   - T019-T022: Configure Vitest + Playwright for TDD + Screenshot QA
   - T023-T025: Test worktree automation

3. **Parallel User Story Execution** (After Foundation)
   - Spawn 10 parallel worktrees for US1-US10
   - Each follows: RED tests → GREEN implementation → REFACTOR → Verify → Screenshot QA
   - All components mount with **real stores/composables** (no mocks)

### Subagent Orchestration Plan

| Role | Count | Responsibility |
|------|-------|----------------|
| Spec Author | 1 | Maintain spec/parity matrix, clarify ambiguities |
| TDD Workers | 10 | One per user story, execute RED-GREEN-REFACTOR in worktrees |
| Screenshot QA Worker | 1 | Playwright headless, 4 viewports, DOM measurements |
| Fresh-Context Reviewer | 1 | Tier 1: 100% spec/parity match verification |
| Parallel Reviewers | 3-5 | Tier 2: Logic/layout/backend-wiring bug hunt, jury vote |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| avoid-ai-design P0/P1 remediation complex | High | High | Foundation phase addresses systematically; impeccable pipeline provides replacement patterns |
| Worktree merge conflicts | Medium | Medium | Short-lived branches, frequent merges, clear file ownership per user story |
| TDD test maintenance burden | Medium | Medium | Test helpers in `packages/ui/tests/utils/`, shared patterns across stories |
| Playwright screenshot flakiness | Medium | High | Deterministic viewports, wait-for-selector, retry logic in QA worker |
| Review rounds exceed 3 | Low | Critical | Clear Important/Nit/Pre-existing labels; style-only discarded; fresh-context Tier 1 catches parity gaps early |

---

## Verification Gates (Must Pass Before PR)

1. **Build & Lint**: `pnpm build && pnpm lint && pnpm typecheck` ✅
2. **Unit Tests**: `pnpm test:unit` (all Vitest pass) ✅
3. **Locale Parity**: `pnpm check:locale` (0 missing keys) ✅
4. **No Chinese Runtime**: `pnpm check:no-chinese-runtime` ✅
5. **Mobile Design System**: `node scripts/verify-mobile-design-system.mjs` ✅
6. **avoid-ai-design**: Exit code 0, P0=0, P1=0, stack score < 6 ✅
7. **Screenshot QA**: 4 viewports, all flows, DOM measurements pass ✅
8. **Tier 1 Review**: 100% spec/parity match ✅
9. **Tier 2 Review**: 0 Important findings after ≤3 rounds ✅
10. **Human Approval**: Explicit approval before merge ✅

---

## Blocker Status

**Current Blockers**: None

**Anticipated Blockers**:
- `@impeccable/*` packages not on npm → Using existing tokens.css + manual implementation
- Playwright may need Chromium installation in headless environment
- Network access for `pnpm install` dependencies

---

## Commands to Resume Work

```bash
cd "/root/workspace/prompt-optimizer/Promlt opti"

# Check status
git status
git worktree list

# Run baseline verification
pnpm build && pnpm test:unit
pnpm check:locale && pnpm check:no-chinese-runtime

# Create foundation worktree
./scripts/worktree-manager.sh create FDN foundation

# In worktree, start foundation tasks
cd ../worktrees/ui-rewrite/FDN-foundation
```

---

## Sign-off

**Orchestrator**: UI Architecture Coordinator (Spec Kit × Superpowers)
**Status**: Pre-flight & WHAT/WHY Complete — Ready for HOW Execution
**Next Milestone**: Foundation Phase Complete (T005-T025 verified)
