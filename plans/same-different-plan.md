# Plan: Game Tìm cái giống / khác (Same / Different)

**Mục đích:** Một hàng thẻ, bé tìm "cái nào giống với cái này" hoặc "cái nào khác với các cái còn lại". Dùng chữ, số, màu hoặc hình đơn giản. Rèn phân loại, so sánh. Giao diện thống nhất KidsGame.

---

## 1. Tổng quan

| Hạng mục | Nội dung |
|----------|----------|
| **Tên game** | Tìm cái giống / khác |
| **Đường dẫn** | `same-different.html` |
| **Chế độ** | 1 người (bé) |
| **Nguồn** | Chữ cái, số, màu (tái dùng data alphabet, counting, color) |
| **Thắng** | Mỗi câu đúng feedback; chơi 5/10 câu hoặc liên tục, có tổng kết |

---

## 2. Luật chơi

- **Chế độ "Tìm cái giống":** Hiện 1 thẻ mẫu + 3–4 thẻ (trong đó 1 thẻ **giống** mẫu, còn lại khác). Bé click vào thẻ giống mẫu → đúng thì sfx + câu tiếp.
- **Chế độ "Tìm cái khác":** Hiện 3–4 thẻ (trong đó 1 thẻ **khác** với tất cả các thẻ còn lại; các thẻ còn lại giống nhau). Bé click vào thẻ khác biệt → đúng thì sfx + câu tiếp.
- Chọn **chủ đề**: Chữ | Số | Màu (data từ alphabet, counting, color).
- Có thể chơi **liên tục** hoặc **5/10 câu** rồi tổng kết.

---

## 3. Cấu trúc file đề xuất

```
KidsGame/
├── same-different.html      # Trang game (meta, SEO)
├── css/
│   └── style.css            # .page-same-diff, .same-diff-sample, .same-diff-cards
├── js/
│   └── same-different/
│       ├── shared.js        # Data chữ/số/màu; getSameQuestion(), getDifferentQuestion()
│       ├── game.js          # Logic: build câu (mẫu + choices), check answer, next
│       └── main.js          # Khởi tạo UI, chọn chế độ (giống/khác), chủ đề, gắn event
├── plans/
│   └── same-different-plan.md
└── index.html               # Link tới same-different.html
```

---

## 4. Nội dung từng file

### 4.1 `same-different.html`

- **Meta/SEO:** title, description, keywords, canonical, og, twitter; url `.../same-different.html`.
- **Cấu trúc:**
  - Header: tiêu đề "Tìm cái giống / khác", mô tả ngắn.
  - Chọn **chế độ**: "Tìm cái giống" | "Tìm cái khác".
  - Chọn **chủ đề**: Chữ | Số | Màu.
  - **Câu hỏi:** "Tìm cái giống với đây:" + 1 thẻ mẫu (chế độ giống); hoặc "Tìm cái khác với các cái còn lại:" + không cần mẫu (chế độ khác).
  - **Lựa chọn:** 3–4 thẻ (chữ/số/màu).
  - **Điểm:** "Đúng: 0 / 10" (nếu chế độ 5/10 câu).
  - Nút **Chơi lại**.
  - Footer: link "← Về trang chủ".
- **Script:** music, settings, settings-ui, sfx, diem; same-different/shared, game, main.
- **CSS:** style.css.

### 4.2 `css/style.css` — bổ sung

- **.page-same-diff:** layout trang.
- **.same-diff-mode:** nút chọn "Tìm giống" / "Tìm khác".
- **.same-diff-topic:** nút chọn Chữ / Số / Màu.
- **.same-diff-sample:** thẻ mẫu (chế độ giống); to hơn hoặc highlight.
- **.same-diff-cards:** grid 2×2 hoặc flex 3–4 thẻ.
- **.same-diff-card:** thẻ (chữ/số/màu); .correct / .wrong khi feedback.

### 4.3 `js/same-different/shared.js`

- **Data:** LETTERS, NUMBERS, COLORS (từ alphabet, counting, color hoặc copy).
- **Hàm:**  
  - `getSameQuestion(topic)` → { sample, choices } với 1 choice giống sample, 2–3 choice khác (cùng topic).  
  - `getDifferentQuestion(topic)` → { choices } với 3 thẻ giống nhau, 1 thẻ khác (vd. A,A,A,B → tìm B).
- **GAME_KEY:** `'sameDifferent'`.

### 4.4 `js/same-different/game.js`

- **state:** `mode` (same|different), `topic`, `currentQuestion` (sample + choices hoặc chỉ choices), `score`, `totalRounds`, `locked`.
- **nextQuestion():** gọi getSameQuestion hoặc getDifferentQuestion; shuffle choices; render mẫu (nếu same) + render thẻ; lưu index đáp án đúng.
- **onCardClick(index):** nếu locked return; so sánh index với đáp án đúng → đúng: score++, sfx, feedback, setTimeout nextQuestion; sai: sfx sai, feedback (tùy chọn).
- **resetGame():** score=0, totalRounds=0; nextQuestion().
- **isRoundOver():** (mode 5/10) totalRounds đủ → tổng kết.

### 4.5 `js/same-different/main.js`

- Chọn chế độ + chủ đề → game.resetGame().
- Gắn click từng thẻ; nút Chơi lại.
- (Tùy chọn) webGameDiem.

---

## 5. Logic tạo câu

- **Tìm giống:** sample = random item (vd. chữ "A"); choices = [sample, other1, other2, other3] (other ≠ sample), shuffle.
- **Tìm khác:** pick 1 item "same" (vd. "A"), 1 item "different" (vd. "B"); choices = [A, A, A, B] hoặc [A, B, A, A], shuffle. Đáp án = index của "different".

---

## 6. Accessibility & UX

- Câu hỏi: aria-label "Tìm cái giống với chữ A" / "Tìm cái khác với các cái còn lại".
- Mỗi thẻ: aria-label "Chữ A", "Số 5", "Màu đỏ".
- Sau chọn đúng: thông báo "Đúng rồi!", chuyển câu.

---

## 7. Các bước triển khai (checklist)

- [x] **Bước 1:** Tạo `plans/same-different-plan.md` (file này).
- [x] **Bước 2:** Tạo `same-different.html` (meta, chế độ, chủ đề, câu hỏi, thẻ, điểm, footer).
- [x] **Bước 3:** Thêm CSS .page-same-diff, .same-diff-sample, .same-diff-cards, .same-diff-card.
- [x] **Bước 4:** Viết `js/same-different/shared.js` (getSameQuestion, getDifferentQuestion).
- [x] **Bước 5:** Viết `js/same-different/game.js` (nextQuestion, onCardClick, resetGame).
- [x] **Bước 6:** Viết `js/same-different/main.js` (chọn chế độ/chủ đề, gắn event).
- [x] **Bước 7:** Thêm link game trên `index.html`; test Tìm giống / Tìm khác, từng chủ đề.
- [x] **Bước 8:** Test responsive, accessibility.

---

## 8. Tùy chọn mở rộng

- Thêm hình (con vật, trái cây): "Tìm con vật giống", "Tìm quả khác".
- Tăng số thẻ (4 lựa chọn).
- Lưu điểm qua webGameDiem.

---

*Plan lưu trong folder `plans`. Cập nhật lần cuối: theo ngày tạo file.*
