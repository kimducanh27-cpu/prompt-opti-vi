# Báo cáo kỹ thuật — Prompt Optimizer bản Mobile-First & Việt hóa (vi-VN)

**Dự án:** `linshenkx/prompt-optimizer` — phiên bản 2.15.2<br />
**Phạm vi:** giao diện Mobile-First hiệu chuẩn cho Honor Magic 6, Việt hóa toàn bộ giao diện và đóng gói mã nguồn kèm báo cáo.<br />
**Ngày hoàn tất kiểm chứng:** 18/11/2026<br />
**Môi trường kiểm chứng:** Ubuntu 24.04 (proot, ARM64), Node.js 24.22.1, pnpm 10.6.1, Chromium 153 (Playwright).

---

## 1. Tóm tắt điều hành

Bản bàn giao gồm ba phần:

1. **Hệ thống thiết kế Mobile-First** dùng token ngữ nghĩa, hiệu chuẩn theo Honor Magic 6 (`412×915` và `421×933` CSS px), đồng thời giữ nguyên bố cục hai cột trên desktop (`≥ 1024px`).
2. **Việt hóa toàn bộ giao diện**: 12 mô-đun ngôn ngữ, **2.990 khóa dịch** cho mỗi ngôn ngữ, khớp cấu trúc tuyệt đối với `en-US`; bổ sung tiếng Việt cho PWA, extension, tài liệu trong ứng dụng và metadata trang web. Lần chạy đầu tiên mở bằng tiếng Việt; lựa chọn của người dùng trong trình chuyển ngôn ngữ luôn được ưu tiên và ghi nhớ.
3. **Kiểm chứng thực thi**: build thành công `core → ui → web`, 92/93 kiểm thử script kho mã (1 bỏ qua theo thiết kế), 32/32 kiểm thử web, 43 bài kiểm thử thành phần liên quan, đo đạc DOM thật trên Chromium ở 5 kích thước màn hình × 9 không gian làm việc, kèm ảnh chụp và nhật ký JSON.

Trong quá trình kiểm chứng đã phát hiện và sửa **7 nhóm lỗi thực tế** khiến bản trước đó không thể build hoặc chưa Việt hóa trọn vẹn (chi tiết ở mục 6).

---

## 2. Phạm vi và nguyên tắc thiết kế

### 2.1. Trong phạm vi

- Toàn bộ giao diện Vue 3 (`packages/ui`), vỏ web (`packages/web`), extension (`packages/extension`).
- 9 không gian làm việc: Tối ưu System Prompt, Tối ưu User Prompt, Biến, Đa tin nhắn, Văn bản sang Ảnh, Ảnh sang Ảnh, Đa hình ảnh, Đấu trường và các màn hình quản lý (mô hình, mẫu, dữ liệu, yêu thích, lịch sử).
- Ngôn ngữ giao diện: `vi-VN` (mặc định), `en-US`, `zh-CN`, `zh-TW`.

### 2.2. Ngoài phạm vi (giữ nguyên có chủ đích)

- **Mẫu prompt tích hợp trong `packages/core`**: chỉ có `en-US` và `zh-CN`. Đây là nội dung prompt gửi cho mô hình, không phải chuỗi giao diện; thêm `vi-VN` sẽ làm thay đổi hành vi tối ưu và kết quả so sánh.
- **Bố cục desktop `≥ 1024px`**: không đổi so với bản gốc.
- **Bản quyền, giấy phép, tên thương hiệu** (`Prompt Optimizer`, `Prompt Garden`, `OpenAI`, `Gemini`…): giữ nguyên.

### 2.3. Nguyên tắc

- Mobile-First theo nghĩa **thu nhỏ có kiểm soát**: mọi thay đổi bố cục chỉ áp dụng dưới `1024px`; desktop không bị ảnh hưởng.
- Ưu tiên **khả năng chạm** (≥ 44×44 px), **không tự động zoom** (ô nhập ≥ 16px), **an toàn vùng cắt** (safe-area), **không tràn ngang** ở 360–430px.
- Tiếng Việt có dấu là điều kiện kiểm thử: font stack, chiều cao dòng, nhãn dài và ngắt dòng đều được kiểm tra bằng DOM thật.

---

## 3. Hệ thống thiết kế Mobile-First

### 3.1. Điểm ngắt và chế độ bố cục

