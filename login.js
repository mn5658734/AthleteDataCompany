/**
 * Athlete Data Company – Unified login (v1.1)
 * Persona selection + credentials → redirect to persona workspace.
 */
(function () {
  var PERSONA_REDIRECTS = {
    athlete: { type: 'internal', hash: '#/athlete/dashboard', hint: "You'll go to your athlete dashboard after sign-in." },
    brand: { type: 'internal', hash: '#/brand/discovery', hint: "You'll go to brand discovery after sign-in." },
    creator: { type: 'internal', hash: '#/creator/dashboard', hint: "You'll go to your creator dashboard after sign-in." },
    admin: { type: 'internal', hash: '#/admin/athlete/governance', hint: "You'll go to the admin console after sign-in." },
    fan: {
      type: 'external',
      url: 'https://sportstrade.world/',
      hint: 'SportsTrade opens in a new browser tab — invest in your favourite athletes.'
    }
  };

  var selectedPersona = 'athlete';
  var personaRoot = document.getElementById('login-personas');
  var hintEl = document.getElementById('login-persona-hint');
  var form = document.getElementById('login-form');
  var errorEl = document.getElementById('login-error');
  var submitBtn = document.getElementById('login-submit-btn');
  var deckLink = document.getElementById('nav-deck-link');

  function setPersona(persona) {
    if (!PERSONA_REDIRECTS[persona]) return;
    selectedPersona = persona;
    if (personaRoot) {
      personaRoot.querySelectorAll('.login-persona').forEach(function (btn) {
        var active = btn.getAttribute('data-persona') === persona;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-checked', active ? 'true' : 'false');
      });
    }
    if (hintEl) hintEl.textContent = PERSONA_REDIRECTS[persona].hint;
    if (submitBtn) {
      submitBtn.textContent = persona === 'fan' ? 'Login & open SportsTrade →' : 'Login →';
    }
    if (errorEl) errorEl.hidden = true;
  }

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = !msg;
  }

  function handleLogin(e) {
    e.preventDefault();
    var emailEl = document.getElementById('login-email');
    var passEl = document.getElementById('login-password');
    var email = emailEl && emailEl.value ? emailEl.value.trim() : '';
    var password = passEl && passEl.value ? passEl.value.trim() : '';

    if (!email) {
      showError('Please enter your email.');
      if (emailEl) emailEl.focus();
      return;
    }
    if (!password) {
      showError('Please enter your password.');
      if (passEl) passEl.focus();
      return;
    }

    showError('');
    var dest = PERSONA_REDIRECTS[selectedPersona];
    if (!dest) return;

    try {
      sessionStorage.setItem('adc_login_persona', selectedPersona);
      sessionStorage.setItem('adc_login_email', email);
    } catch (err) { /* ignore */ }

    if (dest.type === 'external') {
      window.open(dest.url, '_blank', 'noopener,noreferrer');
      showError('');
      if (hintEl) {
        hintEl.textContent = 'SportsTrade opened in a new tab. You can sign in there with the same credentials.';
      }
      return;
    }

    window.location.href = '/' + dest.hash;
  }

  if (personaRoot) {
    personaRoot.addEventListener('click', function (e) {
      var btn = e.target.closest('.login-persona[data-persona]');
      if (!btn) return;
      setPersona(btn.getAttribute('data-persona'));
    });
  }

  if (form) form.addEventListener('submit', handleLogin);

  if (deckLink) {
    deckLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = '/deck';
    });
  }

  function getPersonaFromQuery() {
    var match = /[?&]persona=([^&]+)/.exec(window.location.search);
    return match ? decodeURIComponent(match[1]) : '';
  }

  var initialPersona = getPersonaFromQuery();
  setPersona(PERSONA_REDIRECTS[initialPersona] ? initialPersona : 'athlete');
})();
