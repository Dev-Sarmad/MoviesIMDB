//global variables
const global = {
  // It helps to determine on which page is currently open.
  currentPage: window.location.pathname,
  search: {
    type: "",
    term: "",
    page: 1,
    totalPages: 1,
  },
  api: {
    api_url: `https://api.themoviedb.org/3/`,
    api_key: `03e8760e5618e9c5f7860240d33c9f0c`,
  },
};

// displaying the popular movies from the tmdb API.
const displayPopular = async () => {
  const { results } = await fetchData("movie/popular");
  console.log(results);
  results.forEach((populardMovie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        
                <a href="details.html?id=${populardMovie.id}">
                
                ${
                  populardMovie.poster_path
                    ? `<div
                    class="overflow-hidden bg-contain h-full w-full rounded-lg"
                    style="background-image: url(https://image.tmdb.org/t/p/w500/${populardMovie.poster_path})"
                  ></div>`
                    : `<div
                      class="overflow-hidden bg-contain h-full w-full rounded-lg"
                      style="background-image: url(./images/no-image.jpg)"
                    ></div>`
                }
                
                <div class="text-center font-bold text-white">
                <h4>${populardMovie.title}</h4>
              </div>
                </a>
              
              `;
    document.querySelector(".popular-movies").appendChild(div);
  });
};

// displaying the movie detail.
const displayMovieDetails = async () => {
  // Each movie has id so we have to reder that id to fetch the details
  //for this we have assign the <a href="details.html?id="></a>
  //we apply the window.location.search which return after the ? i.e|?id=1122 etc Now split it and get the ID;
  const movie_id = window.location.search.split("=")[1]; // ['?id', '975902']
  const movie = await fetchData(`movie/${movie_id}`);
  console.log(movie);
  // console.log(movie.credits.cast.length);
  // displayBackdrop(movie.backdrop_path);
  const div = document.createElement("div");
  div.classList.add("details");
  div.innerHTML = `
          <!-- Movie Title and Rating -->
        <div class="flex justify-between">
          <!-- Movie title -->
          <div class="font-semibold">
            <h2 class="text-white">${movie.title}</h2>
            <span class="text-white">${movie.runtime} minutes |</span>
            <span class="text-white">${movie.release_date}</span>
          </div>
          <!-- Movie Rating -->
          <div class="text-white">
            <i class="fa-solid fa-star" style="color: #e8ec09"></i> ${movie.vote_average.toFixed(
              0
            )}
          </div>
        </div>
        <!-- Image and Overview -->
        <div
          class="mt-12 max-w-xl flex space-x-2 md:max-w-2xl md:space-x-10 md:justify-between"
        >
          <!-- Movie Image -->
          <div class="overflow-hidden">
            <img src="https://image.tmdb.org/t/p/w500/${
              movie.poster_path
            }" alt="" />
          </div>
          <!-- Movie Overview -->
          <div
            class="max-w-sm text-left px-3 text-white md:p-10 md:justify-center md:font-semibold"
          >
            <p>
              ${movie.overview}
            </p>
          </div>
        </div>
        <!-- Movie Rating and Tagline -->
        <div class="mt-3 flex space-x-3 justify-around">
          <div class="md:hidden text-white">
            Movie Rating <br />
            <i class="fa-solid fa-star" style="color: #e8ec09"></i>${
              movie.vote_average
            }
          </div>
          <!-- Movie Tagline -->
          <h3 class="text-green-300">${movie.tagline}</h3>
        </div>
        <div class="flex justify-center mt-3">
          <a href="${movie.homepage} target="_blank"
            class="bg-yellow-400 text-black font-semibold mt-3 px-3 items-center border-none"
          >
            <i class="fa-solid fa-house" style="color: #000"></i>
            Visit homepage
          </a>
        </div>
        <hr class="mt-3 " />
        <div class="flex flex-col md:flex-row md:justify-between">
        <div class="casts mt-3 text-green-300 font-bold">
          <span>Casts</span>
          <ul class="mt-2">
            ${movie.credits.cast
              .slice(0, 4)
              .map(
                (cast) =>
                  `<li class="text-white">${cast.name} as ${cast.character} </li>`
              )
              .join("")}
          </ul>
        </div>
        <div class="genres mt-3 text-green-300 font-bold">
          <span>Genre</span>
          <ul class="mt-2">
            ${movie.genres

              .map((genre) => `<li class="text-white">${genre.name} </li>`)
              .join("")}
          </ul>
        </div>
        <div class="genres mt-3 text-green-300 font-bold">
          <span>Language</span>
          <ul class="mt-2">
            ${movie.spoken_languages

              .map((lang) => `<li class="text-white">${lang.name} </li>`)
              .join("")}
          </ul>
        </div>
        </div>
`;

  document.querySelector(".movie-details").appendChild(div);
};

//Search Movie
const search = async () => {
  //url after the ? ?type=movie&search=Irure+ipsum+sunt+ve
  const queryString = window.location.search;
  // for getting the type and specific search we use URLSearchParams because
  //it has a get method
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type"); //name="type" which value was movie
  global.search.term = urlParams.get("search"); ///name="search" which has a specific value

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, page, total_pages, total_results } = await searchApiData();
    global.search.page = page;
    global.search.totalPages = total_pages;
    console.log(results);
    displaySearchResults(results);
  } else {
    alert("kindly search something");
    window.location.href = "/index.html";
  }
};

const searchApiData = async () => {
  const url = global.api.api_url;
  const key = global.api.api_key;
  showSpinner();
  const response = await fetch(
    `${url}search/${global.search.type}?api_key=${key}&language=en-US&append_to_response=credits&query=${global.search.term}&page=${global.search.page}`
  );
  hideSpinner();
  const data = await response.json();

  return data;
};

// displaying the search results
const displaySearchResults = (searchResults) => {
  //clearing the previous results and page
  document.querySelector(".search-results").innerHTML = ``;
  document.querySelector("#pagination").innerHTML = ``;
  searchResults.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      
    <a href="details.html?id=${result.id}">
                
    ${
      result.poster_path
        ? `<div
        class="overflow-hidden bg-contain h-full w-full rounded-lg  bg-no-repeat "
        style=" background:no-repeat url(https://image.tmdb.org/t/p/w500/${result.poster_path})"
      ></div>`
        : `<div
          class="overflow-hidden bg-contain h-full w-full rounded-lg"
          style="background-image: url(./images/no-image.jpg)"
        ></div>`
    }
    
    <div class="text-center font-bold text-white">
    <h4>${result.title}</h4>
  </div>
    </a>
            
            `;
    document.querySelector(".search-results").appendChild(div);
  });
  displayPagination();
};

