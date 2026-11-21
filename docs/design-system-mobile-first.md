# Design System — prompt-optimizer, Mobile-First

> **Status: DRAFT — chờ Kduu duyệt. Chưa code UI.**
> Date: 2026-11-17 · Repo: `linshenkx/prompt-optimizer` v2.15.2, branch `develop`, HEAD `cbba5f95`
> Scope đã chốt: rebuild giao diện mobile từ đầu (bỏ mobile cũ), **tất cả trang**, máy chuẩn **Honor Magic6**, làm lại cả desktop, giữ **Vue 3** (không port React), Astryx chỉ làm mẫu tham chiếu, thêm **tiếng Việt (vi-VN) làm lựa chọn, mặc định vẫn tiếng Anh**, kiểm tra chỉ giao diện (không chạy model thật, dùng VCR replay).
> Nguồn: `research/astryx-foundations.md` (Astryx 0.7.16, MIT) + `research/current-app-audit.md` (audit repo 2026-11-17). Cả hai file đều đã kiểm lại bằng mắt từ file thật.

## 0. Quyết định đã chốt — và 1 điểm chưa chốt

| # | Quyết định | Ghi chú |
|---|---|---|
| D-01 | Giữ Vue 3 + Naive UI 2.44.1 + Tailwind 4.2.2, pnpm workspace | Astryx chỉ chạy React 19+, không cài vào app Vue được. Chỉ học token/pattern của Astryx, không import `@astryxdesign/*`. |
| D-02 | Bỏ hệ mobile cũ, làm lại từ đầu | Hệ cũ là ngưỡng JS duy nhất `width < 1024` + container query rời rạc, 2 fallback accent lệch nhau, target 36–40px. Repo tự ghi (22/10) là chưa đủ gọi là mobile xong. |
| D-03 | Tất cả trang | Basic System/User, Pro Multi/Variable, Image Text2Image/Image2Image/MultiImage, Arena, Favorites, Model Manager, Template Manager, History, Data Manager, Variables/Tools. |
| D-04 | Máy chuẩn: Honor Magic6 | 6.78" LTPO OLED, 1264×2800, ~453 ppi, 120 Hz, màn cong, gesture nav. **CSS viewport chưa đo trên máy thật** — xem mục 1.5, cần đo `window.innerWidth` trước khi khóa breakpoint. |
| D-05 | Làm lại cả desktop | Desktop giữ layout 2 pane, nhưng dùng chung token + primitive mới, không giữ 2 hệ song song. |
| D-06 | Tiếng Việt là lựa chọn, mặc định tiếng Anh | Repo hiện chỉ có en-US / zh-CN / zh-TW (~3.756 dòng/locale, 12 module). Thêm `locales/vi-VN/` ~3.750 dòng + `plugins/i18n.ts` + `LanguageSwitchDropdown.vue`, chạy `check-locale-parity`. |
| D-07 | Kiểm tra chỉ giao diện | Không key API thật. E2E chạy `E2E_VCR_MODE=replay`, thêm project mobile Playwright (xem mục 8). |
| D-08 | Review theo bài Anthropic | Tối đa 3 vòng, re-review chỉ diff, sửa cả class lỗi, không lặp lại finding đã đăng. Xem mục 8. |
| **?** | **Chưa chốt: brand accent** | Đề xuất mục 1.1: giữ xanh `#1f6bd1` (theme blue hiện có). Cần Kduu chốt ở cổng duyệt. Không dùng accent đơn sắc `#1b1b1b` của Astryx Neutral. |

## 1. Foundations

### 1.1 Màu — semantic tokens, light/dark cặp đôi

Nguyên tắc (học Astryx): app code **không dùng hex trực tiếp**, chỉ dùng token theo vai trò. Mọi token màu có cặp light/dark (`light-dark()`). Surface: body → surface → card → popover.

| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| `--color-background-body` | `#f1f1f1` | `#1b1b1b` | Nền app |
| `--color-background-surface` | `#ffffff` | `#262626` | Nền pane / surface |
| `--color-background-card` | `#ffffff` | `#1b1b1b` | Card, popover |
| `--color-background-muted` | `#f1f1f1` | `#1b1b1b` | Nền phụ, skeleton |
| `--color-text-primary` | `#000000` | `#ffffff` | Chữ chính |
| `--color-text-secondary` | `#474747` | `#9e9e9e` | Chữ phụ, meta |
| `--color-text-disabled` | `#919191` | `#525252` | Chữ disabled |
| `--color-border` | `#00000014` | `#ffffff1a` | Border thường |
| `--color-border-emphasized` | `#d4d4d4` | `#525252` | Border nhấn |
| `--color-overlay` (scrim) | `#00000080` | `#000000cc` | Nền mờ modal/sheet |
| `--color-accent` **(đề xuất, chờ chốt)** | `#1f6bd1` | `#6d9cfe` | Nút chính, link, focus |
| `--color-on-accent` | `#ffffff` | `#111111` | Chữ trên nút chính |
| `--color-accent-muted` | `#b9d7ff` | `#253c5a` | Nền nhấn nhẹ |

Trạng thái (lấy từ Astryx Neutral 0.7.16, đã kiểm spot-check AA trong research):

| Role | Base light / dark | Text light / dark |
|---|---|---|
| info | `#0074e2` / `#6d9cfe` | `#0067ce` / `#a1caff` |
| success | `#198100` / `#64af4c` | `#2f7d33` / `#90ca90` |
| warning | `#ffce2f` (cả hai) | `#836700` / `#eec448` |
| error | `#c9303a` / `#ff705d` | `#c0262c` / `#ffaea7` |

**Quy tắc:**
- Xóa 557 hex hardcode trong `src` và 18 hex trong `styles/` (audit §2.4). Token là nguồn duy nhất.
- Sửa 6 token Tailwind `--color-primary/secondary/background/card/text/border` hiện **không được định nghĩa ở đâu** (`tailwind.config.js:14–19`): định nghĩa lại bằng các token trên trong Tailwind 4 `@theme`, xóa config kiểu v3 nếu v4 không áp dụng.
- Gộp 6 theme Naive (`naive-theme.ts`, 925 dòng) thành **1 file override duy nhất**: light / dark theo `data-workspace-theme`, accent theo D-08. Bỏ variant `theme-blue/green/purple` không dùng (0 lần dùng), bỏ theme dark mỏng (chỉ có `common`).
- Sửa lệch fallback `--compact-accent`: `#7295c3` vs `#4b5563` → 1 giá trị duy nhất là `--color-accent`.
- Trạng thái không chỉ dùng màu: kèm chữ/icon (vd "Lỗi", "Đang chạy"), theo WCAG 2.2 AA.

**Chưa kiểm chứng — phải kiểm ở bước implement, không được claim trước:** tỉ lệ tương phản từng component/state (mục tiêu 4.5:1 chữ thường, 3:1 chữ lớn / UI không phải chữ / focus). Accent đề xuất `#1f6bd1` trên trắng cần đo lại bằng tool trước khi chốt.

### 1.2 Chữ

- Font: giữ stack hệ thống + CJK hiện có (`-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`). **Không bắt buộc Figtree** (font của Astryx Neutral). Code: `ui-monospace, "SF Mono", Monaco, Consolas, monospace`.
- Thang chữ (học Astryx): desktop base 14px, tỉ lệ 1.2 → 12 / 14 / 17 / 20 / 24 / 29 / 35 / 42px. **Mobile (pointer: coarse, width < 1024px): base 16px, tỉ lệ 1.1736** — body 14→16px, H1 24→26px, leading body 1.4286→1.5, Display 1 giữ 42px (giá trị đã ship của Astryx Neutral 0.7.16, không dùng công thức sandbox 16×1.2^step cho ra 48px).
- **Input/select/textarea trên mobile: tối thiểu 16px** — chống iOS tự zoom khi focus. Lỗi hiện tại: 3 select đang 13px (`context.css:160`, `image.css:167`, `TestPanelVersionSelect.vue:161`) — sửa hết lên 16px.
- Cỡ chữ tối thiểu cho chữ đọc được: body 16px mobile / 14px desktop; label/meta tối thiểu 12px, không dùng 10–11px như hiện tại (11px ×9, 10px ×1 trong `src`).
- Weight: 400 / 500 / 600 / 700. Heading: semibold 600. Không dùng chữ đậm để thay màu trạng thái.

