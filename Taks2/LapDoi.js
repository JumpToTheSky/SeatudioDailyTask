const readline = require('readline');
const { loadDanhSachFromFile, saveDanhSachToFile } = require('./DanhSachCauThu');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let danhSach = loadDanhSachFromFile(); // Tự động load danh sách từ file

function hienThiDanhSachCauThu() {
    console.log("Danh sách các cầu thủ:");
    danhSach.forEach((cauThu, index) => {
        cauThu.hienThiThongTin();
    });
}

function chonCauThuKhongHop() {
    hienThiDanhSachCauThu();

    rl.question("Nhập số thứ tự của cầu thủ thứ nhất: ", (index1) => {
        const cauThu1 = danhSach[index1 - 1];
        if (!cauThu1) {
            console.log("Số thứ tự không hợp lệ.");
            menu();
            return;
        }

        rl.question("Nhập số thứ tự của cầu thủ thứ hai: ", (index2) => {
            const cauThu2 = danhSach[index2 - 1];
            if (!cauThu2) {
                console.log("Số thứ tự không hợp lệ.");
                menu();
                return;
            }

            if (index1 === index2) {
                console.log("Không thể chọn cùng một cầu thủ.");
                menu();
                return;
            }

            cauThu1.khongHop = cauThu2.ten;
            cauThu2.khongHop = cauThu1.ten;

            console.log(`${cauThu1.ten} và ${cauThu2.ten} không hợp nhau.`);
            saveDanhSachToFile(danhSach); // Lưu danh sách sau khi cập nhật
            menu();
        });
    });
}

function chonCapBaiTrung() {
    hienThiDanhSachCauThu();

    rl.question("Nhập số thứ tự của cầu thủ thứ nhất: ", (index1) => {
        const cauThu1 = danhSach[index1 - 1];
        if (!cauThu1) {
            console.log("Số thứ tự không hợp lệ.");
            menu();
            return;
        }

        rl.question("Nhập số thứ tự của cầu thủ thứ hai: ", (index2) => {
            const cauThu2 = danhSach[index2 - 1];
            if (!cauThu2) {
                console.log("Số thứ tự không hợp lệ.");
                menu();
                return;
            }

            if (index1 === index2) {
                console.log("Không thể chọn cùng một cầu thủ.");
                menu();
                return;
            }

            // Remove old pairings for cauThu1
            if (cauThu1.capBaiTrung) {
                const oldPair = danhSach.find(cauThu => cauThu.ten === cauThu1.capBaiTrung);
                if (oldPair) oldPair.capBaiTrung = null;
            }

            // Remove old pairings for cauThu2
            if (cauThu2.capBaiTrung) {
                const oldPair = danhSach.find(cauThu => cauThu.ten === cauThu2.capBaiTrung);
                if (oldPair) oldPair.capBaiTrung = null;
            }

            // Set new pairings
            cauThu1.capBaiTrung = cauThu2.ten;
            cauThu2.capBaiTrung = cauThu1.ten;

            console.log(`${cauThu1.ten} và ${cauThu2.ten} đã trở thành cặp bài trùng.`);
            saveDanhSachToFile(danhSach); // Lưu danh sách sau khi cập nhật
            menu();
        });
    });
}

function xoaCapBaiTrung() {
    hienThiDanhSachCauThu();

    rl.question("Nhập số thứ tự của cầu thủ muốn xoá cặp bài trùng: ", (index) => {
        const cauThu = danhSach[index - 1];
        if (!cauThu) {
            console.log("Số thứ tự không hợp lệ.");
            menu();
            return;
        }

        if (cauThu.capBaiTrung) {
            const oldPair = danhSach.find(c => c.ten === cauThu.capBaiTrung);
            if (oldPair) oldPair.capBaiTrung = null;
            cauThu.capBaiTrung = null;
            console.log(`Đã xoá cặp bài trùng của cầu thủ ${cauThu.ten}.`);
        } else {
            console.log(`Cầu thủ ${cauThu.ten} không có cặp bài trùng.`);
        }

        saveDanhSachToFile(danhSach); // Lưu danh sách sau khi cập nhật
        menu();
    });
}

