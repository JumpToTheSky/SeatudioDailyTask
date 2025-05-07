const fs = require('fs');

const danhSachHocSinh = [];

function saveDanhSachHocSinh() {
    try {
        fs.writeFileSync('./StudentList.json', JSON.stringify(danhSachHocSinh, null, 2), 'utf8');
        console.log('Danh sách học sinh đã được lưu.');
    } catch (err) {
        console.log('Không thể lưu danh sách học sinh.');
    }
}

module.exports = { danhSachHocSinh, saveDanhSachHocSinh };