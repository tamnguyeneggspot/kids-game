# Plan: Game Ghép hình cho bé (Puzzle / Jigsaw nhẹ)

**Trạng thái:** ✅ **Đã hoàn thành**

**Mục đích:** Game ghép hình đơn giản: ảnh cắt thành 4–9 mảnh, bé kéo thả hoặc click để ghép. Tái dùng data/ảnh từ chữ cái, số, con vật, trái cây. Giao diện và kỹ thuật thống nhất với các game KidsGame hiện có.

---

## 1. Tổng quan

| Hạng mục | Nội dung |
|----------|----------|
| **Tên game** | Ghép hình cho bé |
| **Đường dẫn** | `puzzle.html` |
| **Chế độ** | 1 người (bé) |
| **Nguồn ảnh** | Chữ cái, số, con vật, trái cây (tái dùng asset sẵn) |
| **Thắng** | Ghép xong toàn bộ mảnh → hiệu ứng + âm thanh, nút "Chơi lại" / "Hình khác" |

---

## 2. Luật chơi

- Chọn **độ khó**: 4 mảnh (2×2), 6 mảnh (2×3), 9 mảnh (3×3).
- Ảnh được cắt thành các ô; các ô bị xáo trộn vị trí (hoặc dạng grid có ô trống để trượt).
- **Cách chơi A (kéo thả):** Kéo mảnh vào ô đúng; khi đúng vị trí thì khóa lại.
- **Cách chơi B (click swap):** Click hai mảnh để đổi chỗ cho nhau.
- Ghép xong toàn bộ → celebration + sfx, có thể chọn hình khác hoặc chơi lại.

---

## 3. Cấu trúc file đề xuất

```
KidsGame/
├── puzzle.html              # Trang game (meta, SEO, cấu trúc giống memory.html)
├── css/
│   └── style.css            # Thêm .page-puzzle, .puzzle-board, .puzzle-piece
├── js/
│   └── puzzle/
│       ├── shared.js        # Danh sách ảnh (url/asset), getImageList(), GAME_KEY
│       ├── game.js          # Logic: cắt ảnh, shuffle, drag/drop hoặc swap, check hoàn thành
│       └── main.js          # Khởi tạo UI, chọn độ khó, chọn hình, gắn event
├── img/                     # (hoặc dùng ảnh từ data sẵn)
│   └── puzzle/              # Ảnh dùng cho puzzle (nếu tách riêng)
├── plans/
│   └── puzzle-plan.md       # File plan này
└── index.html               # Thêm link tới puzzle.html
```

---

## 4. Nội dung từng file

### 4.1 `puzzle.html`

- **Meta/SEO:** title, description, keywords, canonical, og, twitter (pattern giống `memory.html`); canonical/og url trỏ tới `.../puzzle.html`.
- **Cấu trúc:**
  - Header: tiêu đề "Ghép hình cho bé", mô tả ngắn.
  - Chọn **độ khó**: 4 / 6 / 9 mảnh (nút hoặc select).
  - Chọn **hình** (nếu nhiều ảnh): carousel hoặc grid nhỏ (chữ, số, con vật, trái cây).
  - **Bảng ghép:** `div.puzzle-board` chứa các `div.puzzle-piece` (background-image từ slice ảnh).
  - Nút **Chơi lại**, **Hình khác** (hiện khi xong hoặc luôn).
  - Footer: link "← Về trang chủ" href=`index.html`.
- **Script:** `js/music.js`, `js/settings.js`, `js/settings-ui.js`, `js/sfx.js`, `js/diem.js` (nếu dùng), `js/puzzle/shared.js`, `js/puzzle/game.js`, `js/puzzle/main.js`.
- **CSS:** `<link rel="stylesheet" href="css/style.css">`.

### 4.2 `css/style.css` — bổ sung

- **.page-puzzle:** layout trang.
- **.puzzle-difficulty:** nút chọn số mảnh (4, 6, 9).
- **.puzzle-image-select:** chọn ảnh (grid hoặc danh sách nhỏ).
- **.puzzle-board:** grid 2×2, 2×3 hoặc 3×3; mỗi ô có kích thước đều.
- **.puzzle-piece:** từng mảnh; cursor grab/grabbing khi kéo; transition khi đặt đúng.
- **.puzzle-piece.correct:** đã đúng vị trí (border xanh nhạt, không kéo được).
- **.puzzle-complete:** panel kết thúc + nút Chơi lại / Hình khác.

