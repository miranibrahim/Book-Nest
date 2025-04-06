class WishlistManager {
  constructor() {
    this.storageKey = "wishlist";
  }

  // Get wishlist from local storage
  getWishlist() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  // Save wishlist to local storage
  saveWishlist(wishlist) {
    localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
  }

  // Add book to wishlist
  addToWishlist(book) {
    const wishlist = this.getWishlist();
    if (!wishlist.some((b) => b.id === book.id)) {
      wishlist.push(book);
      this.saveWishlist(wishlist);
    }
  }

  // Remove book from wishlist
  removeFromWishlist(bookId) {
    let wishlist = this.getWishlist();
    wishlist = wishlist.filter((b) => b.id !== bookId);
    this.saveWishlist(wishlist);
  }

  // Toggle book in wishlist
  toggleWishlist(book) {
    const wishlist = this.getWishlist();
    const index = wishlist.findIndex((b) => b.id === book.id);

    if (index === -1) {
      wishlist.push(book);
      this.saveWishlist(wishlist);
      return true;
    } else {
      wishlist.splice(index, 1);
      this.saveWishlist(wishlist);
      return false;
    }
  }

  // Check if book is in wishlist
  isInWishlist(bookId) {
    const wishlist = this.getWishlist();
    return wishlist.some((b) => b.id === bookId);
  }
}

const wishlistManager = new WishlistManager();
