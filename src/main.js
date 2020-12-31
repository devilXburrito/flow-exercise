// Please do not share or post this api key anywhere,
// Your JavaScript will go here, you can view api information at
// http://www.omdbapi.com/, but the short of it is you'll need to
// send an "s" param with your query, an "apiKey" which is provided above
// and a "type" param. The api also accepts "page" as a parameter, and
// accepts standard numbers as arguments (i.e. page=1)
import ENV from '../env-vars.js';

window.addEventListener('load', () => {
    bindSearchChanges();
});

function bindSearchChanges() {
    const app = document.querySelector('app');
    const search = document.getElementById('search');
    // something like RxJs debounce time.. but using vanilla js xD
    const debounceTime = 800;
    let debounce;

    search.addEventListener('input', (event) => {
        app.innerHTML = `<h3>Searching...</h3>`;
        const searchEvent = event;
        clearTimeout(debounce);

        debounce = setTimeout(() => {
            fetchMovies(app, searchEvent);
        }, debounceTime);
    })
}

async function fetchMovies(app, event) {
    const movies = await fetch(`${ENV.omdbUrl}?apikey=${ENV.omdbKey}&type=${ENV.omdbType}&s=${event.srcElement.value}`).then(response => response.json());
    loadMovies(app, movies);
}

function loadMovies(app, movies) {
    if (!app || !movies || movies.Response === 'False') {
        app.innerHTML = `<h3>We couldn't find your movie, please try to search a more specific movie name...</h3>`;
        return;
    }

    app.innerHTML = ``;
    movies.Search.sort((a,b) => a.Year - b.Year);
    movies.Search.forEach((movie) => {
        const moviePreview = document.createElement('movie-preview');
        moviePreview.movie = movie;
        app.append(moviePreview);
    })
}
