class BookRenderer {
  /**
   * Create a book card element
   * @param {Object} book - The book data
   * @param {Function} onCardClick - Callback for card click
   * @param {Function} onWishlistToggle - Callback for wishlist toggle
   * @returns {HTMLElement} The created book card element
   */
  createBookCard(book, onCardClick, onWishlistToggle) {
    const bookCard = document.createElement("div");
    bookCard.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-md",
      "text-center",
      "flex",
      "flex-col",
      "items-center"
    );

    // Create book details div (clickable)
    const bookDetailsDiv = document.createElement("div");
    bookDetailsDiv.classList.add("w-full", "cursor-pointer");

    // Navigate to book-details.html?id=<book_id>
    bookDetailsDiv.addEventListener("click", () => {
      localStorage.setItem("selectedBook", book.id);
      window.location.href = `book-details.html?id=${book.id}`;
    });

    bookDetailsDiv.innerHTML = `
      <h3 class="mt-2 font-bold">ID: ${book.id}</h3>
      <img src="${book.formats["image/jpeg"]}" alt="${
      book.title
    }" class="h-48 w-40 mx-auto rounded">
      <h3 class="mt-2 font-bold">${book.title}</h3>
      <div class="text-left">
        <p class="text-sm text-gray-600"> <span class="font-bold text-black">Author: </span> ${
          book.authors.length ? book.authors[0].name : "Unknown"
        }</p>
        <p class="text-sm text-gray-600"><span class="font-bold text-black">Genre: </span> ${
          book.subjects && book.subjects.length
            ? book.subjects.join(", ")
            : "Unknown"
        }</p>
      </div>
    `;

    // Create wishlist button container
    const wishlistDiv = document.createElement("div");
    wishlistDiv.classList.add("w-full", "flex", "justify-end", "mt-auto");

    const wishlistButton = document.createElement("button");
    wishlistButton.classList.add("wishlist-btn", "text-lg");
    wishlistButton.innerHTML = wishlistManager.isInWishlist(book.id)
      ? "❤️"
      : "🤍";

    // Wishlist button event listener (does NOT navigate)
    if (onWishlistToggle) {
      wishlistButton.addEventListener("click", () => {
        onWishlistToggle(book.id);
        wishlistButton.innerHTML = wishlistManager.isInWishlist(book.id)
          ? "❤️"
          : "🤍";
      });
    }

    wishlistDiv.appendChild(wishlistButton);

    // Append elements to bookCard
    bookCard.appendChild(bookDetailsDiv);
    bookCard.appendChild(wishlistDiv);

    return bookCard;
  }

  /**
   * Create a wishlist card element
   * @param {Object} book - The book data
   * @param {Function} onRemove - Callback for remove button click
   * @returns {HTMLElement} The created wishlist card element
   */
  createWishlistCard(book, onRemove) {
    const bookCard = document.createElement("div");
    bookCard.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-md",
      "text-center",
      "flex",
      "flex-col",
      "items-center"
    );

    bookCard.innerHTML = `
      <img src="${book.formats["image/jpeg"]}" alt="${
      book.title
    }" class="h-48 w-40 object-cover mx-auto rounded">
      <h3 class="mt-2 font-bold">${book.title}</h3>
      <p class="text-sm text-gray-600">Author: ${
        book.authors.length ? book.authors[0].name : "Unknown"
      }</p>
    `;

    // Add remove button
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "❌ Remove";
    removeButton.classList.add("text-red-500", "text-lg", "mt-2");

    if (onRemove) {
      removeButton.addEventListener("click", () => onRemove(book.id));
    }

    bookCard.appendChild(removeButton);

    return bookCard;
  }

  /**
   * Display a list of books in the specified container
   * @param {Array} books - Array of book objects
   * @param {HTMLElement} container - Container element
   * @param {Function} onCardClick - Callback for card click
   * @param {Function} onWishlistToggle - Callback for wishlist toggle
   */
  displayBooks(books, container, onCardClick, onWishlistToggle) {
    if (!container) return;

    container.innerHTML = "";

    if (books.length === 0) {
      container.innerHTML =
        "<p class='text-center text-gray-500'>No books found.</p>";
      return;
    }

    books.forEach((book) => {
      const bookCard = this.createBookCard(book, onCardClick, onWishlistToggle);
      container.appendChild(bookCard);
    });
  }

  /**
   * Display wishlist books
   * @param {Array} books - Array of book objects
   * @param {HTMLElement} container - Container element
   * @param {Function} onRemove - Callback for remove button click
   */
  displayWishlistBooks(books, container, onRemove) {
    if (!container) return;

    container.innerHTML = "";

    if (books.length === 0) {
      container.innerHTML =
        "<p class='text-center text-gray-500'>Your wishlist is empty.</p>";
      return;
    }

    books.forEach((book) => {
      const bookCard = this.createWishlistCard(book, onRemove);
      container.appendChild(bookCard);
    });
  }
}

// Create a singleton instance
const bookRenderer = new BookRenderer();
