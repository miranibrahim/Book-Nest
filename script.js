const apiEndpoint = "https://gutendex.com/books";
let books = [];
let currentPage = 1;
let booksPerPage = 10;

// Fetch books from API
async function fetchBooks() {
  const response = await fetch(apiEndpoint);
  const data = await response.json();
  books = data.results;
  console.log(books);
  displayBooks(books);
  setupPagination();
}

// Display books with pagination
function displayBooks(booksList) {
  const booksListSection = document.getElementById("books-list");
  
  if (!booksListSection) return; // Avoid errors on wishlist.html

  booksListSection.innerHTML = "";
  const startIndex = (currentPage - 1) * booksPerPage;
  const booksToDisplay = booksList.slice(startIndex, startIndex + booksPerPage);

  booksToDisplay.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "text-center", "flex", "flex-col", "items-center");

    bookCard.innerHTML = `
      <h3 class="mt-2 font-bold">${book.id}</h3>
      <img src="${book.formats["image/jpeg"]}" alt="${book.title}" class="h-48 w-40 object-cover mx-auto rounded">
      <h3 class="mt-2 font-bold">${book.title}</h3>
      <p class="text-sm text-gray-600">Author: ${book.authors.length ? book.authors[0].name : "Unknown"}</p>
      <button onclick="toggleWishlist(${book.id})" class="wishlist-btn text-lg mt-2" data-id="${book.id}">
        ${isInWishlist(book.id) ? "❤️" : "🤍"}
      </button>
    `;

    booksListSection.appendChild(bookCard);
  });
}

// Pagination
function setupPagination() {
  const totalPages = Math.ceil(books.length / booksPerPage);
  const paginationDiv = document.getElementById("pagination");
  if (!paginationDiv) return;

  paginationDiv.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add(
      "px-4",
      "py-2",
      "mx-1",
      "rounded",
      "text-white",
      i === currentPage ? "bg-gray-300" : "bg-blue-500"
    );

    pageButton.onclick = function () {
      currentPage = i;
      displayBooks(books);
      setupPagination();
    };

    paginationDiv.appendChild(pageButton);
  }
}

// Toggle Wishlist Function
function toggleWishlist(bookId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let book = books.find((b) => b.id === bookId);

  if (!book) return;

  const index = wishlist.findIndex((b) => b.id === bookId);
  if (index === -1) {
    wishlist.push(book);
  } else {
    wishlist.splice(index, 1);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  
  // Console log the updated wishlist array
  console.log("Updated Wishlist:", wishlist);

  displayBooks(books);
}

// Check if book is in wishlist
function isInWishlist(bookId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.some((b) => b.id === bookId);
}

// Display wishlist books on wishlist.html
function displayWishlistBooks() {
  const wishlistSection = document.getElementById("wishlist-books");
  if (!wishlistSection) return;

  wishlistSection.innerHTML = "";
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Console log the wishlist array when loading wishlist.html
  console.log("Wishlist on Wishlist Page Load:", wishlist);

  if (wishlist.length === 0) {
    wishlistSection.innerHTML = "<p class='text-center text-gray-500'>Your wishlist is empty.</p>";
    return;
  }

  wishlist.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "text-center", "flex", "flex-col", "items-center");

    bookCard.innerHTML = `
      <img src="${book.formats["image/jpeg"]}" alt="${book.title}" class="h-48 w-40 object-cover mx-auto rounded">
      <h3 class="mt-2 font-bold">${book.title}</h3>
      <p class="text-sm text-gray-600">Author: ${book.authors.length ? book.authors[0].name : "Unknown"}</p>
      <button onclick="removeFromWishlist(${book.id})" class="text-red-500 text-lg mt-2">❌ Remove</button>
    `;

    wishlistSection.appendChild(bookCard);
  });
}

// Remove book from wishlist
function removeFromWishlist(bookId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter((b) => b.id !== bookId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  
  // Console log the updated wishlist array after removal
  console.log("Updated Wishlist after removal:", wishlist);

  displayWishlistBooks();
}

// Run functions
if (document.getElementById("books-list")) {
  fetchBooks();
}

if (document.getElementById("wishlist-books")) {
  displayWishlistBooks();
}
