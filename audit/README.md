# Bằng chứng kiểm chứng (audit)

Thư mục này chứa kịch bản và kết quả đo giao diện bằng Chromium thật (Playwright), dùng cho báo cáo kỹ thuật.

## Chạy lại

```bash
# 1. Build bản production
pnpm build:core && pnpm build:ui && pnpm build:web

# 2. Phục vụ tĩnh thư mục build
cd packages/web/dist && python3 -m http.server 4173 --bind 127.0.0.1

# 3. Đo bố cục (36 tổ hợp mobile + 9 desktop)
BASE_URL=http://127.0.0.1:4173 node audit/mobile-audit.mjs

# 4. Kiểm tra tương tác: sheet Danh mục, chuyển ngôn ngữ, chủ đề Tối
BASE_URL=http://127.0.0.1:4173 node audit/mobile-interactions.mjs
```

## Tệp

- `mobile-audit.mjs` — mở 9 tuyến ở 5 kích thước, đo tràn ngang, ô nhập < 16px, mục chạm < 44px, `lang`, ký tự tiếng Việt.
- `mobile-audit.json` — kết quả đo thô của lần chạy cuối trên bản production.
- `mobile-interactions.mjs` — kịch bản chuyển ngôn ngữ Việt ↔ Anh và bật chủ đề Tối.
- `mobile-interactions.json` — kết quả tương tác cuối.
- `shots/` — ảnh chụp 412×915 (Honor Magic 6), 1440×900 (desktop), sheet chức năng, chế độ.
- `render-report.mjs` — kết xuất `BAO-CAO-KY-THUAT.md` sang HTML.
- `package.py` — đóng gói mã nguồn (không gồm `node_modules`, `dist`) và bản build web.

## Kết quả lần chạy cuối

- 36/36 tổ hợp mobile: `scrollWidth === viewport width` (không tràn ngang).
- 0 ô nhập/textarea có `font-size < 16px`.
- 0 nút/lựa chọn dưới 44px (ngoài ô nhập ẩn bên trong select của Naive UI).
- 24/24 mục tương tác trong Đấu trường đạt ≥ 44px; textarea 16px.
- `document.documentElement.lang` = `vi`; chuyển sang Anh → `en`; quay lại → `vi`.
- Chủ đề Tối: `data-workspace-theme="dark"`, nền `rgb(16,16,20)`.
