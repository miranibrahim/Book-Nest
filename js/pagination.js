class PaginationManager {
  constructor() {
    this.currentPage = 1;
    this.booksPerPage = 10;
  }

  /**
   * Set up pagination controls
   * @param {number} totalItems - Total number of items
   * @param {HTMLElement} container - Container for pagination buttons
   * @param {Function} onPageChange - Callback when page changes
   */
  setupPagination(totalItems, container, onPageChange) {
    if (!container) return;

    const totalPages = Math.ceil(totalItems / this.booksPerPage);
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.classList.add(
        "px-4",
        "py-2",
        "mx-1",
        "rounded",
        "text-white",
        i === this.currentPage ? "bg-gray-300" : "bg-blue-500"
      );

      pageButton.onclick = () => {
        this.currentPage = i;
        if (onPageChange) {
          onPageChange(i);
        }
      };

      container.appendChild(pageButton);
    }
  }

  /**
   * Get current page items
   * @param {Array} items - All items
   * @returns {Array} - Items for current page
   */
  getCurrentPageItems(items) {
    const startIndex = (this.currentPage - 1) * this.booksPerPage;
    return items.slice(startIndex, startIndex + this.booksPerPage);
  }

  /**
   * Reset to first page
   */
  resetToFirstPage() {
    this.currentPage = 1;
  }

  /**
   * Get current page
   * @returns {number} Current page number
   */
  getCurrentPage() {
    return this.currentPage;
  }
}

const paginationManager = new PaginationManager();
