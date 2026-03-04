# Danh sách tất cả game — KidsGame

Tài liệu tổng hợp các game đã có và ý tưởng game mới. Dùng để theo dõi roadmap và triển khai.

---

## 1. Các game đã có (đã triển khai)

| # | Tên game | File | Mô tả ngắn | Trạng thái |
|---|----------|------|------------|------------|
| 1 | **Game số đếm cho bé** | `counting.html` | Học đếm 1–10: nhìn đồ vật, nghe số, chọn số đúng, so sánh nhiều ít | ✅ Có |
| 2 | **Game bảng chữ cái** | `alphabet.html` | Học chữ cái tiếng Việt: phát âm, ghép chữ với hình, sắp xếp A–Z | ✅ Có |
| 3 | **Game màu sắc cho bé** | `color.html` | Nhận biết màu: học tên màu, nghe và chọn màu đúng | ✅ Có |
| 4 | **Game lật thẻ đôi** | `memory.html` | Hai người thay phiên tìm cặp thẻ (chữ / số / màu), rèn trí nhớ | ✅ Có |
| 5 | **Ghép hình cho bé** | `puzzle.html` | Sliding puzzle: 4 hoặc 9 ô + 1 ô trống, kéo mảnh cạnh ô trống để ghép hình | ✅ Có |
| 6 | **Tìm điểm khác biệt** | `spot-difference.html` | Hai hình gần giống nhau, 2–3 chỗ khác; bé bấm vào hình bên phải để tìm. 10 cặp hình. | ✅ Có |
| 7 | **Nghe và chọn đúng** | `listen-tap.html` | Nghe phát âm chữ / số / màu, chọn đúng trong 3–4 ô. Chủ đề: chữ cái, số, màu; chế độ liên tục hoặc 5/10 câu. | ✅ Có |

---

## 2. Ý tưởng game mới (chưa triển khai)

### 2.1. Sắp xếp theo thứ tự (Ordering)

| Hạng mục | Nội dung |
|----------|----------|
| **Tên** | Sắp xếp theo thứ tự |
| **Đường dẫn đề xuất** | `ordering.html` |
| **Mô tả** | Sắp số 1→10, hoặc chữ A→Z (kéo thả hoặc click theo thứ tự). Có thể mở rộng: sắp theo kích thước (bé → lớn), nhiều → ít. |
| **Kỹ năng** | Thứ tự, so sánh |
| **Plan chi tiết** | [ordering-plan.md](ordering-plan.md) |

---

### 2.2. Đếm và chọn số (Count & match)

| Hạng mục | Nội dung |
|----------|----------|
| **Tên** | Đếm và chọn số |
| **Đường dẫn đề xuất** | `count-match.html` |
| **Mô tả** | Hiện một nhóm đồ vật (vd. 5 quả táo), bé chọn số đúng (3, 4, 5, 6). Mở rộng: “Chọn bức hình có nhiều hơn / ít hơn”. |
| **Kỹ năng** | Đếm, so sánh nhiều/ít |
| **Plan chi tiết** | [count-match-plan.md](count-match-plan.md) |
| **Ghi chú** | Gần với game counting, tái dùng data dễ |

---

### 2.3. Tìm cặp giống nhau (Same / Different)

| Hạng mục | Nội dung |
|----------|----------|
| **Tên** | Tìm cái giống / khác |
| **Đường dẫn đề xuất** | `same-different.html` |
| **Mô tả** | Một hàng thẻ, bé tìm “cái nào giống với cái này” hoặc “cái nào khác với các cái còn lại”. Dùng chữ, số, màu hoặc hình đơn giản. |
| **Kỹ năng** | Phân loại, so sánh |
| **Plan chi tiết** | [same-different-plan.md](same-different-plan.md) |

---

### 2.4. Nối chấm theo số (Connect the dots)

| Hạng mục | Nội dung |
|----------|----------|
| **Tên** | Nối chấm theo số |
| **Đường dẫn đề xuất** | `connect-dots.html` |
| **Mô tả** | Các chấm đánh số 1–10 (hoặc 1–20), bé click theo thứ tự để nối thành hình (con vật, ngôi sao…). |
| **Kỹ năng** | Thứ tự số, vui, có thể dùng canvas/SVG |
| **Plan chi tiết** | [connect-dots-plan.md](connect-dots-plan.md) |

---

## 3. Tóm tắt theo ưu tiên triển khai

| Ưu tiên | Game | Lý do |
|---------|------|--------|
| Cao | Đếm và chọn số | Gần counting, tái dùng data |
| Trung bình | Sắp xếp theo thứ tự | Bổ sung thứ tự số/chữ, logic rõ |
| Trung bình | Tìm cái giống / khác | Phân loại, dùng data chữ/số/màu |
| Tùy chọn | Nối chấm theo số | Vui, cần vẽ đường (canvas/SVG) |

---

## 4. Cấu trúc plan từng game

- **Đã có plan chi tiết:**  
  - [memory-match-plan.md](memory-match-plan.md) → Game lật thẻ đôi  
  - [puzzle-plan.md](puzzle-plan.md) → Ghép hình cho bé  
  - [spot-difference-plan.md](spot-difference-plan.md) → Tìm điểm khác biệt  
  - [listen-tap-plan.md](listen-tap-plan.md) → Nghe và chọn đúng  
  - [ordering-plan.md](ordering-plan.md) → Sắp xếp theo thứ tự  
  - [count-match-plan.md](count-match-plan.md) → Đếm và chọn số  
  - [same-different-plan.md](same-different-plan.md) → Tìm cái giống / khác  
  - [connect-dots-plan.md](connect-dots-plan.md) → Nối chấm theo số  
- Tất cả plan trong `plans/` theo format của `memory-match-plan.md`.

---

*Cập nhật lần cuối: theo ngày tạo/sửa file.*
