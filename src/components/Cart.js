// Shopping cart component
import { formatCurrency, showToast } from '../utils/helpers.js';

export class Cart {
  constructor() {
    this.items = this.loadCart();
    this.CART_KEY = 'moonbucks_cart_v1';
    this.listeners = [];
  }

  // Load cart from localStorage
  loadCart() {
    try {
      return JSON.parse(localStorage.getItem(this.CART_KEY) || '[]');
    } catch {
      return [];
    }
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.items));
    this.notifyListeners();
  }

  // Add item to cart
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.qty += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: quantity,
        stock: product.stock
      });
    }
    
    this.saveCart();
    showToast('Added to cart');
  }

  // Remove item from cart
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    showToast('Removed from cart');
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.qty = Math.max(0, quantity);
      if (item.qty === 0) {
        this.removeItem(productId);
      } else {
        this.saveCart();
      }
    }
  }

  // Clear cart
  clearCart() {
    this.items = [];
    this.saveCart();
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.qty), 0);
  }

  // Get cart count
  getCount() {
    return this.items.reduce((count, item) => count + item.qty, 0);
  }

  // Check if item is in cart
  hasItem(productId) {
    return this.items.some(item => item.id === productId);
  }

  // Get item quantity
  getItemQuantity(productId) {
    const item = this.items.find(item => item.id === productId);
    return item ? item.qty : 0;
  }

  // Validate cart against current stock
  validateCart(productMap) {
    const errors = [];
    
    for (const item of this.items) {
      const product = productMap.get(item.id);
      if (!product) {
        errors.push(`${item.name} is no longer available`);
        continue;
      }
      
      if (item.qty > product.stock) {
        errors.push(`Only ${product.stock} left for ${item.name}`);
      }
    }
    
    return errors;
  }

  // Add listener for cart changes
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.items, this.getTotal(), this.getCount()));
  }

  // Render cart UI
  renderCart(cartListEl, cartTotalEl, cartCountEl) {
    if (!cartListEl) return;

    cartListEl.innerHTML = '';
    
    if (this.items.length === 0) {
      cartListEl.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
      if (cartTotalEl) cartTotalEl.textContent = formatCurrency(0);
      if (cartCountEl) cartCountEl.textContent = '0';
      return;
    }

    this.items.forEach(item => {
      const itemEl = this.createCartItemElement(item);
      cartListEl.appendChild(itemEl);
    });

    if (cartTotalEl) cartTotalEl.textContent = formatCurrency(this.getTotal());
    if (cartCountEl) cartCountEl.textContent = this.getCount().toString();
  }

  // Create cart item element
  createCartItemElement(item) {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.imageUrl || './Coffee.png'}" alt="${item.name}" />
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${formatCurrency(item.price)}</div>
        <div class="item-quantity">× ${item.qty}</div>
      </div>
      <button class="remove-item" data-id="${item.id}">×</button>
    `;
    return itemEl;
  }
}
