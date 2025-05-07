const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const { hienThiDanhSachHocSinh } = require('./DisplayStudent');
const { danhSachHocSinh } = require('./StudentList');
const { Student, nhapThongTin } = require('./StoreStudent');
const { timKiemHocSinhTheoTen } = require('./SearchStudentByName');
const { hienThiThongKe } = require('./DisplayStatics');
const { nhapSoLuongHocSinhMoi } = require('./AddStudent');
const { backupDanhSachHocSinh, hienThiBackupDanhSachHocSinh } = require('./BackupStudentList');

function loadDanhSachHocSinh() {
    try {
        const data = fs.readFileSync('./StudentList.json', 'utf8');
        const students = JSON.parse(data);
        students.forEach(student => danhSachHocSinh.push(student));
        console.log('Dữ liệu danh sách học sinh đã được tải.');
    } catch (err) {
        console.log('Không thể tải dữ liệu danh sách học sinh. Tạo danh sách mới.');
    }
}

function hienThiMenu() {
    console.log('\n--- Menu ---');
    console.log('1. Nhập thông tin học sinh');
    console.log('2. Hiển thị danh sách học sinh');
    console.log('3. Tìm kiếm học sinh theo tên');
    console.log('4. Hiển thị thống kê');
    console.log('5. Thêm học sinh mới');
    console.log('6. Tạo bản sao lưu danh sách học sinh');
    console.log('7. Hiển thị danh sách từ bản sao lưu');
    console.log('8. Thoát');
    rl.question('Chọn chức năng (1-8): ', (choice) => {
        switch (choice) {
            case '1':
                rl.question('Nhập số lượng học sinh (hoặc nhập "EXIT" để quay lại): ', (so) => {
                    if (so.trim().toUpperCase() === 'EXIT') {
                        hienThiMenu();
                        return;
                    }
                    const soLuong = parseInt(so);
                    if (isNaN(soLuong) || soLuong <= 0) {
                        console.log('Số lượng không hợp lệ.');
                        hienThiMenu();
                    } else {
                        nhapThongTin(0, soLuong, hienThiMenu);
                    }
                });
                break;
            case '2':
                hienThiDanhSachHocSinh(danhSachHocSinh);
                hienThiMenu();
                break;
            case '3':
                rl.question('Nhập tên học sinh cần tìm (hoặc nhập "EXIT" để quay lại): ', (name) => {
                    if (name.trim().toUpperCase() === 'EXIT') {
                        hienThiMenu();
                        return;
                    }
                    const ketQua = timKiemHocSinhTheoTen(name);
                    if (ketQua.length > 0) {
                        console.log('\nKết quả tìm kiếm:');
                        ketQua.forEach(student => student.hienThiThongTin());
                    } else {
                        console.log('Không tìm thấy học sinh nào.');
                    }
                    hienThiMenu();
                });
                break;
            case '4':
                hienThiThongKe();
                hienThiMenu();
                break;
            case '5':
                rl.question('Nhập số lượng học sinh mới (hoặc nhập "EXIT" để quay lại): ', (so) => {
                    if (so.trim().toUpperCase() === 'EXIT') {
                        hienThiMenu();
                        return;
                    }
                    const soLuong = parseInt(so);
                    if (isNaN(soLuong) || soLuong <= 0) {
                        console.log('Số lượng không hợp lệ.');
                        hienThiMenu();
                    } else {
                        nhapSoLuongHocSinhMoi(soLuong, hienThiMenu);
                    }
                });
                break;
            case '6':
                rl.question('Bạn có chắc muốn sao lưu danh sách học sinh? (y/n): ', (confirm) => {
                    if (confirm.trim().toLowerCase() === 'y') {
                        backupDanhSachHocSinh();
                    }
                    hienThiMenu();
                });
                break;
            case '7':
                hienThiBackupDanhSachHocSinh();
                hienThiMenu();
                break;
            case '8':
                rl.close();
                break;
            default:
                console.log('Lựa chọn không hợp lệ.');
                hienThiMenu();
        }
    });
}

loadDanhSachHocSinh();
hienThiMenu();



