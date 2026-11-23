# PROJECT_STATE

_Cập nhật: 2026-11-23_

## Giai đoạn hiện tại
MVP 0.1 (Reader) — đã sửa xong lỗi lưu/khôi phục vị trí đọc và rebuild bản production; chờ Project Owner kiểm thử runtime bản `.exe` / NSIS mới trước khi đóng milestone.

## Đã xác nhận (Project Owner tự test trên `tauri dev`)
- Mở EPUB nhiều ảnh.
- Cuộn liên tục.
- Mục lục nhảy đúng chương ngay lần bấm đầu.
- Bấm nhanh liên tiếp hai mục không nhảy ngược.
- File giả .epub báo lỗi, không treo.
- Lưu và khôi phục vị trí đọc (Save/Restore Position qua `epub-reader:positions` trên `localStorage`, không còn màn hình trắng khi mở lại sách).

## Đồng nhất Development & Production
- Đã rebuild `npm run tauri build` (2026-11-23) để `epub-reader.exe` và `EPUB Reader_0.1.0_x64-setup.exe` nhúng đúng mã nguồn mới nhất (chứa `initialLocation`, `onLocationChange`, `visibility: hidden` và flush khi đóng cửa sổ).
- Không thay đổi kiến trúc `ReaderEngine` (chỉ bổ sung tham số/callback tùy chọn tương thích ngược) và giữ nguyên `localStorage` (`epub-reader:positions`).
- Lưu ý tách biệt dữ liệu: `tauri dev` chạy trên origin `http://localhost:1420`, còn bản `.exe` production chạy trên `http://tauri.localhost`, nên `localStorage` của hai môi trường tách riêng theo thiết kế WebView2 (dữ liệu đọc của bản `.exe` vẫn bền vững qua các lần đóng/mở app `.exe`).

## Trạng thái build & GitHub
- `npx tsc --noEmit`: Pass.
- `npm run build`: Pass.
- `npm run tauri build`: Pass (`src-tauri/target/release/epub-reader.exe` và `src-tauri/target/release/bundle/nsis/EPUB Reader_0.1.0_x64-setup.exe`).
- GitHub: Đồng bộ lên nhánh `main` (`origin/main`).

## Chưa kiểm chứng
- Kiểm thử runtime trên bản production `.exe` và bộ cài đặt NSIS mới build (`EPUB Reader_0.1.0_x64-setup.exe`).
- Sách EPUB dùng NCX (người dùng quyết định bỏ qua đợt này).

## Giới hạn đã biết
- DRM không hỗ trợ.
- Fixed layout có thể hiển thị khác.
- Chất lượng ảnh chưa rõ do sách gốc hay do app.

## Bước tiếp theo
1. Project Owner cài đặt/chạy thử bản `.exe` và NSIS installer mới để xác nhận runtime production.
2. Đóng MVP 0.1 sau khi test bản production đạt yêu cầu.
3. Cân nhắc danh sách sách gần đây (Proposal, chưa chốt) hoặc chọn milestone kế tiếp.

## Ghi chú vận hành
- Chạy dev bằng `npm run tauri dev`.
- Windows Smart App Control từng chặn Cargo build.
- `localStorage` của bản dev và bản cài đặt là tách riêng.
