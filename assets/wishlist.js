// Simpler implementation without custom elements
document.addEventListener('DOMContentLoaded', function() {
  // Log all wishlist buttons found
  const wishlistButtons = document.querySelectorAll('.wishlist-button');
  
  // Initialize all wishlist buttons
  initWishlistButtons();
  
  // Update wishlist count on page load
  updateWishlistCount();
  
  // Listen for dynamically added buttons
  document.addEventListener('shopify:section:load', function() {
    initWishlistButtons();
  });
});

function initWishlistButtons() {
  document.querySelectorAll('.wishlist-button').forEach(button => {
    // Remove existing click listeners to prevent duplicates
    button.removeEventListener('click', handleWishlistButtonClick);
    
    // Add click listener
    button.addEventListener('click', handleWishlistButtonClick);
    
    // Update button state
    updateButtonState(button);
  });
}

function handleWishlistButtonClick(event) {
  event.preventDefault();
  const button = event.currentTarget;
  const productId = button.getAttribute('data-product-id');
  const variantId = button.getAttribute('data-variant-id');
  
  if (!productId) {
    return;
  }
  
  // Get current wishlist
  let wishlist = getWishlist();
  
  // Check if product is already in wishlist
  const existingIndex = wishlist.findIndex(item => item.productId.toString() === productId.toString());
  
  if (existingIndex >= 0) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1);
    saveWishlist(wishlist);
    showNotification('Removed from wishlist');
  } else {
    // Add to wishlist
    wishlist.push({
      productId: productId,
      variantId: variantId,
      addedAt: new Date().toISOString()
    });
    saveWishlist(wishlist);
    showNotification('Added to wishlist');
  }
  
  // Update button state
  updateButtonState(button);
  
  // Update wishlist count
  updateWishlistCount();
}

function getWishlist() {
  const wishlist = localStorage.getItem('shopify_wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
}

function saveWishlist(wishlist) {
  localStorage.setItem('shopify_wishlist', JSON.stringify(wishlist));
  
  // Dispatch event for other components
  document.dispatchEvent(new CustomEvent('wishlist:updated', {
    detail: { wishlist: wishlist }
  }));
}

function updateButtonState(button) {
  const productId = button.getAttribute('data-product-id');
  const wishlist = getWishlist();
  const isInWishlist = wishlist.some(item => item.productId.toString() === productId.toString());
  
  const emptyIcon = button.querySelector('.wishlist-icon--empty');
  const filledIcon = button.querySelector('.wishlist-icon--filled');
  
  if (isInWishlist) {
    emptyIcon.classList.add('hidden');
    filledIcon.classList.remove('hidden');
    button.setAttribute('aria-label', 'Remove from wishlist');
  } else {
    emptyIcon.classList.remove('hidden');
    filledIcon.classList.add('hidden');
    button.setAttribute('aria-label', 'Add to wishlist');
  }
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  const count = wishlist.length;
  
  const wishlistCountElements = document.querySelectorAll('.wishlist-count');
  
  wishlistCountElements.forEach(element => {
    element.textContent = count;
    element.classList.toggle('hidden', count === 0);
  });
}

function showNotification(message) {
  // Create or use existing notification
  let notification = document.querySelector('.wishlist-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'wishlist-notification';
    document.body.appendChild(notification);
  }
  
  // Set message
  notification.textContent = message;
  notification.classList.add('active');
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('active');
  }, 3000);
}


