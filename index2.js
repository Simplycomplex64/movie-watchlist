const watchListEl = document.getElementById("watchlist-el");

// Function to display watchlist
function displayWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchListEl.innerHTML = ''; // Clear existing content
    watchlist.forEach((movie, index) => {
        watchListEl.innerHTML += `
            <div class="main-container" data-index="${index}">
                <div class="movie-img">
                    <img src="${movie.Poster}" alt="">
                    <div class="add-to-watchlist">
                        <button class="watchlist-btn-remove">Remove</button>
                    </div>
                </div>
                <div class="movie-details">
                    <div class="movie-details-head">
                        <h2>${movie.Title}<br><span><img src="/images/rating icon.png" alt="rating star"><span>${movie.Ratings.length > 0 ? movie.Ratings[0].Value : 'N/A'}</span></span></h2>
                    </div>
                    <div class="movie-details-mid">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                    </div>
                    <div class="description">
                        <p>${movie.Plot}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

// Function to show dialog
function showDialog(message) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog show';
    dialog.textContent = message;
    document.body.appendChild(dialog);
    setTimeout(() => {
        dialog.classList.remove('show');
        document.body.removeChild(dialog);
    }, 3000);
}

// Function to remove movie from watchlist
function removeFromWatchlist(index) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const movie = watchlist[index];
    watchlist.splice(index, 1);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
    showDialog(`${movie.Title} removed from watchlist.`);
}

// Call displayWatchlist to show the watchlist when the page loads
document.addEventListener("DOMContentLoaded", displayWatchlist);

// Event delegation to handle clicks on "Remove" buttons
watchListEl.addEventListener("click", function(event) {
    if (event.target.classList.contains('watchlist-btn-remove')) {
        const movieContainer = event.target.closest('.main-container');
        if (movieContainer) {
            const index = movieContainer.getAttribute('data-index');
            removeFromWatchlist(index);
        }
    }
});
