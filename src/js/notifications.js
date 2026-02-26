// Toast notification system
export class NotificationManager {
  show(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white z-50 transform transition-all duration-300 translate-x-96`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const bgColors = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      info: 'bg-blue-600',
      warning: 'bg-yellow-600'
    };
    toast.classList.add(bgColors[type] || bgColors.info);
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.remove('translate-x-96'), 10);

    // Animate out and remove
    setTimeout(() => {
      toast.classList.add('translate-x-96');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  success(message) {
    this.show(message, 'success');
  }

  error(message) {
    this.show(message, 'error');
  }

  warning(message) {
    this.show(message, 'warning');
  }

  info(message) {
    this.show(message, 'info');
  }
}

// Create a global notification manager instance
export const notify = new NotificationManager();