| Điểm ngắt | Khoảng | Bố cục |
| --- | --- | --- |
| `xs` | < 360px | Một vùng, thu gọn tối đa |
| `sm` | 360–639px | Một vùng, thanh điều hướng dưới (Honor Magic 6 ≈ 412–421px) |
| `md` | 640–1023px | Một vùng rộng / máy tính bảng dọc |
| `lg` | 1024–1279px | Hai cột desktop |
| `xl` | ≥ 1280px | Hai cột rộng |

Chế độ `compact` bật khi `window.innerWidth < 1024`, dùng chung một nguồn sự thật với `useWorkspaceLayout` và `useResponsive` (đã sửa để kiểu trả về của `buttonSize` là union `small | medium | large`, tránh lỗi biên dịch).

### 3.2. Token thiết kế (`packages/ui/src/styles/tokens.css`, 289 dòng)

- **Bề mặt phân tầng**: `body → surface → card → popover`, kèm `muted`, `disabled`.
- **Màu ngữ nghĩa**: chữ (primary/secondary/muted/disabled), accent + 3 trạng thái tương tác, viền, info/success/warning/error.
- **6 chủ đề**: `light`, `dark`, `blue`, `green`, `purple`, `classic` qua `data-workspace-theme`.
- **Chữ**: thang 11/12/13/14/16/17/20px; `--po-text-input-mobile: 1rem` (16px) chống zoom trên iOS/Android; font stack ưu tiên Inter, hệ thống, Noto Sans — hiển thị đúng dấu chồng như `ấ`, `ệ`, `ử`, `ẵ`.
- **Khoảng cách**: thang 4px; **bo góc** 8–18px (sheet 18px trên).
- **Chạm**: `--po-touch-target: 44px`, `--po-touch-target-lg: 48px`.
- **Vùng an toàn**: `--po-safe-top/right/bottom/left` từ `env(safe-area-inset-*)` — áp dụng cho thanh trên, thanh dưới, sheet và modal toàn màn hình.
- **Lớp z-index**: sticky 20, dropdown 1000, sheet 2000, modal 2100, toast 3000.
- **Chuyển động**: 100/175/300ms, easing chuẩn, có `prefers-reduced-motion: reduce`.
- **Tiêu điểm bàn phím**: `--po-focus-ring` 2px, offset 2px.

### 3.3. CSS mobile (`packages/ui/src/styles/compact/`, 11 tệp CSS, 2.311 dòng; `compact-workspace.css` là điểm vào)

- `foundation.css`: token dùng chung, vùng chạm, focus, giảm chuyển động, font.
- `workspace.css`, `prompt.css`, `input.css`, `output.css`, `test-result.css`: bố cục hai vùng (nhập ↔ kết quả) trên một màn hình, không mở trang con.
- `navigation.css`: thanh trên dính, thanh chuyển vùng dưới cùng, sheet chức năng/chế độ.
- `overlay.css`: sheet, modal, bàn phím ảo, safe-area.
- `context.css`, `image.css`, `management.css`: biến, ảnh, quản lý.

Các quy tắc dùng `max(...)`/`min(...)` với `env(safe-area-inset-*)`, `dvh` cho chiều cao thực, `container queries` cho vùng nội dung và `scroll-snap` cho Đấu trường.

### 3.4. Hiệu chuẩn Honor Magic 6

- Độ phân giải vật lý 1264×2800, tỉ lệ ~3.07 → vùng nhìn CSS khoảng **412×915** (thanh điều hướng) đến **421×933** (chế độ tràn viền).
- Đã đo tại cả `412×915` và `421×933`, thêm `360×669`, `393×852` và desktop `1440×900`.
- Kết quả: **không tràn ngang** ở mọi tổ hợp (xem mục 7), thanh dưới nằm trong vùng nhìn, ô nhập đạt 16px, nút đạt 44px.

---

## 4. Việt hóa toàn bộ giao diện

### 4.1. Cấu trúc ngôn ngữ

`packages/ui/src/i18n/locales/` gồm bốn thư mục `en-US`, `zh-CN`, `zh-TW`, `vi-VN`; mỗi thư mục có 12 tệp:

`index.ts`, `arena.ts`, `workspace.ts`, `core.ts`, `favorites.ts`, `prompt.ts`, `models.ts`, `templates.ts`, `testing.ts`, `context.ts`, `image.ts`, `errors.ts`.

- **2.990 khóa** mỗi ngôn ngữ, **0 thiếu, 0 thừa, 0 lệch cấu trúc** so với `en-US` (kiểm tra tự động).
- `vi-VN` có 3.757 dòng, phủ toàn bộ chuỗi giao diện, thông báo lỗi, nhãn trợ năng, nội dung trống và hướng dẫn trong ứng dụng.

