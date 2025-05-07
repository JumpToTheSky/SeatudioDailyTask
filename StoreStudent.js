const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Student {
    constructor(id, name, age, grade) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.grade = grade;
    }
  
    hienThiThongTin() {
        console.log(`Họ tên: ${this.name}, Tuổi: ${this.age}, Mã học sinh: ${this.id}, Lớp: ${this.grade}`);
    }
}

let danhSachHocSinh = [];
let soLuong = 0;
let index = 0;

function nhapThongTin(index) {
    console.log(`\n--- Nhập thông tin học sinh thứ ${index + 1} ---`);
    rl.question('Họ và tên: ', (name) => {
        rl.question('Tuổi: ', (age) => {
            rl.question('Mã học sinh: ', (id) => {
                rl.question('Lớp: ', (grade) => {
                    const student = new Student(id, name, parseInt(age), grade);
                    danhSachHocSinh.push(student);
                    
                    index++;
                    if (index < soLuong) {
                        nhapThongTin(index);
                    } else {
                        console.log('\nDanh sách học sinh :');
                        danhSachHocSinh.forEach((student, i) => {
                            console.log(`SV ${i + 1}:`);
                            student.hienThiThongTin();
                        });
                        rl.close();
                    }
                });
            });
            
          });
        });
    };

  
  rl.question('Nhập số lượng học sinh: ', (so) => {
    soLuong = parseInt(so);
    if (isNaN(soLuong) || soLuong <= 0) {
      console.log('Số lượng không hợp lệ.');
      rl.close();
    } else {
      nhapThongTin(index);
    }
  });