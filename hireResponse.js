document.addEventListener("DOMContentLoaded", () => {
    const hireStatus = localStorage.getItem("hireResponseStatus");
const responseMessageDiv = document.getElementById("responseMessage");

if (hireStatus === "accepted") {
    responseMessageDiv.innerHTML = `
        <h3 class="text-success">🎉 Your work has been accepted!</h3>
        <p>The freelancer has accepted your job. We will contact you to proceed with the next steps.</p>
    `;
} else if (hireStatus === "rejected") {
    responseMessageDiv.innerHTML = `
        <h3 class="text-danger">😢 Your work has been rejected.</h3>
        <p>Sorry! This freelancer is currently unable to accept this job.</p>
    `;
}

// ตั้งเวลาให้ข้อความแสดง 5 วินาที จากนั้นเปลี่ยนกลับเป็นข้อความเริ่มต้น
setTimeout(() => {
    responseMessageDiv.innerHTML = `
        <h3 class="text-warning">⏳ No response or no hiring yet</h3>
     `;
}, 20000);

});

// ถ้าคุณต้องการรีเซ็ตสถานะหลังรีเฟรชหน้า
//window.addEventListener('beforeunload', () => {
    // กำหนดค่าตั้งต้นก่อนหน้ารีเฟรช
    //localStorage.removeItem("hireResponseStatus");
//});
