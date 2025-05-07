const { danhSachHocSinh } = require('./StudentList');

function hienThiThongKe() {
    const totalStudents = danhSachHocSinh.length;

    if (totalStudents === 0) {
        console.log('Không có học sinh nào trong danh sách.');
        return;
    }

    const totalGrades = danhSachHocSinh.reduce((sum, student) => sum + parseFloat(student.grade), 0);
    const averageGrade = totalGrades / totalStudents;

    const classificationCounts = danhSachHocSinh.reduce((counts, student) => {
        const grade = parseFloat(student.grade);
        if (grade >= 8) {
            counts['Excellent'] = (counts['Excellent'] || 0) + 1;
        } else if (grade >= 6.5) {
            counts['Good'] = (counts['Good'] || 0) + 1;
        } else {
            counts['Average'] = (counts['Average'] || 0) + 1;
        }
        return counts;
    }, {});

    console.log('\n--- Thống kê ---');
    console.log(`Tổng số học sinh: ${totalStudents}`);
    console.log(`Điểm trung bình: ${averageGrade.toFixed(2)}`);
    console.log('Number of students by classification:');
    for (const [classification, count] of Object.entries(classificationCounts)) {
        console.log(`  ${classification}: ${count}`);
    }
}

module.exports = { hienThiThongKe };
