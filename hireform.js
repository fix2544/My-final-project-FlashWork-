import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB05cW9rTJPQFGlHr0X713S1wgL8Rr-XDE",
    authDomain: "apply-form-2a78b.firebaseapp.com",
    projectId: "apply-form-2a78b",
    storageBucket: "apply-form-2a78b.appspot.com",
    messagingSenderId: "469342759170",
    appId: "1:469342759170:web:b812a83b8db9181b55fa1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ฟังก์ชันดึงข้อมูลการจ้างงานจาก Firestore
async function getHireData() {
    const clientId = localStorage.getItem("client_loggedInUserId");
    if (!clientId) {
        console.log("ไม่พบ clientId");
        return null;
    }

    const hireRef = collection(db, "hireRequests");
    const hireQuery = query(hireRef, where("clientId", "==", clientId));
    const querySnapshot = await getDocs(hireQuery);

    if (!querySnapshot.empty) {
        let hireDoc = querySnapshot.docs[0];
        return { id: hireDoc.id, ...hireDoc.data() };
    } else {
        console.log("ไม่พบข้อมูลการจ้างงาน");
        return null;
    }
}

// ฟังก์ชันเพื่อลบข้อมูลการจ้างงานจาก Firestore โดยอิงจาก client_loggedInUserId
async function removeHireDataFromFirestore() {
    const clientId = localStorage.getItem("client_loggedInUserId"); // ดึง client_loggedInUserId จาก LocalStorage
    if (!clientId) {
        console.log("ไม่พบข้อมูล clientId ใน LocalStorage");
        return;
    }

    const hireDataRef = collection(db, "hireRequests");
    const hireQuery = query(hireDataRef, where("clientId", "==", clientId)); // ค้นหาข้อมูลที่มี clientId ตรงกับที่เก็บไว้ใน LocalStorage

    try {
        const querySnapshot = await getDocs(hireQuery);

        if (querySnapshot.empty) {
            console.log("ไม่พบข้อมูลการจ้างงานสำหรับ clientId นี้");
            return;
        }

        // ถ้าพบเอกสารที่ตรงกับ clientId
        querySnapshot.forEach(async (doc) => {
            try {
                await deleteDoc(doc.ref); // ลบเอกสารที่ตรงกับ clientId
                console.log("Document successfully deleted: ", doc.id);
            } catch (error) {
                console.error("Error removing document: ", error);
            }
        });
    } catch (error) {
        console.error("Error querying documents: ", error);
    }
}

// แสดงผลข้อมูลการจ้างงาน
document.addEventListener("DOMContentLoaded", async () => {
    const hireData = await getHireData();

    if (hireData) {
        document.getElementById("resultProjectName").textContent = hireData.projectName || "-";
        document.getElementById("resultProjectDescription").textContent = hireData.projectDescription || "-";
        document.getElementById("resultBudget").textContent = hireData.budget || "-";
        document.getElementById("resultTimeline").textContent = hireData.timeline || "-";
        document.getElementById("resultClientInfo").textContent = hireData.clientInfo || "-";

        document.getElementById("AcceptBtn").addEventListener("click", async () => {
            await updateHireStatus(hireData.id, "accepted");
            localStorage.setItem("hireResponseStatus", "accepted");
            document.getElementById("acceptMessage").classList.remove("d-none");
        });

        document.getElementById("notAcceptBtn").addEventListener("click", async () => {
            await updateHireStatus(hireData.id, "rejected");
            localStorage.setItem("hireResponseStatus", "rejected");

            // ลบข้อมูลการจ้างงานจาก Firestore
            await removeHireDataFromFirestore();

            document.querySelector(".card-body").innerHTML = "<p class='text-warning text-center'>ข้อมูลการจ้างงานถูกปฏิเสธ</p>";
        });
    } else {
        document.querySelector(".card-body").innerHTML = "<p class='text-danger text-center'>ไม่พบข้อมูลการจ้างงาน</p>";
    }
});

// ฟังก์ชันอัปเดตสถานะการจ้างงาน
async function updateHireStatus(hireId, status) {
    const hireDocRef = doc(db, "hireRequests", hireId);
    try {
        await updateDoc(hireDocRef, { status });
        console.log(`อัปเดตสถานะเป็น: ${status}`);
    } catch (error) {
        console.error("Error updating hire status: ", error);
    }
} 
