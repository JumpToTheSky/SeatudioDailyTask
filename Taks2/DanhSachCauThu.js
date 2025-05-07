class CauThu {
    constructor(ten, vaiTro, capBaiTrung, khongHop) {
        this.ten = ten;
        this.vaiTro = vaiTro; 
    }

    hienThiThongTin() {
        console.log(`Tên: ${this.ten}, Vị trí: ${this.vaiTro}`);
    }
}

function taoDanhSachCauThu() {
    const danhSach = [];
    const vaiTro = ['nongcot', 'dubi'];
    let countNongcot = 0;
    let countDubi = 0;

    for (let i = 1; i <= 10; i++) {
        let role;
        if (countNongcot < 5 && countDubi < 5) {
            role = vaiTro[Math.floor(Math.random() * 2)];
        } else if (countNongcot < 5) {
            role = 'nongcot';
        } else {
            role = 'dubi';
        }

        if (role === 'nongcot') countNongcot++;
        if (role === 'dubi') countDubi++;

        danhSach.push(new CauThu(`Cauthu${i}`, role));
    }

    danhSach.push(new CauThu('Cauthu11', 'atchubai'));

    return danhSach;
}

function tachDanhSach(danhSach) {
    const danhSachNongcot = danhSach.filter(cauThu => cauThu.vaiTro === 'nongcot');
    const danhSachDubi = danhSach.filter(cauThu => cauThu.vaiTro === 'dubi');
    return { danhSachNongcot, danhSachDubi };
}

const danhSachCauThu = taoDanhSachCauThu();
const { danhSachNongcot, danhSachDubi } = tachDanhSach(danhSachCauThu);

module.exports = { taoDanhSachCauThu, danhSachCauThu, danhSachNongcot, danhSachDubi };
/*danhSachCauThu.forEach((cauThu, i) => {
    console.log(`Cầu thủ ${i + 1}:`);
    cauThu.hienThiThongTin();
}
);*/
