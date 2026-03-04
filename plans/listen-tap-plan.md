# Plan: Game Nghe và chọn đúng (Listen & tap)

**Mục đích:** Phát âm một chữ / số / tên màu, bé chọn đúng trong 3–4 lựa chọn. Tái dùng audio và data từ alphabet, counting, color. Tích hợp nhanh vì dùng chung asset với các game hiện có.

---

## 1. Tổng quan

| Hạng mục | Nội dung |
|----------|----------|
| **Tên game** | Nghe và chọn đúng |
| **Đường dẫn** | `listen-tap.html` |
| **Chế độ** | 1 người (bé) |
| **Nguồn** | Chữ cái (alphabet), Số (counting), Màu (color): audio + data |
| **Thắng** | Không thắng thua cố định — mỗi câu đúng có feedback, có thể chơi không giới hạn hoặc 5/10 câu rồi tổng kết |

---

## 2. Luật chơi

- Chọn **chủ đề**: Chữ cái | Số | Màu.
- Game **phát âm** một item (vd. "A", "5", "Đỏ") — dùng audio sẵn có.
- Hiện **3–4 lựa chọn** (1 đúng, còn lại sai); thứ tự xáo trộn.
- Bé **click** vào một lựa chọn:
  - **Đúng:** sfx đúng + hiệu ứng (vd. vòng xanh), sau 1–2 giây chuyển câu tiếp theo (phát âm item mới).
  - **Sai:** sfx sai (tùy chọn), có thể cho chọn lại hoặc sau vài giây tự chuyển câu.
- Có thể chơi **liên tục** (không đếm câu) hoặc **chế độ 5/10 câu** rồi hiện "Bé đúng X/10!", nút Chơi lại.

---

## 3. Cấu trúc file đề xuất

```
KidsGame/
├── listen-tap.html          # Trang game (meta, SEO)
├── css/
│   └── style.css            # .page-listen-tap, .listen-tap-choices, .listen-tap-card
├── js/
│   └── listen-tap/
│       ├── shared.js        # Lấy data + url audio từ alphabet, counting, color (hoặc import/copy)
│       ├── game.js          # Logic: pick random item, build choices, check answer, next question
│       └── main.js          # Khởi tạo UI, chọn chủ đề, gắn event, phát âm
├── plans/
│   └── listen-tap-plan.md
└── index.html               # Link tới listen-tap.html
```

---

## 4. Nội dung từng file

### 4.1 `listen-tap.html`

- **Meta/SEO:** title, description, keywords, canonical, og, twitter; url `.../listen-tap.html`.
- **Cấu trúc:**
  - Header: tiêu đề "Nghe và chọn đúng", mô tả ngắn.
  - Chọn **chủ đề**: Chữ cái | Số | Màu (nút hoặc tab).
  - (Tùy chọn) Chế độ: Liên tục | 5 câu | 10 câu.
  - **Khu vực câu hỏi:** nút "Nghe lại" (phát lại âm thanh); không hiện chữ/item để bé phải nghe.
  - **Lựa chọn:** `div.listen-tap-choices` chứa 3–4 `button.listen-tap-card` (hiện chữ/số/màu tương ứng).
  - **Điểm (nếu chế độ 5/10 câu):** "Đúng: 0 / 10".
  - Nút **Chơi lại** (hiện khi hết vòng hoặc luôn).
  - Footer: link "← Về trang chủ".
- **Script:** music, settings, settings-ui, sfx, diem; cần load script chứa data alphabet/counting/color (hoặc listen-tap/shared tự định nghĩa map tới audio); listen-tap/game, main.
- **CSS:** style.css.

### 4.2 `css/style.css` — bổ sung

- **.page-listen-tap:** layout trang.
- **.listen-tap-topic:** nút chọn chủ đề (giống memory deck select).
- **.listen-tap-question:** khu vực "Nghe lại" + (tùy chọn) icon loa.
- **.listen-tap-choices:** grid 2×2 hoặc flex 3–4 ô.
- **.listen-tap-card:** thẻ lựa chọn (chữ to, số to, hoặc ô màu); hover, focus; .correct / .wrong (feedback).
- **.listen-tap-score:** "Đúng X / Y".

