const fs = require('fs');
const { danhSachHocSinh } = require('./StudentList');

function backupDanhSachHocSinh() {
    try {
        fs.writeFileSync('./backup.json', JSON.stringify(danhSachHocSinh, null, 2), 'utf8');
        console.log('Danh sách học sinh đã được sao lưu vào file backup.json.');
    } catch (err) {
        console.log('Không thể sao lưu danh sách học sinh.');
    }
}

function hienThiBackupDanhSachHocSinh() {
    try {
        const data = fs.readFileSync('./backup.json', 'utf8');
        const backupList = JSON.parse(data);
        console.log('\n--- Danh sách học sinh từ bản sao lưu ---');
        backupList.forEach(student => {
            console.log(`Họ tên: ${student.name}, Tuổi: ${student.age}, Mã học sinh: ${student.id}, Điểm: ${student.grade}`);
        });
    } catch (err) {
        console.log('Không thể đọc file backup.json hoặc file không tồn tại.');
    }
}

module.exports = { backupDanhSachHocSinh, hienThiBackupDanhSachHocSinh };
