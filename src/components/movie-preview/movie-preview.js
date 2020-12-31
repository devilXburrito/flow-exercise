import ENV from '../../../env-vars.js';

class MoviePreview extends HTMLElement {
    template = document.createElement('div');
    movieDetails;

    set movie(movie) {
        this.template.insertAdjacentHTML('afterbegin', `
            <style>
                :host {
                    flex: 0 25%;
                    padding: 25px;
                    box-sizing:border-box
                }

                .movie-preview {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .movie-preview_poster {
                    position: relative;
                    min-width: 300px;
                    min-height: 455px;
                    background-color: lightseagreen;
                }

                .movie-preview_title {
                    font-size: 22px;
                }

                .movie-preview_info-details {
                    position: absolute;
                    text-align: center;
                    font-size: 20px;
                    background-color: rgba(0, 0, 0, 0.80);
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    top: 0;
                    left: 0;
                    box-sizing:border-box
                }

                .movie-preview_info-details.hide {
                    display: none;
                }

                .movie-preview_info-details.show {
                    display: block;
                }

                .movie-preview_info-year {
                    font-size: 18px;
                }
            </style>

            <div class="movie-preview_poster">
             <img src=${movie.Poster} alt="" class="movie-preview_poster-image"/>
             <div class="movie-preview_info-details hide"></div>
            </div>
            <h1 class="movie-preview_title">${movie.Title}</h1>
            <div class="movie-preview_info">
                <h2 class="movie-preview_info-year">${movie.Year}</h2>
            </div>
        `);
        this.fetchMovieDetails(movie.Title);
    }

    constructor () {
      super();
      this.template.setAttribute('class', 'movie-preview');
      this.bindMovieDetailsChanges();
    }
    
    connectedCallback () {
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(this.template);
    }

    bindMovieDetailsChanges() {
        this.template.addEventListener('mouseover', this.showMovieDetails.bind(this));
        this.template.addEventListener('mouseout', this.clearMovieDetails.bind(this));
    }

    showMovieDetails() {
        const details = this.template.querySelector('.movie-preview_info-details');
        details.setAttribute('class', 'movie-preview_info-details show');
        
        details.innerHTML = `${this.movieDetails}`;
    }

    clearMovieDetails() {
        const details = this.template.querySelector('.movie-preview_info-details');
        details.setAttribute('class', 'movie-preview_info-details hide');

        details.innerHTML = ``;
    }

    async fetchMovieDetails(title) {
        const movieDetails = await fetch(`${ENV.omdbUrl}?apikey=${ENV.omdbKey}&type=${ENV.omdbType}&t=${title}`).then(response => response.json());
        this.movieDetails = movieDetails.Plot;
    }
  }
  
  window.customElements.define('movie-preview', MoviePreview)