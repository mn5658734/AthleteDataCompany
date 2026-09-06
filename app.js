/**
 * Athlete Data Company – Web application
 * Routing, state, discovery (filters + dynamic cards), brand athlete profile.
 */

(function () {
  var PERSONA_START = { athlete: 'athlete-profile', brand: 'brand-register', admin: 'admin-login', creator: 'creator-register' };
  var PERSONA_LABELS = { athlete: 'Athlete', brand: 'Brand / Agency', admin: 'Admin', creator: 'Sports Content Creator' };
  var BREADCRUMBS = {
    'data': 'Scoring Data',
    'athlete-register': 'Profile', 'athlete-profile': 'Edit profile', 'athlete-dashboard': 'Overview', 'athlete-requests': 'Sponsorship requests',
    'creator-register': 'Registration', 'creator-profile': 'Profile', 'creator-dashboard': 'Dashboard', 'creator-requests': 'Brand requests',
    'brand-register': 'Registration', 'brand-discovery': 'Discovery', 'brand-athlete-profile': 'Athlete profile',
    'brand-inquiry': 'Send inquiry', 'brand-proposal': 'Create proposal', 'brand-requests': 'Sponsorship requests', 'brand-shortlist': 'Shortlist',
    'admin-login': 'Login', 'admin-athlete-governance': 'Athlete governance', 'admin-brand-governance': 'Brand governance', 'admin-revenue': 'Revenue dashboard'
  };

  // Left-hand navigation menu per persona. `badge:` keys pull a live count.
  var NAV_MENUS = {
    athlete: {
      label: 'Athlete',
      items: [
        { icon: '📊', label: 'Overview', screen: 'athlete-dashboard' },
        { icon: '👤', label: 'Profile', screen: 'athlete-profile' },
        { icon: '🤝', label: 'Sponsorship Requests', screen: 'athlete-requests', badge: 'athlete-requests' }
      ]
    },
    creator: {
      label: 'Content Creator',
      items: [
        { icon: '📊', label: 'Dashboard', screen: 'creator-dashboard' },
        { icon: '👤', label: 'My Profile', screen: 'creator-profile' },
        { icon: '🤝', label: 'Brand Requests', screen: 'creator-requests', badge: 'creator-requests' },
        { icon: '📝', label: 'Registration', screen: 'creator-register' }
      ]
    },
    brand: {
      label: 'Brand / Agency',
      items: [
        { icon: '🔍', label: 'Athlete Discovery', screen: 'brand-discovery' },
        { icon: '🤝', label: 'Sponsorship Requests', screen: 'brand-requests', badge: 'brand-requests' },
        { icon: '⭐', label: 'Shortlist', screen: 'brand-shortlist', badge: 'shortlist' },
        { icon: '🏢', label: 'Account', screen: 'brand-register' }
      ]
    },
    admin: {
      label: 'Admin Console',
      items: [
        { icon: '🛡️', label: 'Athlete Governance', screen: 'admin-athlete-governance' },
        { icon: '🏢', label: 'Brand Governance', screen: 'admin-brand-governance' },
        { icon: '💹', label: 'Revenue Dashboard', screen: 'admin-revenue' }
      ]
    }
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
  var discoveryState = { filteredList: [], currentPage: 1, pageSize: 10, hasSearched: false };

  function isHomePath() {
    var path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    return path === '/' || path.endsWith('/index.html');
  }

  function goToDeck() {
    history.pushState({ adcScreen: 'landing' }, '', window.location.pathname || '/');
    window.location.href = '/deck';
  }

  function initAthleteRegistrationSportRole() {
    var sportSelect = document.getElementById('athlete-sport');
    var roleSelect = document.getElementById('athlete-role');
    if (!sportSelect || !roleSelect) return;

    function renderRolesForSport(sport) {
      var roles = ATHLETE_SPORT_ROLES[sport] || ['NA'];
      var current = roleSelect.value;
      roleSelect.innerHTML = '<option value="">Select role</option>' + roles.map(function (r) {
        return '<option>' + r + '</option>';
      }).join('');
      if (current && roles.indexOf(current) !== -1) roleSelect.value = current;
    }

    renderRolesForSport(sportSelect.value || 'Cricket');
    sportSelect.addEventListener('change', function () {
      renderRolesForSport(sportSelect.value || 'Cricket');
      updateAthleteProfileCompletion();
    });
  }

  function updateAthleteProfileCompletion() {
    var form = document.getElementById('form-athlete-profile');
    if (!form) return 0;
    var filled = 0;
    var total = 0;

    form.querySelectorAll('[data-profile-field]').forEach(function (el) {
      total += 1;
      if ((el.value || '').toString().trim()) filled += 1;
    });
    form.querySelectorAll('[data-profile-file]').forEach(function (el) {
      total += 1;
      if (el.files && el.files.length) filled += 1;
    });
    form.querySelectorAll('[data-profile-check]').forEach(function (el) {
      total += 1;
      if (el.checked) filled += 1;
    });

    var pct = total ? Math.round((filled / total) * 100) : 0;
    if (pct < 50) pct = 50;
    var valueEl = document.getElementById('athlete-profile-completion-value');
    var fillEl = document.getElementById('athlete-profile-completion-fill');
    var barEl = document.getElementById('athlete-profile-completion-bar');
    var dashEl = document.getElementById('dashboard-profile-completion');
    if (valueEl) valueEl.textContent = pct + '%';
    if (fillEl) fillEl.style.width = pct + '%';
    if (barEl) barEl.setAttribute('aria-valuenow', String(pct));
    if (dashEl) dashEl.textContent = pct + '%';
    return pct;
  }

  function initAthleteProfileForm() {
    var form = document.getElementById('form-athlete-profile');
    if (!form || form.getAttribute('data-profile-bound')) return;
    form.setAttribute('data-profile-bound', '1');

    form.addEventListener('input', updateAthleteProfileCompletion);
    form.addEventListener('change', updateAthleteProfileCompletion);

    var methodGroup = document.getElementById('athlete-login-method');
    if (methodGroup) {
      methodGroup.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-login-method]');
        if (!btn) return;
        methodGroup.querySelectorAll('[data-login-method]').forEach(function (b) {
          b.classList.toggle('is-selected', b === btn);
        });
      });
    }

    updateAthleteProfileCompletion();
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
      campaignObjective: document.getElementById('filter-campaign-objective') && document.getElementById('filter-campaign-objective').value,
      targetAudience: document.getElementById('filter-target-audience') && document.getElementById('filter-target-audience').value,
      targetGeography: document.getElementById('filter-target-geography') && document.getElementById('filter-target-geography').value,
      budget: document.getElementById('filter-budget') && document.getElementById('filter-budget').value,
      brandCategory: document.getElementById('filter-brand-category') && document.getElementById('filter-brand-category').value,
      perfMin: perf[0] ? parseInt(perf[0], 10) : null,
      perfMax: perf[1] ? parseInt(perf[1], 10) : null,
      growth: document.getElementById('filter-growth') && document.getElementById('filter-growth').value,
      commercialValue: document.getElementById('filter-commercial-value') && document.getElementById('filter-commercial-value').value,
      brandMatch: document.getElementById('filter-brand-match') && document.getElementById('filter-brand-match').value,
      verifiedOnly: document.getElementById('filter-verified') ? document.getElementById('filter-verified').checked : false,
      ageMin: age[0] ? parseInt(age[0], 10) : null,
      ageMax: age[1] ? parseInt(age[1], 10) : null,
      gender: document.getElementById('filter-gender') && document.getElementById('filter-gender').value,
      region: document.getElementById('filter-location') && document.getElementById('filter-location').value,
      competition: document.getElementById('filter-competition') && document.getElementById('filter-competition').value,
      role: document.getElementById('filter-role') && document.getElementById('filter-role').value,
      audienceSize: document.getElementById('filter-audience-size') && document.getElementById('filter-audience-size').value,
      engagement: document.getElementById('filter-engagement') && document.getElementById('filter-engagement').value,
      socialMin: social[0] ? parseInt(social[0], 10) : null,
      socialMax: social[1] ? parseInt(social[1], 10) : null,
      perfTrend: document.getElementById('filter-perf-trend') && document.getElementById('filter-perf-trend').value,
      fanDemand: document.getElementById('filter-fan-demand') && document.getElementById('filter-fan-demand').value,
      brandSafety: document.getElementById('filter-brand-safety') && document.getElementById('filter-brand-safety').value,
      availability: document.getElementById('filter-availability') && document.getElementById('filter-availability').value
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
            '<span class="athlete-card-social-score">Social Score: ' + (a.social != null ? a.social : '—') + '</span>' +
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

    if (!options.skipGate && !discoveryState.hasSearched) {
      container.innerHTML = '<p class="discovery-empty">Set filters and click Apply filters to discover athletes.</p>';
      if (countEl) countEl.textContent = '';
      renderDiscoveryPagination(0, 1, discoveryState.pageSize);
      discoveryState.filteredList = [];
      return;
    }

    var filters = getDiscoveryFilters();
    var list = window.ADC_DATA.getAthletes(filters);
    discoveryState.filteredList = list;

    var pageSize = discoveryState.pageSize;
    var totalPages = Math.max(1, Math.ceil(list.length / pageSize) || 1);
    if (list.length === 0) totalPages = 1;
    if (discoveryState.currentPage > totalPages) discoveryState.currentPage = totalPages;
    if (discoveryState.currentPage < 1) discoveryState.currentPage = 1;

    var startIdx = (discoveryState.currentPage - 1) * pageSize;
    var pageList = list.slice(startIdx, startIdx + pageSize);

    container.innerHTML = pageList.length
      ? pageList.map(buildAthleteCardHtml).join('')
      : '<p class="discovery-empty">No athletes matched these filters.</p>';

    if (countEl) {
      countEl.textContent = list.length + ' athlete' + (list.length !== 1 ? 's' : '') + ' found';
    }

    renderDiscoveryPagination(list.length, discoveryState.currentPage, pageSize);
  }

  function runDiscoverySearchAnimation(done) {
    var anim = document.getElementById('discovery-search-anim');
    var linesEl = document.getElementById('discovery-search-anim-lines');
    var cards = document.getElementById('discovery-athlete-cards');
    var countEl = document.getElementById('discovery-results-count');
    var filters = getDiscoveryFilters();
    if (!anim || !linesEl) {
      if (done) done();
      return;
    }
    if (cards) cards.innerHTML = '';
    if (countEl) countEl.textContent = 'Scanning…';
    anim.hidden = false;
    linesEl.innerHTML = '';

    var sport = filters.sport || 'All';
    var steps = [
      '> load filter matrix · sport=' + sport,
      '> apply age/gender/location constraints',
      '> compute perf ∩ social bands · Δt=' + (22 + Math.floor(Math.random() * 35)) + 'ms',
      '> budget + growth + commercial intelligence join',
      '> verified identity check · hash=' + Math.abs(sport.split('').reduce(function (a, c) { return ((a << 5) - a) + c.charCodeAt(0); }, 0)).toString(16).slice(0, 6),
      '> rank candidates · sort(perf, social, fit)',
      '> assemble discovery payload…'
    ];

    var started = Date.now();
    var duration = 5000;
    var i = 0;

    function tick() {
      var elapsed = Date.now() - started;
      if (i < steps.length) {
        var line = document.createElement('div');
        line.className = 'discovery-search-anim-line';
        line.textContent = steps[i];
        linesEl.appendChild(line);
        linesEl.scrollTop = linesEl.scrollHeight;
        i += 1;
      } else if (elapsed < duration) {
        var calc = document.createElement('div');
        calc.className = 'discovery-search-anim-line';
        calc.textContent = '> calc fit_score=' + (Math.random() * 10).toFixed(2) +
          ' · roi_idx=' + (0.4 + Math.random() * 0.55).toFixed(3) +
          ' · t+' + Math.floor(elapsed) + 'ms';
        linesEl.appendChild(calc);
        while (linesEl.children.length > 10) linesEl.removeChild(linesEl.firstChild);
        linesEl.scrollTop = linesEl.scrollHeight;
      }

      if (elapsed >= duration) {
        anim.hidden = true;
        if (done) done();
        return;
      }
      var remaining = duration - elapsed;
      var delay = i < steps.length ? Math.min(520, Math.floor(remaining / Math.max(1, steps.length - i + 1))) : 380;
      setTimeout(tick, delay);
    }
    tick();
  }

  function goToDiscoveryPage(page) {
    var totalPages = Math.max(1, Math.ceil(discoveryState.filteredList.length / discoveryState.pageSize));
    page = parseInt(page, 10);
    if (isNaN(page) || page < 1 || page > totalPages) return;
    discoveryState.currentPage = page;
    renderDiscovery({ skipGate: true });
    var cards = document.getElementById('discovery-athlete-cards');
    if (cards) cards.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function applyDiscoveryFilters() {
    var btn = document.getElementById('btn-apply-filters');
    if (btn) btn.disabled = true;
    runDiscoverySearchAnimation(function () {
      discoveryState.hasSearched = true;
      renderDiscovery({ resetPage: true, skipGate: true });
      if (btn) btn.disabled = false;
    });
  }

  function starRatingHtml(score, ariaLabel) {
    var s = Math.max(0, Math.min(5, Number(score) || 0));
    var full = Math.floor(s);
    var hasHalf = s - full >= 0.4 && s - full < 0.9;
    if (s - full >= 0.9) full += 1;
    var html = '';
    var i;
    for (i = 0; i < 5; i++) {
      if (i < full) html += '<span class="star filled">★</span>';
      else if (i === full && hasHalf) html += '<span class="star half">★</span>';
      else html += '<span class="star empty">★</span>';
    }
    return { html: html, label: (ariaLabel || 'Rating') + ' ' + s + ' out of 5', value: s };
  }

  function deriveBrandProfileScores(athlete) {
    var perf = athlete.perf != null ? Number(athlete.perf) : 0;
    var social = athlete.social != null ? Number(athlete.social) : 0;
    var matches = athlete.matches != null ? Number(athlete.matches) : 0;
    var brandFit = (perf && social) ? ((perf + social) / 20).toFixed(1) : '—';
    var expert = Math.round(Math.max(3, Math.min(5, perf / 18 + social / 40)) * 2) / 2;
    var fitness = matches >= 14 ? 5 : matches >= 10 ? 4.5 : matches >= 6 ? 4 : 3.5;
    var roi = (perf >= 60 && social >= 70) ? 'High' : (perf >= 50 && social >= 50) ? 'Medium' : 'Low';
    return { brandFit: brandFit, expert: expert, fitness: fitness, roi: roi };
  }

  function buildCareerEvents(athlete) {
    var matches = athlete.matches != null ? Number(athlete.matches) : 10;
    var perf = athlete.perf != null ? Number(athlete.perf) : 50;
    var isRising = /suryavanshi|sooryavanshi/i.test(athlete.name || '');
    if (isRising) {
      return [
        { label: 'U19', matches: 4, perf: Math.min(100, perf + 12) },
        { label: 'Ranji', matches: 8, perf: Math.max(40, perf - 8) },
        { label: 'SMAT', matches: 6, perf: Math.min(100, perf + 6) },
        { label: 'IPL', matches: matches, perf: perf },
        { label: 'Duleep', matches: 3, perf: Math.min(100, perf + 18) }
      ];
    }
    return [
      { label: 'Domestic', matches: Math.max(2, Math.round(matches * 0.45)), perf: Math.max(40, perf - 6) },
      { label: 'League', matches: Math.max(2, Math.round(matches * 0.7)), perf: Math.max(42, perf - 2) },
      { label: 'IPL', matches: matches, perf: perf },
      { label: 'Playoffs', matches: Math.max(1, Math.round(matches * 0.2)), perf: Math.min(100, perf + 4) },
      { label: 'Recent', matches: Math.max(1, Math.round(matches * 0.35)), perf: Math.min(100, perf + 8) }
    ];
  }

  function buildCareerGraphSvg(events) {
    var maxM = Math.max.apply(null, events.map(function (e) { return e.matches; })) || 1;
    var xs = [110, 214, 318, 422, 526];
    var bars = '';
    var points = [];
    var circles = '';
    var labels = '';
    events.forEach(function (e, i) {
      var x = xs[i];
      var barH = Math.max(8, (e.matches / maxM) * 150);
      var barY = 178 - barH;
      bars += '<rect x="' + (x - 18) + '" y="' + barY + '" width="36" height="' + barH + '" rx="4"/>';
      var py = 178 - (e.perf / 100) * 150;
      points.push(x + ',' + py);
      circles += '<circle cx="' + x + '" cy="' + py + '" r="5"/>';
      labels += '<text x="' + x + '" y="200">' + e.label + '</text>';
    });
    return (
      '<svg class="career-graph-svg" viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="perfLineGradBrand" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#00d4aa"/><stop offset="100%" stop-color="#6c9fff"/>' +
        '</linearGradient></defs>' +
        '<g stroke="#2a3544" stroke-width="1">' +
          '<line x1="56" y1="28" x2="600" y2="28"/><line x1="56" y1="78" x2="600" y2="78"/>' +
          '<line x1="56" y1="128" x2="600" y2="128"/><line x1="56" y1="178" x2="600" y2="178"/>' +
        '</g>' +
        '<line x1="56" y1="20" x2="56" y2="178" stroke="#8b9cad" stroke-width="1.5"/>' +
        '<line x1="56" y1="178" x2="608" y2="178" stroke="#8b9cad" stroke-width="1.5"/>' +
        '<g fill="#8b9cad" font-size="10" font-family="Outfit,sans-serif" text-anchor="end">' +
          '<text x="48" y="32">100</text><text x="48" y="82">75</text><text x="48" y="132">50</text><text x="48" y="182">25</text>' +
        '</g>' +
        '<g fill="rgba(108,159,255,0.35)">' + bars + '</g>' +
        '<polyline fill="none" stroke="url(#perfLineGradBrand)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="' + points.join(' ') + '"/>' +
        '<g fill="#00d4aa">' + circles + '</g>' +
        '<g fill="#8b9cad" font-size="11" font-family="Outfit,sans-serif" text-anchor="middle">' + labels + '</g>' +
        '<g font-family="Outfit,sans-serif" font-size="11">' +
          '<rect x="56" y="214" width="12" height="12" rx="2" fill="rgba(108,159,255,0.35)"/>' +
          '<text x="74" y="224" fill="#8b9cad">Matches / inns</text>' +
          '<circle cx="180" cy="220" r="4" fill="#00d4aa"/>' +
          '<text x="190" y="224" fill="#8b9cad">Performance score</text>' +
        '</g>' +
      '</svg>'
    );
  }

  function buildEventStatsTableHtml(athlete) {
    var matches = athlete.matches != null ? Number(athlete.matches) : 10;
    var perf = athlete.perf != null ? Number(athlete.perf) : 50;
    var isRising = /suryavanshi|sooryavanshi/i.test(athlete.name || '');
    var rows;
    if (isRising) {
      rows = [
        ['Duleep Trophy 2026/27', 'First-class', '3', '140', '92', '46.7', '107.7', 'Youngest Duleep fifty · SF 92 & 40'],
        ['IPL 2026', 'T20', String(matches), String(Math.round(matches * 26.5)), '67', '26.5', '168.2', 'Impact opener · high six rate'],
        ['Ranji Trophy 2025/26', 'First-class', '8', '207', '93', '25.9', '61.4', 'Plate league · Bihar'],
        ['Syed Mushtaq Ali 2025/26', 'T20', '6', '184', '72', '30.7', '154.6', 'Domestic T20 form spike'],
        ['India U19 bilateral', 'Youth ODI', '4', '156', '81', '39.0', '98.1', 'Youth pathway continuity']
      ];
    } else {
      var inns = matches;
      var runs = Math.round(inns * (18 + perf / 5));
      var hs = Math.round(40 + perf / 3);
      var avg = (runs / Math.max(1, inns - 1)).toFixed(1);
      var sr = (120 + perf).toFixed(1);
      rows = [
        ['IPL 2026', 'T20', String(inns), String(runs), String(hs), avg, sr, (athlete.teamShort || athlete.team || 'Franchise') + ' · POM ' + (athlete.pom != null ? athlete.pom : '—')],
        ['Domestic T20', 'T20', String(Math.max(2, Math.round(matches * 0.5))), String(Math.round(runs * 0.55)), String(Math.round(hs * 0.9)), (avg * 0.95).toFixed ? (Number(avg) * 0.95).toFixed(1) : avg, (Number(sr) * 0.92).toFixed(1), 'State / league form'],
        ['First-class', 'FC', String(Math.max(2, Math.round(matches * 0.4))), String(Math.round(runs * 0.7)), String(Math.round(hs * 1.1)), (Number(avg) * 1.05).toFixed(1), (Number(sr) * 0.55).toFixed(1), 'Long-format exposure'],
        ['Recent series', 'Mixed', String(Math.max(1, Math.round(matches * 0.3))), String(Math.round(runs * 0.35)), String(Math.round(hs * 0.85)), avg, sr, 'Last 12 months']
      ];
    }
    var body = rows.map(function (r) {
      return '<tr>' +
        '<td><strong>' + escapeHtml(r[0]) + '</strong></td>' +
        '<td>' + escapeHtml(r[1]) + '</td>' +
        '<td>' + escapeHtml(r[2]) + '</td>' +
        '<td>' + escapeHtml(r[3]) + '</td>' +
        '<td>' + escapeHtml(r[4]) + '</td>' +
        '<td>' + escapeHtml(r[5]) + '</td>' +
        '<td>' + escapeHtml(r[6]) + '</td>' +
        '<td>' + escapeHtml(r[7]) + '</td>' +
        '</tr>';
    }).join('');
    return (
      '<table class="event-stats-table">' +
        '<thead><tr><th>Event</th><th>Format</th><th>Inns</th><th>Runs</th><th>HS</th><th>Avg</th><th>SR</th><th>Notes</th></tr></thead>' +
        '<tbody>' + body + '</tbody>' +
      '</table>'
    );
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

    var scores = deriveBrandProfileScores(athlete);
    var perfEl = document.getElementById('pv-perf');
    var socialEl = document.getElementById('pv-social');
    var fitEl = document.getElementById('pv-fit');
    var roiEl = document.getElementById('pv-roi');
    var expertEl = document.getElementById('pv-expert-stars');
    var fitnessEl = document.getElementById('pv-fitness-stars');
    if (perfEl) perfEl.textContent = athlete.perf != null ? athlete.perf : '—';
    if (socialEl) socialEl.textContent = athlete.social != null ? athlete.social : '—';
    if (fitEl) fitEl.textContent = scores.brandFit;
    if (roiEl) roiEl.textContent = scores.roi;
    if (expertEl) {
      var expert = starRatingHtml(scores.expert, 'Expert rating');
      expertEl.innerHTML = expert.html;
      expertEl.setAttribute('aria-label', expert.label);
    }
    if (fitnessEl) {
      var fitness = starRatingHtml(scores.fitness, 'Fitness score');
      fitnessEl.innerHTML = fitness.html;
      fitnessEl.setAttribute('aria-label', fitness.label);
    }

    var snapMatches = document.getElementById('pv-snap-matches');
    var snapPom = document.getElementById('pv-snap-pom');
    var snapWins = document.getElementById('pv-snap-wins');
    var snapWinrate = document.getElementById('pv-snap-winrate');
    if (snapMatches) snapMatches.textContent = athlete.matches != null ? athlete.matches : '—';
    if (snapPom) snapPom.textContent = athlete.pom != null ? athlete.pom : '—';
    if (snapWins) snapWins.textContent = athlete.wins != null ? athlete.wins : '—';
    if (snapWinrate) snapWinrate.textContent = athlete.winRate != null ? athlete.winRate + '%' : '—';

    var events = buildCareerEvents(athlete);
    var graphEl = document.getElementById('brand-career-graph');
    if (graphEl) graphEl.innerHTML = buildCareerGraphSvg(events);

    var eventStatsEl = document.getElementById('brand-event-stats');
    if (eventStatsEl) eventStatsEl.innerHTML = buildEventStatsTableHtml(athlete);

    var inquiryTo = document.getElementById('inquiry-to-athlete');
    if (inquiryTo) inquiryTo.value = athlete.name + ' (' + (athlete.teamShort || athlete.team || athlete.sport) + ' · ' + athlete.role + ')';
    var proposalAthlete = document.getElementById('proposal-athlete');
    if (proposalAthlete) proposalAthlete.value = athlete.name;
  }

  function getBadgeCount(key) {
    if (!window.ADC_DATA) return 0;
    if (key === 'shortlist') return window.ADC_DATA.getShortlist().length;
    var reqs = window.ADC_DATA.getSponsorshipRequests();
    if (key === 'brand-requests') return reqs.length;
    if (key === 'athlete-requests' || key === 'creator-requests') {
      var target = key === 'athlete-requests' ? 'athlete' : 'creator';
      return reqs.filter(function (r) { return (r.target || 'athlete') === target; }).length;
    }
    return 0;
  }

  function renderSidebar(screenId) {
    var sidebar = document.getElementById('journey-sidebar');
    if (!sidebar) return;
    var persona = getPersonaForScreen(screenId);
    var menu = persona && NAV_MENUS[persona];
    document.body.classList.toggle('has-sidebar', !!menu);
    if (!menu) {
      sidebar.classList.remove('journey-sidebar--visible', 'journey-sidebar--open');
      return;
    }
    sidebar.classList.add('journey-sidebar--visible');
    var html = '<div class="journey-sidebar-main">';
    html += '<div class="journey-sidebar-group-label">' + menu.label + '</div>';
    html += menu.items.map(function (item) {
      var active = item.screen === screenId ? ' journey-nav-item--active' : '';
      var badge = '';
      if (item.badge) {
        var count = getBadgeCount(item.badge);
        if (count > 0) badge = '<span class="journey-nav-badge">' + count + '</span>';
      }
      return '<button type="button" class="journey-nav-item' + active + '" data-nav="' + item.screen + '">' +
        '<span class="journey-nav-icon">' + item.icon + '</span>' +
        '<span class="journey-nav-text">' + item.label + '</span>' + badge +
        '</button>';
    }).join('');
    html += '</div>';

    if (persona === 'brand') {
      html +=
        '<div class="journey-sidebar-footer">' +
          '<button type="button" class="journey-nav-item journey-nav-assistant" data-open-discovery-assistant title="Open Discovery Assistant" aria-label="Open Discovery Assistant">' +
            '<span class="journey-nav-icon journey-nav-assistant-icon" aria-hidden="true">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
                '<circle cx="9" cy="10" r="1.5" fill="currentColor"/>' +
                '<circle cx="15" cy="10" r="1.5" fill="currentColor"/>' +
                '<path d="M8 14c.5.8 1.5 1.5 2.5 1.5s2-.7 2.5-1.5"/>' +
              '</svg>' +
            '</span>' +
            '<span class="journey-nav-text">Discovery Assistant</span>' +
          '</button>' +
        '</div>';
    }

    sidebar.innerHTML = html;
  }

  function setMobileSidebarOpen(open) {
    var sidebar = document.getElementById('journey-sidebar');
    var scrim = document.getElementById('journey-sidebar-scrim');
    if (sidebar) sidebar.classList.toggle('journey-sidebar--open', open);
    if (scrim) {
      scrim.classList.toggle('journey-sidebar-scrim--open', open);
      scrim.hidden = !open;
    }
  }

  function statusClass(status) {
    var s = (status || '').toLowerCase();
    if (s.indexOf('negoti') !== -1) return 'request-status--negotiation';
    if (s.indexOf('accept') !== -1 || s.indexOf('approv') !== -1) return 'request-status--accepted';
    if (s.indexOf('reject') !== -1) return 'request-status--rejected';
    return 'request-status--review';
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /** Scoring-engine column schema. Missing values render as NA. */
  var BAT_FIELDS = [
    { key: 'innings', label: 'Innings' },
    { key: 'runs', label: 'Runs' },
    { key: 'ballsFaced', label: 'Balls Faced' },
    { key: 'notOuts', label: 'Not Outs' },
    { key: 'highest', label: 'Highest Score' },
    { key: 'average', label: 'Average' },
    { key: 'strikeRate', label: 'Strike Rate' },
    { key: 'hundreds', label: '100s' },
    { key: 'fifties', label: '50s' },
    { key: 'fours', label: '4s' },
    { key: 'sixes', label: '6s' },
    { key: 'foursSixes', label: '4s / 6s' }
  ];
  var BOWL_FIELDS = [
    { key: 'inningsBowled', label: 'Innings Bowled' },
    { key: 'overs', label: 'Overs' },
    { key: 'balls', label: 'Balls' },
    { key: 'runsConceded', label: 'Runs Conceded' },
    { key: 'wickets', label: 'Wickets' },
    { key: 'average', label: 'Average' },
    { key: 'economy', label: 'Economy' },
    { key: 'best', label: 'Best (innings)' }
  ];
  var CRIC_FORMATS = ['Test', 'ODI', 'T20I'];
  var dataViewState = { view: 'scoring' };
  var scoringRowsCache = null;

  function normalizePlayerName(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function cricsheetBucketKey(fmt, kind) {
    var base = fmt === 'T20I' ? 't20i' : fmt.toLowerCase();
    return base + (kind === 'bat' ? 'Bat' : 'Bowl');
  }

  function cricsheetNested(player, fmt, kind, field) {
    var bucket = player[cricsheetBucketKey(fmt, kind)];
    if (!bucket) return null;
    return bucket[field];
  }

  function mapFormatFields(fmt, kind, fields) {
    return fields.map(function (f) {
      return {
        key: cricsheetBucketKey(fmt, kind) + '-' + f.key,
        label: f.label,
        resolve: function (row) { return cricsheetNested(row, fmt, kind, f.key); }
      };
    });
  }

  /** Performance Engine = Domestic (IPL) + Test/ODI/T20I batting & bowling from Cricsheet. */
  function buildScoringEngineGroups() {
    var groups = [
      {
        id: 'identity',
        label: 'Player',
        columns: [
          { key: 'rank', label: 'Rank' },
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'initials', label: 'Initials' },
          { key: 'sport', label: 'Sport' },
          { key: 'role', label: 'Role' },
          { key: 'age', label: 'Age' },
          { key: 'region', label: 'Region' },
          { key: 'gender', label: 'Gender' },
          { key: 'team', label: 'Team' },
          { key: 'teamShort', label: 'Team Short' }
        ]
      },
      {
        id: 'perf-domestic',
        label: '1. Performance · Domestic (IPL)',
        columns: [
          { key: 'domesticLeague', label: 'Domestic League', resolve: function (a) { return a.league || a.domesticLeague; } },
          { key: 'matches', label: 'Match & Season Stats (Matches)' },
          { key: 'pom', label: 'POM Awards' },
          { key: 'wins', label: 'Team Wins' },
          { key: 'winRate', label: 'Win Rate %' },
          { key: 'growth', label: 'Consistency & Progression' },
          { key: 'tournamentLevel', label: 'Tournament & Competition Level', resolve: function (a) { return a.league || a.domesticLeague; } },
          { key: 'fitnessAvailability', label: 'Fitness & Availability' },
          { key: 'perf', label: 'Overall Performance Score' }
        ]
      }
    ];

    CRIC_FORMATS.forEach(function (fmt) {
      var idBase = fmt === 'T20I' ? 't20i' : fmt.toLowerCase();
      groups.push({
        id: 'perf-' + idBase + '-bat',
        label: '1. Performance · ' + fmt + ' Batting',
        columns: mapFormatFields(fmt, 'bat', BAT_FIELDS)
      });
      groups.push({
        id: 'perf-' + idBase + '-bowl',
        label: '1. Performance · ' + fmt + ' Bowling',
        columns: mapFormatFields(fmt, 'bowl', BOWL_FIELDS)
      });
    });

    groups.push(
      {
        id: 'social',
        label: '2. Social & Fan Signal Engine',
        columns: [
          { key: 'socialEngagement', label: 'Social Media Engagement' },
          { key: 'fanFollowingSentiment', label: 'Fan Following & Sentiment' },
          { key: 'communityInteractions', label: 'Community Interactions' },
          { key: 'newsMediaMentions', label: 'News & Media Mentions' },
          { key: 'social', label: 'Social & Fan Score' }
        ]
      },
      {
        id: 'brand',
        label: '3. Brand Matching Engine',
        columns: [
          { key: 'brandAudienceFit', label: 'Brand & Audience Fit', resolve: function (a) {
            if (a.perf == null || a.social == null) return null;
            return ((Number(a.perf) + Number(a.social)) / 20).toFixed(1);
          }},
          { key: 'locationSport', label: 'Location & Sport Category', resolve: function (a) {
            var parts = [a.region, a.sport].filter(function (v) { return v != null && v !== ''; });
            return parts.length ? parts.join(' · ') : null;
          }},
          { key: 'engagementCredibility', label: 'Engagement & Credibility', resolve: function (a) {
            if (a.verified == null) return null;
            return a.verified ? 'Verified' : 'Unverified';
          }},
          { key: 'sponsorshipReadiness', label: 'Sponsorship Readiness', resolve: function (a) { return a.budget; } },
          { key: 'brandMatchScore', label: 'Brand Match Score', resolve: function (a) {
            if (a.perf == null || a.social == null) return null;
            return ((Number(a.perf) + Number(a.social)) / 20).toFixed(1);
          }}
        ]
      }
    );
    return groups;
  }

  function initialsFromName(name) {
    var parts = String(name || '').replace(/\./g, ' ').trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return String(name || '').slice(0, 2).toUpperCase() || 'NA';
  }

  function emptyScoringRow(name) {
    return {
      rank: null,
      id: null,
      name: name,
      initials: initialsFromName(name),
      sport: 'Cricket',
      role: null,
      age: null,
      region: null,
      gender: null,
      team: null,
      teamShort: null,
      league: null,
      domesticLeague: null,
      matches: null,
      pom: null,
      wins: null,
      winRate: null,
      growth: null,
      fitnessAvailability: null,
      perf: null,
      socialEngagement: null,
      fanFollowingSentiment: null,
      communityInteractions: null,
      newsMediaMentions: null,
      social: null,
      verified: null,
      budget: null,
      testBat: null,
      testBowl: null,
      odiBat: null,
      odiBowl: null,
      t20iBat: null,
      t20iBowl: null
    };
  }

  function applyIplAthlete(row, athlete) {
    row.rank = athlete.rank != null ? athlete.rank : row.rank;
    row.id = athlete.id != null ? athlete.id : row.id;
    row.name = athlete.name || row.name;
    row.initials = athlete.initials || row.initials;
    row.sport = athlete.sport || row.sport;
    row.role = athlete.role != null ? athlete.role : row.role;
    row.age = athlete.age != null ? athlete.age : row.age;
    row.region = athlete.region != null ? athlete.region : row.region;
    row.gender = athlete.gender != null ? athlete.gender : row.gender;
    row.team = athlete.team != null ? athlete.team : row.team;
    row.teamShort = athlete.teamShort != null ? athlete.teamShort : row.teamShort;
    row.league = athlete.league != null ? athlete.league : row.league;
    row.domesticLeague = athlete.league || 'IPL';
    row.matches = athlete.matches != null ? athlete.matches : row.matches;
    row.pom = athlete.pom != null ? athlete.pom : row.pom;
    row.wins = athlete.wins != null ? athlete.wins : row.wins;
    row.winRate = athlete.winRate != null ? athlete.winRate : row.winRate;
    row.growth = athlete.growth != null ? athlete.growth : row.growth;
    row.perf = athlete.perf != null ? athlete.perf : row.perf;
    row.social = athlete.social != null ? athlete.social : row.social;
    row.verified = athlete.verified != null ? athlete.verified : row.verified;
    row.budget = athlete.budget != null ? athlete.budget : row.budget;
    return row;
  }

  function applyCricsheetPlayer(row, player) {
    row.name = row.name || player.player;
    row.initials = row.initials || initialsFromName(player.player);
    row.sport = row.sport || 'Cricket';
    row.testBat = player.testBat || null;
    row.testBowl = player.testBowl || null;
    row.odiBat = player.odiBat || null;
    row.odiBowl = player.odiBowl || null;
    row.t20iBat = player.t20iBat || null;
    row.t20iBowl = player.t20iBowl || null;
    return row;
  }

  function getScoringEngineRows() {
    if (scoringRowsCache) return scoringRowsCache;
    var byNorm = {};
    var rows = [];

    function upsert(name) {
      var key = normalizePlayerName(name);
      if (!key) return null;
      if (!byNorm[key]) {
        var row = emptyScoringRow(name);
        byNorm[key] = row;
        rows.push(row);
      }
      return byNorm[key];
    }

    var cricPlayers = (window.ADC_CRICSHEET && window.ADC_CRICSHEET.players) || [];
    cricPlayers.forEach(function (p) {
      var row = upsert(p.player);
      if (row) applyCricsheetPlayer(row, p);
    });

    var athletes = (window.ADC_DATA && typeof window.ADC_DATA.getAthletes === 'function')
      ? window.ADC_DATA.getAthletes({})
      : [];
    athletes.forEach(function (a) {
      var row = upsert(a.name);
      if (row) applyIplAthlete(row, a);
    });

    rows.sort(function (a, b) {
      var ar = a.rank != null ? a.rank : 9999;
      var br = b.rank != null ? b.rank : 9999;
      if (ar !== br) return ar - br;
      var aRuns = ((a.odiBat && a.odiBat.runs) || 0) + ((a.testBat && a.testBat.runs) || 0) + ((a.t20iBat && a.t20iBat.runs) || 0);
      var bRuns = ((b.odiBat && b.odiBat.runs) || 0) + ((b.testBat && b.testBat.runs) || 0) + ((b.t20iBat && b.t20iBat.runs) || 0);
      if (bRuns !== aRuns) return bRuns - aRuns;
      return String(a.name).localeCompare(String(b.name));
    });

    scoringRowsCache = rows;
    return rows;
  }

  function buildCricsheetCareerGroups() {
    var groups = [{
      id: 'identity',
      label: 'Player',
      columns: [{ key: 'player', label: 'Player' }]
    }];
    CRIC_FORMATS.forEach(function (fmt) {
      var idBase = fmt === 'T20I' ? 't20i' : fmt.toLowerCase();
      groups.push({
        id: idBase + '-bat',
        label: fmt + ' Batting',
        columns: mapFormatFields(fmt, 'bat', BAT_FIELDS)
      });
      groups.push({
        id: idBase + '-bowl',
        label: fmt + ' Bowling',
        columns: mapFormatFields(fmt, 'bowl', BOWL_FIELDS)
      });
    });
    return groups;
  }

  function buildFlatColumns(headers, groupId, groupLabel) {
    return [{
      id: groupId,
      label: groupLabel,
      columns: headers.map(function (h) {
        return { key: h.key, label: h.label };
      })
    }];
  }

  var DATA_VIEWS = {
    scoring: {
      label: 'Scoring Engines',
      footnote: 'Performance Engine includes Domestic/IPL columns plus all Test, ODI, and T20I batting & bowling data points from india_cricsheet_stats.py. Missing values show as NA. Social/Brand fields stay engine-aligned; Brand Fit = (Perf + Social) / 20 when both scores exist.',
      showLegend: true,
      getGroups: buildScoringEngineGroups,
      getRows: getScoringEngineRows,
      searchHay: function (a) {
        return [a.name, a.team, a.teamShort, a.role, a.sport, a.league, a.region, a.growth, a.budget].join(' ');
      },
      unit: 'players'
    },
    cricsheet: {
      label: 'Cricsheet Career',
      footnote: 'All batting & bowling data points from india_cricsheet_stats.py (India Test/ODI/T20I, 2010+, ball-by-ball). Missing format/stat cells show as NA.',
      showLegend: false,
      getGroups: buildCricsheetCareerGroups,
      getRows: function () {
        return (window.ADC_CRICSHEET && window.ADC_CRICSHEET.players) || [];
      },
      searchHay: function (row) { return row.player || ''; },
      unit: 'players'
    },
    matches: {
      label: 'Matches',
      footnote: 'India international matches parsed from Cricsheet (2010+).',
      showLegend: false,
      getGroups: function () {
        return buildFlatColumns([
          { key: 'matchId', label: 'Match ID' },
          { key: 'date', label: 'Date' },
          { key: 'format', label: 'Format' },
          { key: 'event', label: 'Event' },
          { key: 'opponent', label: 'India vs' },
          { key: 'venue', label: 'Venue' },
          { key: 'result', label: 'Result' }
        ], 'matches', 'Matches');
      },
      getRows: function () {
        return (window.ADC_CRICSHEET && window.ADC_CRICSHEET.matches) || [];
      },
      searchHay: function (m) {
        return [m.matchId, m.date, m.format, m.event, m.opponent, m.venue, m.result].join(' ');
      },
      unit: 'matches'
    }
  };

  CRIC_FORMATS.forEach(function (fmt) {
    var batKey = 'bat-' + fmt.toLowerCase();
    var bowlKey = 'bowl-' + fmt.toLowerCase();
    DATA_VIEWS[batKey] = {
      label: fmt + ' Batting',
      footnote: fmt + ' batting stats from Cricsheet ball-by-ball (2010+). Average = Runs / Dismissals. Strike Rate = Runs / Balls × 100.',
      showLegend: false,
      getGroups: function () {
        return buildFlatColumns(
          [{ key: 'player', label: 'Player' }].concat(BAT_FIELDS),
          fmt.toLowerCase() + '-bat',
          fmt + ' Batting'
        );
      },
      getRows: function () {
        return (window.ADC_CRICSHEET && window.ADC_CRICSHEET.batting && window.ADC_CRICSHEET.batting[fmt]) || [];
      },
      searchHay: function (r) { return r.player || ''; },
      unit: 'players'
    };
    DATA_VIEWS[bowlKey] = {
      label: fmt + ' Bowling',
      footnote: fmt + ' bowling stats from Cricsheet ball-by-ball (2010+). Average = Runs / Wickets. Economy = Runs / Overs.',
      showLegend: false,
      getGroups: function () {
        return buildFlatColumns(
          [{ key: 'player', label: 'Player' }].concat(BOWL_FIELDS),
          fmt.toLowerCase() + '-bowl',
          fmt + ' Bowling'
        );
      },
      getRows: function () {
        return (window.ADC_CRICSHEET && window.ADC_CRICSHEET.bowling && window.ADC_CRICSHEET.bowling[fmt]) || [];
      },
      searchHay: function (r) { return r.player || ''; },
      unit: 'players'
    };
  });

  function dataCellValue(row, col) {
    var raw = col.resolve ? col.resolve(row) : row[col.key];
    if (raw === undefined || raw === null || raw === '') return 'NA';
    if (typeof raw === 'boolean') return raw ? 'Yes' : 'No';
    return String(raw);
  }

  function renderDataViewTabs() {
    var tabsEl = document.getElementById('data-view-tabs');
    if (!tabsEl) return;
    var order = ['scoring', 'cricsheet', 'matches', 'bat-test', 'bowl-test', 'bat-odi', 'bowl-odi', 'bat-t20i', 'bowl-t20i'];
    tabsEl.innerHTML = order.map(function (key) {
      var view = DATA_VIEWS[key];
      if (!view) return '';
      var active = key === dataViewState.view ? ' data-view-tab--active' : '';
      return '<button type="button" class="data-view-tab' + active + '" role="tab" data-data-view="' + key + '" aria-selected="' +
        (key === dataViewState.view ? 'true' : 'false') + '">' + escapeHtml(view.label) + '</button>';
    }).join('');
  }

  function renderDataTable(opts) {
    opts = opts || {};
    if (opts.view) dataViewState.view = opts.view;
    var view = DATA_VIEWS[dataViewState.view] || DATA_VIEWS.scoring;
    var headEl = document.getElementById('data-table-head');
    var bodyEl = document.getElementById('data-table-body');
    var countEl = document.getElementById('data-count');
    var searchEl = document.getElementById('data-search');
    var legendEl = document.getElementById('data-engine-legend');
    var footnoteEl = document.getElementById('data-footnote');
    if (!headEl || !bodyEl) return;

    renderDataViewTabs();
    if (legendEl) legendEl.hidden = !view.showLegend;
    if (footnoteEl) footnoteEl.textContent = view.footnote;

    var groups = view.getGroups();
    var q = (opts.query != null ? opts.query : (searchEl && searchEl.value) || '').trim().toLowerCase();
    var allRows = view.getRows();
    var rows = allRows.filter(function (row) {
      if (!q) return true;
      return view.searchHay(row).toLowerCase().indexOf(q) !== -1;
    });

    var groupRow = groups.map(function (g) {
      return '<th class="data-th-group data-th-group--' + g.id + '" colspan="' + g.columns.length + '">' +
        escapeHtml(g.label) + '</th>';
    }).join('');

    var colRow = groups.map(function (g) {
      return g.columns.map(function (col) {
        return '<th class="data-th data-th--' + g.id + '" title="' + escapeHtml(col.label) + '">' +
          escapeHtml(col.label) + '</th>';
      }).join('');
    }).join('');

    headEl.innerHTML = '<tr class="data-group-row">' + groupRow + '</tr><tr class="data-col-row">' + colRow + '</tr>';

    if (!rows.length) {
      var colCount = groups.reduce(function (n, g) { return n + g.columns.length; }, 0);
      bodyEl.innerHTML = '<tr><td class="data-empty" colspan="' + colCount + '">No rows match this search.</td></tr>';
    } else {
      bodyEl.innerHTML = rows.map(function (row) {
        return '<tr>' + groups.map(function (g) {
          return g.columns.map(function (col) {
            var val = dataCellValue(row, col);
            var na = val === 'NA' ? ' data-na' : '';
            return '<td class="data-td data-td--' + g.id + '"' + na + '>' + escapeHtml(val) + '</td>';
          }).join('');
        }).join('') + '</tr>';
      }).join('');
    }

    if (countEl) {
      countEl.textContent = rows.length === allRows.length
        ? (allRows.length + ' ' + view.unit)
        : (rows.length + ' of ' + allRows.length + ' ' + view.unit);
    }
  }

  function buildRequestCardHtml(req, role) {
    var title = role === 'brand'
      ? (req.athlete || 'Athlete')
      : (req.brand || 'Brand / Agency');
    var sub = role === 'brand'
      ? ('Campaign: ' + (req.brand || '—'))
      : ('Proposal for: ' + (req.athlete || 'you'));
    var dateLabel = req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '';
    var actions = '';
    if (role !== 'brand') {
      actions = '<div class="request-actions">' +
        '<button type="button" class="btn-sm btn-primary" data-req-action="Accepted" data-req-id="' + req.id + '">Accept</button>' +
        '<button type="button" class="btn-sm btn-outline" data-req-action="Negotiation" data-req-id="' + req.id + '">Negotiate</button>' +
        '<button type="button" class="btn-sm btn-secondary" data-req-action="Rejected" data-req-id="' + req.id + '">Reject</button>' +
        '</div>';
    }
    return '<div class="request-card">' +
      '<div class="request-card-top">' +
        '<div><p class="request-card-title">' + escapeHtml(title) + '</p>' +
        '<p class="request-card-sub">' + escapeHtml(sub) + (dateLabel ? ' · ' + dateLabel : '') + '</p></div>' +
        '<span class="request-status ' + statusClass(req.status) + '">' + escapeHtml(req.status) + '</span>' +
      '</div>' +
      '<div class="request-meta">' +
        '<div class="request-meta-item"><span class="rm-label">Duration</span><span class="rm-value">' + escapeHtml(req.duration || '—') + '</span></div>' +
        '<div class="request-meta-item"><span class="rm-label">Budget</span><span class="rm-value">' + escapeHtml(req.budget || '—') + '</span></div>' +
        '<div class="request-meta-item"><span class="rm-label">NDA</span><span class="rm-value">' + (req.nda ? 'Requested' : 'No') + '</span></div>' +
        '<div class="request-meta-item"><span class="rm-label">Deliverables</span><span class="rm-value">' + escapeHtml(req.deliverables || '—') + '</span></div>' +
      '</div>' +
      (req.message ? '<p class="request-card-sub">“' + escapeHtml(req.message) + '”</p>' : '') +
      actions +
      '</div>';
  }

  function renderRequests(containerId, role, filterTarget) {
    var container = document.getElementById(containerId);
    if (!container || !window.ADC_DATA) return;
    var reqs = window.ADC_DATA.getSponsorshipRequests();
    if (filterTarget) reqs = reqs.filter(function (r) { return (r.target || 'athlete') === filterTarget; });
    if (!reqs.length) {
      if (role === 'athlete') {
        container.innerHTML = '';
        return;
      }
      var empty = role === 'brand'
        ? 'No sponsorship requests yet. Send a proposal from an athlete profile in Discovery and it will appear here.'
        : 'No requests yet. When a brand sends you a proposal, it will show up here.';
      container.innerHTML = '<div class="requests-empty">' + empty + '</div>';
      return;
    }
    container.innerHTML = reqs.map(function (r) { return buildRequestCardHtml(r, role); }).join('');
  }

  function renderBrandShortlist() {
    var container = document.getElementById('brand-shortlist-list');
    if (!container || !window.ADC_DATA) return;
    var ids = window.ADC_DATA.getShortlist();
    if (!ids.length) {
      container.innerHTML = '<div class="requests-empty">Your shortlist is empty. Add athletes from Discovery to compare them here.</div>';
      return;
    }
    container.innerHTML = ids.map(function (id) {
      var a = window.ADC_DATA.getAthleteById(parseInt(id, 10));
      if (!a) return '';
      return buildAthleteCardHtml(a);
    }).join('');
  }

  function submitProposal() {
    var athleteEl = document.getElementById('proposal-athlete');
    var brandEl = document.getElementById('proposal-brand');
    var durationEl = document.getElementById('proposal-duration');
    var deliverablesEl = document.getElementById('proposal-deliverables');
    var budgetEl = document.getElementById('proposal-budget');
    var msgEl = document.querySelector('#screen-brand-inquiry textarea');
    var ndaEl = document.querySelector('#screen-brand-inquiry input[type="checkbox"]');
    var athlete = window.ADC_DATA && window.ADC_DATA.getAthleteById(state.selectedAthleteId);
    var req = {
      athlete: (athleteEl && athleteEl.value) || (athlete && athlete.name) || 'Selected athlete',
      athleteId: state.selectedAthleteId || null,
      brand: (brandEl && brandEl.value.trim()) || 'Your Brand',
      duration: durationEl && durationEl.value.trim(),
      deliverables: deliverablesEl && deliverablesEl.value.trim(),
      budget: budgetEl && budgetEl.value.trim(),
      message: msgEl && msgEl.value.trim(),
      nda: ndaEl ? ndaEl.checked : false,
      target: 'athlete',
      status: 'Under review'
    };
    if (window.ADC_DATA) window.ADC_DATA.addSponsorshipRequest(req);
    showScreen('brand-requests');
  }

  function showScreen(screenId, params) {
    params = params || {};
    if (!screenId) return;
    if (screenId === 'athlete-register') screenId = 'athlete-profile';
    var isLanding = screenId === 'landing';
    document.querySelectorAll('.screen').forEach(function (el) {
      el.classList.toggle('active', el.id === 'screen-' + screenId);
    });
    if (journeyHeader) journeyHeader.style.display = isLanding ? 'none' : 'flex';
    if (isLanding) {
      if (journeyPersonaLabel) journeyPersonaLabel.textContent = '';
      if (journeyBreadcrumb) journeyBreadcrumb.textContent = '';
      renderSidebar('landing');
      setMobileSidebarOpen(false);
      var homeUrl = '/';
      if (window.location.pathname !== homeUrl || window.location.hash || window.location.search) {
        window.history.replaceState(null, '', homeUrl);
      }
      return;
    }
    if (journeyPersonaLabel) journeyPersonaLabel.textContent = PERSONA_LABELS[getPersonaForScreen(screenId)] || '';
    if (journeyBreadcrumb) journeyBreadcrumb.textContent = BREADCRUMBS[screenId] || screenId;

    renderSidebar(screenId);
    setMobileSidebarOpen(false);

    if (screenId === 'deck') {
      goToDeck();
      return;
    } else if (screenId === 'data') {
      renderDataTable();
    } else if (screenId === 'athlete-profile' || screenId === 'athlete-dashboard') {
      updateAthleteProfileCompletion();
    } else if (screenId === 'brand-discovery') {
      renderDiscovery();
    } else if (screenId === 'brand-athlete-profile') {
      var id = params.athleteId != null ? params.athleteId : state.selectedAthleteId;
      renderBrandAthleteProfile(id);
    } else if (screenId === 'brand-inquiry' && state.selectedAthleteId) {
      renderBrandAthleteProfile(state.selectedAthleteId);
    } else if (screenId === 'brand-proposal') {
      var athleteEl = document.getElementById('proposal-athlete');
      var selected = window.ADC_DATA && window.ADC_DATA.getAthleteById(state.selectedAthleteId);
      if (athleteEl) athleteEl.value = selected
        ? (selected.name + ' (' + (selected.teamShort || selected.team || selected.sport) + ' · ' + selected.role + ')')
        : '';
    } else if (screenId === 'brand-requests') {
      renderRequests('brand-requests-list', 'brand');
    } else if (screenId === 'brand-shortlist') {
      renderBrandShortlist();
    } else if (screenId === 'athlete-requests') {
      renderRequests('athlete-requests-list', 'athlete', 'athlete');
    } else if (screenId === 'creator-requests') {
      renderRequests('creator-requests-list', 'creator', 'creator');
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
    var dataViewBtn = e.target.closest('[data-data-view]');
    if (dataViewBtn) {
      e.preventDefault();
      renderDataTable({ view: dataViewBtn.getAttribute('data-data-view') });
      return;
    }
    var assistantBtn = e.target.closest('[data-open-discovery-assistant]');
    if (assistantBtn) {
      e.preventDefault();
      setMobileSidebarOpen(false);
      if (window.ADC_APP && typeof window.ADC_APP.toggleDiscoveryAssistant === 'function') {
        window.ADC_APP.toggleDiscoveryAssistant();
      } else if (window.ADC_APP && typeof window.ADC_APP.openDiscoveryAssistant === 'function') {
        window.ADC_APP.openDiscoveryAssistant();
      }
      return;
    }
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

  function handleProposalSubmit(e) {
    var btn = e.target.closest('#btn-submit-proposal');
    if (!btn) return;
    e.preventDefault();
    submitProposal();
  }

  function handleRequestAction(e) {
    var btn = e.target.closest('[data-req-action]');
    if (!btn) return;
    e.preventDefault();
    var id = btn.getAttribute('data-req-id');
    var status = btn.getAttribute('data-req-action');
    if (window.ADC_DATA) window.ADC_DATA.updateSponsorshipRequestStatus(id, status);
    var listEl = btn.closest('.requests-list');
    var role = listEl ? listEl.getAttribute('data-role') : null;
    if (role === 'athlete') renderRequests('athlete-requests-list', 'athlete', 'athlete');
    else if (role === 'creator') renderRequests('creator-requests-list', 'creator', 'creator');
    var current = parseRoute();
    renderSidebar(current);
  }

  document.body.addEventListener('click', function (e) {
    handleNavClick(e);
    handlePersonaClick(e);
    handleProposalSubmit(e);
    handleRequestAction(e);
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
    initAthleteProfileForm();
    initHeroScroll();
    var menuToggle = document.getElementById('journey-menu-toggle');
    var scrim = document.getElementById('journey-sidebar-scrim');
    if (menuToggle) menuToggle.addEventListener('click', function () {
      var sidebar = document.getElementById('journey-sidebar');
      setMobileSidebarOpen(!(sidebar && sidebar.classList.contains('journey-sidebar--open')));
    });
    if (scrim) scrim.addEventListener('click', function () { setMobileSidebarOpen(false); });
    var btnApply = document.getElementById('btn-apply-filters');
    if (btnApply) btnApply.addEventListener('click', applyDiscoveryFilters);
    var advBtn = document.getElementById('btn-advanced-filters');
    var advPanel = document.getElementById('discovery-advanced-panel');
    if (advBtn && advPanel) {
      advBtn.addEventListener('click', function () {
        var open = advPanel.hidden;
        advPanel.hidden = !open;
        advBtn.classList.toggle('is-open', open);
        advBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    var dataSearch = document.getElementById('data-search');
    if (dataSearch) {
      dataSearch.addEventListener('input', function () {
        renderDataTable({ query: dataSearch.value });
      });
    }
  });

  window.ADC_APP = {
    showScreen: showScreen,
    state: state,
    discoveryState: discoveryState,
    renderDiscovery: renderDiscovery,
    applyDiscoveryFilters: applyDiscoveryFilters,
    goToDiscoveryPage: goToDiscoveryPage,
    renderBrandAthleteProfile: renderBrandAthleteProfile,
    renderDataTable: renderDataTable,
    getDiscoveryFilters: getDiscoveryFilters,
    goToDeck: goToDeck,
    openDiscoveryAssistant: null,
    closeDiscoveryAssistant: null,
    toggleDiscoveryAssistant: null
  };
})();
