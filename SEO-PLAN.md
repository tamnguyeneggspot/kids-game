# Kế hoạch SEO – kid.aiti9.com (Game cho bé)

**Mục tiêu:** Tăng thứ hạng tìm kiếm trên Google cho các từ khóa liên quan game giáo dục cho trẻ em.

**Thời gian tham khảo:** 4–8 tuần để thấy chuyển biến rõ (tùy từ khóa).

---

## Phase 1: On-page SEO (Ưu tiên cao – làm trước)

| # | Việc cần làm | Trạng thái | Ghi chú |
|---|--------------|------------|--------|
| 1.1 | **Trang chủ (index.html)** | ☑ | |
| | – Đặt `<title>` rõ ràng, có từ khóa, < 60 ký tự | ☑ | VD: "Game cho bé - Học số, chữ cái, màu sắc miễn phí" |
| | – Thêm `<meta name="description">` 130–160 ký tự | ☑ | Mô tả hấp dẫn, có từ khóa |
| | – Đảm bảo `<html lang="vi">` | ☑ | |
| | – Một thẻ `<h1>` duy nhất cho tiêu đề chính | ☑ | VD: "Game giáo dục cho bé" |
| | – Thêm `<h2>` + đoạn mô tả ngắn cho từng game (Số đếm, Chữ cái, Màu sắc) | ☑ | Giúp Google hiểu nội dung từng mục |
| | – Thêm 1 đoạn giới thiệu (2–4 câu) về game giáo dục miễn phí cho bé | ☑ | Có từ khóa: game cho bé, học số, bảng chữ cái, màu sắc |
| 1.2 | **Trang Số đếm (counting.html)** | ☑ | |
| | – Title: "Game số đếm cho bé - Học đếm từ 1 đến 10" (hoặc tương tự) | ☑ | |
| | – Meta description riêng cho trang | ☑ | |
| | – H1/H2 + mô tả ngắn trong trang | ☑ | |
| 1.3 | **Trang Bảng chữ cái (alphabet.html)** | ☑ | |
| | – Title + description + H1/H2 phù hợp | ☑ | Từ khóa: bảng chữ cái, học chữ, game cho bé |
| 1.4 | **Trang Màu sắc (color.html)** | ☑ | Đã có title, description, canonical, OG – kiểm tra lại |
| | – Kiểm tra title/description đã đủ từ khóa chưa | ☑ | Có thể bổ sung "game cho bé 3 tuổi", "mầm non" |
| | – Thêm H1/H2 + đoạn mô tả trong body nếu chưa có | ☑ | |
| 1.5 | **Chung** | ☑ | |
| | – Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | ☑ | Mobile-friendly |
| | – Favicon + ảnh OG (og.png) đã có và đúng URL | ☑ | |
| | – Alt text cho mọi ảnh (nếu có) | ☑ | Không có thẻ img trong HTML |

---

## Phase 2: Kỹ thuật & Cấu trúc (Technical SEO)

| # | Việc cần làm | Trạng thái | Ghi chú |
|---|--------------|------------|--------|
| 2.1 | **URL** | ☑ | |
| | – Ưu tiên URL có từ khóa: /so-dem, /bang-chu-cai, /mau-sac (nếu dùng routing) | ☑ | Đang dùng .html, giữ nguyên |
| | – Canonical: mỗi trang có `<link rel="canonical" href="...">` trỏ đúng URL thật | ☑ | Đã kiểm tra, tất cả đúng |
| 2.2 | **Tốc độ** | ⚠ | |
| | – Nén ảnh (WebP/PNG tối ưu), giảm dung lượng nhạc nền nếu lớn | ⚠ | Cần kiểm tra thủ công khi deploy |
| | – Minify CSS/JS (hoặc dùng build step) nếu nhiều file | ⚠ | Có thể dùng build tool khi cần |
| 2.3 | **Sitemap & robots** | ☑ | |
| | – Tạo `sitemap.xml` liệt kê: trang chủ + counting, alphabet, color | ☑ | |
| | – Tạo `robots.txt`: Allow /, trỏ Sitemap: https://kid.aiti9.com/sitemap.xml | ☑ | |

