# Báo Cáo Hoàn Thành Task: Xây Dựng Ứng Dụng CLI Task Manager

**Dự án:** Ứng dụng Quản lý Công việc Dòng Lệnh (CLI Task Manager)
**Mục tiêu:** Phát triển một ứng dụng CLI sử dụng TypeScript để quản lý công việc và nhãn, áp dụng các kiến thức về class, decorator, module và type system.
**Trạng thái:** Hoàn thành.

## 1. Tổng Quan Chức Năng Đã Thực Hiện

Ứng dụng cung cấp các chức năng quản lý công việc và nhãn thông qua giao diện dòng lệnh, với dữ liệu được lưu trữ trong các file `tasks.json` và `tag.json`.

**Chức năng quản lý Công việc:**
*   Liệt kê tất cả công việc.
*   Thêm công việc mới (bao gồm tiêu đề, ưu tiên, mô tả, ngày hết hạn, gán nhãn).
*   Tạo công việc con.
*   Cập nhật thông tin chi tiết của công việc.
*   Xóa công việc.
*   Đánh dấu công việc hoàn thành.
*   Hiển thị danh sách công việc đã hoàn thành.

**Chức năng quản lý Nhãn (Tags):**
*   Liệt kê tất cả nhãn.
*   Thêm nhãn mới.
*   Xóa nhãn.
*   Gán nhãn cho công việc.

**Tiện ích:**
*   Thoát ứng dụng.

## 2. Kiến Trúc và Luồng Hoạt Động

*   **Điểm vào (`main.ts`):** Xử lý giao diện người dùng (menu, nhập liệu) và điều phối các yêu cầu.
*   **Lớp Dịch Vụ (`services/manageServices.ts` - `TaskManager`):** Chứa logic nghiệp vụ chính (thêm, sửa, xóa, liệt kê công việc/nhãn).
*   **Lớp Lưu Trữ Dữ Liệu (`services/dataStorage.ts` - `DataStorage`):** Trừu tượng hóa việc đọc/ghi dữ liệu từ/vào các file JSON.
*   **Mô Hình Dữ Liệu (`model/Task.ts`, `model/Tag.ts`):** Định nghĩa cấu trúc cho `Task` và `Tag`.

**Luồng hoạt động điển hình:**
1.  `main.ts` hiển thị menu, nhận lựa chọn từ người dùng.
2.  `main.ts` gọi phương thức tương ứng trong `TaskManager`.
3.  `TaskManager` xử lý logic, có thể tạo/cập nhật instance của `Task` hoặc `Tag`.
4.  `TaskManager` sử dụng `DataStorage` để đọc/ghi dữ liệu vào file JSON.
5.  Kết quả được trả về `main.ts` để hiển thị.

## 3. Kỹ Thuật TypeScript Được Áp Dụng

### a. Class và Lập Trình Hướng Đối Tượng
*   **`Task` & `Tag`:** Các class này mô hình hóa các thực thể chính. Chúng đóng gói dữ liệu (thuộc tính) và hành vi (phương thức như `toPlainObject`, `static fromPlainObject`, `updateDetails`) liên quan đến công việc và nhãn.
*   **`TaskManager`:** Sử dụng các phương thức `static` để cung cấp các dịch vụ xử lý nghiệp vụ, hoạt động như một service layer.
*   **`DataStorage`:** Đóng vai trò là Data Access Layer, quản lý việc tương tác với file system.

### b. Decorator
*   Một *Method Decorator* là **`@autoSaveLoad(filePath)`** đã được triển khai trong `DataStorage`.
    *   **Chức năng:** Tự động hóa việc đọc dữ liệu từ file JSON trước khi phương thức được gọi và ghi dữ liệu trở lại file sau khi phương thức hoàn tất.
    *   **Lợi ích:** Giảm code lặp, tuân thủ nguyên tắc DRY, và giữ cho logic trong `DataStorage` tập trung vào việc biến đổi dữ liệu.

### c. Module System
*   Dự án được cấu trúc thành các module (file `.ts`) riêng biệt: `main`, `manageServices`, `dataStorage`, `Task`, `Tag`.
*   Sử dụng `import` và `export` để quản lý phụ thuộc, tăng tính module hóa, dễ bảo trì và tái sử dụng.

### d. Type System
*   **Type Aliases (ví dụ: `Priority`):** Định nghĩa các kiểu dữ liệu tùy chỉnh để tăng tính rõ ràng và an toàn kiểu.
*   **Enums (ví dụ: `TaskStatus`):** Sử dụng cho các tập hợp giá trị cố định, cải thiện khả năng đọc và giảm lỗi.
*   **Khai báo kiểu tường minh:** Áp dụng cho biến, tham số hàm và giá trị trả về để tận dụng khả năng kiểm tra kiểu tĩnh của TypeScript và cải thiện chất lượng code.

## 4. Kết Luận

Nhiệm vụ xây dựng ứng dụng CLI Task Manager đã được hoàn thành. Các yêu cầu về chức năng và việc áp dụng các khái niệm cốt lõi của TypeScript như class, decorator, module, và type system đã được đáp ứng. Cấu trúc dự án được tổ chức để đảm bảo tính dễ đọc, dễ bảo trì.