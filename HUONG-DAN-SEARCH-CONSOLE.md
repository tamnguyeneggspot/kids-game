# Hướng dẫn thiết lập Google Search Console

## Bước 1: Đăng ký Google Search Console

1. Truy cập: https://search.google.com/search-console
2. Đăng nhập bằng tài khoản Google của bạn
3. Nhấn nút **"Thêm property"** (Add property)
4. Chọn **"URL prefix"** và nhập: `https://kid.aiti9.com`
5. Nhấn **"Tiếp tục"** (Continue)

## Bước 2: Xác minh quyền sở hữu website

Có 3 cách xác minh (chọn 1 cách dễ nhất):

### Cách 1: Xác minh bằng file HTML (Khuyên dùng)
1. Google sẽ cung cấp một file HTML (ví dụ: `google1234567890.html`)
2. Tải file này về máy
3. Upload file lên thư mục gốc của website (cùng cấp với `index.html`)
4. Truy cập: `https://kid.aiti9.com/google1234567890.html` để kiểm tra file đã upload chưa
5. Quay lại Search Console và nhấn **"Xác minh"** (Verify)

### Cách 2: Xác minh bằng DNS (Nếu bạn có quyền chỉnh DNS)
1. Chọn phương thức **"DNS"**
2. Google sẽ cung cấp một bản ghi TXT
3. Thêm bản ghi TXT này vào DNS của domain
4. Đợi vài phút để DNS cập nhật
5. Nhấn **"Xác minh"** trong Search Console

### Cách 3: Xác minh bằng thẻ HTML (Nếu bạn có quyền chỉnh HTML)
1. Google sẽ cung cấp một thẻ `<meta>` 
2. Thêm thẻ này vào phần `<head>` của file `index.html`
3. Upload lại file lên server
4. Nhấn **"Xác minh"** trong Search Console

## Bước 3: Gửi Sitemap

1. Sau khi xác minh thành công, vào menu bên trái
2. Chọn **"Sitemaps"** (Bản đồ trang web)
3. Trong ô "Nhập URL sitemap", nhập: `sitemap.xml`
4. Nhấn **"Gửi"** (Submit)
5. Đợi vài phút, Google sẽ hiển thị trạng thái "Đã thành công" (Success)

**Lưu ý:** Đảm bảo file `sitemap.xml` đã được upload lên server tại: `https://kid.aiti9.com/sitemap.xml`

## Bước 4: Yêu cầu lập chỉ mục (Request Indexing)

Sau khi gửi sitemap, yêu cầu Google index từng trang quan trọng:

### Trang chủ:
1. Vào menu **"URL Inspection"** (Kiểm tra URL) ở thanh tìm kiếm trên cùng
2. Nhập URL: `https://kid.aiti9.com/`
3. Nhấn Enter
4. Nhấn nút **"Request indexing"** (Yêu cầu lập chỉ mục)
5. Đợi Google xử lý (có thể mất vài phút đến vài giờ)

### Trang Số đếm:
1. Nhập URL: `https://kid.aiti9.com/counting.html`
2. Nhấn **"Request indexing"**

### Trang Bảng chữ cái:
1. Nhập URL: `https://kid.aiti9.com/alphabet.html`
2. Nhấn **"Request indexing"**

### Trang Màu sắc:
1. Nhập URL: `https://kid.aiti9.com/color.html`
2. Nhấn **"Request indexing"**

## Bước 5: Kiểm tra robots.txt

1. Vào menu **"Settings"** → **"robots.txt Tester"**
2. Kiểm tra xem Google có đọc được `robots.txt` không
3. Đảm bảo file `robots.txt` đã được upload lên server tại: `https://kid.aiti9.com/robots.txt`

## Bước 6: Theo dõi hiệu suất (Sau 1-2 tuần)

1. Vào menu **"Performance"** (Hiệu suất)
2. Xem các chỉ số:
   - **Queries** (Truy vấn): Từ khóa nào người dùng tìm thấy website
   - **Position** (Vị trí): Vị trí trung bình trên Google
   - **CTR** (Click-through rate): Tỷ lệ click
   - **Impressions** (Lượt hiển thị): Số lần xuất hiện trên Google

3. Dựa vào dữ liệu này để:
   - Tối ưu title/description cho từ khóa có nhiều impressions nhưng CTR thấp
   - Tập trung vào từ khóa đang có vị trí tốt để cải thiện thêm

## Lưu ý quan trọng

- **Thời gian:** Sau khi submit sitemap và request indexing, phải đợi 1-2 tuần để Google index và hiển thị dữ liệu
- **Kiên nhẫn:** SEO là quá trình dài hạn, không thể tăng rank ngay lập tức
- **Cập nhật thường xuyên:** Kiểm tra Search Console mỗi 1-2 tuần để theo dõi tiến độ

## Troubleshooting

### Nếu không xác minh được:
- Kiểm tra lại file HTML/DNS đã đúng chưa
- Đảm bảo website đã được deploy và có thể truy cập công khai
- Thử phương thức xác minh khác

### Nếu sitemap không được chấp nhận:
- Kiểm tra file `sitemap.xml` có đúng định dạng không
- Đảm bảo URL trong sitemap là HTTPS và đúng domain
- Kiểm tra file có thể truy cập công khai tại `https://kid.aiti9.com/sitemap.xml`

### Nếu URL không được index:
- Đảm bảo trang không bị chặn trong robots.txt
- Kiểm tra trang có nội dung chất lượng không
- Đợi thêm thời gian (có thể mất vài ngày đến vài tuần)
