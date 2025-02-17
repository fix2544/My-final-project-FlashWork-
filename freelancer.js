import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase config
const firebaseConfig = { 
    apiKey: "AIzaSyB05cW9rTJPQFGlHr0X713S1wgL8Rr-XDE",
    authDomain: "apply-form-2a78b.firebaseapp.com",
    databaseURL: "https://apply-form-2a78b-default-rtdb.firebaseio.com",
    projectId: "apply-form-2a78b",
    storageBucket: "apply-form-2a78b.appspot.com",
    messagingSenderId: "469342759170",
    appId: "1:469342759170:web:b812a83b8db9181b55fa1b" 
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ฟังก์ชันดึงชื่อฟรีแลนซ์
async function getFreelancerName(userId) {
    try {
        const userRef = doc(db, "freelapply", userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data().name || "Unnamed Freelancer" : "Unnamed Freelancer";
    } catch (error) {
        console.error("Error fetching freelancer name:", error);
        return "Unnamed Freelancer";
    }
}

// ฟังก์ชันอัปเดตสถานะงาน
async function updateStatus(newStatus, secretCode, linkUrl = null) {
    try {
        const user = auth.currentUser;
        if (!user) return console.error("No authenticated user");

        const userId = user.uid;
        const freelancerName = await getFreelancerName(userId);
        const statusRef = doc(db, "Status", userId);
        secretCode = secretCode.trim();

        const statusSnap = await getDoc(statusRef);
        const statusData = {
            status: newStatus,
            freelancerName: freelancerName,
            ...(linkUrl && { linkUrl: linkUrl }) // เพิ่มลิงค์เฉพาะเมื่อมีค่า
        };

        if (statusSnap.exists() && statusSnap.data()[secretCode]) {
            await updateDoc(statusRef, { [`${secretCode}`]: statusData });
        } else {
            await setDoc(statusRef, { [`${secretCode}`]: statusData }, { merge: true });
        }

        console.log("Status updated successfully for code:", secretCode);
        
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

// ควบคุมการแสดง/ซ่อนฟิลด์ลิงก์
const statusSelect = document.getElementById("statusSelect");
const statusLinkContainer = document.getElementById("statusLinkContainer");

// ฟังก์ชันสำหรับแสดงหรือซ่อนฟิลด์ลิงก์
statusSelect.addEventListener("change", function () {
    if (statusSelect.value === "Completed") {
        statusLinkContainer.style.display = "block";  // แสดงฟิลด์ลิงก์
    } else {
        statusLinkContainer.style.display = "none";   // ซ่อนฟิลด์ลิงก์
        document.getElementById("statusLink").value = ""; // ลบค่าลิงก์ถ้ามี
    }
});

// ตรวจสอบสถานะตอนโหลดหน้า
window.addEventListener("DOMContentLoaded", () => {
    if (statusSelect.value === "Completed") {
        statusLinkContainer.style.display = "block";
    } else {
        statusLinkContainer.style.display = "none";
    }
});

// จัดการฟอร์มอัปเดตสถานะ
document.getElementById("updateStatusForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const newStatus = document.getElementById("statusSelect").value;
    const secretCode = document.getElementById("secretCode").value;
    const linkUrl = document.getElementById("statusLink").value; // รับลิงก์จากฟอร์ม

    if (!newStatus || !secretCode) {
        alert("Please select a status and enter a secret code.");
        return;
    }

    // ส่งลิงก์ไปยังฟังก์ชันอัปเดตสถานะ
    await updateStatus(newStatus, secretCode, linkUrl);
    alert("Status updated successfully!");
});

document.getElementById("acknowledgePaymentBtn").addEventListener("click", async function() {
    const freelancerId = localStorage.getItem('freelancer_loggedInUserId');
    if (!freelancerId) return console.error("Freelancer ID not found in localStorage");

    const secretCode = prompt("กรุณากรอกรหัสลับของงานที่ต้องการยืนยันการชำระเงิน:");
    if (!secretCode) return alert("กรุณากรอกรหัสลับก่อนดำเนินการ");

    const statusRef = doc(db, "Status", freelancerId);
    const statusSnap = await getDoc(statusRef);

    if (statusSnap.exists() && statusSnap.data()[secretCode]) {
        // อัปเดตเฉพาะรหัสลับที่ถูกต้อง
        await updateDoc(statusRef, {
            [`${secretCode}.paymentStatus`]: "Confirmed",
            [`${secretCode}.paymentConfirmed`]: true
        });

        alert("คุณได้ยืนยันการชำระเงินเรียบร้อยแล้ว");

        // เปิดลิงก์งานถ้ามี
        const linkUrl = statusSnap.data()[secretCode].linkUrl;
        if (linkUrl) {
            window.open(linkUrl, "_blank");
        } else {
            alert("ไม่พบลิงก์สำหรับแสดงงาน.");
        }
    } else {
        alert("รหัสลับไม่ถูกต้อง หรือไม่มีสถานะที่เกี่ยวข้องกับรหัสนี้");
    }
});

document.getElementById("confirmPaymentButton").addEventListener("click", async function() {
    const freelancerId = localStorage.getItem('freelancer_loggedInUserId');
    if (!freelancerId) {
        console.error("Freelancer ID is not defined.");
        return;
    }

    const secretCode = prompt("กรุณากรอกรหัสลับของงานที่ต้องการยืนยันการชำระเงิน:");
    if (!secretCode) return alert("กรุณากรอกรหัสลับก่อนดำเนินการ");

    const statusRef = doc(db, "Status", freelancerId);
    const statusSnap = await getDoc(statusRef);

    if (statusSnap.exists() && statusSnap.data()[secretCode]) {
        // อัปเดตเฉพาะรหัสลับที่ถูกต้อง
        await updateDoc(statusRef, {
            [`${secretCode}.paymentStatus`]: "Confirmed",
            [`${secretCode}.paymentConfirmed`]: true
        });

        alert("คุณได้ยืนยันการชำระเงินเรียบร้อยแล้ว");
    } else {
        alert("รหัสลับไม่ถูกต้อง หรือไม่มีสถานะที่เกี่ยวข้องกับรหัสนี้");
    }
});
