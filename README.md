# POLY GAME 2026 - HTML5 CANVAS + PURE JS FRAMEWORK

Bộ khung chuẩn bị bài thi POLY GAME 2026 với đầy đủ bố cục (Header, Footer, Stats, Controls, Debug Tools) và khoang trung tâm `<div id="game-container">`.

## 🚀 Chạy Ứng Dụng
```bash
python3 -m http.server 8080
```
Truy cập: `http://localhost:8080`

## 📁 Cấu trúc thư mục
- `index.html`: Web layout chính
- `css/main.css`: Giao diện Cyber Neon Glassmorphism
- `js/engine/`: AudioManager, InputManager, ParticleSystem, GameEngine, Storage
- `js/games/`: BaseGame, SampleGame, BlankTemplate (Cho ngày thi)
- `js/app.js`: Kết nối giao diện DOM và Động cơ
