document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addForm');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 1. Check if User is Logged In
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!user || !user.sellerProfile) {
            alert("Error: You are not logged in as a seller.");
            window.location.href = '../user/index.html';
            return;
        }

        // 2. Get Data from HTML Inputs
        const nameVal = document.getElementById('name').value;
        const priceVal = document.getElementById('price').value;
        const descVal = document.getElementById('description') ? document.getElementById('description').value : "";

        // 3. Create the JSON Payload
        // This matches the 'FoodRequest' class in your MenuController.java
        const payload = {
            sellerId: user.sellerProfile.id,
            name: nameVal,
            price: parseFloat(priceVal),
            description: descVal
        };

        // 4. Send to Backend
        try {
            const response = await fetch('/api/menu/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Item added successfully!');
                window.location.href = 'seller-menu.html'; // Go back to menu to see the new item
            } else {
                const errorText = await response.text();
                console.error("Server Error:", errorText);
                alert('Failed to add item: ' + errorText);
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert('Could not connect to server.');
        }
    });
});@