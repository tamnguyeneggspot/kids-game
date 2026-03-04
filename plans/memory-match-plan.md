# Plan: Game Lật thẻ đôi (Memory Match)

**Mục đích:** Game hai người (phụ huynh + bé) chơi cùng nhau, thay phiên lật thẻ tìm cặp. Tái sử dụng dữ liệu chữ/số/màu của KidsGame, giao diện và kỹ thuật thống nhất với các game hiện có.

---

## 1. Tổng quan

| Hạng mục | Nội dung |
|----------|----------|
| **Tên game** | Lật thẻ đôi (Memory Match) |
| **Đường dẫn** | `games/memory.html` |
| **Chế độ** | 2 người thay phiên (Bé ↔ Phụ huynh) |
| **Nguồn thẻ** | Chữ cái / Số / Màu (chọn bộ khi vào game) |
| **Thắng** | Không cần thắng thua — chơi đến hết bảng, tổng điểm chung hoặc điểm từng người (tùy chọn) |

---

## 2. Luật chơi

- Mỗi lượt: người chơi lật **2 thẻ**.
- Nếu **trùng** (cùng nội dung): được **1 điểm**, thẻ giữ mở, và **được lật tiếp** (cùng người).
- Nếu **không trùng**: úp lại 2 thẻ sau ~1–1.5 giây, chuyển **lượt** sang người kia.
- Hết thẻ thì kết thúc; có thể hiển thị tổng điểm từng người và nút "Chơi lại".

---

## 3. Cấu trúc file đề xuất

```
KidsGame/
├── games/
│   └── memory.html          # Trang game (meta, SEO, cấu trúc giống alphabet/color/counting)
├── css/
│   └── style.css            # Thêm section .page-memory, .memory-* (grid, card, turn)
├── js/
│   └── memory/
│       ├── shared.js        # Data (chữ/số/màu), shuffle, GAME_KEY, score
│       ├── game.js          # Logic: init board, flip, check pair, turn, win
│       └── main.js          # Khởi tạo UI, chọn bộ thẻ, gắn event
├── plans/
│   └── memory-match-plan.md # File plan này
└── index.html               # Thêm link tới games/memory.html (game card)
```

---

## 4. Nội dung từng file

### 4.1 `games/memory.html`

- **Đường dẫn:** Lưu trong folder `games/`. Từ `games/memory.html` dùng đường dẫn tương đối lên thư mục gốc: `../css/style.css`, `../js/memory/*.js`, `../index.html` (về trang chủ).
- **Meta/SEO:** title, description, keywords, canonical, og, twitter (giống pattern `alphabet.html`); canonical/og url trỏ tới `.../games/memory.html`.
- **Cấu trúc:**
  - Header: tiêu đề "Game lật thẻ đôi", mô tả ngắn, **chọn bộ thẻ**: Chữ cái | Số | Màu (trước khi bắt đầu hoặc trên cùng).
  - Khu vực **turn**: "Lượt của: Bé 🧒" / "Lượt của: Người lớn 👩" (có thể đổi tên).
  - **Điểm:** "Bé: 0 — Người lớn: 0" (hoặc chỉ "Cặp đã tìm: 0" nếu chơi hợp tác).
  - **Grid thẻ:** `div.memory-board` chứa các `button.memory-card` (mặt úp: dấu ? hoặc logo; mặt lật: chữ/số/màu).
  - Nút **Chơi lại** (hiện khi hết game).
  - Footer: link "← Về trang chủ" href=`../index.html`.
- **Script (path từ games/):** `../js/music.js`, `../js/settings.js`, `../js/settings-ui.js`, `../js/sfx.js`, `../js/diem.js` (nếu dùng), `../js/memory/shared.js`, `../js/memory/game.js`, `../js/memory/main.js`.
- **CSS:** `<link rel="stylesheet" href="../css/style.css">`.

### 4.2 `css/style.css` — bổ sung

- **.page-memory:** layout trang.
- **.memory-deck-select:** nút/radio chọn bộ thẻ (Chữ / Số / Màu).
- **.memory-turn:** hiển thị lượt chơi (có thể highlight).
- **.memory-scores:** điểm Bé / Người lớn.
- **.memory-board:** grid (ví dụ 4x4, 4x5) responsive; gap, padding.
- **.memory-card:** thẻ vuông, border-radius, transition flip (transform rotateY hoặc opacity swap).
- **.memory-card.flipped:** mặt lật (hiện nội dung).
- **.memory-card.matched:** đã ghép cặp (mờ hoặc border xanh, không click được).
- **.memory-card .front / .back:** mặt trước (?) và mặt sau (chữ/số/màu).
- **.memory-game-over:** panel kết thúc + nút Chơi lại.

### 4.3 `js/memory/shared.js`

