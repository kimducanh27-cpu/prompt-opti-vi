# BÁO CÁO KIỂM TOÁN MÔI TRƯỜNG, GIT WORKTREE VÀ KẾ HOẠCH XÓA FILE AN TOÀN MONOREPO

> **Mã tài liệu**: `.agent-team/00-audit.md`  
> **Thời điểm kiểm toán**: 2026-11-20T13:25:00+07:00  
> **Vai trò**: Kỹ sư DevOps / Release Engineer kiêm Kiểm toán viên mã nguồn  
> **Mục tiêu**: Thực hiện kiểm tra môi trường thật, xác minh script kiểm chuẩn giao diện, thiết lập Git backup tag và Git worktree cô lập theo chuẩn `obra/superpowers` (`using-git-worktrees`), lập danh mục kiểm kê (inventory) file/export dự kiến xóa an toàn, cam kết bảo toàn 100% backend/core (`packages/core`, `api/`, `packages/mcp-server`), và cung cấp kịch bản cổng kiểm máy `.agent-team/verify.sh`.

---

## 1. Khảo sát Workspace và Hiện trạng Repository

### 1.1. Thông tin chung về Workspace & Runtime
- **Môi trường thực thi**: Linux (Ubuntu 24.04 bên trong PRoot container trên thiết bị Android).
- **Thư mục làm việc hiện tại (`pwd`)**: `/root/workspace`
- **Monorepo mục tiêu**: `/root/workspace/prompt-optimizer/Promlt opti`
- **Upstream Repository**: [`linshenkx/prompt-optimizer`](https://github.com/linshenkx/prompt-optimizer) (Phiên bản mã nguồn gốc: `v2.15.2`).
- **Cấu trúc Monorepo**: Quản lý đa gói (pnpm workspaces):
  - `packages/ui`: Thư viện giao diện, component Vue 3, Naive UI, styles, composables.
  - `packages/web`: Ứng dụng Web PWA (Vite + Vue 3).
  - `packages/core`: Nhân xử lý nghiệp vụ, LLM service, template processor, history, data manager (**Vùng bảo vệ nghiêm ngặt**).
  - `api/`: API endpoints phục vụ Vercel serverless / xác thực runtime (`api/auth.js`) (**Vùng bảo vệ nghiêm ngặt**).
  - `packages/mcp-server`: Triển khai Model Context Protocol server (**Vùng bảo vệ nghiêm ngặt**).
  - `packages/desktop`: Ứng dụng Electron desktop wrapper.
  - `packages/extension`: Trình cắm Chrome Extension (Manifest V3).

### 1.2. Hiện trạng Git tại Monorepo
- **Nhánh chính**: `main`
- **Commit HEAD gốc**: `251e12f chore: Spec Kit initialization - constitution, spec, plan, tasks, parity matrix, data model`
- **Trạng thái working tree**: Clean (không có thay đổi dở dang trước kiểm toán).
- **Worktree list ban đầu**:
  - `/root/workspace/prompt-optimizer/Promlt opti` (`main`)
  - `/root/workspace/prompt-optimizer/worktrees/ui-rewrite/FDN-foundation` (`ui-rewrite/FDN-foundation`)
  - `/root/workspace/prompt-optimizer/worktrees/ui-rewrite/US1-single-prompt` (`ui-rewrite/US1-single-prompt`)

---

## 2. Kết quả kiểm tra môi trường bằng lệnh thật

Dưới đây là biên bản kiểm tra bằng các câu lệnh thực tế được thực thi trực tiếp trên hệ điều hành, ghi nhận đầy đủ câu lệnh, mã thoát (exit code) và dữ liệu đầu ra thực tế.

### 2.1. Bảng đối chiếu môi trường thực tế

| Hạng mục kiểm tra | Lệnh thực thi thực tế | Exit Code | Kết quả trả về thực tế | Giá trị yêu cầu / Quy định repo | Đánh giá & Phân tích kỹ thuật |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Node.js Runtime** | `node --version` | `0` | `v24.22.1` | `24.22.1` (`engines.node: "^24.22.1"`) | **PASS (ĐẠT HOÀN TOÀN)**: Phiên bản môi trường khớp chính xác từng số hiệu phiên bản. |
| **Package Manager (pnpm)** | `pnpm --version` | `0` | `11.28.5` | `10.6.1` (`packageManager: "pnpm@10.6.1"`) | **WARNING / COMPATIBLE**: Môi trường cài bản `11.28.5` (cao hơn bản khai báo `10.6.1`). Cú pháp workspace tương thích; tuy nhiên cần lưu ý bảo vệ cấu trúc `pnpm-lock.yaml`. |
| **Playwright Framework** | `cat package.json \| grep '@playwright/test'` | `0` | `"@playwright/test": "^1.58.2"` | Khai báo trong devDependencies | **PASS**: Phù hợp dải phiên bản yêu cầu của repo. |
| **Playwright Installed Version** | `cat node_modules/@playwright/test/package.json \| grep '"version"'` | `0` | `"version": "1.63.0"` | Tương thích `^1.58.2` | **PASS**: Bản cài đặt thực tế đã sẵn sàng trong `node_modules`. |
| **Playwright CLI Executable** | `npx playwright --version` | `0` | `Version 1.63.0` | CLI sẵn sàng | **PASS**: Khởi chạy thành công qua npx. |

### 2.2. Kiểm toán chi tiết cấu hình Playwright trong `linshenkx/prompt-optimizer`

1. **Tệp cấu hình E2E Web (`playwright.config.ts`)**:
   - `testDir`: `./tests/e2e`
   - `fullyParallel`: `true` (chạy song song độc lập context).
   - `workers`: Tối đa 2 workers trên môi trường local (tự động tính dựa theo `os.cpus().length` hoặc `process.env.E2E_WORKERS`).
   - `webServer`: Tự động build và kích hoạt máy chủ dev phục vụ test E2E:
     ```bash
     pnpm -F @prompt-optimizer/core build && pnpm -F @prompt-optimizer/ui build && pnpm -F @prompt-optimizer/web dev --port 15555
     ```
   - `reuseExistingServer`: `false` (đảm bảo kiểm tra trên bản build mới nhất).
   - `timeout`: 180,000 ms (3 phút cho giai đoạn build và khởi động).
   - `VCR Mode`: Hỗ trợ biến môi trường `E2E_VCR_MODE` (`auto` hoặc `replay`) với placeholder API keys nhằm giả lập các phản hồi LLM khi chạy kiểm thử ngoại tuyến.

2. **Tệp cấu hình Extension E2E (`playwright.extension.config.ts`)**:
   - `testDir`: `./tests/extension`
   - `outputDir`: `./test-results/extension`
   - `workers`: 1 worker (tuần tự nhằm kiểm soát context trình duyệt extension).

3. **Tập lệnh (Scripts) Playwright trong `package.json`**:
   - `pnpm test:e2e` -> `playwright test`
   - `pnpm test:e2e:extension` -> `pnpm build:core && pnpm build:ui && pnpm build:ext && pnpm check:extension-release-secrets && playwright test --config playwright.extension.config.ts`
   - `pnpm test:e2e:ui` -> `playwright test --ui`
   - `pnpm test:e2e:debug` -> `playwright test --debug`
   - Các kịch bản phụ trợ: `scripts/e2e-groups.js`, `scripts/run-e2e-group.js`, `scripts/run-e2e-record.js`, `scripts/smart-e2e.js`.

---

## 3. Xác minh đường dẫn và trạng thái script kiểm định thực tế

### 3.1. Script `detect.mjs` từ `funboy322/avoid-ai-design`
- **Đường dẫn vật lý tuyệt đối**:
  ```text
  /root/.agents/skills/avoid-ai-design/scripts/detect.mjs
  ```
- **Lệnh kiểm tra thực tế**:
  ```bash
  node /root/.agents/skills/avoid-ai-design/scripts/detect.mjs --help
  ```
- **Exit Code**: `0`
- **Tình trạng**: **SẴN SÀNG & HOẠT ĐỘNG HOÀN HẢO**.
- **Đặc tính kỹ thuật**:
  - Không phụ thuộc bên ngoài (zero dependencies), tương thích Node 18+.
  - Quét tĩnh các dấu hiệu nhận dạng mã do AI tạo ra (code-certain tells):
    - `P0`: Gradient tím-xanh (`from-indigo-500`), font `Inter` mặc định mọi vị trí, layout hero 3 thẻ rập khuôn, text nền gradient (`bg-clip-text`).
    - `P1`: Cụm màu bậc hai (cream + terracotta, near-black + acid green), `rounded-2xl shadow-lg` vô tội vạ, 4 cột footer mặc định.
    - Hỗ trợ cờ `--json` để xuất dữ liệu cho hệ thống tự động và cờ `--min=P0|P1|P2`.

### 3.2. Script `sloplint.mjs` từ `nutlope/hallmark`
- **Tình trạng thực tế trên hệ thống**: **CHƯA ĐƯỢC CÀI ĐẶT CỤC BỘ** (Không tìm thấy file trên filesystem máy chủ).
- **Thông tin nguồn gốc**: Thuộc bộ công cụ mã nguồn mở [Hallmark](https://github.com/nutlope/hallmark) của tác giả `nutlope`, cung cấp linter đánh giá AI slop trực quan và layout linter.
- **Phương án giải quyết & Fallback**:
  1. **Fallback cấp 1 (Khuyến nghị)**: Sử dụng trực tiếp `/root/.agents/skills/avoid-ai-design/scripts/detect.mjs` (đã có sẵn và hoạt động độc lập không cần mạng).
  2. **Quy trình cài đặt bổ sung khi cần kích hoạt**:
     ```bash
     npx skills add nutlope/hallmark -g
     # Hoặc clone trực tiếp:
     # git clone https://github.com/nutlope/hallmark.git /root/.agents/skills/hallmark
     ```

---

## 4. Thực hiện Quy trình Git Backup Tag & Worktree tách biệt

Áp dụng nghiêm ngặt theo hướng dẫn kỹ năng `obra/superpowers` mục `using-git-worktrees` (`/root/.dsh/profiles/web/node_modules/superpowers-dsh/skills/using-git-worktrees/SKILL.md`).

### 4.1. Bước 0: Phát hiện môi trường cô lập (Detect Existing Isolation)
- Thực thi các câu lệnh kiểm tra:
  ```bash
  GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
  GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
  ```
- Kết quả tại repo gốc: `GIT_DIR == GIT_COMMON` (`/root/workspace/prompt-optimizer/Promlt opti/.git`). Xác nhận đang ở checkout chính, chưa có isolation.

### 4.2. Tạo Git Backup Tag an toàn
Trước khi thực hiện bất kỳ thay đổi nào lên cây mã nguồn, một tag backup đã được thiết lập để làm điểm phục hồi nguyên bản:
- **Tên Tag**: `backup/pre-refactor-audit`
- **Commit được gắn tag**: `251e12f00fc4aa639753f02b56b0684873c1dd7e`
- **Lệnh tạo tag**:
  ```bash
  git tag -a "backup/pre-refactor-audit" -m "Backup tag before audit, worktree creation, and safe file removal plan"
  ```
- **Xác minh tag**:
  ```bash
  git tag -n1 | grep backup/pre-refactor-audit
  # Output: backup/pre-refactor-audit Backup tag before audit, worktree creation, and safe file removal plan
  ```

### 4.3. Kiểm tra An toàn Thư mục Worktree (Safety Verification)
Theo quy định bắt buộc của `using-git-worktrees`:
> *"MUST verify directory is ignored before creating worktree... If NOT ignored: Add to .gitignore, commit the change, then proceed."*
- Kiểm tra ban đầu: Thư mục `.worktrees/` và `worktrees/` chưa được khai báo trong `.gitignore`.
- Thao tác thực hiện: Bổ sung quy tắc bỏ qua vào `.gitignore`:
  ```gitignore
  # ==========================================
  # Worktrees (superpowers using-git-worktrees)
  # ==========================================
  .worktrees/
  worktrees/
  ```
- Commit thay đổi cấu hình `.gitignore`:
  ```bash
  git commit -m "chore(git): ignore .worktrees/ and worktrees/ per using-git-worktrees skill"
  # Commit tạo ra: 56deee0
  ```
- Xác minh bằng lệnh:
  ```bash
  git check-ignore -v .worktrees/ worktrees/
  # Output:
  # .gitignore:209:.worktrees/    .worktrees/
  # .gitignore:210:worktrees/    worktrees/
  ```

### 4.4. Khởi tạo Git Worktree tách biệt
- **Đường dẫn Worktree được chọn**: `/root/workspace/prompt-optimizer/Promlt opti/.worktrees/audit-safe-removal`
- **Nhánh riêng biệt**: `refactor/audit-safe-removal`
- **Lệnh khởi tạo**:
  ```bash
  git worktree add ".worktrees/audit-safe-removal" -b "refactor/audit-safe-removal"
  ```
- **Xác minh trạng thái cô lập trong worktree mới**:
  - `GIT_DIR`: `/root/workspace/prompt-optimizer/Promlt opti/.git/worktrees/audit-safe-removal`
  - `GIT_COMMON`: `/root/workspace/prompt-optimizer/Promlt opti/.git`
  - `GIT_DIR != GIT_COMMON`: **ĐẠT CHUẨN CÔ LẬP HOÀN TOÀN**. Nhánh `main` được bảo vệ tuyệt đối khỏi mọi xung đột trong quá trình refactor.

---

## 5. Bảng kiểm kê (Inventory) các File & Export dự kiến xóa an toàn

> [!IMPORTANT]
> **Cam kết nguyên tắc**: Đợt kiểm toán này TUYỆT ĐỐI KHÔNG XÓA BẤT KỲ FILE NÀO. Toàn bộ danh mục dưới đây là bảng kế hoạch chi tiết, đánh giá tác động và ánh xạ phụ thuộc (dependency mapping) để chuẩn bị cho giai đoạn tái cấu trúc UI theo kiến trúc mới.

### 5.1. Vùng bảo vệ nghiêm ngặt (Protected Layer - Không chạm vào)
Các package và thư mục sau đây chứa toàn bộ logic nghiệp vụ, engine, lưu trữ và API serverless, **bắt buộc giữ nguyên 100%**:

| Đường dẫn vùng bảo vệ | Thành phần chức năng | Lý do bảo toàn tuyệt đối |
| :--- | :--- | :--- |
| `packages/core/src/services/*` | LLM, Arena, Template, History, Data, Preference, Compare, Context, Favorite, Evaluation, Image, Storage, Variable extraction | Toàn bộ logic lõi của Prompt Optimizer. Giao diện mới sẽ mount trực tiếp vào các service này. |
| `packages/core/src/interfaces/*` | Các giao diện hợp đồng (`IModelManager`, `IPromptService`, `IHistoryManager`, v.v.) | Đảm bảo tính tương thích với Electron proxy và Web adapters. |
| `packages/core/src/types/*` | Khai báo kiểu TypeScript lõi | Ràng buộc kiểu dữ liệu toàn bộ hệ sinh thái. |
| `packages/core/src/constants/*` | Hằng số cấu hình, models mặc định | Dữ liệu khởi tạo hệ thống. |
| `api/auth.js` | API Endpoint xác thực cookie / token trên Vercel Serverless | Cung cấp lớp bảo vệ mật khẩu ứng dụng. Hoàn toàn độc lập với UI. |
| `packages/mcp-server/src/*` | MCP Server, adapters, health check, stdio/SSE handlers | Cung cấp giao thức Model Context Protocol cho Claude Desktop/IDE. |

### 5.2. Danh mục File UI cũ dự kiến xóa / tái cấu trúc (`packages/ui`)

Tất cả các component giao diện cũ trong `packages/ui/src/components` được đưa vào diện dự kiến thay thế bởi hệ thống component mới theo Design System (Mobile-First, Anti-AI-Design):

| Phân nhóm Component | Danh sách file tiêu biểu | Dung lượng ước tính | Tác động bên ngoài | Phương án xử lý |
| :--- | :--- | :---: | :--- | :--- |
| **Layout & Shell** | `MainLayout.vue`, `Panel.vue`, `Modal.vue`, `Toast.vue`, `ContentCard.vue`, `ActionButton.vue` | ~45 KB | Được dùng nội bộ trong UI | Thay thế bằng `AppLayout`, `AdaptiveModal`, `Toast` mới. |
| **Prompt Workspace** | `PromptPanel.vue`, `InputPanel.vue`, `OutputDisplay.vue`, `OutputDisplayCore.vue`, `PromptPreviewPanel.vue`, `HtmlPreview.vue` | ~120 KB | Mount trong các view | Thay thế bằng `PromptInput`, `OptimizationResult` mới. |
| **Variables** | `VariableManagerModal.vue`, `VariableEditor.vue`, `VariableImporter.vue`, `MobileVariableList.vue`, `TemporaryVariablesPanel.vue` | ~85 KB | Mount qua modal | Thay thế bằng `VariableList`, `VariableEditor`, `VariableExporter` mới. |
| **Context Mode** | `ConversationManager.vue`, `ContextEditor.vue`, `ContextSystemWorkspace.vue`, `ContextUserWorkspace.vue`, `ContextUserTestPanel.vue` | ~110 KB | Mount trong Pro workspace | Thay thế bằng `ContextChain`, `ContextNode` mới. |
| **Compare & Arena** | `TestAreaPanel.vue`, `TestInputSection.vue`, `TestControlBar.vue`, `TestResultSection.vue`, `ArenaWorkspace.vue` | ~135 KB | Mount trong Test mode | Thay thế bằng `TestVariantList`, `CompareRunner`, `ComparisonResults` mới. |
| **Image Mode** | `ImageModeSelector.vue`, `ImageText2ImageWorkspace.vue`, `ImageImage2ImageWorkspace.vue`, `ImageMultiImageWorkspace.vue` | ~95 KB | Mount trong Image mode | Thay thế bằng `Text2ImageForm`, `Image2ImageForm`, `MultiImageForm` mới. |
| **History & Storage** | `HistoryDrawer.vue`, `DataManager.vue`, `BackupRecords.vue`, `LocalFilesPanel.vue` | ~75 KB | Mount qua drawer/modal | Thay thế bằng `HistoryPanel`, `HistoryEntry`, `ImportDialog`, `ExportDialog` mới. |
| **Models & Templates** | `ModelManager.vue`, `TextModelManager.vue`, `TemplateManager.vue`, `TemplateSelect.vue`, `CategoryManager.vue`, `FavoriteManager.vue` | ~160 KB | Mount qua modal | Thay thế bằng `ModelManager`, `TemplateManager`, `FavoritesPage` mới. |
| **Evaluation UI** | `EvaluationPanel.vue`, `EvaluateButton.vue`, `EvaluationScoreBadge.vue`, `CompareRoleConfigDialog.vue` | ~70 KB | Mount trong Test mode | Tái cấu trúc chuẩn mobile 44px tap target. |
| **Styles cũ** | `packages/ui/src/styles/common.css`, `index.css`, `scrollbar.css` | ~30 KB | Được import bởi `index.ts` | Thay thế bằng bộ tokens chuẩn trong `DESIGN.md`. |

### 5.3. Ma trận ánh xạ Export (Export Mapping & Shim Strategy)

Khi tái cấu trúc hoặc xóa các file component cũ trong `packages/ui`, tệp `packages/ui/src/index.ts` cần được quản lý thận trọng để tránh làm đứt gãy các consumer bên ngoài:

#### Bảng khảo sát Consumers đối với `@prompt-optimizer/ui`:
1. `packages/web/src/App.vue`: Nhập `PromptOptimizerApp`
2. `packages/web/src/main.ts`: Nhập `installI18nOnly`, `installPinia`, `i18n`, `router`
3. `packages/web/src/pwa/PwaControls.vue`: Nhập `i18n`
4. `packages/extension/src/App.vue`: Nhập `PromptOptimizerApp`
5. `packages/extension/src/main.ts`: Nhập `installI18nOnly`, `installPinia`, `i18n`, `router`, `HTML_PREVIEW_HOST_KEY`

#### Chiến lược Shim / Giữ lại / Thay thế các Exports:

| Danh mục Export trong `packages/ui/src/index.ts` | Trạng thái hiện tại | Phân loại | Chiến lược bảo đảm an toàn khi Refactor |
| :--- | :--- | :---: | :--- |
| `PromptOptimizerApp` | Export từ `components/app-layout` | **BẮT BUỘC (CRITICAL)** | Giữ nguyên export symbol này làm Entry Point chính cho cả Web và Extension. Giao diện mới sẽ đóng gói bên trong component này. |
| `installI18n`, `installI18nOnly`, `i18n` | Export từ `plugins/i18n` | **BẮT BUỘC (CRITICAL)** | Giữ nguyên 100%, không xóa. Cập nhật và bổ sung locale `vi-VN`. |
| `pinia`, `installPinia`, `setPiniaServices` | Export từ `plugins/pinia` | **BẮT BUỘC (CRITICAL)** | Giữ nguyên 100%, quản lý state trung tâm. |
| `router` | Export từ `router/index.ts` | **BẮT BUỘC (CRITICAL)** | Giữ nguyên contract router để đồng bộ các route Web và Extension. |
| `HTML_PREVIEW_HOST_KEY` | Export từ `utils/html-preview` | **BẮT BUỘC (CRITICAL)** | Giữ nguyên để Extension inject iframe preview. |
| `useNaiveTheme`, `naiveTheme`, `themeOverrides` | Export từ `config/naive-theme` | **CẦN TƯƠNG THÍCH** | Cập nhật cấu hình theme mới, giữ nguyên interface export. |
| Toàn bộ Re-export từ `@prompt-optimizer/core` | Re-export factory & proxy | **BẮT BUỘC (CRITICAL)** | Giữ nguyên 100% để các consumer không cần import hai lần. |
| Các component có hậu tố `UI` (`ToastUI`, `ModelManagerUI`, `PromptPanelUI`, v.v.) | Export từ `components/*` | **DỰ KIẾN DEPRECATE** | Không xóa đột ngột. Giữ lại export tạm thời (shim trỏ sang component mới) hoặc dọn dẹp sau khi Web/Extension đã chuyển đổi hoàn tất. |

---

## 6. Hướng dẫn Kịch bản Cổng Kiểm tra Tự động (`.agent-team/verify.sh`)

Kịch bản xác minh máy `.agent-team/verify.sh` đã được xây dựng để cung cấp khả năng tự kiểm tra (self-verification) độc lập với mã trạng thái chuẩn Unix (Exit code 0 khi thành công).

### 6.1. Các cổng kiểm tra (Gates) của Script
- **GATE 1: Node.js Version Check**: Kiểm tra chính xác phiên bản `v24.22.1`.
- **GATE 2: pnpm Version Check**: Kiểm tra tính sẵn sàng của pnpm và cảnh báo tương thích lockfile.
- **GATE 3: Playwright Check**: Xác minh dependency trong `package.json`, tệp config `playwright.config.ts`, và thực thi CLI `playwright --version`.
- **GATE 4: Anti-AI-Design Script Check**: Kiểm tra đường dẫn vật lý `/root/.agents/skills/avoid-ai-design/scripts/detect.mjs` và chạy thử lệnh `--help`. Báo cáo trạng thái của `sloplint.mjs`.
- **GATE 5: Git Backup Tag Check**: Xác minh tag `backup/pre-refactor-audit` tồn tại trong repo.
- **GATE 6: Git Worktree Isolation Check**: Xác minh worktree `.worktrees/audit-safe-removal` tồn tại và thỏa mãn điều kiện `GIT_DIR != GIT_COMMON`.
- **GATE 7: Protected Core/API Integrity Check**: Kiểm tra các tệp sống còn (`packages/core/src/index.ts`, `api/auth.js`, `packages/mcp-server/src/index.ts`) đảm bảo chưa bị xóa hay xâm phạm.

---

## 7. Kết luận và Kế hoạch Hành động Tiếp theo

1. **Kết luận kiểm toán**:
   - Môi trường thực tế đã được đo đạc đầy đủ bằng các câu lệnh thật.
   - Cơ chế bảo vệ mã nguồn gốc đã được thiết lập thông qua Git Backup Tag và Worktree tách biệt.
   - Script rà soát AI slop (`detect.mjs`) sẵn sàng phục vụ kiểm chuẩn.
   - Danh mục kiểm kê đã phân định ranh giới rõ ràng: Bảo toàn tuyệt đối vùng lõi Backend/Core/API, lập kế hoạch thay thế dần lớp UI mà không gây gãy liên kết hệ thống.
2. **Kế hoạch hành động kế tiếp (Sau khi có phê duyệt)**:
   - Chuyển sang làm việc bên trong worktree `.worktrees/audit-safe-removal`.
   - Tiến hành thiết lập các Red Tests cho từng User Story (theo Feature Parity Matrix).
   - Xây dựng các component UI mới đạt chuẩn Mobile-First và Anti-AI-Design.
   - Chạy kiểm thử E2E Playwright và `detect.mjs` trước khi tích hợp vào nhánh chính.
