class PaginationManager {
  constructor() {
    this.currentPage = 1;
    this.booksPerPage = 10;
  }

  // Set up pagination controls
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

  // Get current page items
  getCurrentPageItems(items) {
    const startIndex = (this.currentPage - 1) * this.booksPerPage;
    return items.slice(startIndex, startIndex + this.booksPerPage);
  }

  // Reset to first page
  resetToFirstPage() {
    this.currentPage = 1;
  }

  // Get current page
  getCurrentPage() {
    return this.currentPage;
  }
}

const paginationManager = new PaginationManager();
