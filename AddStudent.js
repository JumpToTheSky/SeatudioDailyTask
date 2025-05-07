const readline = require('readline');
const { danhSachHocSinh } = require('./StudentList');
const { Student } = require('./StoreStudent');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function themHocSinhMoi(index, soLuong) {
    console.log(`\n--- Nhập thông tin học sinh mới thứ ${index + 1} ---`);
    rl.question('Họ và tên: ', (name) => {
        rl.question('Tuổi: ', (age) => {
            rl.question('Mã học sinh: ', (id) => {
                rl.question('Lớp: ', (grade) => {
                    const student = new Student(id, name, parseInt(age), grade);
                    danhSachHocSinh.push(student);

                    index++;
                    if (index < soLuong) {
                        themHocSinhMoi(index, soLuong);
                    } else {
                        console.log('\nDanh sách học sinh sau khi thêm:');
                        danhSachHocSinh.forEach(student => student.hienThiThongTin());
                        rl.close();
                    }
                });
            });
        });
    });
}

function nhapSoLuongHocSinhMoi() {
    rl.question('Nhập số lượng học sinh mới cần thêm: ', (so) => {
        const soLuong = parseInt(so);
        if (isNaN(soLuong) || soLuong <= 0) {
            console.log('Số lượng không hợp lệ.');
            rl.close();
        } else {
            themHocSinhMoi(0, soLuong);
        }
    });
}

module.exports = { nhapSoLuongHocSinhMoi };
