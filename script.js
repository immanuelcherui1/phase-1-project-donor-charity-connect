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

// Function to convert file to base64
async function getFileBase64(fileInput) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]); // Get rid of the "data:image/png;base64," part
        };

        reader.onerror = reject;

        if (fileInput.files[0]) {
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            resolve(null);
        }
    });
}

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
    // Redirect to details.html with the selected organization ID
    window.location.href = `details.html?id=${charityCauseId}`;
}
function displayOrganizations(organizations) {
    // Select the organizations container element by its ID
    const organizationsContainer = document.getElementById('organizations');

    // Clear previous content in the organizations container
    organizationsContainer.innerHTML = '';

    // Iterate through each organization and create a card for it
    organizations.forEach(organization => {
        // Create a div element for the organization card
        const organizationCard = document.createElement('div');

        // Add class and attribute to the card
        organizationCard.classList.add('organization-card');
        organizationCard.setAttribute('data-organization-id', charityCause.organizations);

        // Set the inner HTML content of the card dynamically
        organizationCard.innerHTML = `
            <h2>${charityCause.organizations.name}</h2>
            <img src="${charityCause.organizations.image}" alt="${charityCause.title}">
            <p>${charityCause.organizations.age}</p>
            <button onclick="Donate(${organizations.donationMethod})">Donate</button>
        `;

        // Attach the card to the organization object for potential reference
        organization.element = organizationCard;

        // Append the card to the organizations container
        organizationsContainer.appendChild(organizationCard);
    });
}



// Execute when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Include the header by calling includeHTML
    includeHTML('header.html', 'header');
    includeHTML('beFeatured.html', 'beFeaturedHeader');

    // Fetch charitableCauses from a db.json file
    fetch('db.json')  
        .then(response => response.json())
        .then(charityCauses => {
            // Store the original list of charities
            charities = charityCauses;

            // Display the charities on the page
            displayCharities(charities);
            return charities;
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

//WHY DONATE.html//
// Include the header AND footer by calling includeHTML
includeHTML('whyDonate.html', 'header');
includeHTML('whyDonate.html', 'footer');

//BE FEATURED.html//
// Include the header AND footer by calling includeHTML
includeHTML('beFeatured.html', 'header');
includeHTML('beFeatured.html', 'footer');

// TO BE FEATURED SCRIPT
// script.js

let form = document.getElementById('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let name = form.querySelector("#name").value;
    let contact = form.querySelector("#number").value;
    let email = form.querySelector("#email").value;
    let subCounty = form.querySelector("#name").value; // Changed selector to match HTML
    let address = form.querySelector("#address").value;
    let categorySelected = form.querySelector("#categorySelection").value;
    let whaYouDo = form.querySelector("#whatYouDo").value;
    let donationMethod = form.querySelector("#donationMethod").value;
    let donationCredentials = form.querySelector("#donationCredentials").value;
    
    let fileInput = form.querySelector('#file');
    let projectImage1Input = form.querySelector('#projectImage1');
    let projectImage2Input = form.querySelector('#projectImage2');
    let projectImage3Input = form.querySelector('#projectImage3');

    let file = await getFileBase64(fileInput);
    let projectImage1 = await getFileBase64(projectImage1Input);
    let projectImage2 = await getFileBase64(projectImage2Input);
    let projectImage3 = await getFileBase64(projectImage3Input);

    let formData = {
        name: name,
        contact: contact,
        email: email,
        subCounty: subCounty,
        address: address,
        categorySelected: categorySelected,
        whaYouDo: whaYouDo,
        donationMethod: donationMethod,
        donationCredentials: donationCredentials,
        file: file,
        projectImages: {
            projectImage1: projectImage1,
            projectImage2: projectImage2,
            projectImage3: projectImage3
        }
    };

    // Find the organization in db.json that matches the selected category
    let matchingOrganization = charities.find(org => org.title.toUpperCase() === categorySelected.toUpperCase());

    if (matchingOrganization) {
        // Add the form data to the organizations key in the matching organization
        matchingOrganization.organizations[Date.now()] = formData; // Use timestamp as key

        // Update the db.json file with the modified data
        fetch('db.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(charities),
        })
        .then(res => res.json())
        .then(data => {
            console.log('Data sent successfully:', data);
            // Add any additional handling here
        })
        .catch(error => console.error('Error:', error));
    } else {
        console.error('No matching organization found.');
    }
});
