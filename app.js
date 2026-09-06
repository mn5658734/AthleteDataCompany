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
  var DISCOVERY_CACHE_KEY = 'adc_discovery_last_query';
  var DISCOVERY_SESSION_FRESH_KEY = 'adc_discovery_session_fresh';
  var discoveryState = {
    filteredList: [],
    recommendations: [],
    portfolio: null,
    currentPage: 1,
    pageSize: 6,
    hasSearched: false,
    chatFilters: {},
    pendingQuestion: null,
    chatBusy: false,
    lastQueryText: '',
    restoredFromCache: false,
    sessionStartedFresh: false
  };

  var CAMPAIGN_BRIEF_FIELDS = [
    {
      key: 'campaign',
      label: 'Campaign',
      question: 'What is the campaign? (product / brand / initiative)',
      chips: ['Sports nutrition launch', 'Beverage brand refresh', 'Sportswear endorsement', 'Fintech awareness'],
      required: true
    },
    {
      key: 'budgetAmount',
      label: 'Budget',
      question: 'What is the total campaign budget? (e.g. ₹20L)',
      chips: ['₹5L', '₹8L', '₹12L', '₹20L', '₹35L'],
      required: true
    },
    {
      key: 'market',
      label: 'Market',
      question: 'Which markets should we prioritize?',
      chips: ['Karnataka + Maharashtra', 'PAN India', 'Metro Cities', 'South India', 'West India'],
      required: true
    },
    {
      key: 'audienceLabel',
      label: 'Audience',
      question: 'Who is the target audience? (age range or segment)',
      chips: ['18–30', 'Gen Z', 'Millennials', 'Sports Fans', '18–25'],
      required: true
    },
    {
      key: 'campaignObjective',
      label: 'Objective',
      question: 'What is the campaign objective?',
      chips: ['Awareness + sales', 'Brand Awareness', 'Product Launch', 'Performance Marketing', 'Athlete Endorsement'],
      required: true
    }
  ];

  function clearDiscoveryCache() {
    try { localStorage.removeItem(DISCOVERY_CACHE_KEY); } catch (err) { /* ignore */ }
  }

  function resetDiscoveryStarterChips() {
    var wrap = document.getElementById('discovery-chat-discover-chips');
    if (!wrap) return;
    wrap.innerHTML =
      '<button type="button" class="chat-suggestion-chip" data-discovery-prompt="Campaign: New sports nutrition product&#10;Budget: ₹20L&#10;Market: Karnataka + Maharashtra&#10;Audience: 18–30&#10;Objective: Awareness + sales">Sports nutrition · ₹20L brief</button>' +
      '<button type="button" class="chat-suggestion-chip" data-discovery-prompt="Campaign: Beverage brand refresh&#10;Budget: ₹12L&#10;Market: PAN India&#10;Audience: Gen Z&#10;Objective: Brand Awareness">Beverage · PAN India</button>' +
      '<button type="button" class="chat-suggestion-chip" data-discovery-prompt="Campaign: Sportswear endorsement&#10;Budget: ₹8L&#10;Market: Metro Cities&#10;Audience: 18–25&#10;Objective: Product Launch">Sportswear · Metros</button>';
  }

  function resetDiscoveryChatUi() {
    var box = document.getElementById('discovery-chat-discover-messages');
    if (box) {
      box.innerHTML = '';
      box.hidden = true;
    }
    var input = document.getElementById('discovery-chat-discover-input');
    if (input) input.value = '';
    var tags = document.getElementById('discovery-active-criteria-tags');
    var criteria = document.getElementById('discovery-active-criteria');
    if (tags) tags.innerHTML = '';
    if (criteria) criteria.hidden = true;
    resetDiscoveryStarterChips();
    var portfolioEl = document.getElementById('discovery-portfolio');
    if (portfolioEl) {
      portfolioEl.hidden = true;
      portfolioEl.innerHTML = '';
    }
    var countEl = document.getElementById('discovery-results-count');
    if (countEl) countEl.textContent = '';
    var cards = document.getElementById('discovery-athlete-cards');
    if (cards) cards.innerHTML = '';
    var pagination = document.getElementById('discovery-pagination');
    if (pagination) pagination.innerHTML = '';
    var anim = document.getElementById('discovery-search-anim');
    if (anim) {
      anim.hidden = true;
      anim.classList.remove('is-active');
    }
  }

  function startDiscoveryFresh() {
    discoveryState.filteredList = [];
    discoveryState.recommendations = [];
    discoveryState.portfolio = null;
    discoveryState.currentPage = 1;
    discoveryState.hasSearched = false;
    discoveryState.chatFilters = {};
    discoveryState.pendingQuestion = null;
    discoveryState.chatBusy = false;
    discoveryState.lastQueryText = '';
    discoveryState.restoredFromCache = false;
    clearDiscoveryCache();
    resetDiscoveryChatUi();
  }

  function ensureDiscoveryFreshOnFirstVisit() {
    if (discoveryState.sessionStartedFresh) return false;
    var alreadyFresh = false;
    try {
      alreadyFresh = !!sessionStorage.getItem(DISCOVERY_SESSION_FRESH_KEY);
      sessionStorage.setItem(DISCOVERY_SESSION_FRESH_KEY, '1');
    } catch (err) {
      alreadyFresh = discoveryState.sessionStartedFresh;
    }
    discoveryState.sessionStartedFresh = true;
    if (alreadyFresh) return false;
    startDiscoveryFresh();
    return true;
  }

  function getDiscoveryChatMessagesHtml() {
    var box = document.getElementById('discovery-chat-discover-messages');
    return box ? box.innerHTML : '';
  }

  function getDiscoveryInputValue() {
    var input = document.getElementById('discovery-chat-discover-input');
    return input ? input.value : '';
  }

  function serializeDiscoveryRecommendations(list) {
    return (list || []).map(function (a) {
      return {
        id: a.id,
        matchPct: a.matchPct,
        feeLakhs: a.feeLakhs,
        feeLabel: a.feeLabel,
        recRole: a.recRole
      };
    });
  }

  function serializeDiscoveryPortfolio(portfolio) {
    if (!portfolio) return null;
    return {
      athleteIds: (portfolio.athletes || []).map(function (a) { return a.id; }),
      total: portfolio.total,
      label: portfolio.label,
      note: portfolio.note
    };
  }

  function saveDiscoveryCache() {
    if (!discoveryState.hasSearched) return;
    try {
      var payload = {
        version: 1,
        savedAt: Date.now(),
        chatFilters: discoveryState.chatFilters || {},
        hasSearched: true,
        currentPage: discoveryState.currentPage || 1,
        lastQueryText: discoveryState.lastQueryText || '',
        pendingQuestion: discoveryState.pendingQuestion || null,
        recommendations: serializeDiscoveryRecommendations(discoveryState.recommendations || discoveryState.filteredList),
        portfolio: serializeDiscoveryPortfolio(discoveryState.portfolio),
        messagesHtml: getDiscoveryChatMessagesHtml(),
        inputValue: getDiscoveryInputValue()
      };
      localStorage.setItem(DISCOVERY_CACHE_KEY, JSON.stringify(payload));
    } catch (err) { /* ignore quota / private mode */ }
  }

  function readDiscoveryCache() {
    try {
      var raw = localStorage.getItem(DISCOVERY_CACHE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.hasSearched) return null;
      return data;
    } catch (err) {
      return null;
    }
  }

  function hydrateAthletesFromCache(recs) {
    if (!window.ADC_DATA || !recs || !recs.length) return [];
    return recs.map(function (rec) {
      var base = window.ADC_DATA.getAthleteById(rec.id);
      if (!base) return null;
      return Object.assign({}, base, {
        matchPct: rec.matchPct,
        feeLakhs: rec.feeLakhs,
        feeLabel: rec.feeLabel || (rec.feeLakhs != null ? ('₹' + rec.feeLakhs + 'L') : null),
        recRole: rec.recRole
      });
    }).filter(Boolean);
  }

  function hydratePortfolioFromCache(cachedPortfolio, list) {
    if (!cachedPortfolio) return null;
    var byId = {};
    (list || []).forEach(function (a) { byId[a.id] = a; });
    var athletes = (cachedPortfolio.athleteIds || []).map(function (id) { return byId[id]; }).filter(Boolean);
    if (!athletes.length) return null;
    return {
      athletes: athletes,
      total: cachedPortfolio.total,
      label: cachedPortfolio.label || athletes.map(function (a) { return a.name; }).join(' + '),
      note: cachedPortfolio.note || ''
    };
  }

  function restoreDiscoveryUiFromCache(cache) {
    if (!cache) return;
    var box = document.getElementById('discovery-chat-discover-messages');
    if (box && cache.messagesHtml) {
      box.innerHTML = cache.messagesHtml;
      box.hidden = !String(cache.messagesHtml).trim();
    }
    var input = document.getElementById('discovery-chat-discover-input');
    if (input && cache.inputValue != null) input.value = cache.inputValue;
    renderActiveCriteriaTags();
    setDiscoveryQuestionChips(null);
  }

  function applyDiscoveryCacheToState(cache) {
    if (!cache) return false;
    discoveryState.chatFilters = Object.assign(emptyDiscoveryChatFilters(), cache.chatFilters || {});
    discoveryState.hasSearched = true;
    discoveryState.currentPage = cache.currentPage || 1;
    discoveryState.lastQueryText = cache.lastQueryText || '';
    discoveryState.pendingQuestion = cache.pendingQuestion || null;
    var list = hydrateAthletesFromCache(cache.recommendations);
    if (!list.length && cache.chatFilters) {
      var rebuilt = buildRecommendations(discoveryState.chatFilters);
      list = rebuilt.list;
      discoveryState.portfolio = rebuilt.portfolio;
    } else {
      discoveryState.portfolio = hydratePortfolioFromCache(cache.portfolio, list);
    }
    discoveryState.recommendations = list;
    discoveryState.filteredList = list;
    discoveryState.restoredFromCache = true;
    return true;
  }

  function restoreDiscoveryFromCache() {
    var cache = readDiscoveryCache();
    if (!cache) return false;
    if (!applyDiscoveryCacheToState(cache)) return false;
    restoreDiscoveryUiFromCache(cache);
    return true;
  }

  function hasCachedDiscoveryResults() {
    var cache = readDiscoveryCache();
    return !!(cache && cache.hasSearched && ((cache.recommendations && cache.recommendations.length) || cache.chatFilters));
  }

  function updateBackToDiscoveryButton() {
    var bar = document.getElementById('brand-profile-back-bar');
    if (!bar) return;
    bar.hidden = !(discoveryState.hasSearched || hasCachedDiscoveryResults());
  }

  function goBackToDiscoveryResults() {
    if (!discoveryState.hasSearched) restoreDiscoveryFromCache();
    showScreen('brand-discovery', { restoreResults: true });
    setTimeout(function () {
      scrollDiscoveryResultsIntoView('results');
    }, 60);
  }

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

  function emptyDiscoveryChatFilters() {
    return {
      campaign: '',
      budgetAmount: null,
      budgetLabel: '',
      market: '',
      audienceLabel: '',
      sport: 'Cricket',
      campaignObjective: 'Any',
      targetAudience: 'Any',
      targetGeography: 'Any',
      budget: 'Any',
      brandCategory: 'Any',
      perfMin: null,
      perfMax: null,
      growth: 'Any',
      commercialValue: 'Any',
      brandMatch: 'Any',
      verifiedOnly: true,
      ageMin: null,
      ageMax: null,
      gender: 'All',
      region: '',
      competition: 'Any',
      role: 'All',
      audienceSize: 'Any',
      engagement: 'Any',
      socialMin: null,
      socialMax: null,
      perfTrend: 'Any',
      fanDemand: 'Any',
      brandSafety: 'Any',
      availability: 'Any'
    };
  }

  function getDiscoveryFilters() {
    var f = discoveryState.chatFilters || {};
    var base = emptyDiscoveryChatFilters();
    Object.keys(base).forEach(function (k) {
      if (f[k] !== undefined && f[k] !== null && f[k] !== '') base[k] = f[k];
    });
    return base;
  }

  function ensureChatFilters() {
    if (!discoveryState.chatFilters || !Object.keys(discoveryState.chatFilters).length) {
      discoveryState.chatFilters = emptyDiscoveryChatFilters();
    }
    return discoveryState.chatFilters;
  }

  function mergeParsedIntoFilters(parsed) {
    var f = ensureChatFilters();
    Object.keys(parsed).forEach(function (k) {
      f[k] = parsed[k];
    });
    syncBriefToFilters(f);
  }

  function syncBriefToFilters(f) {
    if (f.budgetAmount != null) {
      if (f.budgetAmount <= 5) f.budget = '₹1–5L';
      else if (f.budgetAmount <= 20) f.budget = '₹5–20L';
      else f.budget = '₹20L+';
      f.budgetLabel = '₹' + f.budgetAmount + 'L';
    }
    if (f.market) {
      var m = f.market.toLowerCase();
      if (m.indexOf('pan india') !== -1) f.targetGeography = 'PAN India';
      else if (m.indexOf('metro') !== -1) f.targetGeography = 'Metro Cities';
      else if (m.indexOf('south') !== -1 || m.indexOf('karnataka') !== -1) f.targetGeography = 'South India';
      else if (m.indexOf('west') !== -1 || m.indexOf('maharashtra') !== -1) f.targetGeography = 'West India';
      else if (m.indexOf('north') !== -1) f.targetGeography = 'North India';
      else if (m.indexOf('east') !== -1) f.targetGeography = 'East India';
      else f.region = f.market;
    }
    if (f.audienceLabel) {
      var a = f.audienceLabel.toLowerCase();
      if (a.indexOf('gen z') !== -1 || /\b18\s*[-–]\s*2[05]\b/.test(a)) f.targetAudience = 'Gen Z';
      else if (a.indexOf('millennial') !== -1) f.targetAudience = 'Millennials';
      else if (a.indexOf('sport') !== -1) f.targetAudience = 'Sports Fans';
      else if (/\b18\s*[-–]\s*30\b/.test(a) || /\b20\s*[-–]\s*35\b/.test(a)) f.targetAudience = 'Gen Z';
    }
    if (f.campaign) {
      var c = f.campaign.toLowerCase();
      if (c.indexOf('nutrition') !== -1 || c.indexOf('wellness') !== -1 || c.indexOf('fitness') !== -1) f.brandCategory = 'Wellness';
      else if (c.indexOf('beverage') !== -1 || c.indexOf('drink') !== -1) f.brandCategory = 'Beverage';
      else if (c.indexOf('sportswear') !== -1 || c.indexOf('apparel') !== -1) f.brandCategory = 'Sportswear';
      else if (c.indexOf('fintech') !== -1 || c.indexOf('bank') !== -1) f.brandCategory = 'Fintech';
      else if (c.indexOf('fmcg') !== -1) f.brandCategory = 'FMCG';
      else if (c.indexOf('auto') !== -1) f.brandCategory = 'Automotive';
      else if (c.indexOf('tech') !== -1) f.brandCategory = 'Tech';
    }
    if (f.campaignObjective && /awareness/i.test(f.campaignObjective) && /sale/i.test(f.campaignObjective)) {
      f._dualObjective = true;
    }
  }

  function parseBudgetLakhs(text) {
    var lower = (text || '').toLowerCase().replace(/,/g, '');
    var m = lower.match(/₹?\s*(\d+(?:\.\d+)?)\s*l(?:akh)?s?\+?/);
    if (m) return Math.round(parseFloat(m[1]));
    m = lower.match(/₹\s*(\d+(?:\.\d+)?)\s*(?:cr|crore)/);
    if (m) return Math.round(parseFloat(m[1]) * 100);
    m = lower.match(/\bbudget\s*[:\-]?\s*₹?\s*(\d+(?:\.\d+)?)/);
    if (m) return Math.round(parseFloat(m[1]));
    return null;
  }

  function parseDiscoveryQuery(raw) {
    var text = (raw || '').trim();
    var lower = text.toLowerCase();
    var parsed = {};
    if (!text) return parsed;

    var lineCampaign = text.match(/campaign\s*[:\-]\s*(.+)/i);
    var lineBudget = text.match(/budget\s*[:\-]\s*(.+)/i);
    var lineMarket = text.match(/market\s*[:\-]\s*(.+)/i);
    var lineAudience = text.match(/audience\s*[:\-]\s*(.+)/i);
    var lineObjective = text.match(/objective\s*[:\-]\s*(.+)/i);

    if (lineCampaign) parsed.campaign = lineCampaign[1].split(/\n/)[0].trim();
    if (lineBudget) {
      var bAmt = parseBudgetLakhs(lineBudget[1]);
      if (bAmt != null) parsed.budgetAmount = bAmt;
      parsed.budgetLabel = lineBudget[1].split(/\n/)[0].trim();
    }
    if (lineMarket) parsed.market = lineMarket[1].split(/\n/)[0].trim();
    if (lineAudience) parsed.audienceLabel = lineAudience[1].split(/\n/)[0].trim();
    if (lineObjective) parsed.campaignObjective = lineObjective[1].split(/\n/)[0].trim();

    if (!parsed.budgetAmount) {
      var amt = parseBudgetLakhs(text);
      if (amt != null) parsed.budgetAmount = amt;
    }

    if (!parsed.campaign) {
      if (/sports nutrition|nutrition product|supplement/i.test(text)) parsed.campaign = 'New sports nutrition product';
      else if (/beverage/i.test(text)) parsed.campaign = 'Beverage brand campaign';
      else if (/sportswear/i.test(text)) parsed.campaign = 'Sportswear endorsement';
    }

    if (!parsed.market) {
      if (/karnataka/.test(lower) && /maharashtra/.test(lower)) parsed.market = 'Karnataka + Maharashtra';
      else if (/pan india/.test(lower)) parsed.market = 'PAN India';
      else if (/metro/.test(lower)) parsed.market = 'Metro Cities';
      else if (/south india/.test(lower)) parsed.market = 'South India';
      else if (/west india/.test(lower)) parsed.market = 'West India';
      else if (/karnataka/.test(lower)) parsed.market = 'Karnataka';
      else if (/maharashtra/.test(lower)) parsed.market = 'Maharashtra';
    }

    if (!parsed.audienceLabel) {
      var ageMatch = lower.match(/\b(\d{2})\s*[-–to]+\s*(\d{2})\b/);
      if (ageMatch) {
        parsed.audienceLabel = ageMatch[1] + '–' + ageMatch[2];
        parsed.ageMin = parseInt(ageMatch[1], 10);
        parsed.ageMax = parseInt(ageMatch[2], 10);
      } else if (/gen z|genz/.test(lower)) parsed.audienceLabel = 'Gen Z';
      else if (/millennial/.test(lower)) parsed.audienceLabel = 'Millennials';
      else if (/sports fans?/.test(lower)) parsed.audienceLabel = 'Sports Fans';
    } else {
      var ageFromLabel = parsed.audienceLabel.match(/(\d{2})\s*[-–]\s*(\d{2})/);
      if (ageFromLabel) {
        parsed.ageMin = parseInt(ageFromLabel[1], 10);
        parsed.ageMax = parseInt(ageFromLabel[2], 10);
      }
    }

    if (!parsed.campaignObjective) {
      if (/awareness\s*\+\s*sales|awareness and sales|sales \+ awareness/.test(lower)) {
        parsed.campaignObjective = 'Awareness + sales';
      } else if (/brand awareness|awareness/.test(lower)) parsed.campaignObjective = 'Brand Awareness';
      else if (/product launch|launch/.test(lower)) parsed.campaignObjective = 'Product Launch';
      else if (/performance marketing|conversion|sales/.test(lower)) parsed.campaignObjective = 'Performance Marketing';
      else if (/endorsement/.test(lower)) parsed.campaignObjective = 'Athlete Endorsement';
    }

    var sports = [
      'Cricket', 'Badminton', 'Boxing', 'Volley Ball', 'Athletic (25)', 'Hockey',
      'Football', 'Kabaddi', 'Kho Kho', 'Tennis', 'TT', 'Swimming'
    ];
    sports.forEach(function (s) {
      if (lower.indexOf(s.toLowerCase()) !== -1) parsed.sport = s;
    });

    if (discoveryState.pendingQuestion && Object.keys(parsed).length === 0) {
      var key = discoveryState.pendingQuestion;
      if (key === 'budgetAmount') {
        var pendingAmt = parseBudgetLakhs(text);
        if (pendingAmt != null) parsed.budgetAmount = pendingAmt;
        else if (/^\d+(\.\d+)?$/.test(text.trim())) parsed.budgetAmount = Math.round(parseFloat(text.trim()));
      } else if (key === 'campaign' || key === 'market' || key === 'audienceLabel' || key === 'campaignObjective') {
        parsed[key] = text.replace(/^["']|["']$/g, '');
      }
      var fieldDef = CAMPAIGN_BRIEF_FIELDS.filter(function (q) { return q.key === key; })[0];
      if (fieldDef && fieldDef.chips) {
        fieldDef.chips.forEach(function (chip) {
          if (lower === chip.toLowerCase() || lower.indexOf(chip.toLowerCase()) !== -1) {
            if (key === 'budgetAmount') {
              var chipAmt = parseBudgetLakhs(chip);
              if (chipAmt != null) parsed.budgetAmount = chipAmt;
            } else {
              parsed[key] = chip;
            }
          }
        });
      }
    }

    return parsed;
  }

  function isBriefFieldAnswered(key, filters) {
    filters = filters || discoveryState.chatFilters || {};
    if (key === 'budgetAmount') return filters.budgetAmount != null && filters.budgetAmount > 0;
    var val = filters[key];
    return !!(val && String(val).trim() && val !== 'Any' && val !== 'All');
  }

  function nextBriefQuestion(filters) {
    filters = filters || discoveryState.chatFilters || {};
    for (var i = 0; i < CAMPAIGN_BRIEF_FIELDS.length; i++) {
      var q = CAMPAIGN_BRIEF_FIELDS[i];
      if (!isBriefFieldAnswered(q.key, filters)) return q;
    }
    return null;
  }

  function countBriefAnswered(filters) {
    filters = filters || discoveryState.chatFilters || {};
    var n = 0;
    CAMPAIGN_BRIEF_FIELDS.forEach(function (q) {
      if (isBriefFieldAnswered(q.key, filters)) n += 1;
    });
    return n;
  }

  function wantsShowResults(text) {
    var lower = (text || '').toLowerCase();
    return /\b(show|find|search|discover|recommend|go ahead|that'?s enough|looks good|run|apply|results|portfolio)\b/.test(lower);
  }

  function appendDiscoveryChatMessage(role, html) {
    var box = document.getElementById('discovery-chat-discover-messages');
    if (!box) return;
    box.hidden = false;
    var div = document.createElement('div');
    div.className = 'chat-msg chat-msg-' + (role === 'user' ? 'user' : 'bot');
    div.innerHTML = html;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function setDiscoveryQuestionChips(questionDef) {
    var wrap = document.getElementById('discovery-chat-discover-chips');
    if (!wrap) return;
    if (!questionDef || !questionDef.chips || !questionDef.chips.length) {
      wrap.innerHTML = '';
      return;
    }
    wrap.innerHTML = questionDef.chips.map(function (c) {
      return '<button type="button" class="chat-suggestion-chip" data-discovery-prompt="' +
        String(c).replace(/"/g, '&quot;') + '">' + c + '</button>';
    }).join('');
  }

  function renderActiveCriteriaTags() {
    var wrap = document.getElementById('discovery-active-criteria');
    var tags = document.getElementById('discovery-active-criteria-tags');
    if (!wrap || !tags) return;
    var f = discoveryState.chatFilters || {};
    var items = [];
    function add(label, val) {
      if (val === undefined || val === null || val === '' || val === 'Any' || val === 'All') return;
      items.push('<span class="discovery-criteria-tag"><em>' + label + '</em> ' + val + '</span>');
    }
    add('Campaign', f.campaign);
    add('Budget', f.budgetLabel || (f.budgetAmount != null ? ('₹' + f.budgetAmount + 'L') : ''));
    add('Market', f.market);
    add('Audience', f.audienceLabel);
    add('Objective', f.campaignObjective);
    add('Sport', f.sport !== 'All' ? f.sport : '');
    add('Category', f.brandCategory);
    tags.innerHTML = items.join('');
    wrap.hidden = items.length === 0;
  }

  function summarizeCaptured(parsed) {
    var labels = {
      campaign: 'Campaign', budgetAmount: 'Budget', budgetLabel: 'Budget', market: 'Market',
      audienceLabel: 'Audience', campaignObjective: 'Objective', sport: 'Sport', brandCategory: 'Category'
    };
    var parts = [];
    Object.keys(parsed).forEach(function (k) {
      if (!labels[k]) return;
      if (k === 'budgetLabel' && parsed.budgetAmount != null) return;
      var val = parsed[k];
      if (k === 'budgetAmount') val = '₹' + val + 'L';
      parts.push('<strong>' + labels[k] + '</strong>: ' + val);
    });
    return parts.length ? '<p>Captured — ' + parts.join(' · ') + '</p>' : '';
  }

  function askNextDiscoveryQuestion() {
    var next = nextBriefQuestion(discoveryState.chatFilters);
    if (!next) {
      discoveryState.pendingQuestion = null;
      appendDiscoveryChatMessage('bot',
        '<p>Brief looks complete. Ready to generate athlete recommendations and a portfolio plan?</p>');
      setDiscoveryQuestionChips(null);
      return;
    }
    discoveryState.pendingQuestion = next.key;
    appendDiscoveryChatMessage('bot',
      '<p><span class="discovery-q-ref">Discovery Filter reference · ' + next.label + '</span></p>' +
      '<p>' + next.question + '</p>' +
      '<p class="discovery-q-hint">Answer specifically, or say <em>recommend athletes</em> with what we have.</p>');
    setDiscoveryQuestionChips(next);
  }

  function estimateAthleteFeeLakhs(a) {
    var base = 3;
    base += Math.max(0, (a.social || 40) - 40) * 0.18;
    base += Math.max(0, (a.perf || 45) - 45) * 0.12;
    if ((a.rank || 99) <= 5) base += 4;
    else if ((a.rank || 99) <= 15) base += 2;
    if (a.growth === 'Emerging' || a.growth === 'Rising') base *= 0.85;
    return Math.max(3, Math.min(18, Math.round(base)));
  }

  function scoreAthleteForBrief(a, brief) {
    var score = 55;
    score += Math.min(22, ((a.perf || 0) / 100) * 22);
    score += Math.min(18, ((a.social || 0) / 100) * 18);
    if (a.verified) score += 3;
    if (a.growth === 'Emerging' || a.growth === 'Rising') score += 4;
    if (brief.brandCategory === 'Wellness' || brief.brandCategory === 'Beverage' || brief.brandCategory === 'Sportswear') {
      if ((a.social || 0) >= 55) score += 3;
    }
    var obj = (brief.campaignObjective || '').toLowerCase();
    if (obj.indexOf('sale') !== -1 || obj.indexOf('performance') !== -1) {
      score += Math.min(6, (a.pom || 0) * 1.5);
    }
    if (obj.indexOf('awareness') !== -1) {
      score += Math.min(6, ((a.social || 0) - 45) * 0.2);
    }
    if (brief.ageMin != null && a.age != null) {
      if (a.age >= brief.ageMin && a.age <= (brief.ageMax || 99)) score += 4;
      else score -= 3;
    }
    var fee = estimateAthleteFeeLakhs(a);
    if (brief.budgetAmount != null && fee > brief.budgetAmount * 0.7) score -= 8;
    if (brief.budgetAmount != null && fee <= brief.budgetAmount * 0.45) score += 3;
    return Math.max(72, Math.min(97, Math.round(score)));
  }

  function assignRecommendationRole(a, usedRoles) {
    var conversionScore = (a.pom || 0) * 3 + (a.winRate || 0) * 0.15 + (a.perf || 0) * 0.2;
    var reachScore = (a.social || 0) + (a.rank <= 10 ? 8 : 0);
    var valueScore = (a.growth === 'Emerging' || a.growth === 'Rising' ? 20 : 0) + (100 - estimateAthleteFeeLakhs(a) * 3) + (a.social || 0) * 0.3;

    var candidates = [
      { role: 'Best for conversion', score: conversionScore, key: 'conversion' },
      { role: 'Best for reach', score: reachScore, key: 'reach' },
      { role: 'Best emerging/value athlete', score: valueScore, key: 'value' }
    ].sort(function (x, y) { return y.score - x.score; });

    for (var i = 0; i < candidates.length; i++) {
      if (!usedRoles[candidates[i].key]) {
        usedRoles[candidates[i].key] = true;
        return candidates[i].role;
      }
    }
    return candidates[0].role;
  }

  function buildRecommendations(brief) {
    brief = brief || getDiscoveryFilters();
    var softFilters = {
      sport: brief.sport && brief.sport !== 'All' ? brief.sport : 'Cricket',
      verifiedOnly: true
    };
    var list = (window.ADC_DATA && window.ADC_DATA.getAthletes(softFilters)) || [];
    var usedRoles = {};
    var scored = list.map(function (a) {
      var fee = estimateAthleteFeeLakhs(a);
      var matchPct = scoreAthleteForBrief(a, brief);
      return Object.assign({}, a, {
        matchPct: matchPct,
        feeLakhs: fee,
        feeLabel: '₹' + fee + 'L'
      });
    }).sort(function (x, y) {
      return (y.matchPct - x.matchPct) || (x.feeLakhs - y.feeLakhs);
    });

    var top = scored.slice(0, 8).map(function (a, idx) {
      if (idx < 3) a.recRole = assignRecommendationRole(a, usedRoles);
      else {
        if ((a.social || 0) >= 65) a.recRole = 'Strong reach option';
        else if (a.growth === 'Emerging' || a.growth === 'Rising') a.recRole = 'Value / emerging option';
        else a.recRole = 'Solid campaign fit';
      }
      return a;
    });

    var budget = brief.budgetAmount != null ? brief.budgetAmount : 20;
    var portfolio = pickPortfolio(top, budget);
    return { list: top, portfolio: portfolio, budget: budget };
  }

  function pickPortfolio(list, budget) {
    if (!list || !list.length) return null;
    var conversion = list.filter(function (a) { return a.recRole === 'Best for conversion'; })[0] || list[0];
    var value = list.filter(function (a) { return a.recRole === 'Best emerging/value athlete'; })[0];
    if (!value || value.id === conversion.id) {
      value = list.filter(function (a) { return a.id !== conversion.id; })[0] || null;
    }
    if (!value) {
      return {
        athletes: [conversion],
        total: conversion.feeLakhs,
        label: conversion.name,
        note: 'Single-athlete plan within budget'
      };
    }
    var total = conversion.feeLakhs + value.feeLakhs;
    if (total > budget) {
      var cheaperPair = null;
      var i, j;
      for (i = 0; i < Math.min(list.length, 6); i++) {
        for (j = i + 1; j < Math.min(list.length, 6); j++) {
          var sum = list[i].feeLakhs + list[j].feeLakhs;
          if (sum <= budget && (!cheaperPair || sum > cheaperPair.total)) {
            cheaperPair = { athletes: [list[i], list[j]], total: sum };
          }
        }
      }
      if (cheaperPair) {
        return {
          athletes: cheaperPair.athletes,
          total: cheaperPair.total,
          label: cheaperPair.athletes.map(function (a) { return a.name; }).join(' + '),
          note: 'Optimized for budget while balancing conversion + value'
        };
      }
      return {
        athletes: [conversion],
        total: conversion.feeLakhs,
        label: conversion.name,
        note: 'Portfolio trimmed to stay inside ₹' + budget + 'L'
      };
    }
    return {
      athletes: [conversion, value],
      total: total,
      label: conversion.name + ' + ' + value.name,
      note: 'Balances conversion + emerging/value within ₹' + budget + 'L'
    };
  }

  function formatPortfolioHtml(portfolio, budget) {
    if (!portfolio) return '';
    var names = portfolio.athletes.map(function (a) {
      return '<strong>' + a.name + '</strong> (₹' + a.feeLakhs + 'L)';
    }).join(' + ');
    return '<div class="discovery-portfolio-card">' +
      '<span class="discovery-portfolio-kicker">Recommended portfolio</span>' +
      '<p class="discovery-portfolio-main">' + names + ' = <strong>₹' + portfolio.total + 'L</strong>' +
      (budget != null ? ' <span class="discovery-portfolio-budget">of ₹' + budget + 'L</span>' : '') + '</p>' +
      '<p class="discovery-portfolio-note">' + (portfolio.note || '') + '</p>' +
      '</div>';
  }

  function runDiscoveryFromChat() {
    if (discoveryState.chatBusy) return;
    discoveryState.chatBusy = true;
    appendDiscoveryChatMessage('bot', '<p>Building marketing decision intelligence from your brief…</p>');
    setDiscoveryQuestionChips(null);
    applyDiscoveryFilters(function () {
      discoveryState.chatBusy = false;
      var recs = discoveryState.recommendations || [];
      var portfolio = discoveryState.portfolio;
      var html = '<p>Top recommendations for your campaign:</p><ol class="discovery-rec-list">';
      recs.slice(0, 3).forEach(function (a, i) {
        html += '<li><strong>' + a.name + '</strong> — ' + a.matchPct + '% Match — ' + a.feeLabel +
          '<br><span class="discovery-rec-role">' + a.recRole + '</span></li>';
      });
      html += '</ol>';
      if (portfolio) {
        html += '<p><strong>Recommended portfolio:</strong> ' +
          portfolio.athletes.map(function (a) { return a.name; }).join(' + ') +
          ' = ₹' + portfolio.total + 'L</p>';
      }
      html += '<p><button type="button" class="btn-secondary btn-sm" id="discovery-jump-results">Jump to recommendations</button></p>';
      appendDiscoveryChatMessage('bot', html);
      setDiscoveryQuestionChips(null);
      var jump = document.getElementById('discovery-jump-results');
      if (jump) {
        jump.addEventListener('click', function () {
          scrollDiscoveryResultsIntoView('results');
        });
      }
      scrollDiscoveryResultsIntoView('results');
    });
  }

  function handleDiscoveryChatSubmit(rawText) {
    var text = (rawText || '').trim();
    if (!text || discoveryState.chatBusy) return;

    var input = document.getElementById('discovery-chat-discover-input');
    if (input) input.value = '';

    appendDiscoveryChatMessage('user', '<p>' + text.replace(/</g, '&lt;').replace(/\n/g, '<br>') + '</p>');
    discoveryState.lastQueryText = text;

    if (/^skip remaining/i.test(text) || /^skip$/i.test(text)) {
      runDiscoveryFromChat();
      return;
    }

    var parsed = parseDiscoveryQuery(text);
    if (Object.keys(parsed).length) {
      mergeParsedIntoFilters(parsed);
      if (discoveryState.pendingQuestion && (
        parsed[discoveryState.pendingQuestion] !== undefined ||
        (discoveryState.pendingQuestion === 'budgetAmount' && parsed.budgetAmount != null)
      )) {
        discoveryState.pendingQuestion = null;
      }
      renderActiveCriteriaTags();
      var summary = summarizeCaptured(parsed);
      if (summary) appendDiscoveryChatMessage('bot', summary);
    } else if (!wantsShowResults(text)) {
      appendDiscoveryChatMessage('bot',
        '<p>I need campaign brief details. Share <strong>Campaign</strong>, <strong>Budget</strong>, <strong>Market</strong>, <strong>Audience</strong>, and <strong>Objective</strong> — or answer the next question.</p>');
      askNextDiscoveryQuestion();
      return;
    }

    var missing = nextBriefQuestion(discoveryState.chatFilters);
    var answered = countBriefAnswered();

    if (wantsShowResults(text) && answered >= 2) {
      runDiscoveryFromChat();
      return;
    }
    if (!missing && answered >= 5) {
      runDiscoveryFromChat();
      return;
    }
    if (answered >= 5) {
      runDiscoveryFromChat();
      return;
    }

    askNextDiscoveryQuestion();
  }

  function initDiscoveryChat() {
    var sendBtn = document.getElementById('discovery-chat-discover-send');
    var input = document.getElementById('discovery-chat-discover-input');
    var chips = document.getElementById('discovery-chat-discover-chips');
    if (sendBtn && !sendBtn.getAttribute('data-bound')) {
      sendBtn.setAttribute('data-bound', '1');
      sendBtn.addEventListener('click', function () {
        handleDiscoveryChatSubmit(input && input.value);
      });
    }
    if (input && !input.getAttribute('data-bound')) {
      input.setAttribute('data-bound', '1');
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey && input.tagName === 'INPUT') {
          e.preventDefault();
          handleDiscoveryChatSubmit(input.value);
        }
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          handleDiscoveryChatSubmit(input.value);
        }
      });
    }
    if (chips && !chips.getAttribute('data-bound')) {
      chips.setAttribute('data-bound', '1');
      chips.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-discovery-prompt]');
        if (!btn) return;
        handleDiscoveryChatSubmit(btn.getAttribute('data-discovery-prompt'));
      });
    }
  }

  function buildAthleteCardHtml(a, index) {
    var teamLabel = a.teamShort || a.team || '';
    var leagueLabel = a.league ? a.league + ' · ' : '';
    var letter = index != null && index < 3 ? String.fromCharCode(65 + index) : null;
    var matchPct = a.matchPct != null ? a.matchPct : null;
    var feeLabel = a.feeLabel || null;
    var recRole = a.recRole || null;
    return '<article class="athlete-card athlete-card--recommend" data-athlete-id="' + a.id + '">' +
      (letter ? '<span class="athlete-card-letter">' + letter + '</span>' : '') +
      '<div class="athlete-card-top">' +
        '<div class="athlete-card-avatar">' + (a.initials || '') + '</div>' +
        '<div class="athlete-card-info">' +
          '<strong>' + (a.name || '') + '</strong>' +
          '<span>' + leagueLabel + (a.role || '') + (teamLabel ? ' · ' + teamLabel : '') + '</span>' +
          '<div class="athlete-card-rec-meta">' +
            (matchPct != null ? '<span class="athlete-match-pct">' + matchPct + '% Match</span>' : '') +
            (feeLabel ? '<span class="athlete-fee">' + feeLabel + '</span>' : '') +
          '</div>' +
          (recRole ? '<p class="athlete-rec-role">' + recRole + '</p>' : '') +
          '<div class="athlete-card-scores">' +
            '<span>Perf: ' + (a.perf != null ? a.perf : '—') + '</span>' +
            '<span class="athlete-card-social-score">Social: ' + (a.social != null ? a.social : '—') + '</span>' +
            (a.verified ? ' <span class="verified">✓ Verified</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="btn-secondary btn-sm btn-view-athlete">Show profile</button>' +
      '</article>';
  }

  function scrollDiscoveryResultsIntoView(focus) {
    var target = null;
    if (focus === 'anim') {
      target = document.getElementById('discovery-search-anim') ||
        document.getElementById('discovery-results-count') ||
        document.querySelector('#screen-brand-discovery .results-area');
    } else {
      target = document.getElementById('discovery-athlete-cards') ||
        document.querySelector('#screen-brand-discovery .results-area');
    }
    if (!target) return;
    requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function setDiscoverySearchingUi(isSearching) {
    var chat = document.getElementById('discovery-chat-discover');
    var results = document.querySelector('#screen-brand-discovery .results-area');
    var paginationEl = document.getElementById('discovery-pagination');
    if (chat) chat.classList.toggle('is-searching', !!isSearching);
    if (results) results.classList.toggle('is-searching', !!isSearching);
    if (isSearching && paginationEl) paginationEl.innerHTML = '';
  }

  function renderDiscoveryPagination(total, page, pageSize) {
    var paginationEl = document.getElementById('discovery-pagination');
    if (!paginationEl) return;
    if (total <= 0) {
      paginationEl.innerHTML = '';
      return;
    }
    if (total <= pageSize) {
      paginationEl.innerHTML = '<span class="discovery-pagination-info">Showing all ' + total + ' athletes</span>';
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

    function pageBtn(i) {
      return '<button type="button" class="discovery-page-btn' + (i === page ? ' discovery-page-btn--active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    var windowSize = 5;
    var from = Math.max(1, page - Math.floor(windowSize / 2));
    var to = Math.min(totalPages, from + windowSize - 1);
    from = Math.max(1, to - windowSize + 1);
    if (from > 1) {
      html += pageBtn(1);
      if (from > 2) html += '<span class="discovery-pagination-ellipsis">…</span>';
    }
    for (var i = from; i <= to; i++) html += pageBtn(i);
    if (to < totalPages) {
      if (to < totalPages - 1) html += '<span class="discovery-pagination-ellipsis">…</span>';
      html += pageBtn(totalPages);
    }

    html += '<button type="button" class="discovery-page-btn" data-page="' + (page + 1) + '" ' + (page >= totalPages ? 'disabled' : '') + '>Next →</button>';
    html += '</div></div>';
    paginationEl.innerHTML = html;
  }

  function renderDiscovery(options) {
    options = options || {};
    var container = document.getElementById('discovery-athlete-cards');
    var countEl = document.getElementById('discovery-results-count');
    var portfolioEl = document.getElementById('discovery-portfolio');
    if (!container || !window.ADC_DATA) return;

    if (options.resetPage) discoveryState.currentPage = 1;

    if (!options.skipGate && !discoveryState.hasSearched) {
      container.innerHTML = '';
      if (countEl) countEl.textContent = '';
      if (portfolioEl) { portfolioEl.hidden = true; portfolioEl.innerHTML = ''; }
      renderDiscoveryPagination(0, 1, discoveryState.pageSize);
      discoveryState.filteredList = [];
      discoveryState.recommendations = [];
      discoveryState.portfolio = null;
      return;
    }

    var brief = getDiscoveryFilters();
    var list;
    if (options.fromSearch || !discoveryState.recommendations || !discoveryState.recommendations.length) {
      var built = buildRecommendations(brief);
      list = built.list;
      discoveryState.portfolio = built.portfolio;
    } else {
      list = discoveryState.recommendations;
    }
    discoveryState.recommendations = list;
    discoveryState.filteredList = list;

    if (portfolioEl) {
      if (discoveryState.portfolio) {
        portfolioEl.hidden = false;
        portfolioEl.innerHTML = formatPortfolioHtml(discoveryState.portfolio, brief.budgetAmount != null ? brief.budgetAmount : null);
      } else {
        portfolioEl.hidden = true;
        portfolioEl.innerHTML = '';
      }
    }

    var pageSize = discoveryState.pageSize;
    var totalPages = Math.max(1, Math.ceil(list.length / pageSize) || 1);
    if (list.length === 0) totalPages = 1;
    if (discoveryState.currentPage > totalPages) discoveryState.currentPage = totalPages;
    if (discoveryState.currentPage < 1) discoveryState.currentPage = 1;

    var startIdx = (discoveryState.currentPage - 1) * pageSize;
    var pageList = list.slice(startIdx, startIdx + pageSize);

    container.innerHTML = pageList.length
      ? pageList.map(function (a, i) { return buildAthleteCardHtml(a, startIdx + i); }).join('')
      : '<p class="discovery-empty">No recommendations matched this brief.</p>';

    if (countEl) {
      countEl.textContent = list.length
        ? list.length + ' recommendation' + (list.length !== 1 ? 's' : '') + ' · ranked by campaign match'
        : '';
    }

    renderDiscoveryPagination(list.length, discoveryState.currentPage, pageSize);
    if (discoveryState.hasSearched) saveDiscoveryCache();

    if (options.scrollToResults) {
      scrollDiscoveryResultsIntoView('results');
    }
  }

  function runDiscoverySearchAnimation(done) {
    var anim = document.getElementById('discovery-search-anim');
    var linesEl = document.getElementById('discovery-search-anim-lines');
    var cards = document.getElementById('discovery-athlete-cards');
    var countEl = document.getElementById('discovery-results-count');
    var portfolioEl = document.getElementById('discovery-portfolio');
    var filters = getDiscoveryFilters();
    if (!anim || !linesEl) {
      if (done) done();
      return;
    }

    setDiscoverySearchingUi(true);
    if (cards) {
      cards.innerHTML = '';
      cards.setAttribute('aria-busy', 'true');
    }
    if (portfolioEl) { portfolioEl.hidden = true; portfolioEl.innerHTML = ''; }
    if (countEl) countEl.textContent = 'Scoring campaign fit…';
    anim.hidden = false;
    anim.classList.add('is-active');
    linesEl.innerHTML = '';
    scrollDiscoveryResultsIntoView('anim');

    var campaign = filters.campaign || 'open brief';
    var budget = filters.budgetAmount != null ? ('₹' + filters.budgetAmount + 'L') : (filters.budget || 'open');
    var market = filters.market || filters.targetGeography || 'open';
    var obj = filters.campaignObjective && filters.campaignObjective !== 'Any' ? filters.campaignObjective : 'open';
    var steps = [
      '> ingest campaign brief · ' + campaign,
      '> constrain budget envelope · ' + budget,
      '> map market affinity · ' + market,
      '> objective weights · ' + obj,
      '> score athletes · match% = f(perf, social, growth, fee)',
      '> assign roles · conversion / reach / emerging-value',
      '> optimize portfolio under budget · knapsack≈greedy',
      '> assemble recommendation payload…'
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
        calc.textContent = '> calc match=' + (88 + Math.random() * 9).toFixed(1) + '%' +
          ' · fee_idx=' + (4 + Math.random() * 10).toFixed(1) + 'L' +
          ' · t+' + Math.floor(elapsed) + 'ms';
        linesEl.appendChild(calc);
        while (linesEl.children.length > 10) linesEl.removeChild(linesEl.firstChild);
        linesEl.scrollTop = linesEl.scrollHeight;
      }

      if (elapsed >= duration) {
        anim.hidden = true;
        anim.classList.remove('is-active');
        if (cards) cards.removeAttribute('aria-busy');
        setDiscoverySearchingUi(false);
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
    var totalPages = Math.max(1, Math.ceil((discoveryState.filteredList.length || 0) / discoveryState.pageSize));
    page = parseInt(page, 10);
    if (isNaN(page) || page < 1 || page > totalPages) return;
    discoveryState.currentPage = page;
    discoveryState.hasSearched = true;
    renderDiscovery({ skipGate: true, scrollToResults: true });
    saveDiscoveryCache();
  }

  function applyDiscoveryFilters(done) {
    var sendBtn = document.getElementById('discovery-chat-discover-send');
    if (sendBtn) sendBtn.disabled = true;
    discoveryState.recommendations = [];
    discoveryState.filteredList = [];
    runDiscoverySearchAnimation(function () {
      discoveryState.hasSearched = true;
      renderDiscovery({ resetPage: true, skipGate: true, fromSearch: true, scrollToResults: true });
      saveDiscoveryCache();
      if (sendBtn) sendBtn.disabled = false;
      if (typeof done === 'function') done();
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
    updateBackToDiscoveryButton();

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
      if (params.restoreResults) {
        restoreDiscoveryFromCache();
        renderDiscovery({
          skipGate: discoveryState.hasSearched,
          scrollToResults: true
        });
      } else {
        ensureDiscoveryFreshOnFirstVisit();
        renderDiscovery({
          skipGate: discoveryState.hasSearched
        });
      }
    } else if (screenId === 'brand-athlete-profile') {
      var id = params.athleteId != null ? params.athleteId : state.selectedAthleteId;
      renderBrandAthleteProfile(id);
      updateBackToDiscoveryButton();
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
    var backBtn = e.target.closest('[data-back-to-discovery]');
    if (backBtn) {
      e.preventDefault();
      goBackToDiscoveryResults();
      return;
    }
    var pageBtn = e.target.closest('.discovery-page-btn[data-page]');
    if (pageBtn) {
      if (pageBtn.hasAttribute('disabled') || pageBtn.disabled) return;
      e.preventDefault();
      e.stopPropagation();
      goToDiscoveryPage(pageBtn.getAttribute('data-page'));
      return;
    }
    var jumpBtn = e.target.closest('#discovery-jump-results');
    if (jumpBtn) {
      e.preventDefault();
      scrollDiscoveryResultsIntoView('results');
      return;
    }
    var card = e.target.closest('.athlete-card[data-athlete-id]');
    if (!card) return;
    var id = card.getAttribute('data-athlete-id');
    if (id) {
      saveDiscoveryCache();
      state.selectedAthleteId = parseInt(id, 10);
      showScreen('brand-athlete-profile', { athleteId: state.selectedAthleteId });
    }
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
    initDiscoveryChat();
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
    saveDiscoveryCache: saveDiscoveryCache,
    restoreDiscoveryFromCache: restoreDiscoveryFromCache,
    goBackToDiscoveryResults: goBackToDiscoveryResults,
    goToDeck: goToDeck,
    openDiscoveryAssistant: null,
    closeDiscoveryAssistant: null,
    toggleDiscoveryAssistant: null
  };
})();
