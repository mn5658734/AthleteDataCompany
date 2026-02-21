/**
 * Athlete Data Company – Clickable prototype navigation
 * Handles: landing → persona selection → journey screens → back to landing
 */

(function () {
  const PERSONA_START = {
    athlete: 'athlete-register',
    brand: 'brand-register',
    admin: 'admin-login'
  };

  const PERSONA_LABELS = {
    athlete: 'Athlete',
    brand: 'Brand / Agency',
    admin: 'Admin'
  };

  const BREADCRUMBS = {
    'athlete-register': 'Registration',
    'athlete-profile': 'Profile',
    'athlete-dashboard': 'Dashboard',
    'brand-register': 'Registration',
    'brand-discovery': 'Discovery',
    'brand-athlete-profile': 'Athlete profile',
    'brand-inquiry': 'Send inquiry',
    'brand-proposal': 'Create proposal',
    'admin-login': 'Login',
    'admin-athlete-governance': 'Athlete governance',
    'admin-brand-governance': 'Brand governance',
    'admin-revenue': 'Revenue dashboard'
  };

  const journeyHeader = document.getElementById('journey-header');
  const journeyPersonaLabel = document.getElementById('journey-persona-label');
  const journeyBreadcrumb = document.getElementById('journey-breadcrumb');

  function showScreen(screenId) {
    if (!screenId) return;
    const isLanding = screenId === 'landing';
    document.querySelectorAll('.screen').forEach(function (el) {
      el.classList.toggle('active', el.id === 'screen-' + screenId);
    });
    if (journeyHeader) {
      journeyHeader.style.display = isLanding ? 'none' : 'flex';
    }
    if (isLanding) {
      if (journeyPersonaLabel) journeyPersonaLabel.textContent = '';
      if (journeyBreadcrumb) journeyBreadcrumb.textContent = '';
      return;
    }
    const persona = getPersonaForScreen(screenId);
    if (journeyPersonaLabel) {
      journeyPersonaLabel.textContent = persona ? PERSONA_LABELS[persona] : '';
    }
    if (journeyBreadcrumb) {
      journeyBreadcrumb.textContent = BREADCRUMBS[screenId] || screenId;
    }
  }

  function getPersonaForScreen(screenId) {
    if (screenId.startsWith('athlete-') || screenId === 'athlete-register') return 'athlete';
    if (screenId.startsWith('brand-')) return 'brand';
    if (screenId.startsWith('admin-')) return 'admin';
    return null;
  }

  function handleNavClick(e) {
    const target = e.target.closest('[data-nav]');
    if (!target) return;
    e.preventDefault();
    showScreen(target.getAttribute('data-nav'));
  }

  function handlePersonaClick(e) {
    const btn = e.target.closest('[data-persona]');
    if (!btn) return;
    const persona = btn.getAttribute('data-persona');
    const start = PERSONA_START[persona];
    if (start) showScreen(start);
  }

  function handleNextClick(e) {
    const btn = e.target.closest('[data-next]');
    if (!btn) return;
    const next = btn.getAttribute('data-next');
    showScreen(next);
  }

  function handleCardClick(e) {
    const card = e.target.closest('.athlete-card');
    if (!card) return;
    const next = card.getAttribute('data-next');
    if (next) showScreen(next);
  }

  document.body.addEventListener('click', function (e) {
    handleNavClick(e);
    handlePersonaClick(e);
    handleNextClick(e);
    handleCardClick(e);
  });

  showScreen('landing');
})();
