class SearchManager {
  constructor() {
    // Define keys for localStorage
    this.STORAGE_KEYS = {
      SEARCH_TERM: "bookstore_search_term",
      SELECTED_GENRE: "bookstore_selected_genre",
    };
  }

  /**
   * Filter books by title and genre
   * @param {Array} books - All books
   * @param {string} searchTerm - Search term for title
   * @param {string} genre - Selected genre
   * @returns {Array} Filtered books
   */
  filterBooks(books, searchTerm, genre) {
    return books.filter((book) => {
      const matchesTitle = book.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGenre =
        !genre || (book.subjects && book.subjects.includes(genre));
      return matchesTitle && matchesGenre;
    });
  }

  /**
   * Extract all unique genres from books
   * @param {Array} books - All books
   * @returns {Set} Set of unique genres
   */
  extractGenres(books) {
    const genres = new Set();
    books.forEach((book) => {
      if (book.subjects) {
        book.subjects.forEach((subject) => genres.add(subject));
      }
    });
    return genres;
  }

  /**
   * Populate genre filter dropdown
   * @param {HTMLElement} selectElement - The select element
   * @param {Set} genres - Set of genres
   */
  populateGenreFilter(selectElement, genres) {
    if (!selectElement) return;

    selectElement.innerHTML = '<option value="">Filter by Genre</option>';

    const isSmallOrMedium = window.innerWidth < 1024; // Tailwind lg breakpoint = 1024px

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.title = genre; // Show full name on hover

      if (isSmallOrMedium && genre.length > 40) {
        option.textContent = genre.slice(0, 30) + "…";
      } else {
        option.textContent = genre;
      }

      selectElement.appendChild(option);
    });

    // Restore saved selection
    const savedGenre = this.getSavedGenre();
    if (savedGenre) {
      selectElement.value = savedGenre;
    }
  }

  /**
   * Save search term to localStorage
   * @param {string} searchTerm - Search term to save
   */
  saveSearchTerm(searchTerm) {
    localStorage.setItem(this.STORAGE_KEYS.SEARCH_TERM, searchTerm);
  }

  /**
   * Get saved search term from localStorage
   * @returns {string} The saved search term or empty string
   */
  getSavedSearchTerm() {
    return localStorage.getItem(this.STORAGE_KEYS.SEARCH_TERM) || "";
  }

  /**
   * Save selected genre to localStorage
   * @param {string} genre - Genre to save
   */
  saveGenre(genre) {
    localStorage.setItem(this.STORAGE_KEYS.SELECTED_GENRE, genre);
  }

  /**
   * Get saved genre from localStorage
   * @returns {string} The saved genre or null
   */
  getSavedGenre() {
    return localStorage.getItem(this.STORAGE_KEYS.SELECTED_GENRE);
  }

  /**
   * Initialize form inputs with saved values
   * @param {HTMLElement} searchInput - The search input element
   * @param {HTMLElement} genreSelect - The genre select element
   */
  initializeWithSavedValues(searchInput, genreSelect) {
    if (searchInput) {
      searchInput.value = this.getSavedSearchTerm();
    }

    // Genre select is handled in populateGenreFilter
  }

  /**
   * Clear all saved search preferences
   */
  clearSavedPreferences() {
    localStorage.removeItem(this.STORAGE_KEYS.SEARCH_TERM);
    localStorage.removeItem(this.STORAGE_KEYS.SELECTED_GENRE);
  }
}

const searchManager = new SearchManager();
