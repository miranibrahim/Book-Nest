class BookRenderer {
  // Create a book card element
  createBookCard(book, onWishlistToggle) {
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

    // Create clickable div to navigate book details
    const bookDetailsDiv = document.createElement("div");
    bookDetailsDiv.classList.add("w-full", "cursor-pointer");

    // Navigate to book-details
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

    // Wishlist button event listener
    if (onWishlistToggle) {
      wishlistButton.addEventListener("click", () => {
        onWishlistToggle(book.id);
        wishlistButton.innerHTML = wishlistManager.isInWishlist(book.id)
          ? "❤️"
          : "🤍";
      });
    }

    // Append elements to bookCard
    bookCard.appendChild(bookDetailsDiv);
    bookCard.appendChild(wishlistDiv);
    wishlistDiv.appendChild(wishlistButton);

    return bookCard;
  }

  // Create a wishlist card element
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

    // Create clickable div to navigate book details
    const bookDetailsDiv = document.createElement("div");
    bookDetailsDiv.classList.add("w-full", "mb-4", "cursor-pointer");

    // Navigate to book-details
    bookDetailsDiv.addEventListener("click", () => {
      localStorage.setItem("selectedBook", book.id);
      window.location.href = `book-details.html?id=${book.id}`;
    });

    bookDetailsDiv.innerHTML = `
      <img src="${book.formats["image/jpeg"]}" alt="${
      book.title
    }" class="h-48 w-40 mx-auto rounded">
      <h3 class="mt-2 font-bold">${book.title}</h3>
      <p class="text-sm text-gray-600">Author: ${
        book.authors.length ? book.authors[0].name : "Unknown"
      }</p>
    `;

    // Add remove button
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "❌ Remove";
    removeButton.classList.add("text-red-500", "text-sm", "mt-auto");

    if (onRemove) {
      removeButton.addEventListener("click", () => onRemove(book.id));
    }

    // Append
    bookCard.appendChild(bookDetailsDiv);
    bookCard.appendChild(removeButton);

    return bookCard;
  }

  // Display a list of books in the specified container
  displayBooks(books, container, action) {
    if (!container) return;

    container.innerHTML = "";
    if (books.length === 0) {
      container.innerHTML =
        "<p class='text-center text-gray-500'>List is empty</p>";
      return;
    }

    books.forEach((book) => {
      const bookCard =
        container.id === "wishlist-books"
          ? this.createWishlistCard(book, action)
          : this.createBookCard(book, action);

      container.appendChild(bookCard);
    });
  }
}

const bookRenderer = new BookRenderer();
