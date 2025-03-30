const apiEndpoint = "https://gutendex.com/books";
let books = [];
let currentPage = 1;
let booksPerPage = 10;
let genres = [];

// Fetch books data from API
async function fetchBooks() {
  const response = await fetch(apiEndpoint);
  const data = await response.json();
  books = data.results;
  console.log(books);
  // Extract unique genres from book subjects
  genres = [...new Set(books.flatMap((book) => book.subjects))];

  // Display books and setup filters & pagination
  displayBooks(books);
  populateGenres();
  setupPagination();
}

// Display books based on current filters and pagination
function displayBooks(booksList) {
  const booksListSection = document.getElementById("books-list");
  booksListSection.innerHTML = "";

  const filteredBooks = applyFilters(booksList);
  const booksToDisplay = paginateBooks(filteredBooks);

  // Create book cards dynamically
  booksToDisplay.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-md",
      "text-center",
      "w-full",
      "flex",
      "flex-col",
      "relative"
    );

    bookCard.innerHTML = `
      <img src="${book.formats["image/jpeg"]}" alt="${book.title}" class="h-48 w-64 mx-auto rounded">
      <h3 class="mt-2 font-bold">${book.title}</h3>
      <p class="text-sm text-gray-600">Author: ${book.authors.length ? book.authors[0].name : "Unknown"}</p>
      <p class="text-sm text-gray-500">Genre: ${book.subjects.length ? book.subjects[0] : "N/A"}</p>
      <button onclick="toggleWishlist(${book.id})" class="wishlist-btn text-red-500 text-lg mt-2 absolute bottom-4 right-4" data-id="${book.id}">🤍</button>
    `;
    booksListSection.appendChild(bookCard);
});

  // Update wishlist UI to show correct icons
  updateWishlistUI();
}

// Populate the genre filter dropdown with unique genres
function populateGenres() {
  const genreFilter = document.getElementById("genre-filter");
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

// Event listeners for search and genre filter changes
document
  .getElementById("search-bar")
  .addEventListener("input", () => displayBooks(books));
document
  .getElementById("genre-filter")
  .addEventListener("change", () => displayBooks(books));

// Apply filters based on search query and selected genre
function applyFilters(booksList) {
  const searchQuery = document.getElementById("search-bar").value.toLowerCase();
  const selectedGenre = document.getElementById("genre-filter").value;

  return booksList.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) &&
      (selectedGenre ? book.subjects.includes(selectedGenre) : true)
  );
}

// Paginate the filtered books list
function paginateBooks(filteredBooks) {
  const startIndex = (currentPage - 1) * booksPerPage;
  return filteredBooks.slice(startIndex, startIndex + booksPerPage);
}

// Setup pagination buttons dynamically
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

    // Add the active (silver) class to the selected button
    if (i === currentPage) {
      pageButton.classList.add("bg-gray-500"); // Set active button to silver
    }

    // Change page when button is clicked
    pageButton.onclick = function () {
      // Update the current page
      currentPage = i;
      // Re-apply the pagination with the correct colors
      displayBooks(books);
      setupPagination(); // Re-run pagination to update the active button
    };

    paginationDiv.appendChild(pageButton);
  }
}


// Toggle books in wishlist (add/remove from local storage)
function toggleWishlist(bookId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const index = wishlist.indexOf(bookId);

  if (index === -1) {
    wishlist.push(bookId); // Add to wishlist
  } else {
    wishlist.splice(index, 1); // Remove from wishlist
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistUI();
}

// Update UI for wishlist buttons to reflect saved books
function updateWishlistUI() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  document.querySelectorAll(".wishlist-btn").forEach((button) => {
    const bookId = parseInt(button.getAttribute("data-id"));
    button.textContent = wishlist.includes(bookId) ? "❤️" : "🤍";
  });
}

// Fetch books when the page loads
fetchBooks();