| Level | Mobile | Desktop | Leading |
|---|---|---|---|
| Display | 42px | 42px | 1.24 |
| H1 | 26px / semibold | 24px / semibold | 1.33 |
| H2 | 22px / semibold | 20px / semibold | 1.4 |
| H3 | 19px / bold | 17px / bold | 1.41 |
| Body | 16px | 14px | 1.5 / 1.43 |
| Label | 16px / medium | 14px / medium | 1.43 |
| Supporting/meta | 14px | 12px | 1.67 |

### 1.3 Spacing, radius, elevation, motion

- Spacing: bước 4px — 0 / 2 / 4 / 6 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 36 / 40 / 44 / 48px. Trong nhóm 16px, giữa section 24px, giữa nhóm lớn 32px.
- Radius: inner 6px, element 10px, container/card 12px, page/sheet 28px (top), full 9999px (pill/avatar).
- Elevation: low / med / high (shadow + viền mờ ở dark mode, theo Astryx Neutral). Card dùng low, popover/dialog dùng med, sheet/modal dùng high.
- Motion: fast 125ms, medium 300ms, slow 700ms. Tôn trọng `prefers-reduced-motion`: medium về 0ms, tắt animation không cần thiết.
- Không dùng `!important` để ép token (hiện có trong compact CSS) — token thắng bằng thứ tự và specificity đúng.

### 1.4 Touch target & safe-area

- **Target chạm tối thiểu 44×44px** trên mobile cho mọi nút/input/select/icon-button (học Astryx adaptation + Apple HIG 44pt). Hiện tại phần lớn 36–40px, nút submit 36px (lại mâu thuẫn 42px ở 1 rule khác) — sửa hết, xóa rule mâu thuẫn.
- Khoảng cách giữa 2 target kề nhau tối thiểu 8px.
- Safe-area: dùng đủ 4 phía `env(safe-area-inset-top/right/bottom/left)`. Hiện tại chỉ top ×1 / bottom ×7, trái/phải ×0 — sửa hết, đặc biệt Magic6 màn cong + gesture nav.
- Viewport: dùng `100dvh` + fallback `100svh`, **bỏ `position: fixed; width: 100vw; height: 100vh; overflow: hidden`** ở `MainLayout.vue` (đang chống lại toolbar trình duyệt + bàn phím). Layout cuộn bằng content wrapper, bàn phím mở thì dùng `visualViewport` (đã có logic, cần giữ + kiểm trên máy thật).

### 1.5 Breakpoints — 1 thang duy nhất, thay ngưỡng JS 1024

Hiện tại: chỉ 1 ngưỡng JS `< 1024`, Tailwind responsive 17 lần, `@media` lộn xộn (767/768, 639/640, 1023/1024). Thang mới:

| Tên | Rộng | Dùng cho |
|---|---|---|
| `handset` | 360–430px | Điện thoại, 1 cột, bottom nav, sheet |
| `tablet` | 768–1023px | 1–2 cột, nav thu gọn |
| `desktop` | ≥1024px | 2 pane Optimize/Test, divider kéo |
| `wide` | ≥1440px | 2 pane + padding rộng hơn |

