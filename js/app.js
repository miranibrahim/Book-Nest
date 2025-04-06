class BookApp {
  constructor() {
    this.books = [];
    this.filteredBooks = [];
    this.isWishlistPage = window.location.pathname.includes("wishlist.html");
  }

  // Initialize the application
  async init() {
    if (this.isWishlistPage) {
      this.initWishlistPage();
      return;
    }

    try {
      this.books = await bookAPI.fetchAllBooks();
      this.filteredBooks = [...this.books];

      this.setupEventListeners();

      // Populate genre filter
      const genres = searchManager.extractGenres(this.books);
      const genreFilter = document.getElementById("genre-filter");
      searchManager.populateGenreFilter(genreFilter, genres);

      // Load saved search preferences
      this.loadSavedSearchPreferences();

      // Display books
      this.displayFilteredBooks();
    } catch (error) {
      console.error("Error initializing app:", error);
      const booksListSection = document.getElementById("books-list");
      if (booksListSection) {
        booksListSection.innerHTML =
          "<p class='text-center text-red-500'>Failed to load books. Please try again later.</p>";
      }
    }
  }

  // Load saved search preferences from localStorage
  loadSavedSearchPreferences() {
    const searchBar = document.getElementById("search-bar");
    const genreFilter = document.getElementById("genre-filter");

    // Restore saved search term if it exists
    const savedSearchTerm = localStorage.getItem("bookstore_search_term");
    if (savedSearchTerm && searchBar) {
      searchBar.value = savedSearchTerm;
    }

    // Restore saved genre if it exists
    const savedGenre = localStorage.getItem("bookstore_selected_genre");
    if (savedGenre && genreFilter) {
      // Find and select the matching option
      const optionToSelect = Array.from(genreFilter.options).find(
        (option) => option.value === savedGenre
      );

      if (optionToSelect) {
        optionToSelect.selected = true;
      }
    }

    // Apply saved filters immediately
    if ((savedSearchTerm || savedGenre) && (searchBar || genreFilter)) {
      this.handleSearch();
    }
  }

  // Set up event listeners
  setupEventListeners() {
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
      searchBar.addEventListener("input", () => this.handleSearch());
    }

    const genreFilter = document.getElementById("genre-filter");
    if (genreFilter) {
      genreFilter.addEventListener("change", () => this.handleSearch());
    }
  }

  // Handle search and filter
  handleSearch() {
    const searchBar = document.getElementById("search-bar");
    const genreFilter = document.getElementById("genre-filter");

    const searchTerm = searchBar ? searchBar.value : "";
    const genre = genreFilter ? genreFilter.value : "";

    // Save to localStorage
    localStorage.setItem("bookstore_search_term", searchTerm);
    localStorage.setItem("bookstore_selected_genre", genre);

    this.filteredBooks = searchManager.filterBooks(
      this.books,
      searchTerm,
      genre
    );
    paginationManager.resetToFirstPage();
    this.displayFilteredBooks();
  }

  // Handle wishlist toggle
  handleWishlistToggle(bookId) {
    const book = this.books.find((b) => b.id === bookId);
    if (book) {
      wishlistManager.toggleWishlist(book);
      // If we're on the wishlist page, refresh the display
      if (this.isWishlistPage) {
        this.displayWishlistBooks();
      } else {
        this.displayFilteredBooks();
      }
    }
  }

  // Initialize wishlist page
  initWishlistPage() {
    const wishlistSection = document.getElementById("wishlist-books");
    this.displayWishlistBooks(wishlistSection);
  }

  // Display filtered books with pagination
  displayFilteredBooks() {
    const booksListSection = document.getElementById("books-list");
    const paginationDiv = document.getElementById("pagination");

    // Get books for current page
    const booksToDisplay = paginationManager.getCurrentPageItems(
      this.filteredBooks
    );

    // Display books
    bookRenderer.displayBooks(booksToDisplay, booksListSection, (bookId) =>
      this.handleWishlistToggle(bookId)
    );

    // Set up pagination
    paginationManager.setupPagination(
      this.filteredBooks.length,
      paginationDiv,
      () => this.displayFilteredBooks()
    );
  }

  // Display wishlist books
  displayWishlistBooks() {
    const wishlistSection = document.getElementById("wishlist-books");
    const wishlist = wishlistManager.getWishlist();

    bookRenderer.displayBooks(wishlist, wishlistSection, (bookId) => {
      wishlistManager.removeFromWishlist(bookId);
      this.displayWishlistBooks();
    });
  }
}

// Initialize the application on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  const app = new BookApp();
  app.init();
});