### 4.3 `js/listen-tap/shared.js`

- **Data:**
  - Chữ: map ký tự → url audio (từ alphabet.js hoặc copy vào đây nếu không import được).
  - Số: 1–10 → url audio (từ counting).
  - Màu: tên màu → url audio (từ color).
- **Hàm:** `getTopicData(topic)` → trả về mảng { value, label, audioUrl }; `getRandomItem(arr, exclude)`; `getWrongChoices(correctItem, topic, count)`.
- **GAME_KEY:** `'listenTap'`.

### 4.4 `js/listen-tap/game.js`

- **state:** `topic`, `currentItem`, `choices[]`, `score`, `totalRounds`, `mode` (continuous | 5 | 10), `locked` (sau khi chọn đúng chưa chuyển câu).
- **nextQuestion():** chọn item ngẫu nhiên, tạo choices (1 đúng + 2–3 sai), shuffle; phát audio (hoặc gọi main để phát); render choices; nếu mode 5/10 thì tăng totalRounds.
- **onChoiceClick(index):** nếu locked return; kiểm tra choices[index] === currentItem → đúng: score++, sfx, đánh dấu .correct, setTimeout nextQuestion; sai: sfx sai, đánh dấu .wrong (tùy chọn).
- **resetGame():** score=0, totalRounds=0, nextQuestion().
- **isRoundOver():** (mode 5/10) totalRounds >= 5 hoặc 10 → hiện tổng kết, nút Chơi lại.

### 4.5 `js/listen-tap/main.js`

- Chọn chủ đề + mode → gọi game.resetGame() (hoặc init).
- Gắn click "Nghe lại" → phát audio currentItem.
- Gắn click từng choice → game.onChoiceClick(index).
- (Tùy chọn) webGameDiem: lưu số lần chơi / điểm.

---

## 5. Tái dùng audio và data

- **Alphabet:** kiểm tra `js/alphabet.js` (hoặc tương đương) có export LETTERS + audio path; nếu không, trong shared.js định nghĩa mảng [{ letter, audioUrl }] giống nguồn alphabet.
- **Counting:** tương tự OBJECTS hoặc NUMBERS 1–10 + audio.
- **Color:** tên màu + hex + audio.
- Phát âm: `new Audio(url).play()` hoặc dùng Audio object chung để tránh chồng tiếng.

---

## 6. Accessibility & UX

- Nút "Nghe lại" có aria-label "Phát lại âm thanh".
- Mỗi lựa chọn có aria-label (vd. "Chữ A", "Số 5", "Màu đỏ"); không đọc đáp án đúng trong label để bé phải nghe.
- Sau khi chọn đúng: focus chuyển vào "Nghe lại" hoặc câu tiếp theo; thông báo ngắn "Đúng rồi!".

---

## 7. Các bước triển khai (checklist)

- [x] **Bước 1:** Tạo `plans/listen-tap-plan.md` (file này).
- [x] **Bước 2:** Tạo `listen-tap.html` (meta, chủ đề, khu vực câu hỏi, choices, điểm, footer).
- [x] **Bước 3:** Thêm CSS .page-listen-tap, .listen-tap-choices, .listen-tap-card, .correct, .wrong.
- [x] **Bước 4:** Viết `js/listen-tap/shared.js` (getTopicData, getRandomItem, getWrongChoices; map audio từ alphabet/counting/color).
- [x] **Bước 5:** Viết `js/listen-tap/game.js` (nextQuestion, onChoiceClick, resetGame, isRoundOver).
- [x] **Bước 6:** Viết `js/listen-tap/main.js` (chọn chủ đề, Nghe lại, gắn choice click).
- [x] **Bước 7:** Thêm link game trên `index.html`; test từng chủ đề, đúng/sai, chế độ 5/10 câu.
- [x] **Bước 8:** Test âm thanh, responsive, accessibility.

---

## 8. Tùy chọn mở rộng

- Chế độ "Chữ hoa / chữ thường" cho alphabet.
- Tăng độ khó: 4 lựa chọn thay vì 3.
- Lưu điểm cao (số câu đúng liên tiếp) qua webGameDiem.

---

*Plan lưu trong folder `plans`. Cập nhật lần cuối: theo ngày tạo file.*
