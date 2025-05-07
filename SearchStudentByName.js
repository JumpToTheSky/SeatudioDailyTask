const { danhSachHocSinh } = require('./StudentList');

function timKiemHocSinhTheoTen(name) {
    return danhSachHocSinh.filter(student => student.name.toLowerCase().includes(name.toLowerCase()));
}

module.exports = { timKiemHocSinhTheoTen };
