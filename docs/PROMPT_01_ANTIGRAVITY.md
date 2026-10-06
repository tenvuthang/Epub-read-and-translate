# Antigravity Prompt #1 — Reader scaffold

> Chỉ giao khi User đã xác nhận ADR-004.

```text
ROLE
Bạn là Implementation Agent cho dự án "EPUB Reader & Translate".
Chỉ làm đúng phạm vi bên dưới, không tự thêm tính năng hay dependency.

MỤC TIÊU
Tạo Windows desktop app mở và đọc được EPUB (MVP 0.1).

STACK (bắt buộc)
Tauri 2, React, TypeScript, Vite, EPUB.js (package `epubjs`).
Plugin Tauri: @tauri-apps/plugin-dialog, @tauri-apps/plugin-fs.

YÊU CẦU
1. Khởi tạo project Tauri 2 + React + TypeScript + Vite; chạy được bằng
   `npm run tauri dev`.
2. Nút "Open EPUB" → file dialog (lọc .epub) → đọc bytes bằng fs plugin
   → truyền ArrayBuffer cho EPUB.js.
3. Tạo interface `ReaderEngine` (open, next, prev, goTo, getToc, destroy) và
   `EpubJsEngine` implement nó, đặt trong src/lib/reader-engine/.
   Component UI chỉ gọi qua interface, KHÔNG import `epubjs` trực tiếp.
4. Hiển thị nội dung ở chế độ CUỘN (scrolled), chiều rộng 100% vùng đọc.
   Gợi ý EPUB.js: flow "scrolled" với manager "continuous".
5. Sidebar mục lục; click mục → nhảy tới chương.
6. Xử lý lỗi: file không phải EPUB hợp lệ hoặc đọc thất bại → thông báo rõ
   ràng, app không crash.
7. Capability/permission Tauri ở mức tối thiểu cần thiết.
8. (TÙY CHỌN, chỉ làm nếu rất nhẹ, khoảng ≤ 20 dòng) Lưu vị trí đọc (CFI)
   theo đường dẫn file bằng localStorage và khôi phục khi mở lại.
   Nếu phức tạp hơn thì bỏ qua và báo lại.

KHÔNG LÀM
Dịch thuật, gọi API, Gemini/OpenRouter, glossary, export, PDF, thư viện sách,
account, thêm dependency ngoài danh sách trên.

ĐẦU RA
- Cấu trúc thư mục cuối cùng.
- Hướng dẫn chạy/build.
- Danh sách dependency đã thêm và lý do.
- Điểm chưa chắc chắn hoặc giới hạn đã phát hiện.

NGHIỆM THU
Mở được ít nhất 3 EPUB khác nhau, cuộn đọc được, mục lục hoạt động,
file lỗi không làm app crash.
```
