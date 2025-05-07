const readline = require('readline');


class Student {
    constructor(id, name, age, grade) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.grade = grade;
    }
  
    hienThiThongTin() {
        console.log(`Họ tên: ${this.name}, Tuổi: ${this.age}, Mã học sinh: ${this.id}, Điểm: ${this.grade}`);
    }
}




module.exports = { Student };


