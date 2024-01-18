// ...

// Function to fetch and include HTML files
function includeHTML(file, elementId) {
    // Fetch HTML file content
    fetch(file)
        .then(response => response.text())
        .then(html => {
            // Set the content of the specified element with the fetched HTML
            document.getElementById(elementId).innerHTML = html;
        });
}

// Execute when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Include the header by calling includeHTML
    includeHTML('header.html', 'header');

    // Fetch charitableCauses from a db.json file
    fetch('db.json')
        .then(response => response.json())
        .then(charityCauses => {
            // Store the original list of charities
            charities = charityCauses;

            // Display the charities on the page
            displayCharities(charities);
        });

    // Include the footer by calling includeHTML after all charities have been displayed
    includeHTML('footer.html', 'footer');
});

// Select the search input element with the attribute data-charity-search
const searchInput = document.querySelector("[data-charity-search]");

// Add an event listener to the search input for input events
searchInput.addEventListener("input", e => {
    // Get the lowercase value of the input
    const value = e.target.value.toLowerCase();

    // Filter the list of charities based on the input value
    const filteredCharities = charities.filter(charityCause => {
        return (
            charityCause.title.toLowerCase().includes(value) ||
            charityCause.description.toLowerCase().includes(value)
        );
    });

    // Display the filtered charities on the page
    displayCharities(filteredCharities);
});



// Function to display charities on the page
function displayCharities(charityCauses) {
    // Select the charity container element by its ID
    const charityContainer = document.getElementById('charityCauses');

    // Clear previous content in the charity container
    charityContainer.innerHTML = '';

    // Iterate through each charity and create a card for it
    charityCauses.forEach(charityCause => {
        // Create a div element for the charity card
        const charityCauseCard = document.createElement('div');

        // Add class and attribute to the card
        charityCauseCard.classList.add('charityCause-card');
        charityCauseCard.setAttribute('data-charity-id', charityCause.id);

        // Set the inner HTML content of the card dynamically
        charityCauseCard.innerHTML = `
            <h2>${charityCause.title}</h2>
            <img src="${charityCause.image}" alt="${charityCause.title}">
            <p>${charityCause.description}</p>
            <button onclick="viewMore(${charityCause.id})">View More</button>
        `;

        // Attach the card to the charity object for potential reference
        charityCause.element = charityCauseCard;

        // Append the card to the charity container
        charityContainer.appendChild(charityCauseCard);
    });
}

// Function to handle "View More" button click
function viewMore(charityCauseId) {
    // Redirect to details.html with the selected charity ID
    window.location.href = `details.html?id=${charityCauseId}`;
}

// Include the footer by calling includeHTML
includeHTML('footer.html', 'footer');

