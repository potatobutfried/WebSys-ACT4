function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    // Show loading indicator
    resultsDiv.innerHTML = '';
    loadingDiv.classList.remove('d-none');

    // Fetch book data
    fetch('https://potatobutfried.github.io/books/books.json') // Adjust to your data URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadingDiv.classList.add('d-none');

            if (!searchTerm) {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-info-circle"></i>
                        <h5>Please enter a title to search</h5>
                    </div>
                `;
                return;
            }

            const books = Array.isArray(data) ? data : [data];

            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm)
            );

            displayResults(filteredBooks);
        })
        .catch(error => {
            loadingDiv.classList.add('d-none');
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle text-danger"></i>
                    <h5>Error loading books</h5>
                    <p class="text-muted">${error.message}</p>
                </div>
            `;
        });
}

function displayResults(books) {
    const resultsDiv = document.getElementById('results');

    if (books.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <i class="fas fa-book-dead"></i>
                <h5>No books found</h5>
                <p class="text-muted">Try a different search term</p>
            </div>
        `;
        return;
    }

    let html = `
        <table class="table contact-table table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Availability</th>
                </tr>
            </thead>
            <tbody>
    `;

    books.forEach(book => {
        let availabilityHTML;
        if (book.available) {
            availabilityHTML = `<span class="available">Available</span>`;
        } else {
            availabilityHTML = `<span class="unavailable">Checkout</span>`;
        }
        html += `
            <tr>
                <td><strong>${book.title || 'N/A'}</strong></td>
                <td>${book.author || 'N/A'}</td>
                <td>${book.genre || 'N/A'}</td>
                <td>${availabilityHTML}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    resultsDiv.innerHTML = html;
}