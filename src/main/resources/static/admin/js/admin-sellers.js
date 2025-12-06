const API_BASE_URL = "http://localhost:8080";
let currentSellers = [];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Check URL parameters to see if we should open 'Approved' tab immediately
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');

    if (view === 'approved') {
        switchTab('approved');
    } else {
        switchTab('pending');
    }

    // 2. Setup Search Listener
    document.getElementById("searchInput").addEventListener("input", function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterAndRender(searchTerm);
    });
});

async function switchTab(tabName) {
    // UI Updates: Highlight the correct button
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active', 'bg-success', 'text-white', 'fw-bold', 'shadow-sm');
        btn.classList.add('text-muted');
    });

    const activeBtn = document.getElementById(`tab-${tabName}`);
    if(activeBtn) {
        activeBtn.classList.add('active', 'bg-success', 'text-white', 'fw-bold', 'shadow-sm');
        activeBtn.classList.remove('text-muted');
    }

    // Show loading state
    const listArea = document.getElementById("pendingListArea");
    listArea.innerHTML = "<p class='text-center text-muted mt-5'>Loading...</p>";

    // Determine Endpoint
    let endpoint = "/api/admin/pending-sellers";
    if (tabName === 'approved') endpoint = "/api/admin/approved-sellers";
    if (tabName === 'all') endpoint = "/api/admin/all-sellers";

    try {
        const response = await fetch(API_BASE_URL + endpoint);
        if (!response.ok) throw new Error("Server Error: " + response.status);

        currentSellers = await response.json();
        console.log(`Loaded ${tabName} list:`, currentSellers); // Debugging
        filterAndRender("");
    } catch (e) {
        console.error(e);
        listArea.innerHTML = `<p class='text-danger text-center'>Error loading data: ${e.message}</p>`;
    }
}

function filterAndRender(searchTerm) {
    const listArea = document.getElementById("pendingListArea");
    listArea.innerHTML = "";

    const filtered = currentSellers.filter(seller =>
        seller.canteenName.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        listArea.innerHTML = "<p class='text-center text-muted mt-4'>No results found.</p>";
        return;
    }

    filtered.forEach(seller => {
        let actionButtons = '';
        let statusBadge = '';

        // ROBUST STATUS CHECKS (Handles different data formats from Java)
        const isApproved = (seller.approved === true || seller.isApproved === true || String(seller.approved) === "true");
        const isSuspended = (seller.suspended === true || seller.isSuspended === true || String(seller.suspended) === "true");

        // FIX "USER UNKNOWN": Safe navigation in case user is null
        const username = (seller.user && seller.user.username) ? seller.user.username : 'Unknown';

        // --- RENDER LOGIC ---
        if (isApproved) {
            if (isSuspended) {
                // SUSPENDED VIEW
                statusBadge = `<small class="text-secondary fw-bold bg-light px-2 py-1 rounded"><i class="bi bi-pause-circle-fill"></i> Suspended</small>`;
                actionButtons = `
                    <div class="d-flex gap-2 mt-2">
                        <button onclick="reactivate(${seller.id})" class="btn btn-sm btn-success px-3 fw-bold">Reactivate</button>
                        <button onclick="viewSeller(${seller.id})" class="btn btn-sm btn-outline-secondary px-3 fw-bold">View</button>
                    </div>`;
            } else {
                // ACTIVE VIEW
                statusBadge = `<small class="text-success fw-bold bg-success bg-opacity-10 px-2 py-1 rounded"><i class="bi bi-check-circle-fill"></i> Active</small>`;
                actionButtons = `
                    <div class="d-flex gap-2 mt-2">
                        <button onclick="suspend(${seller.id})" class="btn btn-sm btn-outline-danger px-3 fw-bold">Suspend</button>
                        <button onclick="viewSeller(${seller.id})" class="btn btn-sm btn-outline-secondary px-3 fw-bold">View</button>
                    </div>`;
            }
        } else {
            // PENDING VIEW
            statusBadge = `<small class="text-warning fw-bold bg-warning bg-opacity-10 px-2 py-1 rounded"><i class="bi bi-hourglass-split"></i> Pending</small>`;
            actionButtons = `
                <div class="d-flex gap-2 mt-2">
                    <button onclick="approve(${seller.id})" class="btn btn-sm btn-success px-3 fw-bold">Approve</button>
                    <button onclick="reject(${seller.id})" class="btn btn-sm btn-danger px-3 fw-bold">Reject</button>
                </div>`;
        }

        const card = document.createElement("div");
        card.className = "seller-card";
        card.innerHTML = `
            <div class="placeholder-img-sm">IMG</div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="fw-bold mb-0 text-dark">${seller.canteenName}</h6>
                        <small class="text-muted d-block" style="font-size: 0.8rem;">User: ${username}</small>
                    </div>
                    ${statusBadge}
                </div>
                ${actionButtons}
            </div>
        `;
        listArea.appendChild(card);
    });
}

// --- BUTTON ACTIONS ---

async function approve(id) {
    if(!confirm("Approve this seller?")) return;
    performAction(`/api/admin/approve/${id}`, 'POST');
}

async function reject(id) {
    if(!confirm("Reject application?")) return;
    performAction(`/api/admin/reject/${id}`, 'DELETE');
}

async function suspend(id) {
    if(!confirm("Suspend this seller? They won't be able to login.")) return;
    performAction(`/api/admin/suspend/${id}`, 'POST');
}

async function reactivate(id) {
    if(!confirm("Reactivate this seller?")) return;
    performAction(`/api/admin/reactivate/${id}`, 'POST');
}

// --- HELPER FUNCTION TO HANDLE ERRORS ---
async function performAction(url, method) {
    try {
        const response = await fetch(API_BASE_URL + url, { method: method });

        if (response.ok) {
            // Success: Refresh the current tab to show changes
            refreshCurrentTab();
        } else {
            // Failure: Alert the user with the server error
            const errorText = await response.text();
            alert("Action Failed: " + errorText);
        }
    } catch (error) {
        console.error(error);
        alert("Network Error: Could not connect to server.");
    }
}

function viewSeller(id) {
    const seller = currentSellers.find(s => s.id === id);
    if(seller && seller.user) {
        alert(`
        Canteen: ${seller.canteenName}
        Owner: ${seller.user.username}
        Phone: ${seller.user.phoneNumber || 'N/A'}
        Campus: ${seller.user.campus || 'N/A'}
        Status: ${seller.isSuspended ? 'Suspended' : 'Active'}
        `);
    } else {
        alert("Seller details not found.");
    }
}

function refreshCurrentTab() {
    const activeTab = document.querySelector('.nav-link.active');
    if(activeTab) {
        const tabName = activeTab.id.replace('tab-', '');
        switchTab(tabName);
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "../user/index.html";
}