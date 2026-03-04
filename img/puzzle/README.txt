Hình ghép puzzle — Con vật / bất kỳ ảnh nào
============================================

Để game "Ghép hình cho bé" dùng ảnh con vật (hoặc ảnh khác), làm một trong hai cách:

CÁCH 1 — Dùng tên file có sẵn (đơn giản nhất)
----------------------------------------------
Đặt ảnh vào folder này (KidsGame/img/puzzle/) với đúng tên file:

  meo.jpg   → Mèo
  cho.jpg   → Chó
  chim.jpg  → Chim
  tho.jpg   → Thỏ
  voi.jpg   → Voi

Định dạng: JPG hoặc PNG đều được. Nếu dùng PNG, đổi trong file js/puzzle/shared.js:
  url: 'img/puzzle/meo.png'  (thay .jpg bằng .png)

CÁCH 2 — Thêm hình mới (tên tùy ý)
-----------------------------------
1. Cho ảnh vào folder này, ví dụ: img/puzzle/heo.jpg
2. Mở file: KidsGame/js/puzzle/shared.js
3. Trong mảng PUZZLE_IMAGES, thêm một dòng:

   { id: 'heo', name: 'Heo', type: 'url', url: 'img/puzzle/heo.jpg' },

4. Lưu file và tải lại trang puzzle.

Lưu ý:
- Ảnh nên vuông hoặc gần vuông để khi cắt 2x2, 2x3, 3x3 trông đẹp.
- Kích thước gợi ý: 300x300 px trở lên (ảnh to sẽ tự co trong ô).
