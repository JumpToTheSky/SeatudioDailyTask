const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const { hienThiDanhSachHocSinh } = require('./DisplayStudent');
const { danhSachHocSinh, saveDanhSachHocSinh, clearDanhSachHocSinh } = require('./StudentList');
const { Student } = require('./StoreStudent');
const { timKiemHocSinhTheoTen } = require('./SearchStudentByName');
const { hienThiThongKe } = require('./DisplayStatics');
const { backupDanhSachHocSinh, hienThiBackupDanhSachHocSinh } = require('./BackupStudentList');

function nhapThongTin(index, soLuong, callback) {
    console.log(`\n--- Nhập thông tin học sinh thứ ${index + 1} ---`);
    rl.question('Họ và tên: ', (name) => {
        rl.question('Tuổi: ', (age) => {
            rl.question('Mã học sinh: ', (id) => {
                rl.question('Điểm: ', (grade) => {
                    const student = new Student(id, name, parseInt(age), grade);
                    danhSachHocSinh.push(student);
                    
                    index++;
                    if (index < soLuong) {
                        nhapThongTin(index, soLuong, callback);
                    } else {
                        saveDanhSachHocSinh(); // Save after adding students
                        if (callback) callback();
                    }
                });
            });
        });
    });
}

function themHocSinhMoi(index, soLuong, callback) {
    console.log(`\n--- Nhập thông tin học sinh mới thứ ${index + 1} ---`);
    rl.question('Họ và tên: ', (name) => {
        rl.question('Tuổi: ', (age) => {
            rl.question('Mã học sinh: ', (id) => {
                rl.question('Điểm: ', (grade) => {
                    const student = new Student(id, name, parseInt(age), grade);
                    danhSachHocSinh.push(student);

                    index++;
                    if (index < soLuong) {
                        themHocSinhMoi(index, soLuong, callback);
                    } else {
                        saveDanhSachHocSinh(); // Save after adding new students
                        if (callback) callback();
                    }
                });
            });
        });
    });
}

function nhapSoLuongHocSinhMoi(callback) {
    rl.question('Nhập số lượng học sinh mới cần thêm: ', (so) => {
        const soLuong = parseInt(so);
        if (isNaN(soLuong) || soLuong <= 0) {
            console.log('Số lượng không hợp lệ.');
            if (callback) callback();
        } else {
            themHocSinhMoi(0, soLuong, callback);
        }
    });
}


function loadDanhSachHocSinh() {
    try {
        const data = fs.readFileSync('./StudentList.json', 'utf8');
        const students = JSON.parse(data);
        students.forEach(studentData => {
            const student = new Student(studentData.id, studentData.name, studentData.age, studentData.grade);
            danhSachHocSinh.push(student);
        });
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
    console.log('9. Xoá sạch danh sách học sinh');
    rl.question('Chọn chức năng (1-9): ', (choice) => {
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
                hienThiDanhSachHocSinh();
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
            case '9':
                rl.question('Bạn có chắc muốn xoá sạch danh sách học sinh? (y/n): ', (confirm) => {
                    if (confirm.trim().toLowerCase() === 'y') {
                        clearDanhSachHocSinh();
                    }
                    hienThiMenu();
                });
                break;
            default:
                console.log('Lựa chọn không hợp lệ.');
                hienThiMenu();
        }
    });
}

loadDanhSachHocSinh();
hienThiMenu();



