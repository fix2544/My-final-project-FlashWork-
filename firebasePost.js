import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

// ฟังก์ชันแสดงโพสต์
function displayPosts(userId = null, canEdit = false) {
    const postsRef = collection(db, "posts");
    const postsQuery = query(postsRef, orderBy("timestamp", "desc"));

    onSnapshot(postsQuery, (snapshot) => {
        const postsContainer = document.getElementById("posts");
        if (!postsContainer) return;  // ตรวจสอบว่า postsContainer มีอยู่หรือไม่
        postsContainer.innerHTML = "";

        snapshot.forEach(doc => {
            const post = doc.data();
            const postId = doc.id;
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            // แสดงเฉพาะโพสต์ของผู้ใช้ที่ตรงกับ userId
            if (post.userId !== userId) return;

            postElement.innerHTML = `
                <p><strong>${post.username}</strong> - ${new Date(post.timestamp.seconds * 1000).toLocaleString()}</p>
                <p>${post.text}</p>
                ${post.contactLink ? 
                    `<a href="${post.contactLink}" target="_blank">
                       <i class="fab fa-facebook-messenger" style="font-size: 20px; margin-left: 5px;"></i>
                     </a>` 
                    : ""}
            `;

            if (canEdit && post.userId === userId) {
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", () => editPost(postId, post.text));

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => deletePost(postId));

                postElement.appendChild(editButton);
                postElement.appendChild(deleteButton);
            }

            postsContainer.appendChild(postElement);
        });
    });
}

// ฟังก์ชันเพิ่มโพสต์
async function addPost(userId, username, postText, contactLink) {
    const postsRef = collection(db, "posts");

    await addDoc(postsRef, {
        userId: userId,
        username: username,
        text: postText,
        contactLink: contactLink,
        timestamp: new Date(),
    });
    console.log("Post added!");
}

// ฟังก์ชันแก้ไขโพสต์
async function editPost(postId, oldText) {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
        const newText = prompt("Edit your post:", oldText);
        if (newText !== null && newText !== oldText) {
            await updateDoc(postRef, {
                text: newText,
            });
            console.log("Post updated!");
        }
    } else {
        console.error("No such post to update!");
    }
}

// ฟังก์ชันลบโพสต์
async function deletePost(postId) {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
        await deleteDoc(postRef);
        console.log("Post deleted!");
    } else {
        console.error("No such post to delete!");
    }
}

// ส่วนจัดการการทำงานของหน้าหลัก
document.addEventListener("DOMContentLoaded", () => {
    const addPostButton = document.getElementById("add-post-btn");
    const postInput = document.getElementById("post-input");
    const contactLinkInput = document.getElementById("contact-link");

    const clientLoggedInUserId = localStorage.getItem("client_loggedInUserId");
    const freelancerLoggedInUserId = localStorage.getItem("freelancer_loggedInUserId");

    if (clientLoggedInUserId) {
        // ลูกค้าที่ล็อกอิน
        const docRef = doc(db, "user", clientLoggedInUserId);
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const username = userData.username;

                displayPosts(clientLoggedInUserId, true); // ลูกค้าสามารถแก้ไขหรือลบโพสต์ได้

                if (addPostButton) {
                    addPostButton.addEventListener("click", () => {
                        const postText = postInput.value.trim();
                        const contactLink = contactLinkInput.value.trim();

                        if (postText) {
                            addPost(clientLoggedInUserId, username, postText, contactLink);
                            postInput.value = "";
                            contactLinkInput.value = "";
                        }
                    });
                }
            } else {
                console.error("No document found for user ID");
            }
        }).catch((error) => {
            console.error("Error getting document: ", error);
        });
    } else if (freelancerLoggedInUserId) {
        // ฟรีแลนซ์ที่ล็อกอิน
        displayPosts(freelancerLoggedInUserId, true); // แสดงโพสต์ของ freelancer ที่ล็อกอิน
    } else {
        // กรณีไม่มีการล็อกอิน
        displayPosts(null, false); // แสดงโพสต์โดยไม่มีสิทธิ์แก้ไขหรือลบ
    }
});
