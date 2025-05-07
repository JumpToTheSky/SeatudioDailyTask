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

function clearDanhSachHocSinh() {
    try {
        danhSachHocSinh.length = 0; // Clear the in-memory list
        fs.writeFileSync('./StudentList.json', JSON.stringify(danhSachHocSinh, null, 2), 'utf8'); // Clear the file
        console.log('Danh sách học sinh đã được xoá sạch.');
    } catch (err) {
        console.log('Không thể xoá danh sách học sinh.');
    }
}

module.exports = { danhSachHocSinh, saveDanhSachHocSinh, clearDanhSachHocSinh };