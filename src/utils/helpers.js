// Utility functions and helpers
export function formatCurrency(amount) {
  return `₱${(amount || 0).toFixed(2)}`;
}

export function formatDate(date) {
  if (!date) return '—';
  const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleString();
}

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 2000);
}

export function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.textContent = content;
  return element;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateImageUrl(url) {
  return /^https?:\/\/.+\.(png|jpe?g|webp|gif)$/i.test(url);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function parseNumber(value, defaultValue = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function parseInteger(value, defaultValue = 0) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
