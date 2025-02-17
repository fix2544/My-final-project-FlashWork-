import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBFdZ3UMjW9pb3BI3pWHgvyf7M-xA0WmyU",
    authDomain: "login-64e84.firebaseapp.com",
    projectId: "login-64e84",
    storageBucket: "login-64e84.appspot.com",
    messagingSenderId: "639525017003",
    appId: "1:639525017003:web:27dfec1475bf121655eeee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ฟังก์ชันแสดงโพสต์ (ไม่มีปุ่มแก้ไข/ลบ)
function displayPosts() {
    const postsRef = collection(db, "posts");
    const postsQuery = query(postsRef, orderBy("timestamp", "desc"));

    onSnapshot(postsQuery, (snapshot) => {
        const postsContainer = document.getElementById("posts");
        if (!postsContainer) {
            console.error("Element with id 'posts' not found.");
            return;
        }
        postsContainer.innerHTML = ""; // ล้างเนื้อหาก่อนโหลดใหม่

        snapshot.forEach(doc => {
            const post = doc.data();
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            postElement.innerHTML = `
                <p><strong>${post.username}</strong> - ${new Date(post.timestamp.seconds * 1000).toLocaleString()}</p>
                <p>${post.text}</p>
                ${post.contactLink ? 
                    `<a href="${post.contactLink}" target="_blank">
                       <i class="fab fa-facebook-messenger" style="font-size: 20px; margin-left: 5px;"></i>
                     </a>` 
                    : ""}
            `;

            postsContainer.appendChild(postElement);
        });
    });
}

// โหลดโพสต์เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
    displayPosts();
});
