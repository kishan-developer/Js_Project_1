// 
const api_key = "api_key=47ae45b316a49c696d64ff975af42329";
const nowPlayingURL = "https://api.themoviedb.org/3/movie/now_playing?page=1";//api. instead of developers
const imageBaseURL = "https://image.tmdb.org/t/p/";
const genereURL = "https://developers.themoviedb.org/3/genres/get-movie-list";

// const genereURL = "https://api.themoviedb.org/3/genres/get-movie-list";
const searchURL = "https://api.themoviedb.org/3/search/movie?page=1&query=";
const detailsURL = "https://api.themoviedb.org/3/movie/";

const movieCardList = document.querySelector(".cards");
const modalSection = document.querySelector(".modal");
const genresList = document.querySelector(".genres-list");
const checkout = document.querySelector(".checkout");
const amount = document.querySelector(".amount")
const tax = document.querySelector(".tax")
const totalAmount = document.querySelector(".total-amount")
const tickets = document.getElementById("tickets");
let price = 250;


// fetching the data 
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
            id: movie.id,
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
        const { title, posterPath, voteAverage, language, id } = movie;
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

        card.addEventListener("click", openModal)

        function openModal() {

            modalSection.style.display = "block";

            fetchDetails(id);

        }
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
    // fetchGenere(genereURL)
}

// while searching if clicks on logo it goes to the home page
const logo = document.querySelector(".logo-text");
logo.addEventListener("click", () => {
    location.reload();
})



function reMapGenere({ results: genereList }) {
    return genereList.map((genre) => {
        return {
            title: genre.title,
            posterPath: genre.poster_path,
            voteAverage: genre.vote_average,
            language: genre.original_language,
        }
    })
}

function genereData(movieList) {
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



// Fetching the movie details

async function fetchDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?${api_key}`)

    const data = await response.json();
    console.log(data)

    const { title, backdrop_path, vote_average, original_language, runtime, genres, overview } = data;
    const allGenres = genres.reduce((acc, curr) => acc + curr.name + ", ", "").slice(0, -2);
    //slice and reduce

    price = Math.ceil(Math.random() * (300 - 250) + 250);

    modalSection.innerHTML = `
        <div class="modal-content">
        <span class="close">&times;</span>

        <img src="${imageBaseURL}original${backdrop_path}" class="image-modal" alt="${title}">
        <div class="details">
            <h3 class="details-title">${title}</h3>
            
            <span class="detail-rating">★ ${vote_average}/10</span>
            
            <p class="details-lang">${original_language.toUpperCase()}</p>
            <p class="details-runtime">${runtime} minutes &#x2022; <span>${allGenres}</span></p>
            
            <p class="details-overview">${overview}</p>
            
            <p class="details-price">₹ ${price}</p>
            <button class="btn">Book Tickets </button>
            </div>
        </div>
    `;



    let bookingBtn = modalSection.querySelector(".btn");

    let closeBtn = modalSection.querySelector(".close");

    closeBtn.addEventListener("click", closeModal)

    function closeModal() {
        modalSection.style.display = "none";
        // closeBtn.removeEventListener("click", closeModal)
    }


    bookingBtn.addEventListener("click", openCheckoutPage)

    function openCheckoutPage() {
        modalSection.style.display = "none";
        checkout.style.display = "block";

        document.querySelector(".checkout-title").textContent = title

        amount.textContent = price;
        let taxValue = +((price * 1.75 * tickets.value) / 100).toFixed(2);
        tax.textContent = taxValue;

        totalAmount.textContent = ((price + taxValue) * tickets.value).toFixed(2);

        // localStorage.setItem("movie-price", price)
        // bookingBtn.removeEventListener("click", openCheckoutPage)
    }
}

tickets.addEventListener("input", () => {
    amount.textContent = price;
    let taxValue = +((price * 1.75 * tickets.value) / 100).toFixed(2);
    tax.textContent = taxValue;

    totalAmount.textContent = ((price + taxValue) * tickets.value).toFixed(2);

})
const backBtn = document.querySelectorAll(".close-checkout");
backBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        checkout.style.display = "none";
    })
});



// get the genres
const getGenres = async function () {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?${api_key}`);

        let { genres } = await response.json();

        console.log(genres)
        // render(data)

        genresList.textContent = "";



        genres.forEach((genre) => {
            const li = document.createElement("li")
            li.textContent = genre.name;

            genresList.appendChild(li)

            li.addEventListener("click", () => {
                fetchData(`https://api.themoviedb.org/3/discover/movie?include_adult=false&page=1&sort_by=popularity.desc&with_genres=${genre.id}`)
            })
        })

    } catch (error) {
        console.log(error);
    }
}
getGenres()


// checkout

function getFromLocal() {
    return localStorage.getItem("movie-price");
}

