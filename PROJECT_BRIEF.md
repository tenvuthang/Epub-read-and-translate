# PROJECT_BRIEF — EPUB Reader & Translate

_Cập nhật: 2026-10-06_

## Mục tiêu dài hạn
1. Import và đọc EPUB.
2. Dịch EPUB sang ngôn ngữ đích (ưu tiên tiếng Việt), giữ cấu trúc/trình bày ở mức tốt nhất.
3. Hiển thị tiến trình dịch (%, ETA).
4. Xuất EPUB đã dịch.
5. Mở rộng sau (chưa cam kết): preview dịch, style/profile, glossary, translation memory, resumable, nhiều provider, EPUB → PDF.

Không xây tất cả ngay từ đầu.

## MVP 0.1 (hiện tại)
**Chỉ mở và đọc EPUB thành công** trên Windows desktop.
- Chọn file .epub, hiển thị nội dung ở chế độ **cuộn (scrolled)**.
- Mục lục, nhảy tới chương.
- Báo lỗi rõ khi file không hợp lệ; app không crash.
- (Tùy chọn, chỉ nếu nhẹ) nhớ vị trí đọc cuối.

## Non-goals của MVP 0.1
Dịch, Gemini/OpenRouter/API, glossary, export, PDF, thư viện sách, account/server/cloud, tính năng cộng đồng.

## Platform & Stack
Windows desktop · Tauri 2 · React · **TypeScript** · Vite · EPUB.js.
Rust chỉ dùng khi cần native; MVP 0.1 dùng plugin Tauri có sẵn (dialog, fs).

## Nguyên tắc
- Reader ổn định trước, translation sau.
- Giữ cấu trúc EPUB (XHTML, CSS, ảnh, font, metadata, TOC/spine); không flatten thành plain text rồi dựng lại.
- EPUB.js chưa chắc xử lý hoàn hảo mọi EPUB → cần test với nhiều file thực tế.
- Ý tưởng chưa được chốt chỉ là Proposal / Open question, không tự biến thành quyết định.

## Vai trò
- User: Project Owner, quyết định cuối cùng.
- ChatGPT / Technical Lead: phân tích, kiến trúc, prompt, review.
- Antigravity: Implementation Agent, viết code theo prompt.

## Quyết định đã chốt
Xem `docs/DECISIONS.md`.

## Câu hỏi còn mở
- Lưu vị trí đọc trong MVP 0.1: chỉ làm nếu không nặng.
- Provider dịch: Gemini là hướng đầu tiên; chi tiết pricing/model/rate limit tra cứu lại khi tới milestone dịch.