### 4.2. Điểm nối

- `plugins/i18n.ts`: thêm `vi-VN` vào `SupportedLocale`, `SUPPORTED_LOCALES`, `messages`, fallback `vi-VN → en-US`, chuẩn hóa `vi`, `vi-*`, `vi_*`.
- `LanguageSwitchDropdown.vue`: thêm mục **Tiếng Việt** (tên bản ngữ), thứ tự ưu tiên Việt → Anh → Trung giản thể → Trung phồn thể.
- `docs/compare-help.ts`, `docs/syntax-guide.ts`: bản dịch tiếng Việt đầy đủ cho trợ giúp so sánh và cú pháp mẫu.
- `packages/web/index.html`: `lang="vi"`, tiêu đề và mô tả tiếng Việt, `viewport-fit=cover`.
- `packages/web/pwa.config.ts`: tên ứng dụng, tên ngắn, mô tả, `lang: 'vi'` cho manifest PWA.
- `packages/web/src/pwa/messages.ts`: bổ sung bộ chuỗi tiếng Việt cho cài đặt, cập nhật, ngoại tuyến, lỗi lưu.
- `packages/extension/public/_locales/vi/messages.json` + `packages/extension/index.html`: tiếng Việt cho extension.
- `packages/web/src/main.ts`, `packages/extension/src/main.ts`: `document.documentElement.lang` ánh xạ đúng `vi` (trước đây rơi vào `en`).

### 4.3. Chính sách ngôn ngữ mặc định

- `DEFAULT_LOCALE = 'vi-VN'`: lần chạy đầu tiên mở bằng tiếng Việt, kể cả khi trình duyệt cấu hình tiếng Anh.
- Người dùng đổi ngôn ngữ trong **Danh mục → Ngôn ngữ**; lựa chọn được lưu vào `PREFERRED_LANGUAGE` và luôn thắng mặc định.
- Đổi lại chính sách chỉ cần sửa một dòng trong `packages/ui/src/plugins/i18n.ts` (`DEFAULT_LOCALE = 'en-US'`) — đã ghi chú ngay tại hằng số.

### 4.4. Quy ước thuật ngữ

Giữ nguyên có chủ đích các thuật ngữ kỹ thuật đã quen thuộc với người dùng Việt Nam: *prompt*, *System Prompt*, *User Prompt*, *API Key*, *token*, *A/B test*, tên mô hình và thương hiệu. Phần câu, nhãn, mô tả, thông báo và hướng dẫn đều dịch sang tiếng Việt tự nhiên.

---

## 5. Kiến trúc kỹ thuật của bản bàn giao

```
packages/
  core/        dịch vụ LLM, lưu trữ, mẫu prompt (en-US, zh-CN)
  ui/          thành phần Vue, i18n (4 ngôn ngữ), design system mobile
  web/         vỏ web + PWA (manifest, service worker, banner cập nhật)
  extension/   vỏ extension Chrome (đã có _locales/vi)
  desktop/     vỏ Electron (giữ nguyên)
  mcp-server/  máy chủ MCP (giữ nguyên)
```

- Không đổi API công khai của `core`; không đổi tuyến đường router hay khóa lưu trữ.
- Thay đổi giao diện nằm trong SFC và CSS mobile; trên `1024px` không có quy tắc mới.
- PWA giữ nguyên chiến lược `injectManifest`, không precache dữ liệu người dùng.

---

## 6. Lỗi phát hiện và đã sửa trong vòng kiểm chứng này

Bản đóng gói trước khi bàn giao **không build được** và còn một số chuỗi chưa Việt hóa. Các lỗi sau đã được sửa và kiểm chứng lại:

