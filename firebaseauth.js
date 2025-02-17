// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Your web app's Firebase configuration
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

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// ฟังก์ชันป้องกันการกดย้อนกลับ
function preventBack() {
    window.history.forward();
}

setTimeout(preventBack, 0);
window.onunload = function () { null };

document.addEventListener('DOMContentLoaded', () => {
    const signUp = document.getElementById('submit');
    signUp.addEventListener('click', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const auth = getAuth();
        const db = getFirestore();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userData = {
                    email: email,
                    username: username
                };
                showMessage('Account Created Successfully', 'signUpMessage');
                const docRef = doc(db, "user", user.uid);
                setDoc(docRef, userData)
                    .then(() => {
                        window.location.href = 'register1.html';
                    })
                    .catch((error) => {
                        console.error("Error writing document", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/email-already-in-use') {
                    showMessage('Email Address Already Exists !!!', 'signUpMessage');
                } else {
                    showMessage('Unable to create User', 'signUpMessage');
                }
            });
    });

    const signIn = document.getElementById('submit');
    if (signIn) {
        signIn.addEventListener('click', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const auth = getAuth();

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    showMessage('Login is successful', 'signInMessage');
                    const user = userCredential.user;
                    localStorage.setItem('client_loggedInUserId', user.uid);

                    // ตรวจสอบ UID หากเป็น UID ที่ต้องการให้ไปที่หน้า admin.html
                    if (user.uid === "BHAtHgt1gSP2ZeoScA95sl2EAFQ2") {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'joblist.html';
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/invalid-credential') {
                        showMessage('Incorrect Email or Password', 'signInMessage');
                    } else {
                        showMessage('Account does not Exist', 'signInMessage');
                    }
                });
        });
    } else {
        console.error("Element with ID 'submitLogin' not found.");
    }

    // ตรวจสอบสถานะการล็อกอิน
    const userId = localStorage.getItem('client_loggedInUserId');
    if (userId) {
        preventBack();  // ป้องกันการย้อนกลับเมื่อผู้ใช้ล็อกอินแล้ว
    }
});
