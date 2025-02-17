import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"; 
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB05cW9rTJPQFGlHr0X713S1wgL8Rr-XDE",
    authDomain: "apply-form-2a78b.firebaseapp.com",
    projectId: "apply-form-2a78b",
    storageBucket: "apply-form-2a78b.firebasestorage.app", 
    messagingSenderId: "469342759170",
    appId: "1:469342759170:web:b812a83b8db9181b55fa1b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch multiple freelancer data from Firestore
async function displayFreelancerData() {
    try {
        const freelancersCollectionRef = collection(db, "freelapply");
        const querySnapshot = await getDocs(freelancersCollectionRef);

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();

            // ตรวจสอบหน้าที่กำลังแสดง
            const currentPage = window.location.pathname;
            if (currentPage.includes("logodesign.html") && data.job !== "Logo Design") return;
            if (currentPage.includes("vdoedit.html") && data.job !== "Video Editor") return;
            if (currentPage.includes("graphicdesign.html") && data.job !== "Graphic Design") return;

            // สร้าง HTML สำหรับสกิล
            let skillsHTML = `<div class="skills-container">`;
            if (data.skills && Array.isArray(data.skills)) {
                data.skills.forEach(skill => {
                    skillsHTML += `
                        <div class="skill">
                            <span>${skill.name}</span>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${skill.percentage}%;"></div>
                            </div>
                            <span>${skill.percentage}%</span>
                        </div>
                    `;
                });
            }
            skillsHTML += `</div>`;

            // สร้าง element หลักของ freelancer
            const freelancerDiv = document.createElement("div");
            freelancerDiv.classList.add("freelancer");

            freelancerDiv.innerHTML = `
                <div class="freelancer-card">
                    <img src="${data.profilePictureUrl || 'default-profile.png'}" alt="Profile Picture" class="freelancer-profile" width="150" height="150" style="border-radius: 50%;">
                    <h3>${data.name || "N/A"}</h3>
                    <p>Job: ${data.job || "N/A"}</p>
                    <p>Price: ${data.price || "N/A"}</p>

                    ${skillsHTML}

                    <button class="toggle-description btn btn-sm btn-info">Description</button>
                    <p class="description-text" style="display: none;">${data.description || "N/A"}</p>

                    <div class="icon-wrapper">
                        <a href="${data.jobLink || "#"}" target="_blank" title="Job Link" class="icon-link">
                            <i class="fas fa-briefcase"></i>
                        </a>
                        <a href="${data.socialLink1 || "#"}" target="_blank" title="Facebook Profile" class="icon-link">
                            <i class="fab fa-facebook"></i>
                        </a>
                        <a href="${data.socialLink2 || "#"}" target="_blank" title="Instagram Profile" class="icon-link">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="${data.socialLink3 || "#"}" target="_blank" title="Messenger" class="icon-link">
                            <i class="fa-regular fa-message"></i>
                        </a>
                        
                    </div>
                </div>


            `;

            // เพิ่ม freelancer ลงในหน้าเว็บ
            document.body.appendChild(freelancerDiv);
        });

        // เพิ่ม Event Listener ให้ปุ่ม Description ทุกอัน
        document.querySelectorAll(".toggle-description").forEach(button => {
            button.addEventListener("click", function () {
                const description = this.nextElementSibling;
                const isVisible = description.style.display === "block";
                description.style.display = isVisible ? "none" : "block";
                this.textContent = isVisible ? "Description" : "Hide Description";
            });
        });

    } catch (error) {
        console.error("Error fetching documents:", error);
    }
}

// Execute the function on page load
document.addEventListener("DOMContentLoaded", displayFreelancerData);