- **Magic6:** dải 360–430px là dải kiểm cũ của repo (360×668, 393×852, 412×915, 430×932). Chưa có số CSS viewport đo trên máy thật — **phải đo `window.innerWidth` trên Magic6 trước khi khóa** (mở đầu bước implement). Không chốt 390px làm số duy nhất khi chưa đo.
- Thêm điều kiện `pointer: coarse` cho rule chạm/chữ 16px (học Astryx), không chỉ dựa vào rộng màn hình.
- Container query chỉ dùng khi thật cần (vd pane hẹp), không dùng làm cơ chế responsive chính.
- Không ngang scroll ngoài ý muốn: `min-width` nội dung không vượt viewport; bảng rộng (vd reproducibility `min-width: 560px`) phải cuộn **trong** card, có dấu hiệu cuộn rõ, hoặc chuyển sang dạng rows trên mobile.

## 2. Layout — frame-first

Chọn khung trước, rồi mới xếp nội dung (học Astryx). Không sửa từng màn rồi mới nghĩ khung.

### 2.1 Khung chung

- **Mobile (<768px):** 1 cột, cuộn dọc. Header gọn (logo + mode + menu). Bottom tab bar cố định (mục 2.2). Nội dung chính cuộn, không giấu pane.
- **Tablet (768–1023px):** 1–2 cột, bottom tab hoặc side nav thu gọn.
- **Desktop (≥1024px):** header 64px + 2 pane Optimize (trái) / Test (phải), divider 12px kéo được, trái 25–50% (giữ hành vi hiện tại, nhưng token + primitive mới).

### 2.2 Điều hướng

- **Mobile — bottom tab bar (mới, Astryx không có BottomNav sẵn nên thiết kế theo pattern MobileNav + BottomSheet của nó):** 5 tab: Basic, Pro, Image, Arena, Favorites. Tab active: accent + chữ, không chỉ màu. Badge chỉ dùng cho **số đếm** (vd số favorite), trạng thái dùng StatusDot/chip chữ.
- **Mode con** (System/User, Multi/Variable, Text/Image/Multi): SegmentedControl ngay dưới header, chạm 44px, cuộn ngang nếu tràn (không wrap 2 hàng).
- **Desktop:** giữ top nav hiện tại (brand + core nav + actions), nhưng dùng token mới, label thu gọn theo rộng (đã có container query header-actions — giữ ý, chuẩn hoá ngưỡng theo thang mục 1.5).
- **Menu mobile:** nút menu mở BottomSheet (không phải modal card 90vw): chứa Model Manager, Templates, History, Data, Variables, Tools, Theme, Language, Help/About, Version. Đóng bằng kéo xuống / nút đóng 44px / back gesture.
- **Chuyển trang:** hash route giữ nguyên (`/#/basic/system` …), guard redirect giữ nguyên. Không thêm auth guard.

### 2.3 Optimize / Test — bỏ pattern giấu pane

