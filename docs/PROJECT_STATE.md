# PROJECT_STATE

_Cập nhật: 2026-10-06 (sau Prompt #1 - Antigravity)_

## Giai đoạn hiện tại
MVP 0.1 - Code đã viết xong, cần chạy build.

## Đã hoàn thành
- [x] Scaffold Tauri 2 + React + TypeScript + Vite trong thư mục gốc
- [x] Cài dependencies: `epubjs`, `@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-fs`
- [x] Viết `ReaderEngine` interface + `EpubJsEngine` implementation (ADR-004)
- [x] Viết App.tsx với flow: Open dialog → readFile → ArrayBuffer → EpubJsEngine
- [x] Sidebar mục lục (TOC), click để nhảy chương
- [x] Xử lý lỗi: error banner, không crash
- [x] Lưu/khôi phục vị trí đọc (CFI) bằng localStorage (≤ 20 dòng)
- [x] Capabilities Tauri tối thiểu: `dialog:allow-open`, `fs:allow-read-file`, `fs:allow-exists`
- [x] TypeScript pass 100% (`tsc --noEmit` clean)

## Vấn đề hiện tại
**Windows Application Control Policy (AppLocker/WDAC)** block việc Cargo chạy build scripts
trong thư mục `C:\Users\Admin\Downloads\`.

**Giải pháp**: Di chuyển thư mục project ra ngoài `Downloads`, ví dụ:
- `C:\Users\Admin\projects\epub-reader\` ← được khuyến nghị
- `C:\Dev\epub-reader\`
- Hoặc bất kỳ đường dẫn nào KHÔNG phải Downloads/Desktop

> **LƯU Ý**: Đường dẫn không được có dấu hoặc khoảng trắng (đã có trong project STATE).

## Sau khi di chuyển, chạy:
```
npm run tauri dev
```

## Câu hỏi còn mở
- (đã giải quyết) Lưu vị trí đọc: ĐÃ THỰC HIỆN với localStorage (CFI per filepath)

## Bước tiếp theo
1. User di chuyển thư mục ra khỏi Downloads
2. Chạy `npm run tauri dev` → test với 3+ EPUB
3. Review kết quả, cập nhật docs

## Ghi chú Technical Lead
- UI không import `epubjs` trực tiếp ✓ (chỉ EpubJsEngine.ts)
- Capability Tauri ở mức tối thiểu ✓ (chỉ dialog:allow-open + fs:allow-read-file + fs:allow-exists)
- Xử lý lỗi file hỏng ✓ (try/catch toàn bộ flow, error banner, không crash)
- Test với EPUB có ảnh, font nhúng, CSS phức tạp, tiếng Việt cần thực hiện sau khi build OK
