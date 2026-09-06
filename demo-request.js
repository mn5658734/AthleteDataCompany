/**
 * Request Demo modal — open / close / submit (client-side prototype).
 */
(function () {
  var modal = document.getElementById('demo-modal');
  var form = document.getElementById('demo-request-form');
  var openTriggers = document.querySelectorAll('[data-open-demo], #nav-demo-link');
  var closeEls = modal ? modal.querySelectorAll('[data-close-demo]') : [];
  var successEl = document.getElementById('demo-modal-success');
  var formWrap = document.getElementById('demo-modal-form-wrap');
  var previouslyFocused = null;

  function openModal(e) {
    if (e) e.preventDefault();
    if (!modal) return;
    previouslyFocused = document.activeElement;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('demo-modal-open');
    if (successEl) successEl.hidden = true;
    if (formWrap) formWrap.hidden = false;
    if (form) form.reset();
    var first = document.getElementById('demo-name');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('demo-modal-open');
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  }

  openTriggers.forEach(function (el) {
    el.addEventListener('click', openModal);
  });

  closeEls.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('demo-name') || {}).value || '';
      var email = (document.getElementById('demo-email') || {}).value || '';
      var phone = (document.getElementById('demo-phone') || {}).value || '';
      var purpose = (document.getElementById('demo-purpose') || {}).value || '';

      var payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        purpose: purpose.trim(),
        submittedAt: new Date().toISOString()
      };

      try {
        var key = 'adc_demo_requests';
        var existing = JSON.parse(localStorage.getItem(key) || '[]');
        if (!Array.isArray(existing)) existing = [];
        existing.push(payload);
        localStorage.setItem(key, JSON.stringify(existing));
      } catch (err) { /* ignore storage errors */ }

      if (formWrap) formWrap.hidden = true;
      if (successEl) {
        successEl.hidden = false;
        var focusBtn = successEl.querySelector('[data-close-demo]');
        if (focusBtn) focusBtn.focus();
      }
    });
  }
})();
