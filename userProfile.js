import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB05cW9rTJPQFGlHr0X713S1wgL8Rr-XDE",
  authDomain: "apply-form-2a78b.firebaseapp.com",
  projectId: "apply-form-2a78b",
  storageBucket: "apply-form-2a78b.appspot.com",
  messagingSenderId: "469342759170",
  appId: "1:469342759170:web:b812a83b8db9181b55fa1b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ดึงข้อมูลผู้ใช้หลังจากล็อกอิน
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;

    // ดึงข้อมูลจาก Firestore
    const userDocRef = doc(db, "freelapply", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // เติมข้อมูลในฟอร์ม
      const userData = userDoc.data();
      document.getElementById("name").value = userData.name || "";
      document.getElementById("job").value = userData.job || "";
      document.getElementById("jobLink").value = userData.jobLink || "";
      document.getElementById("jobLink1").value = userData.socialLink1 || "";
      document.getElementById("jobLink2").value = userData.socialLink2 || "";
      document.getElementById("price").value = userData.price || "";
      document.getElementById("description").value = userData.description || "";
      document.getElementById("profilePictureUrl").value = userData.profilePictureUrl || ""; // เติม URL ของรูปโปรไฟล์

      // ดึงและเติมข้อมูลสกิล
      if (userData.skills && Array.isArray(userData.skills)) {
        const skillsContainer = document.getElementById("skillsContainer");
        userData.skills.forEach(skill => {
          const skillDiv = document.createElement('div');
          skillDiv.classList.add('mb-3', 'skill-item');
          skillDiv.innerHTML = `
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Skill Name" value="${skill.name}" required>
              <input type="number" class="form-control" placeholder="Percentage (0-100)" value="${skill.percentage}" required min="0" max="100">
              <button type="button" class="btn btn-danger removeSkillBtn">Remove</button>
            </div>
          `;
          skillsContainer.appendChild(skillDiv);
          
          // ลบฟิลด์สกิล
          skillDiv.querySelector('.removeSkillBtn').addEventListener('click', function() {
            skillsContainer.removeChild(skillDiv);
          });
        });
      }
    } else {
      console.error("No data found for user:", uid);
    }
  } else {
    console.error("No user is logged in.");
    window.location.href = "freellogin.html"; // Redirect to login page
  }
});

// บันทึกข้อมูลที่แก้ไขกลับไปยัง Firestore
document.getElementById("userProfileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedData = {
    name: document.getElementById("name").value,
    job: document.getElementById("job").value,
    jobLink: document.getElementById("jobLink").value,
    socialLink1: document.getElementById("jobLink1").value,
    socialLink2: document.getElementById("jobLink2").value,
    price: document.getElementById("price").value,
    description: document.getElementById("description").value,
    profilePictureUrl: document.getElementById("profilePictureUrl").value, // เพิ่มฟิลด์ URL ของรูปโปรไฟล์
    skills: getSkillsFromForm() // เพิ่มข้อมูลสกิล
  };

  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    const userDocRef = doc(db, "freelapply", uid);

    try {
      await updateDoc(userDocRef, updatedData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  }
});

// ฟังก์ชั่นดึงข้อมูลสกิลจากฟอร์ม
function getSkillsFromForm() {
  const skills = [];
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(skillItem => {
    const skillName = skillItem.querySelector('input[type="text"]').value;
    const skillPercentage = skillItem.querySelector('input[type="number"]').value;
    if (skillName && skillPercentage) {
      skills.push({ name: skillName, percentage: parseInt(skillPercentage) });
    }
  });
  return skills;
}

// เพิ่มฟิลด์สกิลใหม่
document.getElementById('addSkillBtn').addEventListener('click', function() {
  const skillsContainer = document.getElementById('skillsContainer');
  
  // สร้างฟิลด์ใหม่สำหรับกรอกสกิล
  const skillDiv = document.createElement('div');
  skillDiv.classList.add('mb-3', 'skill-item');
  skillDiv.innerHTML = `
    <div class="input-group">
      <input type="text" class="form-control" placeholder="Skill Name" required>
      <input type="number" class="form-control" placeholder="Percentage (0-100)" required min="0" max="100">
      <button type="button" class="btn btn-danger removeSkillBtn">Remove</button>
    </div>
  `;
  skillsContainer.appendChild(skillDiv);
  
  // ลบฟิลด์สกิล
  skillDiv.querySelector('.removeSkillBtn').addEventListener('click', function() {
    skillsContainer.removeChild(skillDiv);
  });
});
