# DECISIONS (ADR)

| ADR | Quyết định | Trạng thái |
|---|---|---|
| 001 | Windows desktop, Tauri 2 | Đã chốt |
| 002 | React + **TypeScript** + Vite (không dùng JavaScript thuần) | Đã chốt 2026-10-06 |
| 003 | Reader-first; MVP 0.1 chỉ đọc EPUB | Đã chốt |
| 004 | Bọc EPUB.js sau interface `ReaderEngine` | **Proposal** |
| 005 | Gemini API là provider dịch đầu tiên (giai đoạn sau); OpenRouter chưa chọn | Đã chốt |
| 006 | `/docs` là source of truth giữa các chat | Đã chốt |
| 007 | Chế độ đọc: cuộn (scrolled), không phân trang | Đã chốt 2026-10-06 |

## Chi tiết

**ADR-002 TypeScript.** Lý do: User cần review code AI sinh ra; kiểu dữ liệu giúp đọc/kiểm tra dễ hơn; đổi JS→TS về sau tốn công. Loại bỏ: JavaScript thuần.

**ADR-004 ReaderEngine Đã chốt 2026-10-06.** EPUB.js có thể có giới hạn với một số EPUB. Bọc sau interface (open, next, prev, goTo, getToc, destroy) để có thể thay/bổ sung engine mà không sửa UI. Đánh đổi: thêm một lớp mỏng.

**ADR-005 Provider.** OpenRouter là gateway, không mâu thuẫn kiến trúc nhưng chưa dùng (lo ngại rủi ro account/API; chưa cần multi-model). Không đổi chỉ vì có free model.

**ADR-007 Scrolled.** Quyết định của User.
