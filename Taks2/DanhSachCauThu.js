const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'DanhSachCauThu.json');

class CauThu {
    constructor(id, ten, vaiTro, capBaiTrung = null, khongHop = null) {
        this.id = id;
        this.ten = ten;
        this.vaiTro = vaiTro; 
        this.capBaiTrung = capBaiTrung;
        this.khongHop = khongHop;
    }

    hienThiThongTin() {
        console.log(`ID: ${this.id}, Tên: ${this.ten}, Vị trí: ${this.vaiTro}, Không hợp: ${this.khongHop || 'Không có'}, Cặp bài trùng: ${this.capBaiTrung || 'Không có'}`);
    }
}

function taoDanhSachCauThu() {
    const danhSach = [];
    const vaiTro = ['nongcot', 'dubi', 'binhthuong', 'atchubai'];
    let countNongcot = 0;
    let countDubi = 0;
    let countBinhthuong = 0;
    let countAtchubai = 0;

    for (let i = 1; i <= 40; i++) {
        let role;
        while (true) {
            role = vaiTro[Math.floor(Math.random() * 4)];
            if (role === 'nongcot' && countNongcot < 5) {
                countNongcot++;
                break;
            }
            if (role === 'dubi' && countDubi < 5) {
                countDubi++;
                break;
            }
            if (role === 'binhthuong' && countBinhthuong < 29) {
                countBinhthuong++;
                break;
            }
            if (role === 'atchubai' && countAtchubai < 1) {
                countAtchubai++;
                break;
            }
        }

        danhSach.push(new CauThu(i, `Cauthu${i}`, role));
    }

    saveDanhSachToFile(danhSach);
    return danhSach;
}

function tachDanhSach(danhSach) {
    const danhSachNongcot = danhSach.filter(cauThu => cauThu.vaiTro === 'nongcot');
    const danhSachDubi = danhSach.filter(cauThu => cauThu.vaiTro === 'dubi');
    return { danhSachNongcot, danhSachDubi };
}

function saveDanhSachToFile(danhSach) {
    fs.writeFileSync(filePath, JSON.stringify(danhSach, null, 2), 'utf-8');
}

function loadDanhSachFromFile() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data.trim() && data.trim() !== '[]') { // Kiểm tra nếu file không rỗng và không chỉ chứa []
            const danhSach = JSON.parse(data);
            return danhSach.map(cauThu => new CauThu(cauThu.id, cauThu.ten, cauThu.vaiTro, cauThu.capBaiTrung, cauThu.khongHop));
        }
    }
    return taoDanhSachCauThu(); 
}
const danhSachCauThu = loadDanhSachFromFile();
const { danhSachNongcot, danhSachDubi } = tachDanhSach(danhSachCauThu);

module.exports = { CauThu, loadDanhSachFromFile, saveDanhSachToFile, danhSachNongcot, danhSachDubi };
/* danhSachCauThu.forEach((cauThu, i) => {
    console.log(`Cầu thủ ${i + 1}:`);
    cauThu.hienThiThongTin();
}); */
