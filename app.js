/**
 * Athlete Data Company – Web application
 * Routing, state, discovery (filters + dynamic cards), brand athlete profile.
 */

(function () {
  var PERSONA_START = { athlete: 'athlete-register', brand: 'brand-register', admin: 'admin-login', creator: 'creator-register' };
  var PERSONA_LABELS = { athlete: 'Athlete', brand: 'Brand / Agency', admin: 'Admin', creator: 'Sports Content Creator' };
  var BREADCRUMBS = {
    'athlete-register': 'Registration', 'athlete-profile': 'Profile', 'athlete-dashboard': 'Dashboard',
    'creator-register': 'Registration', 'creator-profile': 'Profile', 'creator-dashboard': 'Dashboard',
    'brand-register': 'Registration', 'brand-discovery': 'Discovery', 'brand-athlete-profile': 'Athlete profile',
    'brand-inquiry': 'Send inquiry', 'brand-proposal': 'Create proposal',
    'admin-login': 'Login', 'admin-athlete-governance': 'Athlete governance', 'admin-brand-governance': 'Brand governance', 'admin-revenue': 'Revenue dashboard'
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
  var discoveryState = { filteredList: [], currentPage: 1, pageSize: 10 };

  function isHomePath() {
    var path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    return path === '/' || path.endsWith('/index.html');
  }

  function goToDeck() {
    history.pushState({ adcScreen: 'landing' }, '', window.location.pathname || '/');
    window.location.href = '/deck.html';
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
    if (screenId.startsWith('creator-')) return 'creator';
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
      team: document.getElementById('filter-team') && document.getElementById('filter-team').value,
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

  function buildAthleteCardHtml(a) {
    var teamLabel = a.teamShort || a.team || '';
    var leagueLabel = a.league ? a.league + ' · ' : '';
    return '<article class="athlete-card" data-athlete-id="' + a.id + '">' +
      '<div class="athlete-card-top">' +
        '<div class="athlete-card-avatar">' + (a.initials || '') + '</div>' +
        '<div class="athlete-card-info">' +
          '<strong>#' + (a.rank || '—') + ' ' + (a.name || '') + '</strong>' +
          '<span>' + leagueLabel + (a.role || '') + (teamLabel ? ' · ' + teamLabel : '') + '</span>' +
          '<div class="athlete-card-scores">' +
            '<span>Perf: ' + (a.perf != null ? a.perf : '—') + '</span>' +
            '<span>Social: ' + (a.social != null ? a.social : '—') + '</span>' +
            (a.pom != null ? '<span>POM: ' + a.pom + '</span>' : '') +
            (a.verified ? ' <span class="verified">✓ Verified</span>' : '') +
          '</div>' +
          (a.matches != null ? '<span class="athlete-card-meta">Matches: ' + a.matches + ' · Win rate: ' + (a.winRate != null ? a.winRate + '%' : '—') + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<button type="button" class="btn-secondary btn-sm btn-view-athlete">Show profile</button>' +
      '</article>';
  }

  function renderDiscoveryPagination(total, page, pageSize) {
    var paginationEl = document.getElementById('discovery-pagination');
    if (!paginationEl) return;
    if (total <= pageSize) {
      paginationEl.innerHTML = total > 0
        ? '<span class="discovery-pagination-info">Showing all ' + total + ' athletes</span>'
        : '';
      return;
    }
    var totalPages = Math.ceil(total / pageSize);
    page = Math.max(1, Math.min(page, totalPages));
    var start = (page - 1) * pageSize + 1;
    var end = Math.min(page * pageSize, total);
    var html = '<div class="discovery-pagination-inner">' +
      '<span class="discovery-pagination-info">Showing ' + start + '–' + end + ' of ' + total + '</span>' +
      '<div class="discovery-pagination-controls">';
    html += '<button type="button" class="discovery-page-btn" data-page="' + (page - 1) + '" ' + (page <= 1 ? 'disabled' : '') + '>← Prev</button>';
    for (var i = 1; i <= totalPages; i++) {
      html += '<button type="button" class="discovery-page-btn' + (i === page ? ' discovery-page-btn--active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    html += '<button type="button" class="discovery-page-btn" data-page="' + (page + 1) + '" ' + (page >= totalPages ? 'disabled' : '') + '>Next →</button>';
    html += '</div></div>';
    paginationEl.innerHTML = html;
  }

  function renderDiscovery(options) {
    options = options || {};
    var container = document.getElementById('discovery-athlete-cards');
    var countEl = document.getElementById('discovery-results-count');
    if (!container || !window.ADC_DATA) return;

    if (options.resetPage) discoveryState.currentPage = 1;

    var filters = getDiscoveryFilters();
    var list = window.ADC_DATA.getAthletes(filters);
    discoveryState.filteredList = list;

    var pageSize = discoveryState.pageSize;
    var totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    if (discoveryState.currentPage > totalPages) discoveryState.currentPage = totalPages;
    if (discoveryState.currentPage < 1) discoveryState.currentPage = 1;

    var startIdx = (discoveryState.currentPage - 1) * pageSize;
    var pageList = list.slice(startIdx, startIdx + pageSize);

    container.innerHTML = pageList.map(buildAthleteCardHtml).join('');

    if (countEl) {
      var meta = window.ADC_DATA.IPL_META;
      var suffix = meta ? ' · IPL ' + meta.season + ' dataset' : '';
      countEl.textContent = list.length + ' athlete' + (list.length !== 1 ? 's' : '') + ' found' + suffix;
    }

    renderDiscoveryPagination(list.length, discoveryState.currentPage, pageSize);
  }

  function goToDiscoveryPage(page) {
    var totalPages = Math.max(1, Math.ceil(discoveryState.filteredList.length / discoveryState.pageSize));
    page = parseInt(page, 10);
    if (isNaN(page) || page < 1 || page > totalPages) return;
    discoveryState.currentPage = page;
    renderDiscovery();
    var cards = document.getElementById('discovery-athlete-cards');
    if (cards) cards.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function applyDiscoveryFilters() {
    renderDiscovery({ resetPage: true });
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
    if (nameEl) nameEl.textContent = (athlete.rank ? '#' + athlete.rank + ' ' : '') + athlete.name;
    if (subEl) {
      var parts = [];
      if (athlete.league) parts.push(athlete.league);
      if (athlete.teamShort || athlete.team) parts.push(athlete.teamShort || athlete.team);
      if (athlete.role) parts.push(athlete.role);
      if (athlete.verified) parts.push('Verified');
      subEl.textContent = parts.join(' · ');
    }
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
    if (injuryEl) injuryEl.textContent = athlete.matches >= 12 ? 'Low' : (athlete.matches >= 8 ? 'Moderate' : 'Monitor');
    var statsEl = document.getElementById('brand-profile-ipl-stats');
    if (statsEl) {
      statsEl.innerHTML =
        '<p><strong>IPL 2026 season stats</strong> (from match dataset)</p>' +
        '<ul class="ipl-stats-list">' +
          '<li>Matches played: <strong>' + (athlete.matches != null ? athlete.matches : '—') + '</strong></li>' +
          '<li>Player of the Match: <strong>' + (athlete.pom != null ? athlete.pom : '—') + '</strong></li>' +
          '<li>Team wins when selected: <strong>' + (athlete.wins != null ? athlete.wins : '—') + '</strong></li>' +
          '<li>Win rate: <strong>' + (athlete.winRate != null ? athlete.winRate + '%' : '—') + '</strong></li>' +
          '<li>Franchise: <strong>' + (athlete.teamShort || athlete.team || '—') + '</strong></li>' +
          '<li>Discovery rank: <strong>#' + (athlete.rank || '—') + '</strong></li>' +
        '</ul>' +
        '<p class="ipl-stats-note">Scores combine POM impact (38%), team win rate (32%), and squad availability (30%). Social score adds POM visibility and star recognition.</p>';
    }
    var inquiryTo = document.getElementById('inquiry-to-athlete');
    if (inquiryTo) inquiryTo.value = athlete.name + ' (' + (athlete.teamShort || athlete.team || athlete.sport) + ' · ' + athlete.role + ')';
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
      var homeUrl = '/';
      if (window.location.pathname !== homeUrl || window.location.hash || window.location.search) {
        window.history.replaceState(null, '', homeUrl);
      }
      return;
    }
    if (journeyPersonaLabel) journeyPersonaLabel.textContent = PERSONA_LABELS[getPersonaForScreen(screenId)] || '';
    if (journeyBreadcrumb) journeyBreadcrumb.textContent = BREADCRUMBS[screenId] || screenId;

    if (screenId === 'deck') {
      goToDeck();
      return;
    } else if (screenId === 'brand-discovery') {
      renderDiscovery();
    } else if (screenId === 'brand-athlete-profile') {
      var id = params.athleteId != null ? params.athleteId : state.selectedAthleteId;
      renderBrandAthleteProfile(id);
    } else if (screenId === 'brand-inquiry' && state.selectedAthleteId) {
      renderBrandAthleteProfile(state.selectedAthleteId);
    }

    var newUrl;
    if (screenId === 'landing') {
      newUrl = window.location.pathname || '/';
    } else {
      newUrl = (window.location.pathname || '/') + '#/' + screenId.replace(/-/g, '/');
      if (params.athleteId) newUrl += '/' + params.athleteId;
    }
    if (window.location.href !== window.location.origin + newUrl) window.history.replaceState(null, '', newUrl);
  }

  function parseRoute() {
    var path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    if (path === '/deck') {
      goToDeck();
      return 'landing';
    }
    var hash = (window.location.hash || '#/').slice(1).replace(/^\/+|\/+$/g, '');
    var parts = hash ? hash.split('/') : [];
    if (parts.length === 0 || parts[0] === '') return 'landing';
    if (parts[0] === 'deck') {
      goToDeck();
      return 'landing';
    }
    if (parts[0] === 'landing-content') return 'landing';
    if (parts[0] === 'brand' && parts[1] === 'athlete' && parts[2]) {
      state.selectedAthleteId = parseInt(parts[2], 10);
      return 'brand-athlete-profile';
    }
    return parts.join('-');
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
    e.preventDefault();
    var persona = btn.getAttribute('data-persona');
    window.location.href = '/login.html?persona=' + encodeURIComponent(persona);
  }

  function handleNextClick(e) {
    var btn = e.target.closest('[data-next]');
    if (!btn) return;
    var next = btn.getAttribute('data-next');
    showScreen(next);
  }

  function handleCardClick(e) {
    var pageBtn = e.target.closest('.discovery-page-btn[data-page]');
    if (pageBtn && !pageBtn.disabled) {
      e.preventDefault();
      goToDiscoveryPage(pageBtn.getAttribute('data-page'));
      return;
    }
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

  function isPageReload() {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type) return nav.type === 'reload';
    if (performance.navigation && typeof performance.navigation.type === 'number') {
      return performance.navigation.type === 1;
    }
    return false;
  }

  function initHeroScroll() {
    var scrollBtn = document.getElementById('hero-scroll-btn');
    var landingContent = document.getElementById('landing-content');
    if (!scrollBtn || !landingContent) return;
    scrollBtn.addEventListener('click', function () {
      landingContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  window.addEventListener('hashchange', function () { showScreen(parseRoute()); });
  window.addEventListener('pageshow', function () {
    if (isHomePath() && !window.location.hash) showScreen('landing');
  });
  window.addEventListener('load', function () {
    var deckLink = document.getElementById('nav-deck-link');
    if (deckLink) {
      deckLink.addEventListener('click', function (e) {
        e.preventDefault();
        goToDeck();
      });
    }
    if (isPageReload()) {
      window.history.replaceState(null, '', '/');
      showScreen('landing');
    } else {
      showScreen(parseRoute());
    }
    initAthleteRegistrationSportRole();
    initHeroScroll();
    var btnApply = document.getElementById('btn-apply-filters');
    var searchEl = document.getElementById('discovery-search');
    var teamEl = document.getElementById('filter-team');
    if (btnApply) btnApply.addEventListener('click', applyDiscoveryFilters);
    if (searchEl) searchEl.addEventListener('input', function () { renderDiscovery({ resetPage: true }); });
    if (teamEl) teamEl.addEventListener('change', function () { renderDiscovery({ resetPage: true }); });
  });

  window.ADC_APP = {
    showScreen: showScreen,
    state: state,
    discoveryState: discoveryState,
    renderDiscovery: renderDiscovery,
    applyDiscoveryFilters: applyDiscoveryFilters,
    goToDiscoveryPage: goToDiscoveryPage,
    renderBrandAthleteProfile: renderBrandAthleteProfile,
    getDiscoveryFilters: getDiscoveryFilters,
    goToDeck: goToDeck
  };
})();
