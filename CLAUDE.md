# POLY WebGame 2026 — Project Guidelines

## Dự án
- Web game thi POLY WebGame Championship 2026
- Công nghệ: HTML, CSS, JavaScript thuần, Canvas API
- Mục tiêu: Tạo game hoàn chỉnh trong 90 phút

## Bố cục Web (Đã kiểm duyệt)
- Header: Logo, tên game, badge
- Navigation: Menu (Trang chủ, HD, BXH)
- Stats Bar: Điểm, Mạng, Thời gian
- Khung chơi game: Canvas 800x450 (Trung tâm)
- Controls: Hướng dẫn, nút điều khiển
- Footer: Thông tin tác giả, cuộc thi

## Quy tắc code
1. **Think Before Coding**: Đọc kỹ yêu cầu, không viết code vội vàng
2. **Simplicity First**: Code ngắn gọn, dễ hiểu, không overengineer
3. **Goal-Driven**: Mỗi dòng code phải hướng đến mục tiêu cuối cùng
4. **Don't Touch Outside Scope**: Chỉ sửa file BlankTemplate.js, không động vào file khác

## File chính
- `js/games/BlankTemplate.js` — Chỉ sửa 3 hàm: init(), update(dt), render(ctx)
- `index.html` — Bố cục web, không sửa trong ngày thi
- `css/main.css` — Giao diện, không sửa trong ngày thi

## Nguyên tắc khi tôi hỗ trợ bạn
1. Ưu tiên tốc độ (code nhanh, gọn)
2. Giải thích ngắn gọn, đi thẳng vào code
3. Debug trực tiếp lỗi bạn gửi
4. Không tự ý sửa ngoài BlankTemplate.js

## Khi thi (90 phút)
- 0-10 phút: Đọc đề, lên ý tưởng
- 10-50 phút: Code game vào BlankTemplate.js
- 50-70 phút: Debug, thử nghiệm
- 70-80 phút: Deploy lên Vercel
- 80-90 phút: Chuẩn bị pitch