| # | Lỗi | Tệp | Cách sửa |
| --- | --- | --- | --- |
| 1 | 5 thành phần dùng `locale.value` nhưng không lấy `locale` từ `useI18n` → `TS2304` | `FavoriteDetailPanel.vue`, `FavoriteListItem.vue`, `FavoriteWorkspaceListItem.vue`, `HistoryDrawer.vue`, `FavoritePromptAssetVersionList.vue` | Thêm `locale` vào destructuring `useI18n()` |
| 2 | Kiểu `useI18n` do dự án khai báo chỉ có `t` → `BackupRecords.vue` báo `TS2339` | `src/types/vue-i18n.d.ts` | Bổ sung `locale: ComputedRef<string>` |
| 3 | `String(locale || 'vi-VN')` trên ref → chuỗi `[object Object]` khi định dạng ngày | `data-manager/BackupRecords.vue` | Dùng `locale.value` trong script, giữ `locale` trong template |
| 4 | `buttonSize` luôn trả `'medium'` nên so sánh với `'small'` báo `TS2367` | `composables/ui/useResponsive.ts` | Khai báo kiểu trả về `'small' \| 'medium' \| 'large'` |
| 5 | Manifest PWA và banner cài đặt/cập nhật vẫn là tiếng Trung; thiếu bản tiếng Việt | `web/pwa.config.ts`, `web/src/pwa/messages.ts` | Dịch manifest, thêm bộ chuỗi `vi` và ánh xạ `vi → vi` |
| 6 | `lang` của trang bị gán `en` cho tiếng Việt | `web/src/main.ts`, `extension/src/main.ts` | Ánh xạ `vi → 'vi'` |
| 7 | Đấu trường: nút chọn mô hình và thanh công cụ kết quả cao 28px, textarea 14px | `components/arena-mode/ArenaWorkspace.vue` | Thêm quy tắc mobile: ô nhập 16px, nút ≥ 44px, thanh công cụ cho phép xuống dòng |

Ngoài ra:

- `scripts/check-no-chinese-runtime.mjs` trước đây gọi `git ls-files` nên **không chạy được trên gói mã nguồn đã giải nén** (không có `.git`). Đã bổ sung chế độ duyệt cây tệp dự phòng, bỏ qua `node_modules`, `dist`, `.git`…
- `ProviderPillSelect.vue` còn nhãn dự phòng `更多` → đổi thành `Thêm`.
- `packages/extension/index.html` còn `lang="zh-CN"` và thiếu `viewport-fit=cover` → đổi `lang="vi"` + `viewport-fit=cover`.

---

## 7. Kết quả kiểm chứng

### 7.1. Cổng kiểm tra tự động

| Lệnh | Kết quả |
| --- | --- |
| `node scripts/check-locale-parity.mjs` | ✅ Cấu trúc 4 ngôn ngữ khớp nhau |
| `node scripts/check-no-chinese-runtime.mjs` | ✅ 0 chuỗi tiếng Trung trong mã chạy |
| `node scripts/verify-mobile-design-system.mjs` | ✅ Token, 44px, 16px, safe-area, vi-VN đạt |
| `node --test` trên 10 tệp kiểm thử script kho mã | ✅ 92 đạt, 1 bỏ qua, 0 lỗi |
| `vitest run` cho 8 tệp liên quan (i18n, ngôn ngữ, yêu thích, đấu trường, biến) | ✅ 43/43 |
| `pnpm -F @prompt-optimizer/web test:unit` | ✅ 32/32 |
| `pnpm build:core && pnpm build:ui && pnpm build:web` | ✅ Thành công |

### 7.2. Đo đạc DOM trên Chromium

Kịch bản `audit/mobile-audit.mjs` mở 9 tuyến ở 5 kích thước (36 tổ hợp mobile + 9 tổ hợp desktop), đo:

- `scrollWidth` so với chiều rộng vùng nhìn (tràn ngang);
- sự tồn tại của thanh điều hướng compact;
- số ô nhập có `font-size < 16px`;
- số mục tương tác có cạnh < 44px;
- phần tử vượt biên;
- sự hiện diện của ký tự tiếng Việt có dấu và `lang`.

Kết quả tóm tắt (chi tiết trong `audit/mobile-audit.json`):

| Kích thước | Tràn ngang | Ô nhập < 16px | Nút < 44px (sau sửa) | Tiếng Việt |
| --- | --- | --- | --- | --- |
| 412×915 (Honor Magic 6) | 0 | 0 | 0 (*) | Có |
| 421×933 (Honor Magic 6 tràn viền) | 0 | 0 | 0 (*) | Có |
| 360×669 | 0 | 0 | 0 (*) | Có |
| 393×852 | 0 | 0 | 0 (*) | Có |
| 1440×900 (desktop) | 0 | — | — (desktop không áp dụng 44px) | Có |

`(*)` Ngoại trừ ô nhập ẩn bên trong thành phần select của Naive UI (`n-base-selection-input`, cao 26px) — đây không phải mục tiêu chạm; vùng chạm thực tế là nút bao ngoài, đã đạt 44px.

Ảnh chụp tiêu biểu nằm trong `audit/shots/`:
`honor-magic6-home.png`, `honor-magic6-basic-user.png`, `honor-magic6-arena.png`, `menu-sheet-dark.png`, `desktop-1440-home.png`.

### 7.3. Kiểm tra tương tác mobile

