const readline = require('readline');
const { hienThiDanhSachHocSinh } = require('./DisplayStudent');
const { danhSachHocSinh } = require('./StudentList');

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
                        rl.close();
                    }
                });
            });
        });
    });
}

module.exports = { Student, nhapThongTin };


