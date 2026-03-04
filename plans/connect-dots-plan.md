# Plan: Game Nối chấm theo số (Connect the dots)

**Mục đích:** Các chấm đánh số 1–10 (hoặc 1–20), bé click theo thứ tự để nối thành hình (con vật, ngôi sao…). Rèn thứ tự số, vui; có thể dùng canvas hoặc SVG. Giao diện thống nhất KidsGame.

---

## 1. Tổng quan

| Hạng mục | Nội dung |
|----------|----------|
| **Tên game** | Nối chấm theo số |
| **Đường dẫn** | `connect-dots.html` |
| **Chế độ** | 1 người (bé) |
| **Nguồn** | Các hình định nghĩa sẵn: tọa độ chấm 1, 2, …, N (SVG path hoặc array points) |
| **Thắng** | Nối đúng thứ tự hết chấm → hiện hình hoàn chỉnh + sfx, nút "Chơi lại" / "Hình khác" |

---

## 2. Luật chơi

- Chọn **hình** (vd. ngôi sao, con mèo, máy bay) hoặc random một hình.
- Canvas/SVG hiện **các chấm có số** 1, 2, 3, … (vd. 1–10 hoặc 1–20).
- Bé **click** lần lượt theo thứ tự: click chấm 1 → vẽ đoạn (hoặc chưa vẽ), click chấm 2 → nối 1–2, … click chấm N → nối (N-1)–N.
- **Click sai thứ tự:** sfx sai (tùy chọn), không nối; phải click đúng chấm tiếp theo.
- Nối xong chấm cuối → hiện toàn bộ hình (có thể tô màu hoặc animation), sfx + celebration, nút Chơi lại / Hình khác.

---

## 3. Cấu trúc file đề xuất

```
KidsGame/
├── connect-dots.html        # Trang game (meta, SEO)
├── css/
│   └── style.css            # .page-connect-dots, .connect-dots-canvas-wrap
├── js/
│   └── connect-dots/
│       ├── shared.js        # Danh sách hình: mỗi hình = array points [{x,y}, ...] (tọa độ % hoặc px)
│       ├── game.js          # Logic: vẽ chấm, vẽ đường khi click đúng thứ tự, check complete
│       └── main.js          # Khởi tạo UI, chọn hình, gắn click canvas/SVG
├── plans/
│   └── connect-dots-plan.md
└── index.html               # Link tới connect-dots.html
```

---

## 4. Nội dung từng file

### 4.1 `connect-dots.html`

- **Meta/SEO:** title, description, keywords, canonical, og, twitter; url `.../connect-dots.html`.
- **Cấu trúc:**
  - Header: tiêu đề "Nối chấm theo số", mô tả ngắn.
  - Chọn **hình** (nếu nhiều): dropdown hoặc grid nhỏ (ngôi sao, con vật, …).
  - **Khu vực chơi:** `<canvas>` hoặc `<svg>` chứa chấm số + đường nối; kích thước cố định hoặc responsive.
  - **Gợi ý:** "Click theo thứ tự 1 → 2 → 3 → …"
  - Nút **Chơi lại**, **Hình khác**.
  - Footer: link "← Về trang chủ".
- **Script:** music, settings, settings-ui, sfx, diem; connect-dots/shared, game, main.
- **CSS:** style.css.

### 4.2 `css/style.css` — bổ sung

- **.page-connect-dots:** layout trang.
- **.connect-dots-canvas-wrap:** wrapper canvas/SVG; max-width, margin auto; có thể border hoặc nền nhạt.
- **canvas / svg:** width 100%, height auto (giữ tỉ lệ).

### 4.3 `js/connect-dots/shared.js`

- **Data:** CONNECT_DOTS_SHAPES = [ { id, name, points: [ {x, y}, … ] } ]. Tọa độ có thể 0–100 (%) để scale vào canvas.
- **Ví dụ points ngôi sao 5 cánh (10 điểm):** 10 tọa độ theo thứ tự nối.
- **Hàm:** `getShapes()`, `getShape(id)`.
- **GAME_KEY:** `'connectDots'`.

### 4.4 `js/connect-dots/game.js`

