const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const { hienThiDanhSachHocSinh } = require('./DisplayStudent');
const { danhSachHocSinh } = require('./StudentList');
const { Student, nhapThongTin } = require('./StoreStudent');
const { timKiemHocSinhTheoTen } = require('./SearchStudent');

let soLuong = 0;
let index = 0;

rl.question('Nhập số lượng học sinh: ', (so) => {
    soLuong = parseInt(so);
    if (isNaN(soLuong) || soLuong <= 0) {
        console.log('Số lượng không hợp lệ.');
        rl.close();
    } else {
        nhapThongTin(index);
        hienThiDanhSachHocSinh(danhSachHocSinh);

        rl.question('\nNhập tên học sinh cần tìm: ', (name) => {
            const ketQua = timKiemHocSinhTheoTen(name);
            if (ketQua.length > 0) {
                console.log('\nKết quả tìm kiếm:');
                ketQua.forEach(student => student.hienThiThongTin());
            } else {
                console.log('Không tìm thấy học sinh nào.');
            }
            rl.close();
        });
    }
});



