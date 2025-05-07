const readline = require('readline');
const { loadDanhSachFromFile, saveDanhSachToFile } = require('./DanhSachCauThu');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let danhSach = loadDanhSachFromFile(); 
let dieuKienCapBaiTrung = true; 
let dieuKienKhongHop = true; 

function hienThiDanhSachCauThu() {
    console.log("Danh sách các cầu thủ:");
    danhSach.forEach((cauThu, index) => {
        cauThu.hienThiThongTin();
    });
}

function chonCauThuKhongHop() {
    rl.question("Nhập số thứ tự của cầu thủ thứ nhất (hoặc nhập 'EXIT' để thoát): ", (index1) => {
        if (index1.toLowerCase() === 'exit') {
            menu();
            return;
        }
        const cauThu1 = danhSach[index1 - 1];
        if (!cauThu1) {
            console.log("Số thứ tự không hợp lệ.");
            menu();
            return;
        }

        rl.question("Nhập số thứ tự của cầu thủ thứ hai (hoặc nhập 'EXIT' để thoát): ", (index2) => {
            if (index2.toLowerCase() === 'exit') {
                menu();
                return;
            }
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
    rl.question("Nhập số thứ tự của cầu thủ thứ nhất (hoặc nhập 'EXIT' để thoát): ", (index1) => {
        if (index1.toLowerCase() === 'exit') {
            menu();
            return;
        }
        const cauThu1 = danhSach[index1 - 1];
        if (!cauThu1) {
            console.log("Số thứ tự không hợp lệ.");
            menu();
            return;
        }

        rl.question("Nhập số thứ tự của cầu thủ thứ hai (hoặc nhập 'EXIT' để thoát): ", (index2) => {
            if (index2.toLowerCase() === 'exit') {
                menu();
                return;
            }
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

    rl.question("Nhập số thứ tự của cầu thủ muốn xoá cặp bài trùng (hoặc nhập 'EXIT' để thoát): ", (index) => {
        if (index.toLowerCase() === 'exit') {
            menu();
            return;
        }
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

    rl.question("Nhập số thứ tự của cầu thủ muốn xoá không hợp (hoặc nhập 'EXIT' để thoát): ", (index) => {
        if (index.toLowerCase() === 'exit') {
            menu();
            return;
        }
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
    rl.question("Bạn có chắc chắn muốn xoá toàn bộ dữ liệu? (y/n hoặc nhập 'EXIT' để thoát): ", (confirm) => {
        if (confirm.toLowerCase() === 'exit') {
            menu();
            return;
        }
        if (confirm.toLowerCase() === 'y') {
            danhSach = [];
            saveDanhSachToFile(danhSach); // Lưu danh sách trống vào file
            console.log("Toàn bộ dữ liệu đã được xoá.");
            rl.close();
        } else {
            console.log("Hành động xoá dữ liệu đã bị huỷ.");
            menu();
        }
    });
}

function xoaCauThu() {
    hienThiDanhSachCauThu();

    rl.question("Nhập số thứ tự của cầu thủ muốn xoá (hoặc nhập 'EXIT' để thoát): ", (index) => {
        if (index.toLowerCase() === 'exit') {
            menu();
            return;
        }
        const cauThu = danhSach[index - 1];
        if (!cauThu) {
            console.log("Số thứ tự không hợp lệ.");
            menu();
            return;
        }

        danhSach.splice(index - 1, 1); // Xoá cầu thủ khỏi danh sách
        console.log(`Đã xoá cầu thủ ${cauThu.ten} khỏi danh sách.`);
        saveDanhSachToFile(danhSach); // Lưu danh sách sau khi cập nhật
        menu();
    });
}

function checkTeamValid(cauThu1, cauThu2, cauThu3) {
    // Kiểm tra vai trò của các cầu thủ
    const roles = [cauThu1.vaiTro, cauThu2.vaiTro, cauThu3.vaiTro];
    if (
        !roles.includes('atchubai') || 
        !roles.includes('nongcot') || 
        !roles.includes('dubi')       
    ) {
        return false;
    }

    // Kiểm tra điều kiện cặp bài trùng (nếu được bật)
    if (
        dieuKienCapBaiTrung &&
        (
            (cauThu1.capBaiTrung && cauThu1.capBaiTrung !== cauThu2.ten && cauThu1.capBaiTrung !== cauThu3.ten) ||
            (cauThu2.capBaiTrung && cauThu2.capBaiTrung !== cauThu1.ten && cauThu2.capBaiTrung !== cauThu3.ten) ||
            (cauThu3.capBaiTrung && cauThu3.capBaiTrung !== cauThu1.ten && cauThu3.capBaiTrung !== cauThu2.ten)
        )
    ) {
        return false;
    }

    // Kiểm tra điều kiện không hợp (nếu được bật)
    if (
        dieuKienKhongHop &&
        (
            (cauThu1.khongHop && (cauThu1.khongHop === cauThu2.ten || cauThu1.khongHop === cauThu3.ten)) ||
            (cauThu2.khongHop && (cauThu2.khongHop === cauThu1.ten || cauThu2.khongHop === cauThu3.ten)) ||
            (cauThu3.khongHop && (cauThu3.khongHop === cauThu1.ten || cauThu3.khongHop === cauThu2.ten))
        )
    ) {
        return false;
    }

    return true;
}

function thayDoiDieuKienCapBaiTrung() {
    rl.question("Bạn có muốn bật/tắt điều kiện cặp bài trùng? (y/n): ", (confirm) => {
        if (confirm.toLowerCase() === 'y') {
            dieuKienCapBaiTrung = !dieuKienCapBaiTrung;
            console.log(`Điều kiện cặp bài trùng đã được ${dieuKienCapBaiTrung ? 'bật' : 'tắt'}.`);
        } else {
            console.log("Không thay đổi điều kiện cặp bài trùng.");
        }
        menu();
    });
}

function thayDoiDieuKienKhongHop() {
    rl.question("Bạn có muốn bật/tắt điều kiện không hợp? (y/n): ", (confirm) => {
        if (confirm.toLowerCase() === 'y') {
            dieuKienKhongHop = !dieuKienKhongHop;
            console.log(`Điều kiện không hợp đã được ${dieuKienKhongHop ? 'bật' : 'tắt'}.`);
        } else {
            console.log("Không thay đổi điều kiện không hợp.");
        }
        menu();
    });
}

function listTeamValid() {
    const validTeams = [];
    for (let i = 0; i < danhSach.length - 2; i++) {
        for (let j = i + 1; j < danhSach.length - 1; j++) {
            for (let k = j + 1; k < danhSach.length; k++) {
                const cauThu1 = danhSach[i];
                const cauThu2 = danhSach[j];
                const cauThu3 = danhSach[k];
                if (checkTeamValid(cauThu1, cauThu2, cauThu3)) {
                    validTeams.push([cauThu1, cauThu2, cauThu3]);
                }
            }
        }
    }

    console.log("Danh sách các đội hợp lệ:");
    console.log("Đội\tCầu thủ 1 \tCầu thủ 2 \tCầu thủ 3 ");
    validTeams.forEach((team, index) => {
        const [cauThu1, cauThu2, cauThu3] = team;
        console.log(
            `${index + 1}\t${cauThu1.ten} (${cauThu1.vaiTro})\t${cauThu2.ten} (${cauThu2.vaiTro})\t${cauThu3.ten} (${cauThu3.vaiTro})`
        );
    });
}

function pickTeamToCheck() {

    rl.question("Nhập ID của cầu thủ thứ nhất: ", (id1) => {
        const cauThu1 = danhSach.find(c => c.id === parseInt(id1));
        if (!cauThu1) {
            console.log("ID không hợp lệ.");
            menu();
            return;
        }

        rl.question("Nhập ID của cầu thủ thứ hai: ", (id2) => {
            const cauThu2 = danhSach.find(c => c.id === parseInt(id2));
            if (!cauThu2) {
                console.log("ID không hợp lệ.");
                menu();
                return;
            }

            rl.question("Nhập ID của cầu thủ thứ ba: ", (id3) => {
                const cauThu3 = danhSach.find(c => c.id === parseInt(id3));
                if (!cauThu3) {
                    console.log("ID không hợp lệ.");
                    menu();
                    return;
                }

                if (checkTeamValid(cauThu1, cauThu2, cauThu3)) {
                    console.log(`Đội hợp lệ: ${cauThu1.ten}, ${cauThu2.ten}, ${cauThu3.ten}`);
                } else {
                    console.log("Không thể tạo thành đội vì:");

                    // Check roles
                    const roles = [cauThu1.vaiTro, cauThu2.vaiTro, cauThu3.vaiTro];
                    if (!roles.includes('atchubai')) {
                        console.log("- Thiếu thành viên át chủ bài.");
                    }
                    if (!roles.includes('nongcot')) {
                        console.log("- Thiếu thành viên nóng cốt.");
                    }
                    if (!roles.includes('dubi')) {
                        console.log("- Thiếu thành viên dự bị.");
                    }

                    // Check capBaiTrung condition
                    if (dieuKienCapBaiTrung) {
                        if (cauThu1.capBaiTrung && cauThu1.capBaiTrung !== cauThu2.ten && cauThu1.capBaiTrung !== cauThu3.ten) {
                            console.log(`- Cầu thủ ${cauThu1.ten} có cặp bài trùng (${cauThu1.capBaiTrung}) không nằm trong đội.`);
                        }
                        if (cauThu2.capBaiTrung && cauThu2.capBaiTrung !== cauThu1.ten && cauThu2.capBaiTrung !== cauThu3.ten) {
                            console.log(`- Cầu thủ ${cauThu2.ten} có cặp bài trùng (${cauThu2.capBaiTrung}) không nằm trong đội.`);
                        }
                        if (cauThu3.capBaiTrung && cauThu3.capBaiTrung !== cauThu1.ten && cauThu3.capBaiTrung !== cauThu2.ten) {
                            console.log(`- Cầu thủ ${cauThu3.ten} có cặp bài trùng (${cauThu3.capBaiTrung}) không nằm trong đội.`);
                        }
                    }

                    // Check khongHop condition
                    if (dieuKienKhongHop) {
                        if (cauThu1.khongHop && (cauThu1.khongHop === cauThu2.ten || cauThu1.khongHop === cauThu3.ten)) {
                            console.log(`- Cầu thủ ${cauThu1.ten} không hợp với ${cauThu1.khongHop}.`);
                        }
                        if (cauThu2.khongHop && (cauThu2.khongHop === cauThu1.ten || cauThu2.khongHop === cauThu3.ten)) {
                            console.log(`- Cầu thủ ${cauThu2.ten} không hợp với ${cauThu2.khongHop}.`);
                        }
                        if (cauThu3.khongHop && (cauThu3.khongHop === cauThu1.ten || cauThu3.khongHop === cauThu2.ten)) {
                            console.log(`- Cầu thủ ${cauThu3.ten} không hợp với ${cauThu3.khongHop}.`);
                        }
                    }
                }
                menu();
            });
        });
    });
}

function menu() {
    console.log("Menu:");
    console.log("1. Hiển thị danh sách cầu thủ");
    console.log("2. Chọn cầu thủ không hợp nhau");
    console.log("3. Chọn cặp bài trùng");
    console.log("4. Xoá cặp bài trùng");
    console.log("5. Xoá không hợp");
    console.log("6. Xoá toàn bộ dữ liệu");
    console.log("7. Liệt kê tất cả các đội 3 người hợp lệ");
    console.log("8. Bật/tắt điều kiện cặp bài trùng");
    console.log("9. Bật/tắt điều kiện không hợp");
    console.log("10. Xoá một cầu thủ");
    console.log("11. Chọn tổ hợp 3 cầu thủ theo ID và kiểm tra");
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
                listTeamValid();
                menu();
                break;
            case "8":
                thayDoiDieuKienCapBaiTrung();
                break;
            case "9":
                thayDoiDieuKienKhongHop();
                break;
            case "10":
                xoaCauThu();
                break;
            case "11":
                pickTeamToCheck();
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