function xoaKhongHop() {
    hienThiDanhSachCauThu();

    rl.question("Nhập số thứ tự của cầu thủ muốn xoá không hợp: ", (index) => {
        const cauThu = danhSach[index - 1];
        if (!cauThu) {
            console.log("Số thứ tự không hợp lệ.");
            menu();
            return;
        }

        if (cauThu.khongHop) {
            const oldIncompatible = danhSach.find(c => c.ten === cauThu.khongHop);
            if (oldIncompatible) oldIncompatible.khongHop = null;
            cauThu.khongHop = null;
            console.log(`Đã xoá không hợp của cầu thủ ${cauThu.ten}.`);
        } else {
            console.log(`Cầu thủ ${cauThu.ten} không có không hợp.`);
        }

        saveDanhSachToFile(danhSach); // Lưu danh sách sau khi cập nhật
        menu();
    });
}

function xoaToanBoDuLieu() {
    rl.question("Bạn có chắc chắn muốn xoá toàn bộ dữ liệu? (y/n): ", (confirm) => {
        if (confirm.toLowerCase() === 'y') {
            danhSach = [];
            saveDanhSachToFile(danhSach); // Lưu danh sách trống vào file
            console.log("Toàn bộ dữ liệu đã được xoá.");
        } else {
            console.log("Hành động xoá dữ liệu đã bị huỷ.");
        }
        menu();
    });
}

function LapDoi3Nguoi() {
    const atChubai = danhSach.find(cauThu => cauThu.vaiTro === 'atchubai');
    if (!atChubai) {
        console.log("Không có thành viên át chủ bài trong danh sách.");
        menu();
        return;
    }

    const danhSachNongcot = danhSach.filter(cauThu => cauThu.vaiTro === 'nongcot');
    const danhSachDubi = danhSach.filter(cauThu => cauThu.vaiTro === 'dubi');

    const ketQua = [];

    danhSachNongcot.forEach(nongcot => {
        danhSachDubi.forEach(dubi => {
            // Kiểm tra điều kiện cặp bài trùng
            if (
                (nongcot.capBaiTrung && nongcot.capBaiTrung !== dubi.ten) ||
                (dubi.capBaiTrung && dubi.capBaiTrung !== nongcot.ten) ||
                (atChubai.capBaiTrung && atChubai.capBaiTrung !== nongcot.ten && atChubai.capBaiTrung !== dubi.ten)
            ) {
                return;
            }

            // Kiểm tra điều kiện không hợp
            if (
                (nongcot.khongHop && nongcot.khongHop === dubi.ten) ||
                (dubi.khongHop && dubi.khongHop === nongcot.ten) ||
                (atChubai.khongHop && (atChubai.khongHop === nongcot.ten || atChubai.khongHop === dubi.ten))
            ) {
                return;
            }

            ketQua.push([atChubai.ten, nongcot.ten, dubi.ten]);
        });
    });

    if (ketQua.length === 0) {
        console.log("Không tìm thấy tổ hợp nào thoả mãn.");
    } else {
        console.log("Các tổ hợp 3 người thoả mãn:");
        ketQua.forEach((toHop, index) => {
            console.log(`${index + 1}: ${toHop.join(", ")}`);
        });
    }

    menu();
}

function menu() {
    console.log("Menu:");
    console.log("1. Hiển thị danh sách cầu thủ");
    console.log("2. Chọn cầu thủ không hợp nhau");
    console.log("3. Chọn cặp bài trùng");
    console.log("4. Xoá cặp bài trùng");
    console.log("5. Xoá không hợp");
    console.log("6. Xoá toàn bộ dữ liệu");
    console.log("7. Lập đội 3 người thoả mãn");
    console.log("0. Thoát");

    rl.question("Chọn một tùy chọn: ", (option) => {
        switch (option) {
            case "1":
                hienThiDanhSachCauThu();
                menu();
                break;
            case "2":
                chonCauThuKhongHop();
                break;
            case "3":
                chonCapBaiTrung();
                break;
            case "4":
                xoaCapBaiTrung();
                break;
            case "5":
                xoaKhongHop();
                break;
            case "6":
                xoaToanBoDuLieu();
                break;
            case "7":
                LapDoi3Nguoi();
                break;
            case "0":
                console.log("Thoát chương trình.");
                rl.close();
                return;
            default:
                console.log("Tùy chọn không hợp lệ.");
                menu();
        }
    });
}

menu();


