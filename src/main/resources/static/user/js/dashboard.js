document.addEventListener("DOMContentLoaded", function() {

    const userJson = sessionStorage.getItem("loggedInUser");
    if (!userJson) {
        window.location.href = "index.html";
        return;
    }

    const user = JSON.parse(userJson);
    console.log("Logged in as:", user.username);

    const canteens = [
        {
            name: "Emerson Canteen",
            location: "3rd Floor Devesse Building",
            campus: "SLU Mary Heights Campus",
            id: 1
        },
        {
            name: "Oval Canteen",
            location: "SLU Oval",
            campus: "SLU Mary Heights Campus",
            id: 2
        },
        {
            name: "Bakakeng Canteen",
            location: "Main Building",
            campus: "SLU Bakakeng Campus",
            id: 3
        }
    ];

    const container = document.getElementById('canteenContainer');

});

function selectCanteen(id) {
    console.log("Selected Canteen ID:", id);
    // Save the ID so the Menu page knows which canteen to load
    sessionStorage.setItem("selectedCanteenId", id);
    window.location.href = "menu.html";
}