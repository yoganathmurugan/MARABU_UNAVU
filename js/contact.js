// ==========================================================================
// contact.js — Contact page. Per PRD §5 this form is intentionally
// non-functional: it validates client-side, then shows a success state.
// No network request is made — documented as a known limitation in the
// README.
// ==========================================================================

const CONTACT_VALIDATORS = {
  name: (v) => v.trim().length >= 2 || 'Enter your name.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
  message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.',
};

function clearContactErrors(form) {
  form.querySelectorAll('.field-error').forEach((el) => { el.textContent = ''; });
  form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
}

function showContactError(fieldName, message) {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorEl) errorEl.textContent = message;
  const input = document.querySelector(`[name="${fieldName}"]`);
  input?.closest('.form-field')?.classList.add('has-error');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearContactErrors(form);

    let isValid = true;
    let name = '';
    Object.entries(CONTACT_VALIDATORS).forEach(([field, validator]) => {
      const input = form.querySelector(`[name="${field}"]`);
      const value = input ? input.value : '';
      if (field === 'name') name = value.trim();
      const result = validator(value);
      if (result !== true) {
        isValid = false;
        showContactError(field, result);
      }
    });

    if (!isValid) {
      form.querySelector('.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    document.querySelector('[data-contact-form-wrap]').hidden = true;
    const successEl = document.querySelector('[data-contact-success]');
    successEl.hidden = false;
    const nameSlot = document.querySelector('[data-contact-success-name]');
    if (nameSlot) nameSlot.textContent = name ? `, ${name}` : '';
    successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const resetBtn = document.querySelector('[data-contact-reset]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      clearContactErrors(form);
      document.querySelector('[data-contact-success]').hidden = true;
      document.querySelector('[data-contact-form-wrap]').hidden = false;
    });
  }
});
