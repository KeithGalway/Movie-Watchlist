const watchContainer = document.getElementById('watch-container')                             // get watch container element

let addedToWatchlist = JSON.parse(localStorage.getItem('watchlist')) || []                    // get the watch list from local storage

if (addedToWatchlist.length === 0) {                                                          // if the watch list is empty
    renderEmptyWatchlist()                                                                    // display html with message of empty watch list
} else {                                                                                      // if the watch list is not empty
    renderFilm(addedToWatchlist, watchContainer)                                              // display html with embedded film data in watch container element
}

const watchlistElements = document.querySelectorAll('.fa-circle-plus')                        // get all the elements with class fa-circle-plus
for (const item of watchlistElements) {                                                       // for each of the items in the elements found
    item.classList.replace('fa-circle-plus', 'fa-circle-minus')                               // change class fa-circle-plus to fa-circle-minus
}

// click event listener to remove movie from the watch list
document.addEventListener('click', (e) => {
    if (e.target.dataset.filmid) {                                                            // if the click occurred on an element with the data-filmid attribute value of a specific id 
        const id = e.target.dataset.filmid                                                    // save the id in const id

        const el = e.target.closest('.film-container')                                        // find the parent container of the movie with matching id (film-container element for that id)
        el.remove()                                                                           // remove that film-container element

        addedToWatchlist = addedToWatchlist.filter((element) => {                             // update the watchlist to updated list with filtered out movie
            return element.imdbID !== id                                                      // returns all elements that do not match the id
        })
    }

    if (addedToWatchlist.length === 0) {                                                      // after the movie is removed, check if the watch list is empty
        renderEmptyWatchlist()                                                                // if it is, then display html with message of empty watch list
    }

    localStorage.setItem('watchlist', JSON.stringify(addedToWatchlist))                       // set updated watch list to local storage
})

// renderFilm function renders html with embedded film data
function renderFilm(films, container) {
    let htmlFeed = ''                                                                          // declare empty html string

    for (const film of films) {                                                                // for each of the films in the films array
        htmlFeed += `
            <div class="film-container">
                <div class="img-container">
                    <img src="${film.Poster}" class="film-poster" alt="poster to film" />
                </div>
                <div class="film-details">
                    <div class="film-title-container">
                        <p class="film-title">${film.Title}</p>
                        <img src="assets/star.png" class="rating-star" alt="image of yellow star" />
                        <p class="film-rating">${film.imdbRating}</p>
                    </div>
                    <div class="film-info">
                        <p class="film-typography">${film.Runtime}</p>
                        <p class="film-typography">${film.Genre}</p>
                        <i class="fa-solid fa-circle-plus" data-filmid="${film.imdbID}"></i>
                        <p class="watchlist-text film-typography">Watchlist</p>
                    </div>
                    <p class="film-plot">${film.Plot}</p>
                </div>
            </div>
        `                                                                                    // create html to display film data (for each film)
    }
    container.innerHTML = htmlFeed                                                           // set container to html with embedded film data 
}

// renderEmptyWatchlist function runs if the watch list is empty
function renderEmptyWatchlist() {
    watchContainer.innerHTML = `
        <div class="start-exploring">
            <p class="empty-watchlist-paragraph">Your watchlist is looking a little empty...</p>
            <div class="watchlist-empty-container">
                <a href="index.html">
                    <img src="assets/add-movies.svg" /> 
                    <p>Let's add some movies!</p>
                </a>
            </div>
        </div>
    `                                                                                         // renders html to display empty watch list message
}