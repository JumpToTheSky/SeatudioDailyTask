const { danhSachHocSinh } = require('./StudentList');

function hienThiDanhSachHocSinh() {
    console.log('\nDanh sách học sinh :');
    danhSachHocSinh.forEach((student, i) => {
        console.log(`SV ${i + 1}:`);
        student.hienThiThongTin();
    });
}

module.exports = { hienThiDanhSachHocSinh };