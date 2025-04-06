class BookAPI {
  constructor() {
    this.apiEndpoint = "https://gutendex.com/books";
  }

  /**
   * Fetch all books from the API
   * @returns {Promise} Promise with books data
   */
  async fetchAllBooks() {
    try {
      const response = await fetch(this.apiEndpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      
      return data.results;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  /**
   * Fetch a specific book by ID
   * @param {number} id - The book ID
   * @returns {Promise} Promise with book data
   */
  async fetchBookById(id) {
    try {
      const response = await fetch(`${this.apiEndpoint}/?ids=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch book details");
      }
      const data = await response.json();
      if (!data.results.length) {
        throw new Error("Book not found.");
      }
      return data.results[0];
    } catch (error) {
      console.error("Error fetching book details:", error);
      throw error;
    }
  }
}

const bookAPI = new BookAPI();