// pagination

const displayPagination = () => {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
  <button class="bg-blue-500 px-3" id="prev">Prev</button>
  <button class="bg-green-500 px-3" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector("#pagination").appendChild(div);
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }
  document.querySelector("#next").addEventListener("click", async () => {
    {
      global.search.page++;
      const { results, total_pages } = await searchApiData();
      displaySearchResults(results);
    }
  });
  document.querySelector("#prev").addEventListener("click", async () => {
    {
      global.search.page--;
      const { results, total_pages } = await searchApiData();
      displaySearchResults(results);
    }
  });
};

//fetching the data from the tmdb API.
const fetchData = async (endpoints) => {
  const url = global.api.api_url;
  const key = global.api.api_key;
  showSpinner();
  const response = await fetch(
    `${url}${endpoints}?api_key=${key}&language=en-US&append_to_response=credits`
  );

  const data = await response.json();
  hideSpinner();
  return data;
};
// Showing the spinner
function showSpinner() {
  document.querySelector(".spinner").classList.add("lds-facebook");
}
//Hiding the spinner
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("lds-facebook");
}

function appStart() {
  switch (global.currentPage) {
    case "/":
      displayPopular();
      break;
    case "/details.html":
      displayMovieDetails();
      break;
    case "/search.html":
      search();
      break;
  }
}
document.addEventListener("DOMContentLoaded", appStart);
