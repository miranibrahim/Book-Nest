class BookDetailsManager {
  // Initialize book details page
  async init() {
    const localId = localStorage.getItem("selectedBook");
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id && id != localId) {
      document.body.innerHTML =
        "<h2 class='text-center text-red-500'>No book details found.</h2>";
      return;
    }

    try {
      const book = await bookAPI.fetchBookById(id);
      this.displayBookDetails(book);
    } catch (error) {
      console.error("Error in book details:", error);
      document.body.innerHTML =
        "<h2 class='text-center text-red-500'>Failed to load book details.</h2>";
    }
  }

  // Display book details on the page
  displayBookDetails(book) {
    document.getElementById("book-cover").src =
      book.formats["image/jpeg"] || "placeholder.jpg";
    document.getElementById("book-title").textContent = book.title;
    document.getElementById("book-author").textContent = `Author: ${
      book.authors.length ? book.authors[0].name : "Unknown"
    }`;
    document.getElementById("book-genre").textContent = `Genre: ${
      book.subjects && book.subjects.length
        ? book.subjects.join(", ")
        : "Unknown"
    }`;
    document.getElementById("book-summary").textContent =
      book.summaries && book.summaries.length
        ? book.summaries[0]
        : "No summary available.";
    document.getElementById("book-downloads").textContent = book.download_count;

    this.displayBookFormats(book.formats);
  }

  // Display book formats as download links
  displayBookFormats(formats) {
    const formatsList = document.getElementById("book-formats");
    formatsList.innerHTML = ""; 

    Object.entries(formats).forEach(([format, link]) => {
      if (format !== "image/jpeg") {
        let li = document.createElement("li");
        li.innerHTML = `<a href="${link}" target="_blank">${format
          .replace(/application\/|text\/|; charset=us-ascii/g, "")
          .toUpperCase()}</a>`;
        formatsList.appendChild(li);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const bookDetailsManager = new BookDetailsManager();
  bookDetailsManager.init();
});
