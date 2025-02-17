import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB05cW9rTJPQFGlHr0X713S1wgL8Rr-XDE",
    authDomain: "apply-form-2a78b.firebaseapp.com",
    projectId: "apply-form-2a78b",
    storageBucket: "apply-form-2a78b.appspot.com",
    messagingSenderId: "469342759170",
    appId: "1:469342759170:web:b812a83b8db9181b55fa1b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("viewFreelancersBtn").addEventListener("click", async () => {
    const dataDisplay = document.getElementById("dataDisplay");
    dataDisplay.innerHTML = "<h4>Loading Freelancers...</h4>";

    try {
        const querySnapshot = await getDocs(collection(db, "freelapply"));
        dataDisplay.innerHTML = ""; // Clear loading text

        querySnapshot.forEach((docSnap) => {
            const freelancer = docSnap.data();
            const freelancerCard = document.createElement('div');
            freelancerCard.className = "card mb-3 p-3 shadow-sm";

            freelancerCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${freelancer.name}</h5>
                        <p>Email: ${freelancer.email}</p>
                        <p>Job: ${freelancer.job}</p>
                    </div>
                    <button class="btn btn-danger btn-sm delete-freelancer" data-id="${docSnap.id}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            `;
            dataDisplay.appendChild(freelancerCard);
        });

        if (querySnapshot.empty) {
            dataDisplay.innerHTML = "<p>No freelancers found.</p>";
        }

        // Add event listener for delete buttons
        document.querySelectorAll('.delete-freelancer').forEach(button => {
            button.addEventListener('click', async (e) => {
                const freelancerId = e.currentTarget.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this freelancer?')) {
                    await deleteFreelancer(freelancerId);
                }
            });
        });

    } catch (error) {
        console.error("Error fetching freelancers:", error);
        dataDisplay.innerHTML = "<p>Error loading freelancer data.</p>";
    }
});

async function deleteFreelancer(freelancerId) {
    try {
        await deleteDoc(doc(db, "freelapply", freelancerId));
        alert('Freelancer deleted successfully.');
        document.getElementById("viewFreelancersBtn").click(); // Refresh the freelancer list
    } catch (error) {
        console.error("Error deleting freelancer:", error);
        alert('Failed to delete freelancer.');
    }
}
