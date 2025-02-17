// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB05cW9rTJPQFGlHr0X713S1wgL8Rr-XDE",
  authDomain: "apply-form-2a78b.firebaseapp.com",
  projectId: "apply-form-2a78b",
  storageBucket: "apply-form-2a78b.firebasestorage.app",
  messagingSenderId: "469342759170",
  appId: "1:469342759170:web:b812a83b8db9181b55fa1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Add Skills Feature
document.addEventListener("DOMContentLoaded", () => {
    const skillsContainer = document.getElementById("skills-container");
    const addSkillBtn = document.getElementById("add-skill-btn");

    const skillsList = [
        { name: "Photoshop", icon: "fab fa-adobe" },
        { name: "Illustrator", icon: "fab fa-adobe" },
        { name: "Premiere Pro", icon: "fas fa-video" },
        { name: "Figma", icon: "fab fa-figma" },
        { name: "After Effects", icon: "fas fa-film" }
    ];

    addSkillBtn.addEventListener("click", () => {
        const skillDiv = document.createElement("div");
        skillDiv.classList.add("d-flex", "align-items-center", "mb-2");

        const skillSelect = document.createElement("select");
        skillSelect.classList.add("form-select", "me-2");
        skillsList.forEach(skill => {
            const option = document.createElement("option");
            option.value = skill.name;
            option.textContent = skill.name;
            skillSelect.appendChild(option);
        });

        const skillIcon = document.createElement("i");
        skillIcon.classList.add("me-2");

        const skillPercentage = document.createElement("input");
        skillPercentage.type = "range";
        skillPercentage.classList.add("form-range", "me-2");
        skillPercentage.min = "0";
        skillPercentage.max = "100";
        skillPercentage.value = "50";

        const percentageLabel = document.createElement("span");
        percentageLabel.textContent = "50%";

        skillPercentage.addEventListener("input", () => {
            percentageLabel.textContent = `${skillPercentage.value}%`;
        });

        skillSelect.addEventListener("change", () => {
            const selectedSkill = skillsList.find(skill => skill.name === skillSelect.value);
            skillIcon.className = selectedSkill ? selectedSkill.icon : "";
        });

        skillDiv.appendChild(skillIcon);
        skillDiv.appendChild(skillSelect);
        skillDiv.appendChild(skillPercentage);
        skillDiv.appendChild(percentageLabel);

        skillsContainer.appendChild(skillDiv);
    });
});

// Handle Form Submission
document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const job = document.getElementById("job").value.trim();
    const jobLink = document.getElementById("jobLink").value.trim();
    const socialLink1 = document.getElementById("jobLink1").value.trim();
    const socialLink2 = document.getElementById("jobLink2").value.trim();
    const socialLink3 = document.getElementById("jobLink3").value.trim();  // Now it's properly stored
    const price = document.getElementById("price").value.trim();
    const description = document.getElementById("description").value.trim();
    const profilePictureUrl = document.getElementById("profilePictureUrl").value.trim();
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

    const skills = [];
    document.querySelectorAll("#skills-container div").forEach(skillDiv => {
        const skillName = skillDiv.querySelector("select").value;
        const skillPercentage = skillDiv.querySelector("input").value;
        skills.push({ name: skillName, percentage: skillPercentage });
    });

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const freelancerRef = doc(db, "freelapply", userCredential.user.uid);

    await setDoc(freelancerRef, { name, job, jobLink, socialLink1, socialLink2, socialLink3, price, description, profilePictureUrl, email, skills });  // Storing socialLink3

    alert("Successfully registered!");
    window.location.href = "freellogin.html";
});

