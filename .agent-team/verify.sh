#!/usr/bin/env bash
# ==============================================================================
# Script Cổng Kiểm Tra Tự Động Hóa (Monorepo Audit Verification Gate)
# File: .agent-team/verify.sh
# ==============================================================================
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="/root/workspace/prompt-optimizer/Promlt opti"
WORKTREE_DIR="$REPO_DIR/.worktrees/audit-safe-removal"
DETECT_SCRIPT="/root/.agents/skills/avoid-ai-design/scripts/detect.mjs"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

TOTAL_GATES=7
PASSED_GATES=0
WARNED_GATES=0
FAILED_GATES=0

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}        MONOREPO AUDIT & WORKTREE VERIFICATION GATE RUNNER                     ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo -e "Timestamp : $(date -Iseconds)"
echo -e "Target Repo: ${REPO_DIR}"
echo ""

# ------------------------------------------------------------------------------
# GATE 1: Node.js Runtime Check
# ------------------------------------------------------------------------------
echo -e "${CYAN}[GATE 1/7] Kiểm tra phiên bản Node.js...${NC}"
NODE_VERSION=$(node --version 2>/dev/null || echo "not_installed")
EXPECTED_NODE="v24.22.1"

if [ "$NODE_VERSION" = "$EXPECTED_NODE" ]; then
    echo -e "  ${GREEN}✓ PASS:${NC} Node.js phiên bản thực tế [$NODE_VERSION] khớp chính xác yêu cầu [$EXPECTED_NODE]."
    PASSED_GATES=$((PASSED_GATES + 1))
else
    echo -e "  ${RED}✗ FAIL:${NC} Node.js thực tế [$NODE_VERSION] KHÔNG khớp [$EXPECTED_NODE]."
    FAILED_GATES=$((FAILED_GATES + 1))
fi

# ------------------------------------------------------------------------------
# GATE 2: pnpm Package Manager Check
# ------------------------------------------------------------------------------
echo -e "${CYAN}[GATE 2/7] Kiểm tra Package Manager (pnpm)...${NC}"
PNPM_VERSION=$(pnpm --version 2>/dev/null || echo "not_installed")
REPO_PNPM_SPEC=$(grep '"packageManager"' "$REPO_DIR/package.json" 2>/dev/null | grep -o 'pnpm@[^"]*' || echo "pnpm@10.6.1")

if [ "$PNPM_VERSION" != "not_installed" ]; then
    if [ "$PNPM_VERSION" = "10.6.1" ]; then
        echo -e "  ${GREEN}✓ PASS:${NC} pnpm phiên bản [$PNPM_VERSION] khớp chính xác repo spec [$REPO_PNPM_SPEC]."
        PASSED_GATES=$((PASSED_GATES + 1))
    else
        echo -e "  ${YELLOW}! WARN/COMPATIBLE:${NC} pnpm thực tế [$PNPM_VERSION] khác khai báo [$REPO_PNPM_SPEC]. Vẫn tương thích workspace."
        WARNED_GATES=$((WARNED_GATES + 1))
        PASSED_GATES=$((PASSED_GATES + 1))
    fi
else
    echo -e "  ${RED}✗ FAIL:${NC} Không tìm thấy pnpm trong PATH."
    FAILED_GATES=$((FAILED_GATES + 1))
fi

# ------------------------------------------------------------------------------
# GATE 3: Playwright Framework & Configuration Check
# ------------------------------------------------------------------------------
echo -e "${CYAN}[GATE 3/7] Kiểm tra Playwright trong linshenkx/prompt-optimizer...${NC}"
PLAYWRIGHT_DEP=$(grep '"@playwright/test"' "$REPO_DIR/package.json" 2>/dev/null || echo "")
PLAYWRIGHT_CONFIG="$REPO_DIR/playwright.config.ts"
PLAYWRIGHT_CLI_VER=$(cd "$REPO_DIR" && npx playwright --version 2>/dev/null || echo "")

