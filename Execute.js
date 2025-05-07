const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const { hienThiDanhSachHocSinh } = require('./DisplayStudent');
const { danhSachHocSinh } = require('./StudentList');
const { Student, nhapThongTin } = require('./StoreStudent');
const { timKiemHocSinhTheoTen } = require('./SearchStudent');
const { hienThiThongKe } = require('./DisplayStatics');
const { nhapSoLuongHocSinhMoi } = require('./AddStudent');

function hienThiMenu() {
    console.log('\n--- Menu ---');
    console.log('1. Nhập thông tin học sinh');
    console.log('2. Hiển thị danh sách học sinh');
    console.log('3. Tìm kiếm học sinh theo tên');
    console.log('4. Hiển thị thống kê');
    console.log('5. Thêm học sinh mới');
    console.log('6. Thoát');
    rl.question('Chọn chức năng (1-6): ', (choice) => {
        switch (choice) {
            case '1':
                rl.question('Nhập số lượng học sinh: ', (so) => {
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
                rl.question('Nhập tên học sinh cần tìm: ', (name) => {
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
                nhapSoLuongHocSinhMoi();
                hienThiMenu();
                break;
            case '6':
                rl.close();
                break;
            default:
                console.log('Lựa chọn không hợp lệ.');
                hienThiMenu();
        }
    });
}

hienThiMenu();



