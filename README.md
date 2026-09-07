# PICKO 247 SPORTS & PLAY HUB — PICKLEBALL CLASH 1v1

Hệ thống Web Quản lý Thể thao bộ môn Pickleball + Integrated Mini Webgame **Pickleball Clash 1v1 🏓⚡** (Chuyển đổi từ file `try1.html`).

## 🚀 Chạy Ứng Dụng
```bash
python3 -m http.server 8080
```
Truy cập: `http://localhost:8080`

## 📁 Cấu Trúc Hệ Thống
- `index.html`: Giao diện Web Hub (Header Navigation, Tab Tour, Tab Score, Tab Game 1v1, Tab Admin, Modals)
- `css/main.css`: Design system thương hiệu Picko 247 (Deep Navy, Electric Cyan, Pickleball Yellow)
- `js/pickoPlatform.js`: Business Logic quản lý Giải đấu (Tour), Bảng xếp hạng VĐV (Score), CRUD Admin & Sync điểm
- `js/games/PickleballClash.js`: Mini-game đối đầu 1v1 Pickleball Clash (Chuyển đổi từ `try1.html`)
- `js/engine/`: AudioManager, InputManager, ParticleSystem, GameEngine, Storage
- `js/app.js`: Main Application Controller
