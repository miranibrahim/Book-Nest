const apiEndpoint = "https://gutendex.com/books";
let books = [];
let currentPage = 1;
let booksPerPage = 10;
let genres = [];

async function fetchBooks() {
  const response = await fetch(apiEndpoint);
  const data = await response.json();
  books = data.results;
  genres = [...new Set(books.flatMap((book) => book.subjects))];
  displayBooks(books);
  populateGenres();
  setupPagination();
}

function displayBooks(booksList) {
  const booksListSection = document.getElementById("books-list");
  booksListSection.innerHTML = "";

  const filteredBooks = applyFilters(booksList);
  const booksToDisplay = paginateBooks(filteredBooks);

  booksToDisplay.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-md",
      "text-center"
    );
    bookCard.innerHTML = `
                    <img src="${book.formats["image/jpeg"]}" alt="${
      book.title
    }" class="w-full h-40 object-cover rounded">
                    <h3 class="mt-2 font-bold">${book.title}</h3>
                    <p class="text-sm text-gray-600">Author: ${
                      book.authors.length ? book.authors[0].name : "Unknown"
                    }</p>
                    <p class="text-sm text-gray-500">Genre: ${
                      book.subjects.length ? book.subjects[0] : "N/A"
                    }</p>
                    <button onclick="toggleWishlist(${
                      book.id
                    })" class="wishlist-btn text-red-500 text-lg mt-2" data-id="${
      book.id
    }">🤍</button>
                `;
    booksListSection.appendChild(bookCard);
  });
  updateWishlistUI();
}

function populateGenres() {
  const genreFilter = document.getElementById("genre-filter");
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

document
  .getElementById("search-bar")
  .addEventListener("input", () => displayBooks(books));
document
  .getElementById("genre-filter")
  .addEventListener("change", () => displayBooks(books));

function applyFilters(booksList) {
  const searchQuery = document.getElementById("search-bar").value.toLowerCase();
  const selectedGenre = document.getElementById("genre-filter").value;
  return booksList.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) &&
      (selectedGenre ? book.subjects.includes(selectedGenre) : true)
  );
}

function paginateBooks(filteredBooks) {
  const startIndex = (currentPage - 1) * booksPerPage;
  return filteredBooks.slice(startIndex, startIndex + booksPerPage);
}

function setupPagination() {
  const totalPages = Math.ceil(books.length / booksPerPage);
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add(
      "px-4",
      "py-2",
      "mx-1",
      "rounded",
      "bg-blue-500",
      "text-white"
    );
    pageButton.onclick = function () {
      currentPage = i;
      displayBooks(books);
    };
    paginationDiv.appendChild(pageButton);
  }
}

function toggleWishlist(bookId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const index = wishlist.indexOf(bookId);
  if (index === -1) {
    wishlist.push(bookId);
  } else {
    wishlist.splice(index, 1);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistUI();
}

function updateWishlistUI() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  document.querySelectorAll(".wishlist-btn").forEach((button) => {
    const bookId = parseInt(button.getAttribute("data-id"));
    button.textContent = wishlist.includes(bookId) ? "❤️" : "🤍";
  });
}

fetchBooks();
