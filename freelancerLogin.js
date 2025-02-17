import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB05cW9rTJPQFGlHr0X713S1wgL8Rr-XDE",
  authDomain: "apply-form-2a78b.firebaseapp.com",
  projectId: "apply-form-2a78b",
  storageBucket: "apply-form-2a78b.appspot.com", // แก้ไข storageBucket
  messagingSenderId: "469342759170",
  appId: "1:469342759170:web:b812a83b8db9181b55fa1b",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function preventBack() {
    window.history.forward();
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please enter your email and password.");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save login info to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          lastLogin: new Date().toISOString(),
          
        });

        // Save the logged-in user's UID to localStorage as freelancer_loggedInUserId
        localStorage.setItem('freelancer_loggedInUserId', user.uid);

        alert("Login successful and data saved!");
        window.location.href = "123.html"; // Redirect to dashboard
      } catch (error) {
        console.error("Error during login:", error);
        alert("Invalid email or password. Please try again.");
      }
    });
  }

  // Handle logout functionality
  const logoutButton = document.getElementById("logOut");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          // Successfully signed out
          alert("You have logged out.");
          localStorage.removeItem('freelancer_loggedInUserId'); // Remove the logged-in user ID from localStorage
        })
        .catch((error) => {
          console.error("Error signing out:", error);
          alert("Error signing out. Please try again.");
        });
    });
  }

  // Display logged-in user info
  const user = auth.currentUser;
  if (user) {
    document.getElementById("loggedusername").textContent = user.displayName || "Unknown";
    document.getElementById("loggeduseremail").textContent = user.email || "No email";
  }

  // Prevent back button after login
  const userId = localStorage.getItem('freelancer_loggedInUserId');
  if (userId) {
    preventBack();  // ป้องกันการย้อนกลับเมื่อผู้ใช้ล็อกอินแล้ว
  }

  setTimeout(preventBack, 0);
  window.onunload = function () { null };
});
