# PROJECT_STATE

_Cập nhật: 2026-10-06_

## Giai đoạn hiện tại
Chuẩn bị xong môi trường, sẵn sàng bắt đầu implementation MVP 0.1 (Reader).

## Đã hoàn thành
- Xác định phạm vi MVP 0.1 và stack.
- Cài môi trường Windows (Git, Node, Rust, C++ Build Tools, WebView2).
- Chạy thử project Tauri trống thành công (đã xóa/không dùng tiếp).
- Có sẵn bộ EPUB để test.

## Quyết định đã chốt
Tauri 2 + React + TypeScript + Vite + EPUB.js · Reader-first · chế độ đọc cuộn · Gemini là provider dịch đầu tiên (sau này), OpenRouter chưa chọn · `/docs` là source of truth.

## Câu hỏi còn mở
- Lưu vị trí đọc: optional.

## Vấn đề hiện tại
Không có.

## Bước tiếp theo
1. Đưa `docs/PROMPT_01_ANTIGRAVITY.md` cho Antigravity.
2. Review kết quả, test với bộ EPUB, cập nhật docs.

## Ghi chú Technical Lead
- Review Prompt #1 output chú ý: UI không import `epubjs` trực tiếp; capability Tauri ở mức tối thiểu; xử lý lỗi file hỏng.
- Test EPUB nên có: ảnh, font nhúng, CSS phức tạp, sách tiếng Việt.
- Đường dẫn project không dấu, không khoảng trắng.