- **Dữ liệu thẻ:**
  - **Chữ:** lấy từ `LETTERS` + `LETTER_IMAGES` (emoji hoặc chữ) — mỗi cặp 2 thẻ cùng nội dung.
  - **Số:** từ 1–10 (OBJECTS hoặc số), mỗi số 2 thẻ.
  - **Màu:** từ bộ màu trong `js/color/` (tên + hex), mỗi màu 2 thẻ.
- **Hàm:** `shuffle(array)`, `getDeck(type)` → trả về mảng thẻ đã shuffle (mỗi item có `id` cặp và `content` hiển thị).
- **GAME_KEY:** `'memory'` nếu lưu điểm (tùy chọn: lưu high score tổng cặp tìm được).

### 4.4 `js/memory/game.js`

- **state:** `deck`, `flippedCards[]` (tối đa 2), `currentTurn` ('kid' | 'adult'), `scores { kid, adult }`, `locked` (tránh click khi đang úp lại).
- **initBoard(deck):** render grid từ `deck`, mỗi thẻ có `data-id` (id cặp), `data-index`.
- **onCardClick(index):**  
  - Nếu locked hoặc thẻ đã flipped/matched → return.  
  - Lật thẻ (đẩy vào `flippedCards`).  
  - Nếu đủ 2 thẻ: so sánh `id` cặp → trùng: +1 điểm cho `currentTurn`, đánh dấu matched, gọi sfx đúng, không đổi lượt; không trùng: sau timeout úp lại, đổi lượt, sfx sai.  
  - Kiểm tra hết cặp → game over.
- **setTurn(turn):** cập nhật `currentTurn`, UI lượt và điểm.
- **resetGame():** shuffle lại deck, reset state, render lại.

### 4.5 `js/memory/main.js`

- Chọn bộ thẻ (Chữ / Số / Màu) → gọi `shared.getDeck(type)` → `game.initBoard(deck)`.
- Gắn click cho từng thẻ, nút Chơi lại.
- (Tùy chọn) tích hợp `webGameDiem` để lưu điểm hoặc số lần chơi.

---

## 5. Số thẻ và kích thước bảng

- **Chữ cái:** dùng 8 cặp (16 thẻ) → lấy 8 chữ từ LETTERS (ví dụ A, B, C, D, E, G, M, T).
- **Số:** 8 cặp (1–8) hoặc 6 cặp (1–6) tùy độ khó.
- **Màu:** 6–8 cặp tùy số màu có sẵn.
- **Grid:** 4x4 (16 thẻ) hoặc 4x5 (20 thẻ); CSS grid `grid-template-columns: repeat(4, 1fr)`.

---

## 6. Accessibility & UX

- Thẻ dùng `<button>` hoặc role="button", có `aria-label` (ví dụ "Thẻ 1, chưa lật" / "Chữ A").
- Khi lật, cập nhật aria-label; thẻ đã ghép cặp `aria-disabled="true"` hoặc không focus.
- Hiệu ứng flip ngắn (~0.3s), sau đó mới úp lại nếu sai (1–1.5s).
- Có thể thêm **âm thanh:** lật thẻ, đúng cặp, sai cặp, hết game (tái dùng `sfx.js` nếu có).

---

## 7. Các bước triển khai (checklist)

- [ ] **Bước 1:** Tạo `plans/memory-match-plan.md` (file này).
- [ ] **Bước 2:** Tạo `games/memory.html` (khung trang, meta, deck selector, board container, footer; dùng `../` cho css, js, link về trang chủ).
- [ ] **Bước 3:** Thêm CSS cho `.page-memory`, board, card (flip, matched), turn, scores.
- [ ] **Bước 4:** Viết `js/memory/shared.js` (data chữ/số/màu, `getDeck(type)`, `shuffle`).
- [ ] **Bước 5:** Viết `js/memory/game.js` (state, initBoard, onCardClick, setTurn, resetGame).
- [ ] **Bước 6:** Viết `js/memory/main.js` (chọn bộ thẻ, gắn event, tích hợp game).
- [ ] **Bước 7:** Thêm link game Lật thẻ đôi trên `index.html` (href=`games/memory.html`).
- [ ] **Bước 8:** Test 2 người (lượt, điểm, hết game, chơi lại); test responsive và accessibility.

---

## 8. Tùy chọn mở rộng (sau khi xong bản cơ bản)

- Chọn **số cặp** (dễ: 6 cặp, khó: 10 cặp).
- Chế độ **hợp tác:** không chia lượt, chỉ đếm tổng cặp tìm được.
- **Lưu điểm** theo từng bộ thẻ (chữ/số/màu) qua `webGameDiem`.
- Hiệu ứng **celebration** khi hết game (dùng pattern giống `counting` nếu có).

---

*Plan được lưu trong folder `plans`. Cập nhật lần cuối: theo ngày tạo file.*
