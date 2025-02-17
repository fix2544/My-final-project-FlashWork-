import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


// Firebase configuration
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


// สร้าง Modal สำหรับจ้างงาน
document.body.innerHTML += `
    <div class="modal fade" id="hireModal" tabindex="-1" aria-labelledby="hireModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="hireModalLabel">Hire Freelancer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="hireForm">
                        <div class="mb-3">
                            <label for="projectName" class="form-label">Please Login</label>
                        </div>
                        
`;


// ฟังก์ชันแสดงข้อมูลฟรีแลนซ์
async function displayFreelancerData() {
    try {
        const freelancersCollectionRef = collection(db, "freelapply");
        const querySnapshot = await getDocs(freelancersCollectionRef);


        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();


            // ตรวจสอบหน้าที่กำลังแสดง
            const currentPage = window.location.pathname;
            if (currentPage.includes("no2.html") && data.job !== "Logo Design") return;
            if (currentPage.includes("no3.html") && data.job !== "Video Editor") return;
            if (currentPage.includes("no1.html") && data.job !== "Graphic Design") return;


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


            const storedFreelancerId = localStorage.getItem("freelancer_loggedInUserId") || data.uid;

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
            <a href="# || "#"}" target="_blank" title="Facebook Profile" class="icon-link">
                <i class="fab fa-facebook"></i>
            </a>
            <a href="#|| "#"}" target="_blank" title="Instagram Profile" class="icon-link">
                <i class="fab fa-instagram"></i>
            </a>
            <a href="# || "#"}" target="_blank" title="Messenger" class="icon-link">
                <i class="fa-regular fa-message"></i>
            </a>
        </div>

        <button class="hire-btn btn btn-success" data-freelancer-id="${storedFreelancerId}">Hire</button>
    </div>
`;


            // เพิ่ม freelancer ลงในหน้าเว็บ
            document.body.appendChild(freelancerDiv);
        });


        // ปุ่ม toggle รายละเอียด
        document.querySelectorAll(".toggle-description").forEach(button => {
            button.addEventListener("click", function () {
                const description = this.nextElementSibling;
                const isVisible = description.style.display === "block";
                description.style.display = isVisible ? "none" : "block";
                this.textContent = isVisible ? "Description" : "Hide Description";
            });
        });


        // ปุ่ม Hire
        document.querySelectorAll(".hire-btn").forEach(button => { 
            button.addEventListener("click", function () {
                const freelancerId = localStorage.getItem("freelancer_loggedInUserId"); // ดึง UID จาก Local Storage
                if (!freelancerId) {
                    alert("Error: Freelancer ID not found!");
                    return;
                }
        
                const hireModalInstance = new bootstrap.Modal(document.getElementById("hireModal"));
                hireModalInstance.show();
        
                // ฟอร์มการจ้างงาน
                document.getElementById("hireForm").onsubmit = async function(event) {
                    event.preventDefault();
        
                    const hireData = {
                        projectName: document.getElementById("projectName").value,
                        projectDescription: document.getElementById("projectDescription").value,
                        budget: document.getElementById("budget").value,
                        timeline: document.getElementById("timeline").value,
                        clientInfo: document.getElementById("clientInfo").value,
                        createdAt: new Date(),  
                        clientId: localStorage.getItem("client_loggedInUserId"),  // UID ของลูกค้า
                        freelancerId: freelancerId  // UID ของฟรีแลนซ์จาก Local Storage
                    };
        
                    try {
                        const docRef = await addDoc(collection(db, "hireRequests"), hireData);
                        console.log("Document written with ID: ", docRef.id);
        
                        hireModalInstance.hide();
                        alert("Job information submitted successfully!");
                    } catch (error) {
                        console.error("Error adding document: ", error);
                        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล!");
                    }
                };
            });
        });
        
        

    } catch (error) {
        console.error("Error fetching documents:", error);
    }
}


// เรียกใช้ฟังก์ชันเมื่อหน้าเว็บโหลด
document.addEventListener("DOMContentLoaded", displayFreelancerData);