- Mở **Danh mục**: sheet cao 380px, nằm trọn trong 412×915, không tràn ngang, mọi nút ≥ 44px.
- Mở **Chuyển chế độ**: sheet liệt kê đủ 9 không gian làm việc bằng tiếng Việt.
- **Chuyển ngôn ngữ** Việt ↔ Anh: `document.documentElement.lang` đổi tương ứng, giao diện đổi ngay, lựa chọn được lưu.
- **Chủ đề Tối**: đổi màu nền và thuộc tính `data-workspace-theme`.

---

## 8. Hướng dẫn build và chạy

```bash
pnpm install
pnpm build:core
pnpm build:ui
pnpm build:web        # kết quả trong packages/web/dist
```

Chạy thử bản build:

```bash
pnpm -F @prompt-optimizer/web preview --host 0.0.0.0 --port 4173
```

Hoặc chạy chế độ phát triển:

```bash
pnpm dev
```

Yêu cầu: Node.js ≥ 24.22.1, pnpm 10.6.1. Trên máy không có mạng, dùng `pnpm install --offline` với kho pnpm đã có sẵn.

Đổi ngôn ngữ mặc định: sửa `DEFAULT_LOCALE` trong `packages/ui/src/plugins/i18n.ts`.

---

## 9. Hạn chế và khuyến nghị

1. **Chưa kiểm chứng trên máy thật Honor Magic 6**: số đo lấy từ Chromium 153 với mô phỏng thiết bị (viewport, DPI, cảm ứng). Cần kiểm tra thêm: bàn phím ảo che vùng nhập, `env(safe-area-inset-*)` thực tế của máy, cử chỉ vuốt và tần số quét 120Hz.
2. **Hộp thoại/ô nhập tiếng Việt dài**: một số nhãn chọn mô hình bị cắt bằng dấu ba chấm ở 412px (hành vi có sẵn của Naive UI). Không gây tràn ngang, nhưng nên rút ngắn nhãn hoặc thêm tooltip nếu muốn đẹp hơn.
3. **Đấu trường** dùng cuộn ngang có `scroll-snap` để so sánh nhiều cột trên điện thoại — là thiết kế có chủ đích, không phải lỗi tràn.
4. **Mẫu prompt trong `core`** vẫn là `en-US`/`zh-CN`; nếu muốn prompt tối ưu bằng tiếng Việt thì cần một dự án riêng vì nó thay đổi nội dung gửi mô hình.
5. Chú thích mã nguồn tiếng Trung vẫn còn (không hiển thị cho người dùng); cổng `check-no-chinese-runtime` chỉ chặn chuỗi chạy.

---

## 10. Phụ lục — Tệp thay đổi chính

**Thiết kế & tài liệu**
`DESIGN.md`, `CLAUDE.md`, `REVIEW.md`, `BAO-CAO-KY-THUAT.md`

**Design system**
`packages/ui/src/styles/tokens.css`, `packages/ui/src/styles/compact-workspace.css`, `packages/ui/src/styles/compact/*.css` (12 tệp)

**Việt hóa**
`packages/ui/src/i18n/locales/vi-VN/*` (12 tệp), `packages/ui/src/plugins/i18n.ts`, `packages/ui/src/components/LanguageSwitchDropdown.vue`, `packages/ui/src/docs/compare-help.ts`, `packages/ui/src/docs/syntax-guide.ts`, `packages/web/index.html`, `packages/web/pwa.config.ts`, `packages/web/src/pwa/messages.ts`, `packages/web/public/config.js`, `packages/extension/index.html`, `packages/extension/public/_locales/vi/messages.json`

**Responsive & sửa lỗi**
`packages/ui/src/composables/ui/useResponsive.ts`, `packages/ui/src/components/arena-mode/ArenaWorkspace.vue`, `packages/ui/src/components/FavoriteDetailPanel.vue`, `FavoriteListItem.vue`, `FavoriteWorkspaceListItem.vue`, `HistoryDrawer.vue`, `favorites/FavoritePromptAssetVersionList.vue`, `data-manager/BackupRecords.vue`, `ProviderPillSelect.vue`, `packages/ui/src/types/vue-i18n.d.ts`, `packages/web/src/main.ts`, `packages/extension/src/main.ts`

**Kiểm chứng**
`scripts/verify-mobile-design-system.mjs`, `scripts/check-no-chinese-runtime.mjs`, `packages/ui/tests/unit/plugins/i18n-bootstrap.spec.ts`, `audit/` (kịch bản đo, JSON, ảnh chụp)
