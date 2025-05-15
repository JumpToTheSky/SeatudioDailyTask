# Báo Cáo Hoàn Thành Task: Xây Dựng Ứng Dụng CLI Library Management

**Dự án:** Ứng dụng Quản lý Thư Viện Dòng Lệnh (CLI Library Management)  
**Mục tiêu:** Phát triển một ứng dụng CLI sử dụng TypeScript để quản lý sách, người dùng và các bản ghi mượn/trả sách, áp dụng các kiến thức về class, module, và type system.  
**Trạng thái:** Hoàn thành.

## 1. Tổng Quan Chức Năng Đã Thực Hiện

Ứng dụng cung cấp các chức năng quản lý sách, người dùng và bản ghi mượn/trả sách thông qua giao diện dòng lệnh, với dữ liệu được lưu trữ trong các file JSON.

### Chức năng quản lý Sách:
*   Liệt kê tất cả sách.
*   Thêm sách mới (bao gồm tiêu đề, tác giả, thể loại, năm xuất bản, số lượng bản sao, v.v.).
*   Cập nhật số lượng bản sao của sách.
*   Xóa sách khỏi thư viện.
*   Tìm kiếm sách theo tiêu đề hoặc thể loại.
*   Hiển thị danh sách tất cả các thể loại sách.

### Chức năng quản lý Người dùng:
*   Liệt kê tất cả người dùng.
*   Thêm người dùng mới (bao gồm tên, email, số điện thoại, địa chỉ).
*   Xóa người dùng.

### Chức năng quản lý Mượn/Trả Sách:
*   Mượn sách (người dùng mượn sách từ thư viện).
*   Trả sách (người dùng trả sách đã mượn).
*   Hiển thị danh sách tất cả các bản ghi mượn sách.
*   Kiểm tra các bản ghi mượn sách quá hạn (chưa trả sau 1 tuần).
*   Kiểm tra các bản ghi trả sách muộn (trả sau 1 tuần).

### Tiện ích:
*   Thoát ứng dụng.

## 2. Kiến Trúc và Luồng Hoạt Động

*   **Điểm vào (`library.ts`):** Xử lý giao diện người dùng (menu, nhập liệu) và điều phối các yêu cầu.
*   **Lớp Dịch Vụ (`module.ts`):** Chứa logic nghiệp vụ chính (mượn, trả sách, lưu trữ dữ liệu).
*   **Quản lý Sách (`books.ts`):** Xử lý các chức năng liên quan đến sách.
*   **Quản lý Người dùng (`users.ts`):** Xử lý các chức năng liên quan đến người dùng.
*   **Quản lý Dữ liệu (`module.ts`):** Đọc/ghi dữ liệu từ/vào các file JSON.

**Luồng hoạt động điển hình:**
1.  `library.ts` hiển thị menu, nhận lựa chọn từ người dùng.
2.  `library.ts` gọi phương thức tương ứng trong các module (`books.ts`, `users.ts`, `module.ts`).
3.  Các module xử lý logic, cập nhật dữ liệu và lưu trữ vào file JSON.
4.  Kết quả được trả về `library.ts` để hiển thị.

## 3. Kỹ Thuật TypeScript Được Áp Dụng

### a. Interface
*   **`User`, `Book`, `BorrowedBook`:** Các interface được sử dụng để định nghĩa cấu trúc dữ liệu cho người dùng, sách và bản ghi mượn/trả sách. Điều này đảm bảo rằng dữ liệu luôn tuân thủ một cấu trúc nhất định, giúp giảm lỗi và tăng tính rõ ràng.
*   **Ví dụ:**
    ```typescript
    export interface User {
        user_id: number;
        name: string;
        email: string;
        phone: string;
        address: string;
    }
    ```

### b. Generic Type
*   **Hàm tái sử dụng:** Các hàm như `loadDataFromJSON` và `saveDataToJSON` sử dụng generic types để xử lý dữ liệu của nhiều loại khác nhau (sách, người dùng, bản ghi mượn/trả).
*   **Lợi ích:** Tăng tính tái sử dụng và đảm bảo an toàn kiểu.
*   **Ví dụ:**
    ```typescript
    export async function loadDataFromJSON<T>(url: string): Promise<T[]> {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return data as T[];
    }
    ```

### c. Utility Type
*   **`Omit`:** Sử dụng để tạo kiểu mới bằng cách loại bỏ một số thuộc tính từ kiểu gốc. Ví dụ, khi thêm người dùng mới, `Omit<User, 'user_id'>` được sử dụng để loại bỏ `user_id` vì nó sẽ được tự động tạo.
*   **Ví dụ:**
    ```typescript
    export function addUser(users: User[], newUserDetails: Omit<User, 'user_id'>): User[] {
        const newUser: User = { ...newUserDetails, user_id: maxId + 1 };
        return [...users, newUser];
    }
    ```

### d. Type Assertion
*   **Chuyển đổi kiểu:** Sử dụng để chỉ định kiểu dữ liệu khi TypeScript không thể tự suy luận chính xác. Ví dụ, khi đọc dữ liệu từ file JSON, dữ liệu được ép kiểu thành mảng của kiểu cụ thể.
*   **Ví dụ:**
    ```typescript
    const data = JSON.parse(fileContent) as T[];
    ```

## 4. Kết Luận

Nhiệm vụ xây dựng ứng dụng CLI Library Management đã được hoàn thành. Các yêu cầu về chức năng và việc áp dụng các khái niệm cốt lõi của TypeScript như interface, utility type, generic type, và type assertion đã được đáp ứng. Cấu trúc dự án được tổ chức để đảm bảo tính dễ đọc, dễ bảo trì.
