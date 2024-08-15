// script.js

// Create and append a loading spinner element to the page
const resultsContainer = document.getElementById('results');
const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'loading';
loadingIndicator.innerHTML = '<div class="spinner"></div>Loading...';
resultsContainer.appendChild(loadingIndicator);

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    if (query) {
        fetchResults(query);
    }
});

// Handle theme change
document.getElementById('theme-select').addEventListener('change', function() {
    const theme = this.value;
    document.body.className = theme + '-theme';
});

// Handle line spacing change
document.getElementById('line-select').addEventListener('change', function() {
    const lineSpacing = this.value;
    document.querySelectorAll('.result-item').forEach(item => {
        item.classList.remove('normal-line', 'wide-line');
        item.classList.add(lineSpacing + '-line');
    });
});

function fetchResults(query) {
    loadingIndicator.style.display = 'block'; // Show loading spinner
    
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(query)}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResults(data.query.search);
            loadingIndicator.style.display = 'none'; // Hide loading spinner
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p class="error">There was an error fetching the results. Please try again later.</p>';
            loadingIndicator.style.display = 'none'; // Hide loading spinner
        });
}

function displayResults(results) {
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No results found.</p>';
        return;
    }

    const lineSpacing = document.getElementById('line-select').value;

    results.forEach(result => {
        const title = result.title;
        const snippet = result.snippet;
        const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${lineSpacing}-line`;
        resultItem.innerHTML = `<a href="${pageUrl}" target="_blank" class="result-title">${title}</a><p class="result-snippet">${snippet}</p>`;
        resultsContainer.appendChild(resultItem);
    });
}
