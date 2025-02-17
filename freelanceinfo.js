import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB05cW9rTJPQFGlHr0X713S1wgL8Rr-XDE",
  authDomain: "apply-form-2a78b.firebaseapp.com",
  projectId: "apply-form-2a78b",
  storageBucket: "apply-form-2a78b.firebasestorage.app", 
  messagingSenderId: "469342759170",
  appId: "1:469342759170:web:b812a83b8db9181b55fa1b",
};

// Check if Firebase app already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem('freelancer_loggedInUserId');
  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById('loggeduseremail').innerText = userData.email || "No email";
        } else {
          console.log("No document found matching ID.");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    console.log("User ID not found in local storage.");
  }
});

// Handle logout functionality
const logoutButton = document.getElementById("logOut");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("You have logged out.");
        localStorage.removeItem('freelancer_loggedInUserId');
        window.location.href = "freellogin.html";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        alert("Error signing out. Please try again.");
      });
  });
}

// Display logged-in user info (if available)
const user = auth.currentUser;
if (user) {
  document.getElementById("loggedusername").textContent = user.displayName || "Unknown";
  document.getElementById("loggeduseremail").textContent = user.email || "No email";
}

