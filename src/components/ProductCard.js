// Product card component
import { formatCurrency } from '../utils/helpers.js';

export class ProductCard {
  constructor(product, cart) {
    this.product = product;
    this.cart = cart;
  }

  // Create product card element
  create() {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = this.getHTML();
    
    // Add event listeners
    this.addEventListeners(card);
    
    return card;
  }

  // Get product card HTML
  getHTML() {
    const { product } = this;
    const isOutOfStock = product.stock <= 0;
    const inCart = this.cart.getItemQuantity(product.id);
    
    return `
      <div class="product-image">
        <img src="${product.imageUrl || './Coffee.png'}" 
             alt="${product.name}" 
             loading="lazy" />
        ${isOutOfStock ? '<div class="out-of-stock">Out of Stock</div>' : ''}
      </div>
      
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        
        <div class="product-meta">
          <div class="product-price">${formatCurrency(product.price)}</div>
          <div class="product-stock ${isOutOfStock ? 'out' : ''}">
            ${isOutOfStock ? 'Out of stock' : `${product.stock} left`}
          </div>
        </div>
        
        <div class="product-actions">
          ${this.getActionButton(inCart, isOutOfStock)}
        </div>
      </div>
    `;
  }

  // Get action button based on state
  getActionButton(inCart, isOutOfStock) {
    if (isOutOfStock) {
      return '<button class="btn btn-disabled" disabled>Unavailable</button>';
    }
    
    if (inCart > 0) {
      return `
        <div class="quantity-controls">
          <button class="btn btn-secondary" data-action="decrease">-</button>
          <span class="quantity">${inCart}</span>
          <button class="btn btn-secondary" data-action="increase">+</button>
        </div>
      `;
    }
    
    return '<button class="btn btn-primary" data-action="add">Add to Cart</button>';
  }

  // Add event listeners
  addEventListeners(card) {
    const addBtn = card.querySelector('[data-action="add"]');
    const decreaseBtn = card.querySelector('[data-action="decrease"]');
    const increaseBtn = card.querySelector('[data-action="increase"]');

    if (addBtn) {
      addBtn.addEventListener('click', () => this.addToCart());
    }

    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => this.decreaseQuantity());
    }

    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => this.increaseQuantity());
    }
  }

  // Add product to cart
  addToCart() {
    if (this.product.stock <= 0) return;
    
    const currentQuantity = this.cart.getItemQuantity(this.product.id);
    if (currentQuantity >= this.product.stock) {
      this.showMessage('No more stock available');
      return;
    }
    
    this.cart.addItem(this.product);
    this.updateButton();
  }

  // Increase quantity
  increaseQuantity() {
    const currentQuantity = this.cart.getItemQuantity(this.product.id);
    if (currentQuantity >= this.product.stock) {
      this.showMessage('No more stock available');
      return;
    }
    
    this.cart.addItem(this.product);
    this.updateButton();
  }

  // Decrease quantity
  decreaseQuantity() {
    const currentQuantity = this.cart.getItemQuantity(this.product.id);
    if (currentQuantity > 0) {
      this.cart.updateQuantity(this.product.id, currentQuantity - 1);
      this.updateButton();
    }
  }

  // Update button state
  updateButton() {
    const card = document.querySelector(`[data-product-id="${this.product.id}"]`);
    if (!card) return;
    
    const inCart = this.cart.getItemQuantity(this.product.id);
    const actionsEl = card.querySelector('.product-actions');
    
    if (actionsEl) {
      actionsEl.innerHTML = this.getActionButton(inCart, this.product.stock <= 0);
      this.addEventListeners(card);
    }
  }

  // Show message
  showMessage(message) {
    // You can implement a toast notification here
    console.log(message);
  }

  // Update product data
  updateProduct(newProduct) {
    this.product = { ...this.product, ...newProduct };
  }
}