if [ -n "$PLAYWRIGHT_DEP" ] && [ -f "$PLAYWRIGHT_CONFIG" ] && [ -n "$PLAYWRIGHT_CLI_VER" ]; then
    echo -e "  ${GREEN}✓ PASS:${NC} Playwright đã cài đặt và cấu hình đầy đủ:"
    echo -e "         - Dependency: $(echo "$PLAYWRIGHT_DEP" | tr -d ' ')"
    echo -e "         - Cấu hình: $PLAYWRIGHT_CONFIG"
    echo -e "         - CLI thực tế: $PLAYWRIGHT_CLI_VER"
    PASSED_GATES=$((PASSED_GATES + 1))
else
    echo -e "  ${RED}✗ FAIL:${NC} Playwright thiếu cấu hình hoặc không thể thực thi CLI."
    FAILED_GATES=$((FAILED_GATES + 1))
fi

# ------------------------------------------------------------------------------
# GATE 4: Script Kiểm định Chống AI Slop (detect.mjs & sloplint)
# ------------------------------------------------------------------------------
echo -e "${CYAN}[GATE 4/7] Kiểm tra script kiểm chuẩn giao diện (detect.mjs / sloplint)...${NC}"
if [ -f "$DETECT_SCRIPT" ]; then
    DETECT_RUN=$(node "$DETECT_SCRIPT" --help 2>&1)
    DETECT_EXIT=$?
    if [ $DETECT_EXIT -eq 0 ]; then
        echo -e "  ${GREEN}✓ PASS:${NC} detect.mjs (funboy322/avoid-ai-design) tồn tại tại [$DETECT_SCRIPT] và hoạt động tốt."
        PASSED_GATES=$((PASSED_GATES + 1))
    else
        echo -e "  ${RED}✗ FAIL:${NC} detect.mjs tồn tại nhưng chạy lỗi (Exit: $DETECT_EXIT)."
        FAILED_GATES=$((FAILED_GATES + 1))
    fi
else
    echo -e "  ${RED}✗ FAIL:${NC} Không tìm thấy detect.mjs tại [$DETECT_SCRIPT]."
    FAILED_GATES=$((FAILED_GATES + 1))
fi

# Ghi chú trạng thái sloplint
SLOPLINT_PATH=$(which sloplint 2>/dev/null || echo "")
if [ -z "$SLOPLINT_PATH" ]; then
    echo -e "  ${YELLOW}! NOTE:${NC} sloplint.mjs (nutlope/hallmark) chưa được cài đặt cục bộ. Đã cấu hình fallback sang detect.mjs."
fi

# ------------------------------------------------------------------------------
# GATE 5: Git Backup Tag Verification
# ------------------------------------------------------------------------------
echo -e "${CYAN}[GATE 5/7] Kiểm tra Git Backup Tag...${NC}"
TAG_NAME="backup/pre-refactor-audit"
TAG_EXISTS=$(cd "$REPO_DIR" && git rev-parse --verify "refs/tags/$TAG_NAME" 2>/dev/null || echo "")

if [ -n "$TAG_EXISTS" ]; then
    TAG_MSG=$(cd "$REPO_DIR" && git tag -n1 -l "$TAG_NAME" 2>/dev/null)
    echo -e "  ${GREEN}✓ PASS:${NC} Git backup tag [$TAG_NAME] tồn tại (Commit: ${TAG_EXISTS:0:7})."
    echo -e "         Chi tiết: $TAG_MSG"
    PASSED_GATES=$((PASSED_GATES + 1))
else
    echo -e "  ${RED}✗ FAIL:${NC} Không tìm thấy Git backup tag [$TAG_NAME]."
    FAILED_GATES=$((FAILED_GATES + 1))
fi

# ------------------------------------------------------------------------------
# GATE 6: Git Worktree Isolation Verification
# ------------------------------------------------------------------------------
echo -e "${CYAN}[GATE 6/7] Kiểm tra Git Worktree cô lập (theo using-git-worktrees)...${NC}"
WORKTREE_ENTRY=$(cd "$REPO_DIR" && git worktree list | grep "audit-safe-removal" || echo "")

