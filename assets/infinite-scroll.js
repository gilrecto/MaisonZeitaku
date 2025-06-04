class InfiniteScroll extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;
    this.currentPage = 1;
    this.paginationUrl = this.dataset.paginationUrl;
    this.productGrid = document.getElementById('product-grid');
    this.loadingSpinner = this.querySelector('.loading-overlay');
    this.totalPages = parseInt(this.dataset.totalPages || '1', 10);
    
    // Store the current URL to detect changes
    this.currentUrl = window.location.href;
    
    // Observer for the sentinel element (triggers loading more products)
    this.sentinel = this.querySelector('#infinite-scroll-sentinel');
    this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
      rootMargin: '0px 0px 400px 0px' // Load more products when sentinel is 400px from viewport
    });
    
    if (this.sentinel) {
      this.intersectionObserver.observe(this.sentinel);
    }
    
    // Listen for URL changes (filtering/sorting)
    this.setupFilterAndSortListeners();
    
    // Listen for custom events from facets.js
    document.addEventListener('collection:reloaded', this.onCollectionReloaded.bind(this));
  }
  
  setupFilterAndSortListeners() {
    // Listen for form submissions (filters and sorting)
    document.querySelectorAll('form[action*="/filter"], form[action*="/sort_by"]').forEach(form => {
      form.addEventListener('submit', () => {
        console.log('Filter or sort form submitted - page will reload');
        // Set a flag to indicate we're changing filters
        this.dataset.filterChanging = 'true';
        // Store the current URL to compare after reload
        localStorage.setItem('previousUrl', window.location.href);
      });
    });
    
    // Listen for facet filter clicks
    document.querySelectorAll('.js-facet-remove, .js-facet-filter').forEach(filter => {
      filter.addEventListener('click', () => {
        console.log('Filter clicked - page will reload');
        // Set a flag to indicate we're changing filters
        this.dataset.filterChanging = 'true';
        // Store the current URL to compare after reload
        localStorage.setItem('previousUrl', window.location.href);
      });
    });
    
    // Check for URL changes periodically (for history API changes)
    this.urlCheckInterval = setInterval(() => {
      if (this.currentUrl !== window.location.href) {
        console.log('URL changed from', this.currentUrl, 'to', window.location.href);
        this.currentUrl = window.location.href;
        // Set a flag to indicate we're changing filters
        this.dataset.filterChanging = 'true';
      }
    }, 500);
  }
  
  onCollectionReloaded(event) {
    console.log('Collection reloaded event received');
    
    // Always reset when collection is reloaded
    this.resetAfterFilterChange();
  }
  
  resetAfterFilterChange() {
    console.log('Resetting infinite scroll after filter/sort change');
    
    // Update pagination URL to match current URL (without page parameter)
    const url = new URL(window.location.href);
    url.searchParams.delete('page');
    this.paginationUrl = url.pathname + url.search;
    
    // Reset current page
    this.currentPage = 1;
    
    // Update total pages from the new data
    const paginationData = document.querySelector('.pagination');
    if (paginationData) {
      const lastPageLink = paginationData.querySelector('.pagination__item--last a');
      if (lastPageLink) {
        const lastPageUrl = new URL(lastPageLink.href);
        const lastPage = parseInt(lastPageUrl.searchParams.get('page') || '1', 10);
        this.totalPages = lastPage;
      }
    }
    
    // IMPORTANT: Clear all products and replace with first page only
    // This is the key fix for the duplication issue
    const firstPageProductsHTML = this.productGrid.innerHTML;
    this.productGrid.innerHTML = firstPageProductsHTML;
    
    console.log('Reset complete. New pagination URL:', this.paginationUrl);
    console.log('New total pages:', this.totalPages);
    
    // Re-observe the sentinel if it exists
    if (this.sentinel && this.intersectionObserver) {
      this.intersectionObserver.observe(this.sentinel);
    }
  }

  handleIntersection(entries) {
    if (!entries[0].isIntersecting || this.isLoading) return;
    
    // Check if we've reached the last page
    if (this.currentPage < this.totalPages) {
      this.loadMoreProducts();
    } else {
      // Remove sentinel when all pages are loaded
      if (this.sentinel) {
        this.sentinel.remove();
        this.intersectionObserver.disconnect();
      }
    }
  }

  async loadMoreProducts() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.toggleLoading(true);
    
    try {
      const nextPage = this.currentPage + 1;
      
      // Build URL with current filters and sort options
      let url = this.paginationUrl;
      
      // Add page parameter
      url += url.includes('?') ? '&' : '?';
      url += `page=${nextPage}`;
      
      // Add timestamp to prevent caching
      url += `&_=${Date.now()}`;
      
      console.log('Loading more products from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to load more products');
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Get new products
      const newProductItems = doc.querySelectorAll('#product-grid .grid__item');
      
      if (newProductItems.length > 0) {
        // Append new products to the grid
        newProductItems.forEach(item => {
          // Check if this product is already in the grid (by data-id if available, or by comparing innerHTML)
          const productId = item.dataset.productId;
          let isDuplicate = false;
          
          if (productId) {
            // If product has an ID, check for duplicates by ID
            isDuplicate = !!this.productGrid.querySelector(`.grid__item[data-product-id="${productId}"]`);
          } else {
            // Otherwise, check by comparing a unique part of the content
            const productTitle = item.querySelector('.card__heading')?.textContent.trim();
            if (productTitle) {
              isDuplicate = Array.from(this.productGrid.querySelectorAll('.card__heading')).some(
                heading => heading.textContent.trim() === productTitle
              );
            }
          }
          
          if (!isDuplicate) {
            this.productGrid.appendChild(item.cloneNode(true));
          } else {
            console.log('Skipping duplicate product');
          }
        });
        
        // Update current page
        this.currentPage = nextPage;
        
        // Initialize any JS components in the new products
        this.initializeProductComponents();
        
        // If we've loaded all pages, remove the sentinel
        if (this.currentPage >= this.totalPages) {
          if (this.sentinel) {
            this.sentinel.remove();
            this.intersectionObserver.disconnect();
          }
        }
      } else {
        // No more products, remove sentinel
        if (this.sentinel) {
          this.sentinel.remove();
          this.intersectionObserver.disconnect();
        }
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      this.isLoading = false;
      this.toggleLoading(false);
    }
  }

  toggleLoading(show) {
    if (this.loadingSpinner) {
      this.loadingSpinner.classList.toggle('loading-overlay--active', show);
    }
  }

  initializeProductComponents() {
    // Re-initialize any JS components that need it (like quick add buttons)
    if (window.Shopify && window.Shopify.PaymentButton) {
      window.Shopify.PaymentButton.init();
    }
    
    // Trigger any animation reveals for new elements
    if (window.customElements.get('scroll-trigger')) {
      const newAnimatedElements = this.querySelectorAll('.scroll-trigger.animate--slide-in:not(.animate--active)');
      newAnimatedElements.forEach((element, index) => {
        element.style.setProperty('--animation-order', index);
        element.classList.add('animate--active');
      });
    }
  }
  
  disconnectedCallback() {
    // Clean up when component is removed
    if (this.urlCheckInterval) {
      clearInterval(this.urlCheckInterval);
    }
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

customElements.define('infinite-scroll', InfiniteScroll);

