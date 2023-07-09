// 
const api_key = "api_key=47ae45b316a49c696d64ff975af42329";
const nowPlayingURL = "https://api.themoviedb.org/3/movie/now_playing?page=1";//api. instead of developers
const imageBaseURL = "https://image.tmdb.org/t/p/";
const genereURL = "https://api.themoviedb.org/3/genres/get-movie-list";
const searchURL = "https://api.themoviedb.org/3/search/movie?page=1&query=";
const detailsURL = "https://api.themoviedb.org/3/movie/";

const movieCardList = document.querySelector(".cards");




const fetchData = async function (url) {
    try {
        const response = await fetch(`${url}&${api_key}`);

        let data = await response.json();

        data = reMapData(data)
        // console.log(data)
        render(data)
    } catch (error) {
        console.log(error);
    }
}

function reMapData({ results: movieList }) {
    return movieList.map((movie) => {
        return {
            title: movie.title,
            posterPath: movie.poster_path,
            voteAverage: movie.vote_average,
            language: movie.original_language,
        }
    })
}

function render(movieList) {
    movieCardList.textContent = "";

    movieList.forEach(movie => {
        const { title, posterPath, voteAverage, language } = movie;
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
        <img src="${imageBaseURL}w185${posterPath}" alt="${title}"/>
        <div class="card-details">
        <h3 class="card-title">${title}</h3>

        <div class="info">
            <span>${language.toUpperCase()}</span>
            <span>${voteAverage.toFixed(1)}</span>
        </div>
        </div>
        `;
        movieCardList.appendChild(card);
    });
}

const heading = document.querySelector(".heading");
const searchInput = document.querySelector(".search-input")
const searchBtn = document.querySelector(".search-btn")

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    heading.textContent = "Results for: " + searchInput.value;
    // console.log(searchInput.value);
    fetchData(searchURL + searchInput.value.trim())
})
window.onload = () => {
    fetchData(nowPlayingURL);
}
//"https://api.themoviedb.org/3/search/movie?page=1&query=hello&api_key=47ae45b316a49c696d64ff975af42329"
// https://api.themoviedb.org/3/search/movie?page=1&query=hello&api_key=47ae45b316a49c696d64ff975af42329

const logo = document.querySelector(".logo-text");
logo.addEventListener("click", () => {
    location.reload();
})