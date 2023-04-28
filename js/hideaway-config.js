function toggleDescription() {
    const hideaway = document.getElementById("hideaway");
    const frame = document.getElementById("frame");
    const button = document.getElementById("button");

    if (hideaway.style.display === "none") {
        hideaway.style.display = "block";
        button.innerHTML = "&#x25BC; Hide Info";
        frame.style.width = "70%";
    } else {
        hideaway.style.display = "none";
        frame.style.width = "100%";
        button.innerHTML = "&#x25B2; Show Info";
    }
};

