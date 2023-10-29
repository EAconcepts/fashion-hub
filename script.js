const allContainer = document.getElementById("all-container");
const allProducts = document.getElementById("all-products");
const pagination = document.getElementById("paginations");
const searchInput = document.getElementById("search-text");
const searchInfo = document.getElementById("search-info");
const loading = document.getElementById('loading')

let perPage = 8;
let page = 1;
let movieArr;
let isLoading = false
const fetchMovies = (callback) => {
    isLoading= true
    loading.innerHTML = 'loading...'
    loading.className = "text-2xl animate-pulse";
  fetch(`https://fakestoreapi.com/products`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      movieArr = data;

      paginate(data, page, perPage);
        isLoading=false
      return data;
    })
    .catch((err) => {
      console.log(err);
      loading.innerHTML = `Something happend! ${err.message}`
      loading.className='text-center text-2xl'
      const reload = document.createElement('button')
      loading.appendChild(reload)
      reload.innerHTML='try again'
      reload.className='block text-center text-2xl underline'
      reload.addEventListener('click', ()=>fetchMovies())
    });
};

const appendMovies = (movies) => {
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className =
      "md:w-[350px] shadow-md shadow-slate-300 w-[300px] md:h-[440px] h-[320px] border p-2 border-slate-200 rounded flex flex-col gap-y-4 relative";
    allProducts.appendChild(movieCard);
    createMovieElements(movie, movieCard);
  });
};
const createMovieElements = (movie, movieCard) => {
  const productImg = document.createElement("img");
  productImg.src = movie.image;
  productImg.alt = movie.title;
  productImg.className = "w-full md:h-[270px] h-[200px] object-cover object-top";
  movieCard.appendChild(productImg);
  const detailsCont = document.createElement("div");
  detailsCont.className = "flex flex-col h-full justify-between";
  movieCard.appendChild(detailsCont);
  const productTitle = document.createElement("h3");
  productTitle.innerHTML = movie.title.substring(0, 59)
  productTitle.className = "md:text-xl ";
  detailsCont.appendChild(productTitle);
  const productDesc = document.createElement("p");
  productDesc.className = " font-mono md:text-sm text-xs";
  productDesc.innerHTML = `${movie.description.substring(0, 60)}...`;
  detailsCont.appendChild(productDesc);
  const productPrice = document.createElement("p");
  productPrice.innerHTML = `$${movie.price}`;
  productPrice.className = "font-bold md:text-lg ";
  detailsCont.appendChild(productPrice);
};
fetchMovies();

searchInput.oninput = (e) => {
  // console.log(e.target.value)
  const searchText = e.target.value;
  const filteredMovies = filterMovies(searchText);
  console.log(filteredMovies);
  allProducts.innerHTML = "";
  appendMovies(filteredMovies);
  try {
    if (searchText && filteredMovies.length === 0)
      throw `No product matched the search value "${searchText}"`;
  } catch (err) {
    searchInfo.innerHTML = err;
  }
};

const filterMovies = (searchValue) =>
  movieArr.filter((movie) =>
    movie.title.toLowerCase().includes(searchValue.toLowerCase())
  );

// setTimeout(() => {
//   // console.log(paginate(movieArr));
//   handlePaginate();
// }, 2000);
const paginate = (movieArr, page = 1, perPage = 8) => {
  //   console.log(page);
  let pagedArr = movieArr.slice(perPage * (page - 1), perPage * page);
  allProducts.innerHTML = "";
  pagination.innerHTML = "";
  appendMovies(pagedArr);
  handlePaginate();
  console.log(pagedArr);
  return pagedArr;
};

const handlePaginate = () => {
  const totalPages = Math.ceil(movieArr.length / perPage);
  const paginateDiv = document.createElement("div");
  paginateDiv.className = "w-full flex flex-row justify-center gap-x-5 mt-10";
  pagination.appendChild(paginateDiv);
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");
  prevBtn.innerHTML = "<";
  nextBtn.innerHTML = ">";
  nextBtn.addEventListener("click", () =>
    paginate(movieArr, (page += 1), perPage)
  );
  prevBtn.addEventListener("click", () =>
    paginate(movieArr, (page -= 1), perPage)
  );
  paginateDiv.appendChild(prevBtn);
  let a = Array.from(Array(totalPages)).map((_, index) => {
    const pageBtn = document.createElement("button");
    pageBtn.innerHTML = `page ${index + 1}`;
    pageBtn.addEventListener("click", function () {
      paginate(movieArr, (page = index + 1), perPage);
    });
    pageBtn.className = `text-center ${
      page === index + 1 && "text-red-600 font-semibold"
    } text-lg font-light`;
    paginateDiv.appendChild(pageBtn);
  });
  paginateDiv.appendChild(nextBtn);
  console.log(page);
  nextBtn.disabled = page === totalPages;
  prevBtn.disabled = page === 1;
  nextBtn.className = "text-3xl disabled:text-slate-400";
  prevBtn.className = "text-3xl disabled:text-slate-400";
  //   nextBtn.className = 'disabled:opacity-5'
  console.log(a);
};
// handlePaginate()
