import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyBFdZ3UMjW9pb3BI3pWHgvyf7M-xA0WmyU",
    authDomain: "login-64e84.firebaseapp.com",
    projectId: "login-64e84",
    storageBucket: "login-64e84.appspot.com",
    messagingSenderId: "639525017003",
    appId: "1:639525017003:web:27dfec1475bf121655eeee"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth=getAuth();
  const db=getFirestore();

  onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('client_loggedInUserId');
    if (loggedInUserId) {
        const docRef = doc(db, "user", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedusername').innerText = userData.username;
                    document.getElementById('loggeduseremail').innerText = userData.email;

                    // Check if the UID matches the admin's UID
                    if (user.uid === "BHAtHgt1gSP2ZeoScA95sl2EAFQ2") {
                        // ถ้าเป็น Admin ให้เปลี่ยน URL โดยไม่รีโหลดหน้า
                        history.pushState(null, null, 'admin.html');
                        // คุณสามารถโหลดเนื้อหาของหน้า admin.html ที่นี่ได้โดยไม่ต้องรีเฟรช
                    } else {
                        history.pushState(null, null, 'joblist.html');
                    }
                } else {
                    console.log("No document found matching the id");
                }

            })
            .catch((error) => {
                console.log("Error getting document");
            });
    } else {
        console.log("User ID not found in Local storage");
    }
});
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('client_loggedInUserId');
    signOut(auth)
        .then(() => {
            // หลังจากการล็อกเอาท์เสร็จแล้ว
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error Signing out:', error);
        });
});

// ป้องกันการย้อนกลับเมื่ออยู่ในหน้า index.html
function preventBack() {
    window.history.forward();
}

document.addEventListener("DOMContentLoaded", () => {
    // เมื่อหน้า index.html โหลดเสร็จ
    if (window.location.pathname === "/index.html") {
        preventBack();  // ป้องกันการย้อนกลับ
        setTimeout(preventBack, 0);  // ทำให้การป้องกันเกิดขึ้นทันที
        window.onunload = function () { null };  // ฟังก์ชันนี้ทำให้หน้าไม่ถูกทิ้ง

        // ใช้ pushState เพื่อไม่ให้สามารถย้อนกลับไปหน้าเดิมได้
        history.pushState(null, null, location.href);
        history.back();
        history.forward();
    }
});

  
