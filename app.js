/**
 * Athlete Data Company – Web application
 * Routing, state, discovery (filters + dynamic cards), brand athlete profile.
 */

(function () {
  var PERSONA_START = { athlete: 'athlete-register', brand: 'brand-register', admin: 'admin-login' };
  var PERSONA_LABELS = { athlete: 'Athlete', brand: 'Brand / Agency', admin: 'Admin' };
  var BREADCRUMBS = {
    'athlete-register': 'Registration', 'athlete-profile': 'Profile', 'athlete-dashboard': 'Dashboard',
    'brand-register': 'Registration', 'brand-discovery': 'Discovery', 'brand-athlete-profile': 'Athlete profile',
    'brand-inquiry': 'Send inquiry', 'brand-proposal': 'Create proposal',
    'admin-login': 'Login', 'admin-athlete-governance': 'Athlete governance', 'admin-brand-governance': 'Brand governance', 'admin-revenue': 'Revenue dashboard',
    'deck': 'Deck'
  };

  var ATHLETE_SPORT_ROLES = {
    'Cricket': ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'],
    'Football (Soccer)': ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger'],
    'Basketball': ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
    'Volleyball': ['Setter', 'Outside Hitter', 'Opposite Hitter', 'Middle Blocker', 'Libero', 'Defensive Specialist'],
    'Tennis': ['NA'],
    'Badminton': ['NA'],
    'Table Tennis': ['NA'],
    'Hockey (Field Hockey)': ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
    'Ice Hockey': ['Goalie', 'Defenseman', 'Center', 'Left Wing', 'Right Wing'],
    'Kabaddi': ['Raider', 'Defender', 'All-rounder'],
    'Baseball': ['Pitcher', 'Catcher', 'First Baseman', 'Second Baseman', 'Third Baseman', 'Shortstop', 'Left Field', 'Center Field', 'Right Field'],
    'Softball': ['Pitcher', 'Catcher', 'Infielder', 'Outfielder'],
    'Rugby': ['Prop', 'Hooker', 'Lock', 'Flanker', 'Number 8', 'Scrum-half', 'Fly-half', 'Center', 'Wing', 'Fullback'],
    'American Football': ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Lineman', 'Defensive Lineman', 'Linebacker', 'Cornerback', 'Safety', 'Kicker'],
    'Golf': ['NA'],
    'Boxing': ['NA'],
    'Wrestling': ['NA'],
    'MMA': ['NA'],
    'Athletics (Track & Field)': ['Sprinter', 'Middle Distance Runner', 'Long Distance Runner', 'Hurdler', 'Jumper', 'Thrower', 'Decathlete'],
    'Swimming': ['Freestyle Specialist', 'Backstroke Specialist', 'Breaststroke Specialist', 'Butterfly Specialist', 'Medley Swimmer'],
    'Gymnastics': ['Artistic Gymnast', 'Rhythmic Gymnast', 'Trampoline Gymnast'],
    'Cycling': ['Sprinter', 'Climber', 'Time Trialist', 'Domestique', 'All-rounder'],
    'Chess': ['NA'],
    'Esports': ['Attacker', 'Defender', 'Support', 'Tank', 'Sniper'],
    'Car Racing (F1 / Motorsport)': ['Driver'],
    'Archery': ['Archer'],
    'Shooting': ['Shooter'],
    'Weightlifting': ['Weightlifter'],
    'Bodybuilding': ['Bodybuilder'],
    'Rowing': ['Rower', 'Coxswain'],
    'Canoeing / Kayaking': ['Paddler'],
    'Fencing': ['Foil Fencer', 'Épée Fencer', 'Sabre Fencer'],
    'Skateboarding': ['NA'],
    'Surfing': ['Surfer'],
    'Skiing': ['Alpine Skier', 'Freestyle Skier', 'Cross-country Skier'],
    'Snowboarding': ['Freestyle Rider', 'Alpine Rider'],
    'Handball': ['Goalkeeper', 'Left Wing', 'Right Wing', 'Center Back', 'Left Back', 'Right Back', 'Pivot'],
    'Netball': ['Goal Shooter', 'Goal Attack', 'Wing Attack', 'Center', 'Wing Defense', 'Goal Defense', 'Goal Keeper'],
    'Polo': ['Forward', 'Midfielder', 'Back'],
    'Squash': ['NA']
  };

  var journeyHeader = document.getElementById('journey-header');
  var journeyPersonaLabel = document.getElementById('journey-persona-label');
  var journeyBreadcrumb = document.getElementById('journey-breadcrumb');

  var state = { selectedAthleteId: null };
  var deckState = { pdfDoc: null, numPages: 0, currentPage: 1 };

  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  function initAthleteRegistrationSportRole() {
    var sportSelect = document.getElementById('athlete-sport');
    var roleSelect = document.getElementById('athlete-role');
    if (!sportSelect || !roleSelect) return;

    function renderRolesForSport(sport) {
      var roles = ATHLETE_SPORT_ROLES[sport] || ['NA'];
      roleSelect.innerHTML = roles.map(function (r) {
        return '<option>' + r + '</option>';
      }).join('');
    }

    renderRolesForSport(sportSelect.value || 'Cricket');
    sportSelect.addEventListener('change', function () {
      renderRolesForSport(sportSelect.value);
    });
  }

  function getPersonaForScreen(screenId) {
    if (screenId === 'deck') return null;
    if (screenId.startsWith('athlete-') || screenId === 'athlete-register') return 'athlete';
    if (screenId.startsWith('brand-')) return 'brand';
    if (screenId.startsWith('admin-')) return 'admin';
    return null;
  }

  function getDiscoveryFilters() {
    var ageEl = document.getElementById('filter-age');
    var perfEl = document.getElementById('filter-perf');
    var socialEl = document.getElementById('filter-social');
    var age = (ageEl && ageEl.value) ? ageEl.value.trim().split(/\s*[-–]\s*/) : [];
    var perf = (perfEl && perfEl.value) ? perfEl.value.trim().split(/\s*[-–]\s*/) : [];
    var social = (socialEl && socialEl.value) ? socialEl.value.trim().split(/\s*[-–]\s*/) : [];
    return {
      sport: document.getElementById('filter-sport') && document.getElementById('filter-sport').value,
      role: document.getElementById('filter-role') && document.getElementById('filter-role').value,
      ageMin: age[0] ? parseInt(age[0], 10) : null,
      ageMax: age[1] ? parseInt(age[1], 10) : null,
      region: document.getElementById('filter-location') && document.getElementById('filter-location').value,
      perfMin: perf[0] ? parseInt(perf[0], 10) : null,
      perfMax: perf[1] ? parseInt(perf[1], 10) : null,
      socialMin: social[0] ? parseInt(social[0], 10) : null,
      socialMax: social[1] ? parseInt(social[1], 10) : null,
      gender: document.getElementById('filter-gender') && document.getElementById('filter-gender').value,
      growth: document.getElementById('filter-growth') && document.getElementById('filter-growth').value,
      budget: document.getElementById('filter-budget') && document.getElementById('filter-budget').value,
      verifiedOnly: document.getElementById('filter-verified') ? document.getElementById('filter-verified').checked : false,
      searchQuery: document.getElementById('discovery-search') ? document.getElementById('discovery-search').value.trim() : ''
    };
  }

  function renderDiscovery() {
    var container = document.getElementById('discovery-athlete-cards');
    var countEl = document.getElementById('discovery-results-count');
    if (!container || !window.ADC_DATA) return;
    var filters = getDiscoveryFilters();
    var list = window.ADC_DATA.getAthletes(filters);
    container.innerHTML = list.map(function (a) {
      return '<article class="athlete-card" data-athlete-id="' + a.id + '">' +
        '<div class="athlete-card-top">' +
          '<div class="athlete-card-avatar">' + (a.initials || '') + '</div>' +
          '<div class="athlete-card-info">' +
            '<strong>' + (a.name || '') + '</strong>' +
            '<span>' + (a.sport || '') + ' · ' + (a.role || '') + '</span>' +
            '<div class="athlete-card-scores">' +
              '<span>Perf: ' + (a.perf != null ? a.perf : '—') + '</span>' +
              '<span>Social: ' + (a.social != null ? a.social : '—') + '</span>' +
              (a.verified ? ' <span class="verified">✓ Verified</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="btn-secondary btn-sm btn-view-athlete">Show profile</button>' +
        '</article>';
    }).join('');
    if (countEl) countEl.textContent = list.length + ' athlete' + (list.length !== 1 ? 's' : '') + ' found';
  }

  function renderBrandAthleteProfile(athleteId) {
    var athlete = window.ADC_DATA && window.ADC_DATA.getAthleteById(athleteId);
    var avatarEl = document.getElementById('brand-profile-avatar');
    var nameEl = document.getElementById('brand-profile-name');
    var subEl = document.getElementById('brand-profile-subtitle');
    var btnShortlist = document.getElementById('btn-shortlist-toggle');
    if (!athlete) {
      if (avatarEl) avatarEl.textContent = '—';
      if (nameEl) nameEl.textContent = 'Athlete not found';
      if (subEl) subEl.textContent = 'Go back to Discovery to select an athlete.';
      return;
    }
    if (avatarEl) avatarEl.textContent = athlete.initials || athlete.name.slice(0, 2).toUpperCase();
    if (nameEl) nameEl.textContent = athlete.name;
    if (subEl) subEl.textContent = (athlete.sport || '') + ' · ' + (athlete.role || '') + (athlete.verified ? ' · Verified' : '');
    if (btnShortlist) {
      var inList = window.ADC_DATA.isInShortlist(athlete.id);
      btnShortlist.textContent = inList ? 'Remove from shortlist' : 'Add to shortlist';
      btnShortlist.onclick = function () {
        if (window.ADC_DATA.isInShortlist(athlete.id)) window.ADC_DATA.removeFromShortlist(athlete.id);
        else window.ADC_DATA.addToShortlist(athlete.id);
        renderBrandAthleteProfile(athleteId);
      };
    }
    var perfEl = document.getElementById('pv-perf');
    var perfMeta = document.getElementById('pv-perf-meta');
    var socialEl = document.getElementById('pv-social');
    var socialMeta = document.getElementById('pv-social-meta');
    var fitEl = document.getElementById('pv-fit');
    var roiEl = document.getElementById('pv-roi');
    var injuryEl = document.getElementById('pv-injury');
    if (perfEl) perfEl.textContent = athlete.perf != null ? athlete.perf : '—';
    if (perfMeta) perfMeta.textContent = (athlete.perf >= 85 ? 'Tier A' : athlete.perf >= 75 ? 'Tier B' : 'Tier C');
    if (socialEl) socialEl.textContent = athlete.social != null ? athlete.social : '—';
    if (socialMeta) socialMeta.textContent = '↑ ' + (athlete.social >= 80 ? 15 : athlete.social >= 70 ? 10 : 5) + '%';
    if (fitEl) fitEl.textContent = (athlete.perf && athlete.social) ? ((athlete.perf + athlete.social) / 20).toFixed(1) : '—';
    if (roiEl) roiEl.textContent = (athlete.perf >= 80 && athlete.social >= 75) ? 'High' : (athlete.perf >= 70 ? 'Medium' : 'Low');
    if (injuryEl) injuryEl.textContent = 'Low';
    var inquiryTo = document.getElementById('inquiry-to-athlete');
    if (inquiryTo) inquiryTo.value = athlete.name + ' (' + athlete.sport + ' · ' + athlete.role + ')';
  }

  function showScreen(screenId, params) {
    params = params || {};
    if (!screenId) return;
    var isLanding = screenId === 'landing';
    document.querySelectorAll('.screen').forEach(function (el) {
      el.classList.toggle('active', el.id === 'screen-' + screenId);
    });
    if (journeyHeader) journeyHeader.style.display = isLanding ? 'none' : 'flex';
    if (isLanding) {
      if (journeyPersonaLabel) journeyPersonaLabel.textContent = '';
      if (journeyBreadcrumb) journeyBreadcrumb.textContent = '';
      return;
    }
    if (journeyPersonaLabel) journeyPersonaLabel.textContent = PERSONA_LABELS[getPersonaForScreen(screenId)] || '';
    if (journeyBreadcrumb) journeyBreadcrumb.textContent = BREADCRUMBS[screenId] || screenId;

    if (screenId === 'deck') {
      initDeckViewer();
    } else if (screenId === 'brand-discovery') {
      renderDiscovery();
    } else if (screenId === 'brand-athlete-profile') {
      var id = params.athleteId != null ? params.athleteId : state.selectedAthleteId;
      renderBrandAthleteProfile(id);
    } else if (screenId === 'brand-inquiry' && state.selectedAthleteId) {
      renderBrandAthleteProfile(state.selectedAthleteId);
    }

    var hash = screenId === 'landing' ? '#/' : '#/' + screenId.replace(/-/g, '/');
    if (params.athleteId) hash += '/' + params.athleteId;
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  }

  function parseRoute() {
    var hash = (window.location.hash || '#/').slice(1).replace(/^\/+|\/+$/g, '');
    var parts = hash ? hash.split('/') : [];
    if (parts.length === 0 || parts[0] === '') return 'landing';
    if (parts[0] === 'deck') return 'deck';
    if (parts[0] === 'brand' && parts[1] === 'athlete' && parts[2]) {
      state.selectedAthleteId = parseInt(parts[2], 10);
      return 'brand-athlete-profile';
    }
    return parts.join('-');
  }

  function initDeckViewer() {
    var canvas = document.getElementById('deck-canvas');
    var fallback = document.getElementById('deck-fallback');
    var pageInfo = document.getElementById('deck-page-info');
    var prevBtn = document.getElementById('deck-prev');
    var nextBtn = document.getElementById('deck-next');
    if (!canvas || !pageInfo) return;

    function showFallback(show) {
      if (fallback) fallback.style.display = show ? 'block' : 'none';
      canvas.style.display = show ? 'none' : 'block';
      if (prevBtn) prevBtn.disabled = show;
      if (nextBtn) nextBtn.disabled = show;
      if (pageInfo && show) pageInfo.textContent = '—';
    }

    function renderDeckPage(pageNum) {
      if (!deckState.pdfDoc || !canvas) return;
      deckState.currentPage = pageNum;
      pageInfo.textContent = 'Page ' + pageNum + ' / ' + deckState.numPages;
      prevBtn.disabled = pageNum <= 1;
      nextBtn.disabled = pageNum >= deckState.numPages;
      deckState.pdfDoc.getPage(pageNum).then(function (page) {
        var scale = 1.5;
        var viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
      });
    }

    if (deckState.pdfDoc) {
      showFallback(false);
      renderDeckPage(deckState.currentPage);
      return;
    }

    if (typeof pdfjsLib === 'undefined') {
      showFallback(true);
      return;
    }

    var pdfPath = 'Athlete-Data-Company (2).pdf';
    pdfjsLib.getDocument(pdfPath).promise.then(function (pdf) {
      deckState.pdfDoc = pdf;
      deckState.numPages = pdf.numPages;
      deckState.currentPage = 1;
      showFallback(false);
      renderDeckPage(1);
    }).catch(function () {
      showFallback(true);
    });

    if (prevBtn) prevBtn.onclick = function () {
      if (!deckState.pdfDoc || deckState.currentPage <= 1) return;
      renderDeckPage(deckState.currentPage - 1);
    };
    if (nextBtn) nextBtn.onclick = function () {
      if (!deckState.pdfDoc || deckState.currentPage >= deckState.numPages) return;
      renderDeckPage(deckState.currentPage + 1);
    };
  }

  function handleNavClick(e) {
    var target = e.target.closest('[data-nav]');
    if (!target) return;
    e.preventDefault();
    showScreen(target.getAttribute('data-nav'));
  }

  function handlePersonaClick(e) {
    var btn = e.target.closest('[data-persona]');
    if (!btn) return;
    var persona = btn.getAttribute('data-persona');
    var start = PERSONA_START[persona];
    if (start) showScreen(start);
  }

  function handleNextClick(e) {
    var btn = e.target.closest('[data-next]');
    if (!btn) return;
    var next = btn.getAttribute('data-next');
    showScreen(next);
  }

  function handleCardClick(e) {
    var card = e.target.closest('.athlete-card[data-athlete-id]');
    if (!card) return;
    var id = card.getAttribute('data-athlete-id');
    if (id) { state.selectedAthleteId = parseInt(id, 10); showScreen('brand-athlete-profile'); }
  }

  document.body.addEventListener('click', function (e) {
    handleNavClick(e);
    handlePersonaClick(e);
    handleNextClick(e);
    handleCardClick(e);
  });

  window.addEventListener('hashchange', function () { showScreen(parseRoute()); });
  window.addEventListener('load', function () {
    showScreen(parseRoute());
    initAthleteRegistrationSportRole();
    var btnApply = document.getElementById('btn-apply-filters');
    var searchEl = document.getElementById('discovery-search');
    if (btnApply) btnApply.addEventListener('click', function () { renderDiscovery(); });
    if (searchEl) searchEl.addEventListener('input', function () { renderDiscovery(); });
  });

  window.ADC_APP = { showScreen: showScreen, state: state, renderDiscovery: renderDiscovery, renderBrandAthleteProfile: renderBrandAthleteProfile };
})();
