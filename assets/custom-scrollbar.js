document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.product__media-list.custom-scrollbar');
  
  sliders.forEach(slider => {
    slider.addEventListener('scroll', function() {
      const scrollLeft = this.scrollLeft;
      const maxScrollLeft = this.scrollWidth - this.clientWidth;
      const scrollProgress = (scrollLeft / maxScrollLeft) * 100;
      // Ensure a minimum of 25% for the scroll progress
      const finalProgress = Math.max(25, scrollProgress);
      
      const container = this.closest('.product-media-container') || this.parentElement;
      if (container) {
        container.style.setProperty('--scroll-progress', `${finalProgress}%`);
      }
    });

    slider.dispatchEvent(new Event('scroll'));
  });
});