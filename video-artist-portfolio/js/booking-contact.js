/**
 * Project Transmission — Contact Form via FormSubmit.co AJAX
 * Sends form data without leaving the page.
 */

class ContactTransceiver {
  constructor() {
    this.form      = document.getElementById('project-booking-form');
    this.submitBtn = document.getElementById('booking-submit-btn');
    if (!this.form) return;
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Live focus glow on inputs
    this.form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('focus', () => el.style.borderColor = 'rgba(0,245,212,0.7)');
      el.addEventListener('blur',  () => el.style.borderColor = '');
    });
  }

  async handleSubmit(e) {
    e.preventDefault(); // Prevent page redirect

    const nameEl    = document.getElementById('contact-name');
    const emailEl   = document.getElementById('contact-email');
    const subjectEl = document.getElementById('contact-subject');
    const msgEl     = document.getElementById('contact-message');

    const name    = nameEl.value.trim();
    const email   = emailEl.value.trim();
    const subject = subjectEl ? subjectEl.value.trim() : '';
    const message = msgEl.value.trim();

    // ── Validation ────────────────────────────────────────
    if (!name) {
      this.shake(nameEl);
      this.showToast('⚠️ Please enter your name.', 'error');
      return;
    }
    if (!this.isValidEmail(email)) {
      this.shake(emailEl);
      this.showToast('⚠️ Please enter a valid email address.', 'error');
      return;
    }
    if (!message) {
      this.shake(msgEl);
      this.showToast('⚠️ Please describe your project.', 'error');
      return;
    }

    // ── Send via FormSubmit AJAX ──────────────────────────
    this.setLoading(true);
    if (window.soundFX) window.soundFX.playTransmit();

    const payload = {
      name:    name,
      email:   email,
      subject: subject || 'New Project Inquiry',
      message: message,
      // FormSubmit special fields
      _subject:  subject ? `[Portfolio] ${subject}` : '[Portfolio] New Project Inquiry',
      _template: 'table',
      _captcha:  'false'
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/nabiliatta10@gmail.com', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      this.setLoading(false);

      if (response.ok && result.success === 'true') {
        this.form.reset();
        this.showToast('🚀 Transmission sent! I\'ll review your brief within 24 hours.', 'success');
        if (window.soundFX) window.soundFX.playSuccess();
      } else {
        throw new Error(result.message || 'Unknown error');
      }

    } catch (err) {
      console.error('FormSubmit error:', err);
      this.setLoading(false);
      this.showToast('❌ Transmission failed. Please email directly: nabiliatta10@gmail.com', 'error');
      if (window.soundFX) window.soundFX.playError();
    }
  }

  // ── Helpers ───────────────────────────────────────────

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  setLoading(isLoading) {
    if (!this.submitBtn) return;
    if (isLoading) {
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML = `
        <span class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          ENCRYPTING &amp; DISPATCHING...
        </span>`;
    } else {
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML =
        `<i class="fa-solid fa-paper-plane"></i><span>TRANSMIT PROJECT BRIEF</span>`;
    }
  }

  shake(el) {
    el.style.borderColor = '#f43f5e';
    el.animate([
      { transform: 'translateX(0)'  },
      { transform: 'translateX(-7px)' },
      { transform: 'translateX(7px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(0)'  }
    ], { duration: 320, easing: 'ease-out' });
    setTimeout(() => { el.style.borderColor = ''; }, 1500);
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    if (type === 'error') {
      toast.style.borderLeftColor = '#f43f5e';
      toast.style.borderColor     = '#f43f5e';
    }
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fa-solid ${
          type === 'error'
            ? 'fa-triangle-exclamation text-rose-500'
            : 'fa-circle-check text-neon-cyan'
        }"></i>
        <span>${message}</span>
      </div>`;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 40);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 5500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.contactTransceiver = new ContactTransceiver();
});
