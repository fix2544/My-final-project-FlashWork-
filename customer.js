import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, onSnapshot} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";



const firebaseConfig = { 
    apiKey: "AIzaSyB05cW9rTJPQFGlHr0X713S1wgL8Rr-XDE",
    authDomain: "apply-form-2a78b.firebaseapp.com",
    databaseURL: "https://apply-form-2a78b-default-rtdb.firebaseio.com",
    projectId: "apply-form-2a78b",
    storageBucket: "apply-form-2a78b.appspot.com",
    messagingSenderId: "469342759170",
    appId: "1:469342759170:web:b812a83b8db9181b55fa1b" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ฟังก์ชันเช็คสถานะการล็อกอิน
function checkLoginStatus() {
    const userId = localStorage.getItem('client_loggedInUserId'); // เอาข้อมูลจาก localStorage
    const loginWarning = document.getElementById('loginWarning');
    const statusList = document.getElementById('statusList');
    
    if (!userId) {  // ถ้าไม่ได้ล็อกอิน
        loginWarning.style.display = 'block'; // แสดงข้อความให้ไปล็อกอิน
        statusList.style.display = 'none'; // ซ่อนสถานะ
    } else {  // ถ้าเข้าสู่ระบบแล้ว
        loginWarning.style.display = 'none'; // ซ่อนข้อความ
        statusList.style.display = 'block'; // แสดงสถานะ
        loadFreelancerStatuses();  // โหลดสถานะงาน
    }
}

// ฟังก์ชันโหลดสถานะงาน
async function loadFreelancerStatuses() {
    const secretCode = prompt("Enter the secret code to track the status:")?.trim();
    if (!secretCode) {
        alert("Please enter a secret code.");
        return;
    }

    const freelancersStatusRef = collection(db, "Status");
    const querySnapshot = await getDocs(freelancersStatusRef);

    const statusList = document.getElementById("statusList");
    statusList.innerHTML = "";

    let foundStatus = false;
    let isPaymentCompleted = false; // ตัวแปรสำหรับตรวจสอบว่าได้กดปุ่ม Get Payment หรือไม่

    querySnapshot.forEach(docSnapshot => {  // <-- use docSnapshot here
        const statusData = docSnapshot.data()[secretCode];
        if (statusData) {
            const statusElement = document.createElement("div");
            statusElement.classList.add("alert", "alert-info");
            statusElement.innerHTML = `<strong>${statusData.freelancerName}</strong>: ${statusData.status}`;

            // แสดงลิงค์ (ล็อคไว้ก่อน)
            const linkElement = document.createElement("a");
            linkElement.href = "#";
            linkElement.target = "_blank";
            linkElement.classList.add("btn", "btn-link", "mt-2");
            
            // ตรวจสอบหากไม่มีลิงค์จากฟรีแลนซ์
            if (statusData.linkUrl) {
                linkElement.innerHTML = "Click to view your work details or dowload"; // แสดงลิงก์เมื่อมี URL
            } else {
                linkElement.style.display = "none"; // ซ่อนลิงก์ถ้าไม่มี URL
            }

            // ฟังก์ชันตรวจสอบการคลิกปุ่ม Get Payment
            linkElement.addEventListener("click", function(event) {
                if (!isPaymentCompleted) {
                    alert("Please click 'Get Payment' button before viewing status details.");
                    event.preventDefault(); // ป้องกันการเปิดลิงก์
                }
            });

            statusElement.appendChild(linkElement);

            // แสดงปุ่ม Get Payment หากสถานะเป็น "Completed"
            if (statusData.status === "Completed") {
                const paymentBtnContainer = document.getElementById("paymentBtnContainer");
                paymentBtnContainer.style.display = "block"; // แสดงปุ่ม Get Payment

                // ฟังก์ชันที่ทำงานเมื่อคลิกปุ่ม Get Payment
                document.getElementById("getPaymentBtn").addEventListener("click", function() {
                    isPaymentCompleted = true;

                    // สร้าง Modal ขึ้นมา
                    const modal = document.createElement("div");
                    modal.classList.add("modal");
                    modal.style.position = "fixed";
                    modal.style.top = "0";
                    modal.style.left = "0";
                    modal.style.width = "100%";
                    modal.style.height = "100%";
                    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    modal.style.display = "flex";
                    modal.style.justifyContent = "center";
                    modal.style.alignItems = "center";
                    modal.style.zIndex = "9999";
                   
                    modal.innerHTML = `
                    <div class="modal-content" style="background: white; padding: 30px; border-radius: 15px; text-align: center; width: 70%; max-width: 500px; margin: auto;">
                        <img src="QR.png" alt="Success Image" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 30px; border-radius: 10px;">
                        <p style="font-size: 14px; color: #333; font-weight: bold; margin-bottom: 20px; font-family: 'Poppins', sans-serif;">Please make the payment before viewing the work.</p>
                        <div style="display: flex; justify-content: center; gap: 10px;">
                        <button id="okButton" style="background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
                            OK
                        </button>
                        <button id="cancelButton" style="background-color: #f44336; color: white; padding: 10px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
                            Cancel
                        </button>
                        </div>
                    </div>
                    `;

                    document.body.appendChild(modal);

                    document.getElementById("okButton").addEventListener("click", function() {
                        if (statusData.linkUrl) {
                            const freelancerId = localStorage.getItem('freelancer_loggedInUserId');
                            console.log("Freelancer ID:", freelancerId);
                    
                            if (!freelancerId) {
                                console.error("Freelancer ID is not defined.");
                                return;
                            }
                    
                            const statusRef = doc(db, "Status", freelancerId);
                    
                            // อัปเดตสถานะการชำระเงินเป็นรอตรวจสอบ
                            updateDoc(statusRef, {
                                paymentStatus: "Pending Confirmation",
                                paymentConfirmed: false
                            }).then(() => {
                                alert("กรุณารอการตรวจสอบการชำระเงินจากฟรีแลนซ์");
                    
                                // ฟังการอัปเดตสถานะแบบ Real-time เพื่อรอการยืนยันจากฟรีแลนซ์
                                const unsubscribe = onSnapshot(statusRef, (docSnap) => {
                                    if (docSnap.exists()) {
                                        const data = docSnap.data();
                                        if (data.paymentStatus === "Confirmed" && data.paymentConfirmed === true) {
                                            alert("ฟรีแลนซ์ได้ยืนยันการชำระเงินแล้ว กำลังนำคุณไปยังลิงก์งาน");
                                            window.open(statusData.linkUrl, "_blank");
                                            unsubscribe(); // ยกเลิกการฟังเมื่อได้รับการยืนยันแล้ว
                                        }
                                    }
                                });
                            }).catch((error) => {
                                console.error("Error updating payment status:", error);
                            });
                        }
                        modal.remove(); // ปิด modal
                    });
                    
                    // เมื่อกดปุ่ม Cancel
                    document.getElementById("cancelButton").addEventListener("click", function() {
                        modal.remove(); // ปิด modal
                    });
                    
                    
                    // ฟังก์ชันสำหรับฟรีแลนซ์ในการยืนยันการชำระเงิน
                    
                    document.addEventListener("DOMContentLoaded", function () {
                        const linkElement = document.querySelector("a.btn-link"); // ลิงก์ที่ลูกค้าจะคลิก
                        const paymentBtnContainer = document.getElementById("paymentBtnContainer"); // ปุ่ม "Get Payment"
                        const paymentStatusContainer = document.getElementById("paymentStatusContainer"); // สำหรับแสดงข้อความ "ชำระแล้ว"
                    
                        if (linkElement) {
                            linkElement.addEventListener("click", function () {
                                // เมื่อผู้ใช้คลิกลิงก์ เราจะทำให้สถานะการชำระเงินเป็น "Confirmed"
                                const freelancerId = localStorage.getItem('freelancer_loggedInUserId');
                                if (!freelancerId) return console.error("Freelancer ID not found in localStorage");
                    
                                const statusRef = doc(db, "Status", freelancerId);
                    
                                // อัปเดตสถานะการชำระเงินเป็น Confirmed
                                updateDoc(statusRef, {
                                    paymentStatus: "Confirmed",
                                    paymentConfirmed: true
                                }).then(() => {
                                    alert("คุณได้ยืนยันการชำระเงินเรียบร้อยแล้ว");
                    
                                    
                                }).catch((error) => {
                                    console.error("Error confirming payment:", error);
                                });
                            });
                        }
                    
                        // ฟังก์ชันนี้จะทำงานเมื่อลิงก์ถูกเปิด
                        if (linkElement) {
                            // ตรวจสอบเมื่อผู้ใช้ไปยังลิงก์
                            linkElement.addEventListener("click", function () {
                                const freelancerId = localStorage.getItem('freelancer_loggedInUserId');
                                if (!freelancerId) return console.error("Freelancer ID not found in localStorage");
                    
                                const statusRef = doc(db, "Status", freelancerId);
                    
                                // เปลี่ยนสถานะการชำระเงินเป็น "Confirmed"
                                updateDoc(statusRef, {
                                    paymentStatus: "Confirmed",
                                    paymentConfirmed: true
                                }).then(() => {
                                    alert("คุณได้ยืนยันการชำระเงินเรียบร้อยแล้ว");
                    
                                    // ปลดล็อคลิงก์
                                    linkElement.href = linkElement.dataset.url; // ใช้ URL ที่เก็บไว้ใน data-attribute
                                    linkElement.style.display = "inline-block"; // ทำให้ลิงก์สามารถคลิกได้
                                    linkElement.innerHTML = "Click here to view the work"; // เปลี่ยนข้อความลิงก์
                    
                                    // ซ่อนปุ่ม "Get Payment"
                                    paymentBtnContainer.style.display = "none"; // ซ่อนปุ่ม "Get Payment"
                    
                                    // แสดงข้อความว่า "ชำระแล้ว"
                                    if (paymentStatusContainer) {
                                        paymentStatusContainer.innerHTML = "<p>ชำระเงินแล้ว สามารถเข้าดูลิงก์งานได้ทันที</p>";
                                    }
                                }).catch((error) => {
                                    console.error("Error confirming payment:", error);
                                });
                            });
                        }
                    });
                                        
                    
                    
                });
            }

            statusList.appendChild(statusElement);
            foundStatus = true;
        }
    });

    if (!foundStatus) {
        alert("No status found for the provided secret code.");
    }
}



// เช็คสถานะการล็อกอินเมื่อโหลดหน้า
document.addEventListener("DOMContentLoaded", checkLoginStatus); 
console.log("JavaScript file loaded successfully");
