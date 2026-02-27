# Hướng dẫn thêm trang mới vào SEO

Khi bạn thêm một trang HTML mới (ví dụ: `shapes.html`, `animals.html`), làm theo các bước sau:

## Bước 1: Cập nhật sitemap.xml

1. Mở file `sitemap.xml`
2. Thêm URL mới vào trong thẻ `<urlset>`, ví dụ:

```xml
<url>
  <loc>https://kid.aiti9.com/shapes.html</loc>
  <lastmod>2026-02-27</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

3. Cập nhật `<lastmod>` với ngày hiện tại
4. Upload file `sitemap.xml` lên server

## Bước 2: Chọn một trong hai cách

### Cách A: Để Google tự động crawl (Khuyến nghị)

**Ưu điểm:** Tự động, không cần làm gì thêm  
**Nhược điểm:** Chậm hơn (1-2 tuần)

**Làm gì:**
- Chỉ cần cập nhật sitemap.xml và upload lên server
- Google sẽ tự động phát hiện URL mới trong sitemap và crawl
- Không cần làm gì thêm

**Khi nào dùng:** 
- Trang không quá quan trọng
- Không cần index ngay lập tức
- Muốn tiết kiệm thời gian

---

### Cách B: Request indexing thủ công (Nhanh hơn)

**Ưu điểm:** Google index nhanh hơn (vài giờ đến vài ngày)  
**Nhược điểm:** Phải làm thủ công mỗi trang mới

**Làm gì:**
1. Vào Google Search Console: https://search.google.com/search-console
2. Vào menu **"URL Inspection"** (thanh tìm kiếm trên cùng)
3. Nhập URL trang mới: `https://kid.aiti9.com/shapes.html`
4. Nhấn Enter
5. Nhấn nút **"Request indexing"** (Yêu cầu lập chỉ mục)
6. Đợi Google xử lý

**Khi nào dùng:**
- Trang quan trọng, cần index ngay
- Trang có nội dung mới, muốn xuất hiện trên Google sớm
- Có thời gian để làm thủ công

---

## Bước 3: Kiểm tra trang mới có SEO đầy đủ chưa

Đảm bảo trang HTML mới có:

- ✅ `<title>` < 60 ký tự, có từ khóa
- ✅ `<meta name="description">` 130-160 ký tự
- ✅ `<meta name="viewport">` cho mobile
- ✅ `<link rel="canonical">` trỏ đúng URL
- ✅ `<html lang="vi">`
- ✅ Một thẻ `<h1>` duy nhất với từ khóa
- ✅ `<h2>` + đoạn mô tả ngắn (nếu cần)
- ✅ Open Graph tags (og:title, og:description, og:image)
- ✅ Twitter Card tags

**Ví dụ cấu trúc:**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game hình dạng cho bé - Học hình học</title>
  <meta name="description" content="Game hình dạng cho bé: học hình tròn, vuông, tam giác. Nhận biết hình học vui nhộn, miễn phí cho mầm non.">
  <link rel="canonical" href="https://kid.aiti9.com/shapes.html">
  <!-- Open Graph tags -->
  <!-- ... -->
</head>
<body>
  <header>
    <h1>Game hình dạng cho bé</h1>
    <p class="page-intro">Mô tả ngắn về game...</p>
  </header>
  <!-- Nội dung game -->
</body>
</html>
```

## Bước 4: Cập nhật robots.txt (nếu cần)

Nếu trang mới không cần bị chặn, không cần làm gì.  
File `robots.txt` hiện tại đã cho phép tất cả: `Allow: /`

## Tóm tắt quy trình

**Khi thêm trang mới:**

1. ✅ Tạo file HTML với SEO đầy đủ
2. ✅ Thêm URL vào `sitemap.xml`
3. ✅ Upload `sitemap.xml` lên server
4. ⚠️ (Tùy chọn) Request indexing trong Search Console nếu muốn nhanh

**Lưu ý:**
- Google sẽ tự động crawl sitemap mỗi vài ngày/tuần
- Không cần request indexing cho mọi trang mới, chỉ trang quan trọng
- Sau khi request indexing, đợi vài giờ đến vài ngày để Google xử lý
