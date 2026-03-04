# Plan: Game Đếm và chọn số (Count & match)

**Mục đích:** Hiện một nhóm đồ vật (vd. 5 quả táo), bé chọn số đúng (3, 4, 5, 6). Mở rộng: "Chọn bức hình có nhiều hơn / ít hơn". Gần với game counting, tái dùng data dễ. Giao diện thống nhất KidsGame.

---

## 1. Tổng quan

| Hạng mục | Nội dung |
|----------|----------|
| **Tên game** | Đếm và chọn số |
| **Đường dẫn** | `count-match.html` |
| **Chế độ** | 1 người (bé) |
| **Nguồn** | Đồ vật + số (từ counting: OBJECTS, số 1–10) |
| **Thắng** | Mỗi câu đúng có feedback; chơi 5/10 câu rồi tổng kết "Đúng X/10!" hoặc chơi liên tục |

---

## 2. Luật chơi

- **Câu hỏi:** Hiện một nhóm đồ vật (vd. 5 quả táo) — dùng hình/emoji từ counting.
- **Lựa chọn:** 3–4 số (vd. 3, 4, 5, 6); 1 đúng, còn lại sai; thứ tự xáo trộn.
- Bé **click** số đúng → sfx đúng + chuyển câu tiếp (hiện nhóm đồ vật mới, số mới).
- Click sai → sfx sai (tùy chọn), có thể cho chọn lại hoặc không.
- **Chế độ:** Liên tục hoặc 5/10 câu rồi hiện điểm, nút Chơi lại.

**Mở rộng (sau):**
- "Chọn bức hình có **nhiều hơn**" (2 hình: 3 táo vs 5 táo).
- "Chọn bức hình có **ít hơn**".

---

## 3. Cấu trúc file đề xuất

```
KidsGame/
├── count-match.html         # Trang game (meta, SEO)
├── css/
│   └── style.css            # .page-count-match, .count-match-objects, .count-match-choices
├── js/
│   └── count-match/
│       ├── shared.js        # Data đồ vật (OBJECTS từ counting), số 1–10; getQuestion(), getWrongOptions()
│       ├── game.js          # Logic: random câu (số + đồ vật), build choices, check answer, next
│       └── main.js          # Khởi tạo UI, chế độ 5/10/liên tục, gắn event
├── plans/
│   └── count-match-plan.md
└── index.html               # Link tới count-match.html
```

---

## 4. Nội dung từng file

### 4.1 `count-match.html`

- **Meta/SEO:** title, description, keywords, canonical, og, twitter; url `.../count-match.html`.
- **Cấu trúc:**
  - Header: tiêu đề "Đếm và chọn số", mô tả ngắn.
  - (Tùy chọn) Chế độ: Liên tục | 5 câu | 10 câu.
  - **Khu vực câu hỏi:** hiện nhóm đồ vật (số lượng N, hình lặp N lần hoặc 1 hình + số N); câu chữ "Có bao nhiêu?"
  - **Lựa chọn số:** 3–4 nút (vd. 3, 4, 5, 6).
  - **Điểm:** "Đúng: 0 / 10" (nếu chế độ 5/10).
  - Nút **Chơi lại**.
  - Footer: link "← Về trang chủ".
- **Script:** music, settings, settings-ui, sfx, diem; count-match/shared, game, main.
- **CSS:** style.css.

### 4.2 `css/style.css` — bổ sung

- **.page-count-match:** layout trang.
- **.count-match-question:** khu vực hiện đồ vật (flex wrap nhiều icon/emoji) + text "Có bao nhiêu?"
- **.count-match-choices:** grid 2×2 hoặc flex 3–4 nút số.
- **.count-match-btn:** nút số; .correct / .wrong khi feedback.
- **.count-match-score:** "Đúng X / Y".

### 4.3 `js/count-match/shared.js`

- **Data:** OBJECTS (đồ vật từ counting: emoji hoặc url ảnh), NUMBERS 1–10.
- **Hàm:** `getRandomQuestion()` → { count: 5, object: 'táo', objectDisplay } (count 1–10, object ngẫu nhiên); `getWrongOptions(correctCount, count)` → mảng 2–3 số sai (gần với correct để khó hơn: vd. đúng 5 thì sai 4,6,3).
- **GAME_KEY:** `'countMatch'`.

### 4.4 `js/count-match/game.js`

- **state:** `currentQuestion` (count, object), `choices[]` (số đúng + sai xáo trộn), `score`, `totalRounds`, `mode`, `locked`.
- **nextQuestion():** gọi shared.getRandomQuestion(); tạo choices = [correct, ...wrong].sort(shuffle); render câu hỏi (hiện count lần object) + render nút choices.
- **onChoiceClick(value):** nếu locked return; nếu value === currentQuestion.count → đúng: score++, sfx, feedback, setTimeout nextQuestion; sai: sfx sai, feedback .wrong (tùy chọn). Nếu mode 5/10 thì totalRounds++; khi đủ 5/10 → tổng kết.
- **resetGame():** score=0, totalRounds=0, nextQuestion().

### 4.5 `js/count-match/main.js`

- Chọn mode (nếu có) → game.resetGame().
- Gắn click cho từng nút số; nút Chơi lại.
- (Tùy chọn) webGameDiem: lưu số lần chơi / điểm.

---

## 5. Hiển thị "nhóm đồ vật"

- **Cách 1:** Lặp emoji/icon N lần (vd. 🍎🍎🍎🍎🍎 cho 5).
- **Cách 2:** Một ảnh có sẵn N đồ vật (ảnh 5 quả táo) — cần asset.
- Ưu tiên cách 1 để tái dùng data counting (emoji/object type).

---

## 6. Accessibility & UX

- Câu hỏi có aria-label "Có bao nhiêu đồ vật?" (không nói số đúng).
- Mỗi nút số có aria-label "Số 3", "Số 5", …
- Sau khi chọn đúng: thông báo ngắn "Đúng rồi!"; focus chuyển an toàn.

---

## 7. Các bước triển khai (checklist)

- [ ] **Bước 1:** Tạo `plans/count-match-plan.md` (file này).
- [ ] **Bước 2:** Tạo `count-match.html` (meta, câu hỏi, choices, điểm, Chơi lại, footer).
- [ ] **Bước 3:** Thêm CSS .page-count-match, .count-match-question, .count-match-choices, .count-match-btn.
- [ ] **Bước 4:** Viết `js/count-match/shared.js` (getRandomQuestion, getWrongOptions; dùng data counting).
- [ ] **Bước 5:** Viết `js/count-match/game.js` (nextQuestion, onChoiceClick, resetGame).
- [ ] **Bước 6:** Viết `js/count-match/main.js` (gắn event, Chơi lại).
- [ ] **Bước 7:** Thêm link game trên `index.html`; test vài câu, đúng/sai, chế độ 5/10.
- [ ] **Bước 8:** Test responsive, accessibility.

---

## 8. Tùy chọn mở rộng

- "Chọn hình có **nhiều hơn**" / "**ít hơn**" (2 hình, mỗi hình số lượng khác nhau).
- Tăng độ khó: 4 lựa chọn, số gần nhau hơn (vd. 4,5,6,7 khi đáp án 5).
- Lưu điểm cao qua webGameDiem.

---

*Plan lưu trong folder `plans`. Cập nhật lần cuối: theo ngày tạo file.*