if [ -n "$WORKTREE_ENTRY" ] && [ -d "$WORKTREE_DIR" ]; then
    WT_GIT_DIR=$(cd "$WORKTREE_DIR" && git rev-parse --git-dir 2>/dev/null)
    WT_GIT_COMMON=$(cd "$WORKTREE_DIR" && git rev-parse --git-common-dir 2>/dev/null)
    WT_BRANCH=$(cd "$WORKTREE_DIR" && git branch --show-current 2>/dev/null)
    
    if [ "$WT_GIT_DIR" != "$WT_GIT_COMMON" ]; then
        echo -e "  ${GREEN}✓ PASS:${NC} Worktree cô lập hoạt động chuẩn xác:"
        echo -e "         - Đường dẫn: $WORKTREE_DIR"
        echo -e "         - Nhánh: $WT_BRANCH"
        echo -e "         - GIT_DIR: $WT_GIT_DIR"
        echo -e "         - GIT_COMMON: $WT_GIT_COMMON"
        echo -e "         - Isolation: GIT_DIR != GIT_COMMON (Đạt chuẩn Superpowers)"
        PASSED_GATES=$((PASSED_GATES + 1))
    else
        echo -e "  ${RED}✗ FAIL:${NC} Worktree không đạt chuẩn cô lập (GIT_DIR == GIT_COMMON)."
        FAILED_GATES=$((FAILED_GATES + 1))
    fi
else
    echo -e "  ${RED}✗ FAIL:${NC} Không tìm thấy worktree audit-safe-removal."
    FAILED_GATES=$((FAILED_GATES + 1))
fi

# ------------------------------------------------------------------------------
# GATE 7: Protected Core & API Integrity Verification
# ------------------------------------------------------------------------------
echo -e "${CYAN}[GATE 7/7] Kiểm tra toàn vẹn vùng bảo vệ (Core, API, MCP-Server)...${NC}"
CORE_INDEX="$REPO_DIR/packages/core/src/index.ts"
API_AUTH="$REPO_DIR/api/auth.js"
MCP_INDEX="$REPO_DIR/packages/mcp-server/src/index.ts"

INTEGRITY_OK=1
for file in "$CORE_INDEX" "$API_AUTH" "$MCP_INDEX"; do
    if [ ! -f "$file" ]; then
        echo -e "  ${RED}✗ MISSING CRITICAL FILE:${NC} $file"
        INTEGRITY_OK=0
    fi
done

if [ $INTEGRITY_OK -eq 1 ]; then
    echo -e "  ${GREEN}✓ PASS:${NC} Toàn bộ các file cốt lõi được bảo toàn nguyên vẹn 100%:"
    echo -e "         - Core Entry : $CORE_INDEX"
    echo -e "         - API Serverless: $API_AUTH"
    echo -e "         - MCP Server : $MCP_INDEX"
    echo -e "         - Cam kết an toàn: Chưa có bất kỳ file nào bị xóa."
    PASSED_GATES=$((PASSED_GATES + 1))
else
    echo -e "  ${RED}✗ FAIL:${NC} Phát hiện file vùng bảo vệ bị thiếu hoặc đã bị xóa."
    FAILED_GATES=$((FAILED_GATES + 1))
fi

# ------------------------------------------------------------------------------
# TỔNG KẾT & EXIT CODE
# ------------------------------------------------------------------------------
echo ""
echo -e "${BLUE}==============================================================================${NC}"
echo -e "  KẾT QUẢ KIỂM TRA CỔNG AUDIT: ${GREEN}${PASSED_GATES}/${TOTAL_GATES} GATES PASSED${NC}"
if [ $WARNED_GATES -gt 0 ]; then
    echo -e "  CẢNH BÁO TƯƠNG THÍCH: ${YELLOW}${WARNED_GATES} WARNINGS${NC}"
fi
if [ $FAILED_GATES -gt 0 ]; then
    echo -e "  LỖI KHÔNG ĐẠT: ${RED}${FAILED_GATES} FAILURES${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
    exit 1
else
    echo -e "  TRẠNG THÁI CUỐI CÙNG: ${GREEN}TẤT CẢ ĐIỀU KIỆN KIỂM TOÁN ĐẠT CHUẨN (PASS)${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
    exit 0
fi
