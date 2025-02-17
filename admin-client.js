
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

document.getElementById("viewClientsBtn").addEventListener("click", async () => {
    const dataDisplay = document.getElementById("dataDisplay");
    dataDisplay.innerHTML = "<h4>Loading Clients...</h4>";

    try {
        const querySnapshot = await getDocs(collection(db, "user"));
        dataDisplay.innerHTML = ""; // Clear loading text

        querySnapshot.forEach((docSnap) => {
            const client = docSnap.data();
            const clientCard = document.createElement('div');
            clientCard.className = "card mb-3 p-3 shadow-sm";

            clientCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${client.username}</h5>
                        <p>Email: ${client.email}</p>
                    </div>
                    <button class="btn btn-danger btn-sm delete-client" data-id="${docSnap.id}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            `;
            dataDisplay.appendChild(clientCard);
        });

        if (querySnapshot.empty) {
            dataDisplay.innerHTML = "<p>No clients found.</p>";
        }

        // Add event listener for delete buttons
        document.querySelectorAll('.delete-client').forEach(button => {
            button.addEventListener('click', async (e) => {
                const clientId = e.currentTarget.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this client?')) {
                    await deleteClient(clientId);
                }
            });
        });

    } catch (error) {
        console.error("Error fetching clients:", error);
        dataDisplay.innerHTML = "<p>Error loading client data.</p>";
    }
});

async function deleteClient(clientId) {
    try {
        await deleteDoc(doc(db, "user", clientId));
        alert('Client deleted successfully.');
        document.getElementById("viewClientsBtn").click(); // Refresh the client list
    } catch (error) {
        console.error("Error deleting client:", error);
        alert('Failed to delete client.');
    }
}
