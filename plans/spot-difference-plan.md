# Plan: Game Tìm điểm khác biệt (Spot the difference)

**Mục đích:** Hai bức hình gần giống nhau, có 2–3 chỗ khác (màu, số lượng, thiếu đồ vật). Bé click vào chỗ khác biệt → hiệu ứng + âm thanh đúng. Giao diện và kỹ thuật thống nhất với KidsGame.

---

## 1. Tổng quan

| Hạng mục | Nội dung |
|----------|----------|
| **Tên game** | Tìm điểm khác biệt |
| **Đường dẫn** | `spot-difference.html` |
| **Chế độ** | 1 người (bé) |
| **Nguồn hình** | Cặp ảnh (bản gốc + bản đã chỉnh 2–3 điểm khác); có thể vẽ SVG/Canvas hoặc dùng ảnh tĩnh |
| **Thắng** | Tìm hết các điểm khác biệt → hiệu ứng + sfx, nút "Chơi lại" / "Cặp khác" |

---

## 2. Luật chơi

- Hiển thị **hai ảnh** cạnh nhau (hoặc trên/dưới trên mobile): trái = A, phải = B.
- Có **2–3 điểm khác biệt** (vùng click được định nghĩa sẵn: circle/rect trên ảnh B).
- Bé **click** vào vùng khác biệt trên ảnh B → đánh dấu "đã tìm" (vòng tròn xanh, tick), phát sfx đúng.
- Click nhầm vùng không phải khác biệt → sfx sai (tùy chọn), không trừ điểm.
- Tìm hết tất cả → thông báo "Hoàn thành!", nút Chơi lại hoặc cặp hình khác.

---

## 3. Cấu trúc file đề xuất

```
KidsGame/
├── spot-difference.html      # Trang game (meta, SEO)
├── css/
│   └── style.css            # .page-spot-diff, .spot-diff-images, .spot-diff-hit-zone
├── js/
│   └── spot-difference/
│       ├── shared.js        # Danh sách cặp ảnh + tọa độ/ vùng khác biệt (hotspots)
│       ├── game.js          # Logic: load cặp ảnh, hit test click, đánh dấu tìm được, check complete
│       └── main.js          # Khởi tạo UI, chọn cặp (nếu nhiều), gắn event
├── img/
│   └── spot-difference/     # Cặp ảnh (original.png, modified.png) hoặc từng level
├── plans/
│   └── spot-difference-plan.md
└── index.html               # Link tới spot-difference.html
```

---

## 4. Nội dung từng file

### 4.1 `spot-difference.html`

- **Meta/SEO:** title, description, keywords, canonical, og, twitter; url `.../spot-difference.html`.
- **Cấu trúc:**
  - Header: tiêu đề "Tìm điểm khác biệt", mô tả ngắn.
  - **Hai ảnh:** `div.spot-diff-images` chứa hai `div` hoặc `img` (ảnh A, ảnh B). Ảnh B có lớp phủ các vùng invisible (hit area) hoặc overlay sau khi tìm được.
  - **Đếm:** "Đã tìm: 0 / 3" (số điểm khác biệt).
  - Nút **Chơi lại**, **Cặp khác** (nếu có nhiều level).
  - Footer: link "← Về trang chủ".
- **Script:** music, settings, settings-ui, sfx, diem (nếu dùng), spot-difference/shared, game, main.
- **CSS:** style.css.

### 4.2 `css/style.css` — bổ sung

- **.page-spot-diff:** layout trang.
- **.spot-diff-images:** flex hoặc grid hai ảnh; responsive (stack trên mobile).
- **.spot-diff-image:** wrapper mỗi ảnh; position relative để đặt hit zones.
- **.spot-diff-hit-zone:** vùng click (position absolute, % hoặc em); border-radius 50% hoặc rect; cursor pointer; transparent hoặc outline khi hover (dev).
- **.spot-diff-hit-zone.found:** đã tìm (hiện vòng tròn xanh/tick, không click nữa).

### 4.3 `js/spot-difference/shared.js`

- **Dữ liệu level:** mảng `SPOT_DIFF_LEVELS[]`, mỗi item: `{ id, imageLeft, imageRight, differences: [ { x, y, r } ] }` (tọa độ % và bán kính vùng click trên ảnh phải).
- **Hàm:** `getLevels()`, `getLevel(id)`.
- **GAME_KEY:** `'spotDifference'`.

### 4.4 `js/spot-difference/game.js`

- **state:** `level`, `found[]` (mảng boolean hoặc index đã tìm), `totalDiff`.
- **initLevel(levelData):** render hai ảnh; tạo các hit zone (div hoặc canvas) với position từ `differences`; reset found.
- **onHitZoneClick(index):** nếu chưa found[index], đánh dấu found[index]=true, cập nhật UI (vòng xanh), sfx đúng; gọi checkComplete().
- **checkComplete():** nếu mọi difference đã found → game over, celebration.
- **resetGame():** reset found, render lại hit zones.

### 4.5 `js/spot-difference/main.js`

- Load level (mặc định level 0 hoặc chọn từ dropdown); gọi `game.initLevel(levelData)`.
- Gắn click cho từng hit zone; nút Chơi lại, Cặp khác.
- (Tùy chọn) webGameDiem: lưu số level đã chơi / số lần chơi.

---

## 5. Định nghĩa vùng khác biệt

- Mỗi "điểm khác biệt" là một vùng tròn (hoặc rect): `{ x: 30, y: 20, r: 5 }` = 30% từ trái, 20% từ trên, bán kính 5% cạnh ảnh.
- Click có tọa độ (px) → quy đổi sang % so với kích thước ảnh → kiểm tra nằm trong vùng nào.
- Hoặc: mỗi vùng là một `<button>` hoặc `<div role="button">` position absolute, không cần tính toán tọa độ (dễ hơn).

---

## 6. Accessibility & UX

- Mỗi hit zone có `aria-label` ("Điểm khác biệt 1", "Điểm khác biệt 2"); khi đã tìm thì aria-label "Đã tìm - Điểm 1".
- Feedback rõ: sfx đúng khi tìm đúng; có thể thêm lời "Đúng rồi!".
- Sau khi hoàn thành: focus nút "Chơi lại", thông báo "Bé đã tìm hết điểm khác biệt!".

---

## 7. Các bước triển khai (checklist)

- [x] **Bước 1:** Tạo `plans/spot-difference-plan.md` (file này).
- [x] **Bước 2:** Chuẩn bị ít nhất 1 cặp ảnh (gốc + đã chỉnh 2–3 chỗ) và định nghĩa tọa độ vùng khác biệt.
- [x] **Bước 3:** Tạo `spot-difference.html` (meta, hai ảnh, đếm, nút, footer).
- [x] **Bước 4:** Thêm CSS .page-spot-diff, .spot-diff-images, .spot-diff-hit-zone, .found.
- [x] **Bước 5:** Viết `js/spot-difference/shared.js` (levels + differences).
- [x] **Bước 6:** Viết `js/spot-difference/game.js` (initLevel, onHitZoneClick, checkComplete, resetGame).
- [x] **Bước 7:** Viết `js/spot-difference/main.js` (load level, gắn event).
- [x] **Bước 8:** Thêm link game trên `index.html`; test click đúng/sai, hoàn thành, responsive.

---

## 8. Tùy chọn mở rộng

- Thêm nhiều cặp ảnh (nhiều level).
- Gợi ý sau N giây (làm nhấp nháy vùng chưa tìm).
- Lưu level đã chơi / đã hoàn thành qua webGameDiem.

---

*Plan lưu trong folder `plans`. Cập nhật lần cuối: theo ngày tạo file.*
