const inputField = document.getElementById('text-field')                            // get input field element
const searchForm = document.getElementById('movie')                                 // get search form element
const container = document.getElementById('container')                              // get container element

const moviesArr = []                                                                // declare movies array

let watchlistArr = JSON.parse(localStorage.getItem('watchlist')) || []              // get watch list from local storage if there is any

// click event listener saves a movie to localstorage
document.addEventListener('click', (e) => {
    if (e.target.dataset.filmid) {                                                  // if the click occurred on an element with the data-filmid attribute value of a specific id 
        const id = e.target.dataset.filmid                                          // save the id in const id

        const elementActionIcon = document.querySelector(`[data-filmid='${id}']`)   // gets the idiomatic element with a specific id
        elementActionIcon.classList.replace('fa-circle-plus', 'fa-circle-check')    // replace class fa-circle-plus with fa-circle-check 

        for (const item of moviesArr) {                                             // for the items in the movies array
            if (item.imdbID === id) {                                               // if movie id matches the id in the rendered html
                watchlistArr.push(item)                                             // add the movie to the watch list array
            }
        }

        watchlistArr = watchlistArr.reduce((acc, current) => {                      // maps over the watch list array and saves current movie object to acc array object
            const duplicates = acc.find(item => {                                   // as the movie items accumalate and a duplicate is found, save the duplicate object
                return item.imdbID === current.imdbID                               // return the object of which the logic in the return is true
            })

            if (!duplicates) {                                                      // if no duplicate was found
                return acc.concat(current)                                          // add the current array elements to the watch list
            } else {                                                                // if duplicate was found
                return acc                                                          // just return acc array (ignoring the duplicate) to the watch list
            }
        }, [])
        setLocal()                                                                  // run setLocal function which saves the watchlist to localstorage
    }
})

// submit event listener listens for form submit
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()                                                              // prevent default browser reload
    removeChildNodes(container)                                                     // clear the child elements of container element

    if (inputField.value === null || inputField.value === '') {                     // if the input search field is null or empty
        removeChildNodes(container)                                                 // clear the child elements of container element
        container.innerHTML = `
            <div class="start-exploring">
                <p>Unable to find what you're looking for. Please try another search.<p>
            </div>
        `                                                                           // set the container html to display no results
    } else {                                                                        // if there is an input in the search
        getFilmDetails()                                                            // sets the container html to display film details
    }
})

// getFilmDetails function requests film details and renders the details in html
async function getFilmDetails() {
    const response = await fetch(`https://www.omdbapi.com/?apikey=f7c82950&s=${inputField.value}&type=movie`)  // perform a search on the omdbapi (receives stream data)
    const data = await response.json()                                              // converts the stream data from the response to json data

    const filmId = getImdbID(data.Search)                                           // gets an array of all the movie ids of the movie list

    for (const item of filmId) {                                                    // for each item of filmId array
        const response2 = await fetch(`https://www.omdbapi.com/?apikey=f7c82950&i=${item}`)  // perform a seach on imbdapi for a particular id (receives stream data)
        const data2 = await response2.json()                                        // converts the stream data from the response to json data
        moviesArr.push(data2)                                                       // push the movie information to the movies array
    }
    renderFilm(moviesArr, container)                                                // render film data in html
}

// renderFilm function renders html with embedded film data
function renderFilm(films, container) {
    let htmlFeed = ''                                                               // declare empty html string

    for (const film of films) {                                                     // for each of the films in the films array
        htmlFeed += `
            <div class="film-container">
                <div class="img-container">
                    <img src="${film.Poster}" class="film-poster" alt="poster of film" />
                </div>
                <div class="film-details">
                    <div class="film-title-container">
                        <p class="film-title">${film.Title}</p>
                        <img src="assets/star.png" class="rating-star" alt="star icon" />
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
        `                                                                          // create html to display film data (for each film)
    }
    container.innerHTML = htmlFeed                                                 // set container to html with embedded film data 
}

// returns array of movie id's
function getImdbID(filmArr) {
    const movieId = filmArr.map((movie) => {                                       // map over array of movies
        return movie.imdbID                                                        // return the id of each movie
    })
    return movieId                                                                 // return an array of movie ids
}

// saves to local storage
function setLocal() {
    localStorage.setItem('watchlist', JSON.stringify(watchlistArr))                // saves the watchlist array to localstorage
}

// removeChildNodes function clears the html in a parent element
function removeChildNodes(parent) {
    if (parent.children.length > 0) {                                              // if the parent element has one or more children                                         
        while (parent.firstChild) {                                                // while the first child is present
            parent.removeChild(parent.lastChild)                                   // remove the last child (loop until the first child is reached and removed, ending the while loop)
        }
    }
}