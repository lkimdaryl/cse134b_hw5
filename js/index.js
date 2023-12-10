document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("rating-form");
    const maxStars = document.getElementById("rating").getAttribute("max");
    const starsContainer = document.getElementById("stars");
    const messageElement = document.getElementById("message");
    const inputRate = document.getElementById("rating");
    const submit = document.querySelector("button[type='submit']");
    inputRate.style.display = "none";
    submit.style.display = "none";

    for (let i = 1; i <= maxStars; i++) {
        const star = document.createElement("span");
        star.innerHTML = "&starf;"; // Unicode character for a filled star
        star.setAttribute("data-rating", i);
        star.addEventListener("click", updateRating);
        starsContainer.appendChild(star);
    }

    function updateRating(event) {
        const selectedRating = event.target.getAttribute('data-rating');
        inputRate.value = selectedRating;
        resetStars();
        highlightStars(selectedRating);
        submitRating();
    }

    function resetStars() {
        const stars = starsContainer.children;
        Array.from(stars).forEach(star => star.style.color = "black");
    }

    function highlightStars(selectedRating) {
        const stars = starsContainer.children;
        for (let i = 0; i < selectedRating; i++) {
            stars[i].style.color = "gold";
        }
    }

    function submitRating() {
        const rating = inputRate.value;
        const isPositive = (rating / maxStars) >= 0.8;

        messageElement.innerText = isPositive ?
        "Thank you for your positive feedback!" : "We appreciate your feedback. We'll do better next time";

        const endpoint = form.action;
        const formData = new FormData(form);
        const formDataObject = {};
        formData.forEach((value, key) => { formDataObject[key] = value; });
        const formDataJson = JSON.stringify(formDataObject);
//        console.log('FormData as JSON:', formDataObject);

        fetch(endpoint, {
            method: form.method,
            headers: {
                "Content-Type" : "application/json"
            },
            body: formDataJson
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("error: ", error );
        })
    }
});