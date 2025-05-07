function hienThiDanhSachHocSinh(danhSachHocSinh) {
    console.log('\nDanh sách học sinh :');
    danhSachHocSinh.forEach((student, i) => {
        console.log(`SV ${i + 1}:`);
        student.hienThiThongTin();
    });
}

module.exports = { hienThiDanhSachHocSinh };