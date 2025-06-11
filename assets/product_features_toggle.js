class ProductFeaturesToggle extends HTMLElement {
  constructor() {
    super();
    this.expanded = false;
  }

  connectedCallback() {
    const features = this.querySelectorAll('li');
    if (!features) return;

    const visibleCount = parseInt(this.getAttribute('visible-count')) || 5;
		const ul = this.querySelector('ul');
		ul.classList.add('ts:list-disc', 'ts:!p-0', 'ts:!m-0');

    features.forEach((feature, index) => {
      feature.className = 'feature-item';
      if (index >= visibleCount) feature.classList.add('ts:hidden');
    });

    const button = this.querySelector('button');
    button.addEventListener('click', () => {
      this.expanded = !this.expanded;
      ul.querySelectorAll('.feature-item').forEach((li, index) => {
        if (index >= visibleCount) {
          li.classList.toggle('ts:hidden', !this.expanded);
        }
      });
      button.textContent = this.expanded ? 'SHOW LESS' : 'SHOW MORE';
    });

    ul.querySelectorAll('.feature-item').forEach((li, index) => {
      if (index >= visibleCount) li.classList.add('ts:hidden');
    });
  }
}

customElements.define('product-features-toggle', ProductFeaturesToggle);