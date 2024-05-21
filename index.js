// Variable declaration section
const searchBtn = document.getElementById("search-btn");
const moviesEl = document.getElementById("movies-el");
const watchListEl = document.getElementById("watchlist-el");
let rating;
let movieDetails = [];

// Create a dialog element
const dialog = document.createElement('div');
dialog.className = 'dialog';
document.body.appendChild(dialog);

// Function to show dialog
function showDialog(message) {
    dialog.textContent = message;
    dialog.classList.add('show');
    setTimeout(() => {
        dialog.classList.remove('show');
    }, 3000);
}

// Search button fetch function and logic
searchBtn.addEventListener("click", async function fetchData() {
    moviesEl.innerHTML = '';
    const apiKey = "e0711f60";
    const userInput = document.getElementById("user-input").value;
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${userInput}`;

    const res = await fetch(url);
    const searchData = await res.json();
    // Check if res is true and if it is, iterate through the searchData array
    if (searchData.Response === "True") {
        movieDetails = await Promise.all(searchData.Search.map(async movie => {
            const detailUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
            const detailRes = await fetch(detailUrl);
            if (!detailRes.ok) {
                throw new Error('Network response was not ok.');
            }
            // This is the second data returned by the API
            return detailRes.json();
        }));

        for (let i = 0; i < movieDetails.length; i++) {
            rating = movieDetails[i].Ratings.length > 0 ? movieDetails[i].Ratings[0].Value : 'N/A';
            moviesEl.innerHTML += `
                <div class="main-container" data-index="${i}">
                    <div class="movie-img">
                        <img src="${movieDetails[i].Poster}" alt="">
                        <div class="add-to-watchlist">
                            <button class="watchlist-btn">Add to watchlist</button>
                        </div>
                    </div>
                    <div class="movie-details">
                        <div class="movie-details-head">
                            <h2>${movieDetails[i].Title}<br><span><img src="/images/rating icon.png" alt="rating star"><span>${rating}</span></span></h2>
                        </div>
                        <div class="movie-details-mid">
                            <p>${movieDetails[i].Runtime}</p>
                            <p>${movieDetails[i].Genre}</p>
                        </div>
                        <div class="description">
                            <p>${movieDetails[i].Plot}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    } else {
        showDialog('No results found for your search.');
    }
});

// Function to save movie to local storage
function saveToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.some(watchedMovie => watchedMovie.imdbID === movie.imdbID)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        showDialog(`${movie.Title} added to watchlist.`);
    } else {
        showDialog(`${movie.Title} is already in your watchlist.`);
    }
}

// Function to handle adding to watchlist
function handleAddToWatchlist(event, index) {
    const movie = movieDetails[index];
    saveToWatchlist(movie);
    event.target.classList.add('added-to-watchlist');
    event.target.textContent = 'In your watchlist';
}

// Event delegation to handle clicks on "Add to watchlist" buttons
moviesEl.addEventListener("click", function (event) {
    if (event.target.classList.contains('watchlist-btn')) {
        const movieContainer = event.target.closest('.main-container');
        if (movieContainer) {
            const index = movieContainer.getAttribute('data-index');
            handleAddToWatchlist(event, index);
        }
    }
});
