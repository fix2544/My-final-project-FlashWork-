import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { fetchPosts }  from "https://www.gstatic.com/firebasejs/10.13.2/firebasePost.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFdZ3UMjW9pb3BI3pWHgvyf7M-xA0WmyU",
    authDomain: "login-64e84.firebaseapp.com",
    projectId: "login-64e84",
    storageBucket: "login-64e84.appspot.com",
    messagingSenderId: "639525017003",
    appId: "1:639525017003:web:27dfec1475bf121655eeee"
};

// Initialize Firebase App and Services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Display Posts Function (For Freelancers)
