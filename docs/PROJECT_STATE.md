# PROJECT_STATE

_Cập nhật: 2026-10-13_

## Giai đoạn hiện tại
MVP 0.1 (Reader) đang hoàn thiện, chưa đóng.

## Đã xác nhận (người dùng tự test)
- Mở EPUB nhiều ảnh.
- Cuộn liên tục.
- Mục lục nhảy đúng chương ngay lần bấm đầu.
- Bấm nhanh liên tiếp hai mục không nhảy ngược.
- File giả .epub báo lỗi, không treo.

## Chưa đạt
- Khôi phục vị trí đọc: sau khi đóng và mở lại sách, nội dung trống cho tới khi bấm một chương, và không tự về vị trí đọc cuối.

## Chưa kiểm chứng
- Sách EPUB dùng NCX (người dùng quyết định bỏ qua đợt này).

## Giới hạn đã biết
- DRM không hỗ trợ.
- Fixed layout có thể hiển thị khác.
- Chất lượng ảnh chưa rõ do sách gốc hay do app.

## Bước tiếp theo
1. Sửa khôi phục vị trí đọc.
2. Cân nhắc danh sách sách gần đây (Proposal, chưa chốt).
3. Test bản build NSIS.
4. Chọn milestone kế tiếp: A hoàn thiện Reader / B dịch / C spike cấu trúc EPUB (chưa chốt).

## Ghi chú vận hành
- Chạy dev bằng `npm run tauri dev`.
- Windows Smart App Control từng chặn Cargo build.
- localStorage của bản dev và bản cài đặt là tách riêng.