- **state:** `shape` (points), `currentStep` (đã nối đến chấm mấy: 0 = chưa nối, 1 = đã click 1, …), `completed`.
- **initShape(shape):** vẽ lại canvas/SVG: vẽ các chấm + số (1, 2, …); chưa vẽ đường; currentStep = 0.
- **getPointAt(x, y):** hit test: (x,y) (tọa độ click) thuộc chấm nào (index 0..n-1)? So sánh khoảng cách với từng point (sau khi scale).
- **onPointClick(index):** nếu index === currentStep → đúng thứ tự: vẽ đoạn từ point[currentStep-1] đến point[currentStep] (nếu currentStep > 0); currentStep++; sfx nhẹ. Nếu index !== currentStep → sfx sai (tùy chọn). Nếu currentStep === points.length → hoàn thành: vẽ nốt đoạn cuối (nối về 1 nếu hình kín), hiệu ứng + sfx, game over.
- **resetGame():** currentStep = 0, vẽ lại chấm, xóa đường.

### 4.5 `js/connect-dots/main.js`

- Chọn hình (hoặc random) → game.initShape(shape).
- Gắn click (hoặc touch) lên canvas: đổi tọa độ event sang tọa độ canvas → game.getPointAt(px, py) → game.onPointClick(index).
- Nút Chơi lại, Hình khác.
- (Tùy chọn) webGameDiem.

---

## 5. Kỹ thuật vẽ (Canvas vs SVG)

- **Canvas:** Vẽ chấm (arc) + text (số); mỗi lần click đúng vẽ lineTo; clearRect và vẽ lại mỗi frame nếu cần hoặc chỉ vẽ thêm đoạn.
- **SVG:** Mỗi chấm là `<circle>` + `<text>`; mỗi đoạn nối là `<line>`; click circle → dễ hit test (event target). Ưu tiên SVG cho đơn giản hit test và scale.
- **Tọa độ:** Dùng % (0–100) trong data, nhân với width/height khi render để responsive.

---

## 6. Định nghĩa hình mẫu

- **Ngôi sao 5 cánh:** 10 điểm (5 đỉnh ngoài + 5 đỉnh trong), nối 1–2–3–…–10–1.
- **Tam giác:** 3 điểm. **Hình vuông:** 4 điểm. **Con vật đơn giản:** 6–10 điểm (phác thảo).
- Có thể bắt đầu với 2–3 hình (ngôi sao, tam giác, nhà) rồi thêm sau.

---

## 7. Accessibility & UX

- Mỗi chấm (trong SVG) có `<title>` hoặc aria-label "Chấm số 1", "Chấm số 2"; vùng click đủ rộng (radius hit test ~15px).
- Gợi ý rõ: "Click theo thứ tự 1, 2, 3, …"
- Khi hoàn thành: thông báo "Bé đã nối xong!", focus nút Chơi lại.

---

## 8. Các bước triển khai (checklist)

- [ ] **Bước 1:** Tạo `plans/connect-dots-plan.md` (file này).
- [ ] **Bước 2:** Định nghĩa ít nhất 1 hình (points) trong shared.js.
- [ ] **Bước 3:** Tạo `connect-dots.html` (meta, chọn hình, canvas/SVG, gợi ý, nút, footer).
- [ ] **Bước 4:** Thêm CSS .page-connect-dots, .connect-dots-canvas-wrap.
- [ ] **Bước 5:** Viết `js/connect-dots/shared.js` (CONNECT_DOTS_SHAPES, getShape).
- [ ] **Bước 6:** Viết `js/connect-dots/game.js` (initShape, getPointAt, onPointClick, resetGame); vẽ chấm + đường (canvas hoặc SVG).
- [ ] **Bước 7:** Viết `js/connect-dots/main.js` (chọn hình, gắn click, Chơi lại).
- [ ] **Bước 8:** Thêm link game trên `index.html`; test nối đúng thứ tự, sai thứ tự, hoàn thành; responsive.

---

## 9. Tùy chọn mở rộng

- Thêm nhiều hình (con vật, xe, nhà).
- Chế độ 1–20 chấm (hình phức tạp hơn).
- Sau khi nối xong: tô màu hình (fill) hoặc animation đường vẽ.
- Lưu số lần chơi / hình đã hoàn thành qua webGameDiem.

---

*Plan lưu trong folder `plans`. Cập nhật lần cuối: theo ngày tạo file.*
