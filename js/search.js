class SearchManager {
  constructor() {
    // Define keys for localStorage
    this.STORAGE_KEYS = {
      SEARCH_TERM: "bookstore_search_term",
      SELECTED_GENRE: "bookstore_selected_genre",
    };
  }

  // Filter books by title and genre
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

  // Extract all unique genres from books
  extractGenres(books) {
    const genres = new Set();
    books.forEach((book) => {
      if (book.subjects) {
        book.subjects.forEach((subject) => genres.add(subject));
      }
    });
    return genres;
  }

  // Populate genre filter dropdown
  populateGenreFilter(selectElement, genres) {
    if (!selectElement) return;

    selectElement.innerHTML = '<option value="">Filter by Genre</option>';

    const isSmallOrMedium = window.innerWidth < 1024;

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.title = genre;

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

  // Get saved genre from localStorage
  getSavedGenre() {
    return localStorage.getItem(this.STORAGE_KEYS.SELECTED_GENRE);
  }
}

const searchManager = new SearchManager();