Lỗi hiện tại (audit #6): mobile giấu 1 pane, chuyển Optimize↔Test tốn thêm tap + mất context.

- **Mobile mới: xếp chồng 1 cột, cuộn liên tục:** Input → Optimize (CTA) → Output (V1, V2…) → Test input → Test results, cùng 1 trang cuộn. Không `v-show` giấu pane, không nút chuyển Optimize/Test.
- **Desktop:** giữ 2 pane + divider kéo.
- **Test results:** 2 cột trên mobile (đã có từ 21/10, giữ), mỗi cột độc lập: xem prompt thật, retry, phóng to. Không dùng tab A/B che nhau.
- **Arena mobile:** bỏ deck ngang min-width 280px + x-scroll (2 đối thủ đã vượt 360–430px). Mobile: xếp dọc từng đối thủ (1 cột), mỗi đối thủ là 1 card đầy đủ (model selector + run + output), có thể thu gọn. Desktop: giữ deck ngang.

### 2.4 Quản lý (Model / Template / History / Favorites / Data)

Lỗi hiện tại (audit #7): modal card desktop 90vw/max 1200px, lồng tới 3 lớp, internals chưa thiết kế cho điện thoại.

- **Mobile: tất cả chuyển thành BottomSheet toàn chiều rộng, cao tối đa 90dvh, kéo để đóng, header sticky (tiêu đề + đóng 44px), nội dung cuộn trong sheet.** Không lồng modal trong modal: editor mở thành **trang sheet mới** (thay sheet cũ, có nút Back), không chồng 2–3 lớp.
- **Desktop:** modal card tối đa 720px (không 1200px), 1 lớp duy nhất; editor mở sang panel phải hoặc trang riêng.
- **Danh sách dày (history, favorites, templates, models): dạng rows** (học Astryx: dense data = rows, edge-to-edge + divider), **không bọc mỗi item bằng Card**. Card chỉ dùng cho widget / settings group / gallery.
- **Favorites:** mobile 1 cột, card ảnh bìa + tiêu đề + meta; search + filter thu gọn thành 1 hàng cuộn ngang; bảng reproducibility chuyển sang rows, không scroll ngang 560px.

## 3. Components — 1 primitive duy nhất cho mỗi loại

Lỗi hiện tại (audit #10): `NButton` dùng trực tiếp 422 lần/103 file, `ActionButton` chỉ 1 importer, `Panel/ContentCard/Icon/InputWithSelect` 0 importer, `--n-*` override 283 lần, `<button>` thô 44 lần. Không có chỗ duy nhất để ép rule 44px / 16px.

**Quy tắc:** app code chỉ dùng primitive dưới đây, không dùng trực tiếp Naive/raw HTML cho các loại này. Primitive bọc Naive UI + token mới.

| Primitive (mới, Vue) | Bọc | Rule bắt buộc |
|---|---|---|
| `PoButton` | `NButton` | Cao tối thiểu 44px mobile / 36px desktop; variant primary / secondary / ghost / destructive; loading: `aria-busy`, không cho bấm 2 lần; icon + label, icon-only phải có `aria-label` |
| `PoInput` / `PoTextarea` | `NInput` | Font 16px mọi màn (kể cả select); label luôn có; lỗi inline dưới field (`FieldStatus`); placeholder không thay label |
| `PoSelect` | `NSelect` + adaptive | Desktop: popover; **mobile: BottomSheet, row chạm 44px** (học Astryx `presentation="adaptive"`); tìm kiếm trong sheet nếu >8 option |
| `PoCard` | `NCard` | Chỉ widget/settings group; radius 12px; padding 16px |
| `PoRow` | div + divider | Danh sách dày: row 56px mobile, tiêu đề + meta + chevron/action |
| `PoModal` / `PoSheet` | `AdaptiveModal` (28 importer — chuẩn thực tế hiện tại) | Mobile = sheet (mục 2.4); desktop = card ≤720px; focus trap + trả focus khi đóng; đóng bằng Esc/back/kéo |
| `PoToast` / `PoBanner` | `NMessage` | Toast trên-phải desktop, trên-bottom-nav mobile; Banner cho info/success/warning/error trong trang |
| `PoTabs` / `PoSegmented` | `NTabs` / segmented | Chạm 44px; active có chữ + gạch, không chỉ màu |
| `PoTable` | `NDataTable` / rows | Mobile: chuyển sang rows; không scroll ngang toàn trang |
| `PoEmpty` / `PoLoading` / `PoError` | — | Empty: icon + chữ + CTA; Loading: skeleton đúng hình; Error: chữ lỗi + nút Thử lại |
| `PoStatus` | chip + StatusDot | Trạng thái bằng chữ, không chỉ màu |
| `PoBadge` | — | **Chỉ số đếm** (học Astryx) |

**States — mọi component phải có đủ:** rest, hover, focus-visible (viền focus ≥3:1, luôn thấy), active/pressed, selected/current, loading, disabled, read-only, error. Focus không bao giờ rớt ra `body`. Loading vẫn focus được, chặn bấm trùng.

**Xóa / không mang sang (cần Kduu chốt ở cổng duyệt, audit #9):** `TestAreaPanel.vue` (501 dòng, 0 usage), `FavoriteListItem.vue` (298 dòng, 0 usage), 2 QuickSwitch gần giống nhau (312+300 dòng, 0 usage), `Panel` vs `ContentCard` (trùng nhau), `Icon.vue` (chỉ xử lý `refresh`), `InputWithSelect.vue` (0 usage), i18n `_legacy` (~2.850 dòng/locale, 0 import). Mặc định: **xóa, không copy sang hệ mới** — trừ khi Kduu nói giữ.

## 4. i18n — thêm vi-VN

- Thêm `packages/ui/src/i18n/locales/vi-VN/` đủ 12 module (`arena, context, core, errors, favorites, image, index, models, prompt, templates, testing, workspace`), copy shape từ `en-US` (3.756 dòng), dịch sang tiếng Việt tự nhiên, không dịch máy nguyên văn key kỹ thuật.
- Sửa `plugins/i18n.ts`: `SupportedLocale` thêm `"vi-VN"`, `SUPPORTED_LOCALES` thêm `"vi-VN"`, fallback `vi-VN → en-US`, `normalizeLocaleCandidate`: `vi*` → `vi-VN`.
- Thêm mục "Tiếng Việt" vào `LanguageSwitchDropdown.vue`. Mặc định vẫn `en-US`.
- **Không** đổi `BuiltinTemplateLanguage` (chỉ zh-CN/en-US cho template có sẵn) — đó là ngôn ngữ template, không phải ngôn ngữ giao diện.
- Chạy `pnpm check:locale` (parity shape) + `pnpm check:no-chinese-runtime`. Lưu ý audit: parity script chưa chạy được ở checkout này do thiếu `typescript`/`node_modules` — phải chạy sau `pnpm install`.
- Chuỗi tiếng Việt dài hơn tiếng Anh ~20–30%: layout phải chịu được chữ dài (wrap/ellipsis, không fix width theo tiếng Anh).

## 5. Accessibility

- WCAG 2.2 AA: chữ thường 4.5:1, chữ lớn / UI không phải chữ / focus 3:1. Kiểm từng component/state, không chỉ spot-check.
- Bàn phím đầy đủ theo ARIA APG; modal/sheet trap focus + trả focus; `aria-busy`/`aria-disabled` khi loading; trạng thái bằng chữ.
- `prefers-reduced-motion`: tắt/giảm animation (motion medium về 0ms).
- Ngôn ngữ: mọi chuỗi hiển thị + chuỗi cho screen reader đều qua i18n key, không hardcode tiếng Anh/Trung trong component.
- Màu không phải kênh duy nhất: lỗi/thành công luôn có icon + chữ.

## 6. Implement — ánh xạ sang stack hiện tại

| Design system | Implement bằng |
|---|---|
| Token màu/chữ/spacing/radius/motion | Tailwind 4 `@theme` trong `packages/ui/src/styles/tokens.css` (file mới, nguồn duy nhất) + CSS var `light-dark()` |
| Theme Naive | 1 file override `packages/ui/src/config/naive-theme.ts` viết lại gọn (thay 925 dòng), theo `data-workspace-theme` |
| Primitive `Po*` | `packages/ui/src/components/primitives/` (mới), bọc Naive UI |
| Layout/frame | Viết lại `MainLayout.vue` + `CompactNavigation.vue` + `AppHeaderActions.vue` theo mục 2, bỏ `position: fixed; 100vw` |
| Workspace | Viết lại 7 workspace theo mục 2.3 (xếp chồng mobile, 2 pane desktop), dùng chung `OptimizeWorkspaceLayout` / `TestWorkspaceLayout` mới |
| Modal/sheet | Chuẩn hoá về `AdaptiveModal` + `PoSheet`, bỏ `NModal` card 90vw/max 1200px |
| Xóa code chết | Xóa theo mục 3 (sau khi Kduu chốt), không copy sang |
| vi-VN | Mục 4 |

**Không làm ở bước này:** không đổi logic optimize/test/evaluate, không đổi API/provider, không đổi data contract, không thêm dependency mới trừ khi có lý do rõ (mặc định: không thêm).

## 7. E2E & kiểm tra (UI-only, theo quyết định 6C + 7C)

- Thêm **project mobile Playwright**: viewport Magic6 (đo thật, mục 1.5), `isMobile: true`, `hasTouch: true`. Config hiện chỉ có `Desktop Chrome`, firefox/webkit đang comment.
- Chạy E2E ở chế độ **`replay` bắt buộc** (`E2E_VCR_MODE=replay`) — `auto` sẽ gọi API thật khi thiếu fixture, không được dùng. 11/48 spec hiện bypass fixture chung (mất guard fail-on-console-error) — phải gắn lại guard hoặc ghi rõ lý do.
- Flow chính phải có E2E mobile: nhập prompt → optimize → output non-empty → test compare → **lưu favorite** (hiện optimize spec chưa có bước lưu favorite) → đổi ngôn ngữ sang vi-VN → kiểm không tràn ngang, target 44px.
- Nhóm `gate` hiện chỉ 4 spec, không có mobile, image-image2image/multiimage bị đẩy ra extended — bổ sung mobile vào gate trước khi merge.
- Kiểm tay trên Magic6 thật: bàn phím, safe-area, gesture nav, màn cong — repo tự ghi là chưa kiểm các mục này.

## 8. Review — theo bài Anthropic (claude.dev/blog/solving-code-review-at-anthropic)

- Review chạy liên tục, không dồn cuối: mỗi thay đổi nhỏ, tự review diff trước khi mở PR, có bằng chứng chạy được (build/test/screenshot) thay vì nói miệng.
- Tối đa **3 vòng review**, sau đó dừng lại xem lại hướng làm. Re-review chỉ diff mới, sửa cả class lỗi, không lặp lại finding đã đăng.
- Mỗi finding phải trả lời: sửa, hoặc đóng kèm lý do ngắn. Không để finding mở khi merge.
- Check tự động chặn merge: lint, typecheck, unit test, build, E2E gate (replay, mobile). Human duyệt theo rủi ro: đổi token/primitive/layout = 1 người (Kduu) duyệt; đổi workflow/CI = cần xem lại.
- Rollback: thay đổi nhỏ, tách commit theo từng slice, revert được từng slice.

## 9. Cổng duyệt — Kduu trả lời

Chưa code UI cho tới khi ông duyệt file này. Ông trả lời:

1. **Duyệt design system này?** A. Duyệt hết — làm tiếp · B. Duyệt, sửa vài điểm (ghi rõ điểm nào) · C. Chưa duyệt (ghi rõ cần sửa gì)
2. **Accent `#1f6bd1`?** A. Giữ · B. Đổi sang màu khác (ghi mã màu) · C. Ông tự chọn sau
3. **Xóa code chết mục 3?** A. Xóa hết như liệt kê · B. Giữ lại 1–2 file (ghi rõ tên) · C. Chưa xóa, cứ mang sang
4. **Arena mobile xếp dọc?** A. Đồng ý · B. Giữ deck ngang cuộn · C. Cách khác (ghi rõ)
5. **Đo viewport Magic6:** ông mở trang đo giúp, hoặc để mình hướng dẫn đo sau (ghi `window.innerWidth`)?

## 10. References

- Astryx — https://github.com/meta/astryx — MIT, 0.7.16 (npm `latest`, 2026-11-17), React 19+, Beta. Nguồn token/pattern cho file này. **Không import vào app Vue.**
- prompt-optimizer — https://github.com/linshenkx/prompt-optimizer — AGPL-3.0-only, v2.15.2, develop `cbba5f95`. Repo làm việc: `~/workspace/prompt-optimizer`.
- Code review tại Anthropic — https://claude.dev/blog/solving-code-review-at-anthropic/ — quy trình mục 8.
- WCAG 2.2 AA — 4.5:1 chữ thường, 3:1 chữ lớn/UI/focus.
- Research trong repo: `research/astryx-foundations.md`, `research/current-app-audit.md`.