### 4.3 `js/puzzle/shared.js`

- **Danh sách ảnh:** mảng `PUZZLE_IMAGES[]` (url hoặc key map tới asset chữ/số/con vật/trái cây).
- **Hàm:** `getImageList()`, `getImageUrl(key)` (nếu cần).
- **GAME_KEY:** `'puzzle'` (lưu điểm/lần chơi qua diem nếu cần).

### 4.4 `js/puzzle/game.js`

- **state:** `imageKey`, `difficulty` (4|6|9), `pieces[]` (mảng index hoặc vị trí), `correctCount`, `locked`.
- **initPuzzle(imageUrl, cols, rows):** tạo grid cols×rows, mỗi mảnh có background-position tương ứng slice ảnh; shuffle thứ tự mảnh.
- **onPieceClick(index)** (mode swap): đổi chỗ 2 mảnh đang chọn; sau mỗi lần đổi kiểm tra xong chưa.
- **onDragStart/Update/End** (mode kéo thả): cập nhật vị trí, khi thả vào ô đúng thì đánh dấu correct, sfx.
- **checkComplete():** so sánh thứ tự hiện tại với thứ tự đúng; nếu trùng → game over, celebration.
- **resetGame():** shuffle lại, reset state, render lại.

### 4.5 `js/puzzle/main.js`

- Chọn độ khó + hình → gọi `game.initPuzzle(url, cols, rows)`.
- Gắn event: click (swap) hoặc drag/drop cho từng mảnh; nút Chơi lại, Hình khác.
- (Tùy chọn) tích hợp `webGameDiem` để lưu số lần chơi / thời gian.

---

## 5. Kỹ thuật cắt ảnh

- **Canvas:** vẽ ảnh lên canvas, dùng `drawImage` với source rect để cắt từng ô → export dataURL hoặc giữ trong memory.
- **CSS background:** mỗi mảnh là một div, `background-image` chung một ảnh, `background-size` = (cols*100%, rows*100%), `background-position` = (cột, hàng) tương ứng.
- Ưu tiên CSS background để đơn giản, không cần tạo nhiều blob ảnh.

---

## 6. Accessibility & UX

- Mảnh dùng `role="button"` hoặc draggable div, `aria-label` ("Mảnh 1", "Mảnh 2", …).
- Khi ghép đúng từng mảnh: feedback ngắn (sfx nhẹ hoặc animation).
- Khi hoàn thành: focus vào nút "Chơi lại", thông báo rõ ("Bé đã ghép xong!").

---

## 7. Các bước triển khai (checklist)

- [x] **Bước 1:** Tạo `plans/puzzle-plan.md` (file này).
- [x] **Bước 2:** Tạo `puzzle.html` (khung trang, meta, chọn độ khó, chọn hình, board container, footer).
- [x] **Bước 3:** Thêm CSS cho `.page-puzzle`, board, piece, correct, complete.
- [x] **Bước 4:** Viết `js/puzzle/shared.js` (danh sách ảnh, getImageList).
- [x] **Bước 5:** Viết `js/puzzle/game.js` (initPuzzle, shuffle, swap/check hoặc drag/drop, checkComplete, resetGame).
- [x] **Bước 6:** Viết `js/puzzle/main.js` (chọn độ khó/hình, gắn event, tích hợp game).
- [x] **Bước 7:** Thêm link game Ghép hình trên `index.html`.
- [x] **Bước 8:** Test 4/6/9 mảnh, đổi hình, chơi lại; test responsive và accessibility.

**Đã bổ sung:** Sliding puzzle với 1 ô trống (item N+1), chỉ kéo mảnh cạnh ô trống vào ô trống; ô trống luôn ở hàng cuối khi start; options 4 ô và 9 ô; 5 hình con vật (Mèo, Chó, Chim, Thỏ, Voi).

---

## 8. Tùy chọn mở rộng

- Thêm nhiều ảnh (con vật, trái cây, phương tiện).
- Chế độ "trượt ô trống" (1 ô trống, trượt mảnh cạnh vào).
- Lưu tiến độ (ảnh + độ khó) hoặc thời gian hoàn thành qua `webGameDiem`.

---

*Plan lưu trong folder `plans`. Cập nhật lần cuối: theo ngày tạo file.*