---

## Phase 3: Nội dung & Từ khóa (Content)

| # | Việc cần làm | Trạng thái | Ghi chú |
|---|--------------|------------|--------|
| 3.1 | **Từ khóa mục tiêu** (đưa vào title, description, H1/H2, đoạn văn) | ☑ | |
| | – Trang chủ: "game cho bé", "game giáo dục cho trẻ em", "game học số chữ màu" | ☑ | Đã có trong title, description, H1 |
| | – Số đếm: "game số đếm cho bé", "học đếm cho bé", "game đếm số" | ☑ | Đã có trong title, H1, keywords |
| | – Chữ cái: "bảng chữ cái cho bé", "game học chữ", "học chữ cái" | ☑ | Đã có trong title, H1, keywords |
| | – Màu sắc: "game màu sắc cho bé", "học màu cho bé", "nhận biết màu" | ☑ | Đã có trong title, H1, keywords |
| 3.2 | **Mở rộng từ khóa dài** (tùy chọn) | ☑ | |
| | – "game cho bé 3 tuổi", "game mầm non", "trò chơi giáo dục miễn phí" | ☑ | Đã có trong descriptions, không nhồi nhét |

---

## Phase 4: Google & Theo dõi

| # | Việc cần làm | Trạng thái | Ghi chú |
|---|--------------|------------|--------|
| 4.1 | **Google Search Console** | ☐ | |
| | – Thêm property https://kid.aiti9.com/ | ☐ | search.google.com/search-console |
| | – Xác minh (DNS hoặc file HTML) | ☐ | |
| | – Gửi Sitemap URL | ☐ | |
| | – Dùng "Kiểm tra URL" cho trang chủ + 3 trang game | ☐ | Yêu cầu lập chỉ mục |
| 4.2 | **Theo dõi** | ☐ | |
| | – Xem "Hiệu suất" (truy vấn, vị trí, CTR) mỗi 1–2 tuần | ☐ | |
| | – Sửa title/description theo truy vấn thực tế người dùng tìm | ☐ | |

---

## Phase 5: Off-page & Lan tỏa (Tùy chọn nhưng nên làm)

| # | Việc cần làm | Trạng thái | Ghi chú |
|---|--------------|------------|--------|
| 5.1 | **Backlink & chia sẻ** | ☐ | |
| | – Chia sẻ link trên Facebook/fanpage (cha mẹ, giáo dục) | ☐ | |
| | – Đăng trong group phụ huynh, giáo viên (kèm mô tả rõ, không spam) | ☐ | |
| | – Nếu có blog/website khác: đặt link đến kid.aiti9.com | ☐ | |

---

## Thứ tự thực hiện gợi ý

1. **Tuần 1:** Phase 1 (On-page) – hoàn thành title, description, H1/H2, đoạn giới thiệu cho tất cả trang.
2. **Tuần 1–2:** Phase 2 – sitemap.xml, robots.txt, kiểm tra canonical, tối ưu ảnh/nhạc.
3. **Tuần 2:** Phase 4 – đăng ký Search Console, gửi sitemap, kiểm tra URL.
4. **Tuần 3–4:** Phase 3 – rà soát từ khóa, chỉnh lại title/description nếu cần.
5. **Liên tục:** Phase 5 – chia sẻ, backlink khi có cơ hội; theo dõi Search Console.

---

## Ghi chú

- **Đã có sẵn** (ví dụ color.html): lang="vi", viewport, title, description, canonical, Open Graph, Twitter card – có thể dùng làm mẫu cho các trang khác.
- **Không nên:** nhồi nhét từ khóa, copy nội dung từ site khác, mua backlink hàng loạt.
- Cập nhật cột "Trạng thái" (☐ → ☑) khi hoàn thành từng mục.
