# Plan: Game Sắp xếp theo thứ tự (Ordering)

**Mục đích:** Sắp số 1→10 hoặc chữ A→Z (kéo thả hoặc click theo thứ tự). Có thể mở rộng: sắp theo kích thước (bé → lớn), nhiều → ít. Giao diện và kỹ thuật thống nhất với KidsGame.

---

## 1. Tổng quan

| Hạng mục | Nội dung |
|----------|----------|
| **Tên game** | Sắp xếp theo thứ tự |
| **Đường dẫn** | `ordering.html` |
| **Chế độ** | 1 người (bé) |
| **Nguồn** | Số 1–10, Chữ A–Z (tái dùng data alphabet, counting); mở rộng: kích thước, số lượng |
| **Thắng** | Sắp xong đúng thứ tự → hiệu ứng + sfx, nút "Chơi lại" / "Chủ đề khác" |

---

## 2. Luật chơi

- Chọn **chủ đề**: Số (1→10) | Chữ (A→Z) | (Mở rộng: Bé→Lớn, Ít→Nhiều).
- Các thẻ hiện **xáo trộn** (vd. 5, 2, 9, 1, … hoặc C, A, Z, B, …).
- **Cách chơi A (kéo thả):** Kéo thẻ vào ô thứ tự (ô 1, ô 2, …); khi đủ thẻ đúng thứ tự thì hoàn thành.
- **Cách chơi B (click chọn thứ tự):** Click lần lượt theo thứ tự (click 1 → click 2 → …); sai thứ tự thì sfx sai (tùy chọn) hoặc reset phần đã chọn.
- **Cách chơi C (swap):** Click đổi chỗ hai thẻ cho đến khi đúng thứ tự.
- Hoàn thành → celebration + sfx, nút Chơi lại.

---

## 3. Cấu trúc file đề xuất

```
KidsGame/
├── ordering.html            # Trang game (meta, SEO)
├── css/
│   └── style.css            # .page-ordering, .ordering-slots, .ordering-card
├── js/
│   └── ordering/
│       ├── shared.js        # Data số 1–10, chữ A–Z; getTopicData(topic), shuffle
│       ├── game.js          # Logic: init slots + cards, drag/drop hoặc click-order, check complete
│       └── main.js          # Khởi tạo UI, chọn chủ đề, gắn event
├── plans/
│   └── ordering-plan.md
└── index.html               # Link tới ordering.html
```

---

## 4. Nội dung từng file

### 4.1 `ordering.html`

- **Meta/SEO:** title, description, keywords, canonical, og, twitter; url `.../ordering.html`.
- **Cấu trúc:**
  - Header: tiêu đề "Sắp xếp theo thứ tự", mô tả ngắn.
  - Chọn **chủ đề**: Số 1→10 | Chữ A→Z (nút hoặc tab).
  - **Khu vực chơi:** Hai phần: (1) dãy **ô thứ tự** (1, 2, 3, … hoặc A, B, C, …); (2) **thẻ xáo trộn** (số hoặc chữ) để kéo vào ô hoặc click theo thứ tự.
  - Nút **Chơi lại**, **Chủ đề khác**.
  - Footer: link "← Về trang chủ".
- **Script:** music, settings, settings-ui, sfx, diem; ordering/shared, game, main.
- **CSS:** style.css.

### 4.2 `css/style.css` — bổ sung

- **.page-ordering:** layout trang.
- **.ordering-topic:** chọn chủ đề (Số / Chữ).
- **.ordering-slots:** dãy ô trống (flex/grid) đánh số 1–10 hoặc A–Z; mỗi ô có thể chứa 1 thẻ.
- **.ordering-cards:** khu vực thẻ xáo trộn (kéo thả) hoặc cùng dãy với slots (click mode).
- **.ordering-card:** thẻ số/chữ; draggable; khi đặt đúng slot thì .correct.
- **.ordering-slot:** ô; min-height để nhận drop; .filled khi đã có thẻ.

### 4.3 `js/ordering/shared.js`

- **Data:** NUMBERS_1_10 = [1,2,…,10], LETTERS_A_Z (từ alphabet hoặc mảng 29 chữ); có thể rút gọn 1–5, A–E cho dễ.
- **Hàm:** `getTopicData(topic)` → mảng items; `shuffle(arr)`; `isOrderCorrect(placed)` so sánh với thứ tự chuẩn.
- **GAME_KEY:** `'ordering'`.

### 4.4 `js/ordering/game.js`

- **state:** `topic`, `items[]` (đã shuffle), `slots[]` (thứ tự đã đặt: index hoặc value), `locked`.
- **initGame(topic):** tạo items shuffle; render slots (trống) và cards (từ items); nếu mode click-order thì chỉ render 1 dãy cards, click lần lượt đúng thứ tự.
- **onCardDrop(slotIndex, cardValue)** (kéo thả): gán slots[slotIndex]=cardValue; cập nhật UI; checkComplete().
- **onCardClickOrder(cardValue)** (click thứ tự): mong đợi click theo thứ tự 1,2,…,10 hoặc A,B,…; nếu đúng thứ tự thì đánh dấu; sai thì feedback.
- **checkComplete():** so sánh slots với thứ tự đúng → nếu trùng thì game over, celebration.
- **resetGame():** shuffle lại, reset slots, render lại.

### 4.5 `js/ordering/main.js`

- Chọn chủ đề → game.initGame(topic).
- Gắn drag/drop (HTML5 drag or pointer) hoặc click theo thứ tự; nút Chơi lại.
- (Tùy chọn) webGameDiem.

---

## 5. Độ khó (tùy chọn)

- **Dễ:** 1–5 hoặc A–E (5 phần tử).
- **Trung bình:** 1–10 hoặc A–J (10 phần tử).
- **Khó:** 1–10 toàn bộ hoặc A–Z (29 chữ).

---

## 6. Accessibility & UX

- Slots có aria-label "Ô số 1", "Ô số 2", …; thẻ có aria-label "Số 5", "Chữ C".
- Kéo thả: keyboard alternative (focus + phím chọn slot) hoặc chế độ click-order cho a11y.
- Khi hoàn thành: focus nút "Chơi lại", thông báo "Bé đã sắp xếp đúng!".

---

## 7. Các bước triển khai (checklist)

- [ ] **Bước 1:** Tạo `plans/ordering-plan.md` (file này).
- [ ] **Bước 2:** Tạo `ordering.html` (meta, chủ đề, slots + cards area, footer).
- [ ] **Bước 3:** Thêm CSS .page-ordering, .ordering-slots, .ordering-card, .ordering-slot.
- [ ] **Bước 4:** Viết `js/ordering/shared.js` (getTopicData, shuffle, isOrderCorrect).
- [ ] **Bước 5:** Viết `js/ordering/game.js` (initGame, onCardDrop hoặc onCardClickOrder, checkComplete, resetGame).
- [ ] **Bước 6:** Viết `js/ordering/main.js` (chọn chủ đề, gắn drag/drop hoặc click).
- [ ] **Bước 7:** Thêm link game trên `index.html`; test Số / Chữ, hoàn thành, Chơi lại.
- [ ] **Bước 8:** Test responsive, accessibility.

---

## 8. Tùy chọn mở rộng

- Sắp theo kích thước (hình bé → lớn).
- Sắp theo số lượng (ít → nhiều: 1 quả táo, 2 quả, 3 quả…).
- Lưu điểm / thời gian hoàn thành qua webGameDiem.

---

*Plan lưu trong folder `plans`. Cập nhật lần cuối: theo ngày tạo file.*
