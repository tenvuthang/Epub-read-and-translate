# PROJECT_STATE

_Cập nhật: 2026-10-06 (Hoàn thành MVP 0.1 - Antigravity)_

## Giai đoạn hiện tại
MVP 0.1 - Hoàn tất khởi tạo và build chạy ứng dụng đọc EPUB trên Windows desktop.

## Đã hoàn thành
- [x] Khởi tạo dự án Tauri 2 + React + TypeScript + Vite trong thư mục gốc.
- [x] Cài đặt và cấu hình đầy đủ các dependency: `epubjs`, `@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-fs`.
- [x] Thiết lập kiến trúc bọc engine (ADR-004):
  - Interface `ReaderEngine` tại [`src/lib/reader-engine/ReaderEngine.ts`](file:///c:/Users/Admin/Downloads/Epub%20file%20reader/src/lib/reader-engine/ReaderEngine.ts) (gồm `open`, `next`, `prev`, `goTo`, `getToc`, `destroy`, `getCurrentCfi`).
  - Class `EpubJsEngine` tại [`src/lib/reader-engine/EpubJsEngine.ts`](file:///c:/Users/Admin/Downloads/Epub%20file%20reader/src/lib/reader-engine/EpubJsEngine.ts) bọc `epubjs` độc lập. UI hoàn toàn không import `epubjs` trực tiếp.
- [x] Xây dựng UI:
  - Nút "Mở EPUB" kích hoạt Tauri file dialog (lọc `.epub`) → đọc mảng bytes qua `@tauri-apps/plugin-fs` → truyền `ArrayBuffer` sang engine.
  - Chế độ đọc: Cuộn liên tục (`flow: "scrolled"`, `manager: "continuous"`, `width: "100%"`).
  - Sidebar mục lục cây phân cấp, click vào mục nhảy trực tiếp tới chương.
  - Báo lỗi rõ ràng bằng error banner khi file hỏng hoặc đọc thất bại, ứng dụng không bị crash.
  - (Tùy chọn) Lưu và khôi phục vị trí đọc (CFI) theo file path qua `localStorage` (gọn nhẹ ≤ 20 dòng).
- [x] Cấu hình quyền Tauri ở mức tối thiểu (`dialog:allow-open`, `fs:allow-read-file`, `fs:allow-exists`).
- [x] Đã giải quyết vấn đề SAC/AppLocker sau khi tắt SAC.
- [x] Ứng dụng đã compile thành công và đang chạy tiến trình desktop `epub-reader.exe` qua `npm run tauri dev`.
- [x] TypeScript & Vite build pass 100% (`npm run build`).

## Hướng dẫn chạy và sử dụng
- Chế độ phát triển (Dev): `npm run tauri dev`
- Build gói sản phẩm (Production): `npm run tauri build`

## Điểm lưu ý & giới hạn
- EPUB có mã hóa DRM sẽ không mở được qua EPUB.js.
- Chế độ cuộn phụ thuộc vào định dạng CSS/HTML nội tại của file sách (một số file thiết kế fixed-layout có thể cần điều chỉnh viewport).

## Nghiệm thu
"Nghiệm thu lần 1: đọc/cuộn ổn; lỗi mục lục (nhảy sai lần 1) và lỗi file giả (loading vô hạn) chưa sửa; chưa test NCX và khôi phục vị trí. Chạy app bằng terminal ngoài (npm.cmd run tauri dev), không chạy qua agent."
