/**
 * Athlete Data Company – App data layer
 * Mock athletes and filter/query helpers. Use localStorage for shortlist and session state.
 */

(function (global) {
  var ATHLETES = [
    { id: 1, name: 'Rahul K.', initials: 'RK', sport: 'Cricket', role: 'Batsman', age: 24, region: 'North India', gender: 'Male', perf: 82, social: 76, verified: true, growth: 'Rising', budget: '₹5–20L' },
    { id: 2, name: 'Priya S.', initials: 'PS', sport: 'Badminton', role: 'Singles', age: 22, region: 'South India', gender: 'Female', perf: 88, social: 81, verified: true, growth: 'Rising', budget: '₹5–20L' },
    { id: 3, name: 'Aarav M.', initials: 'AM', sport: 'Football', role: 'Midfielder', age: 21, region: 'West India', gender: 'Male', perf: 75, social: 69, verified: false, growth: 'Stable', budget: '₹1–5L' },
    { id: 4, name: 'Ananya R.', initials: 'AR', sport: 'Cricket', role: 'Bowler', age: 23, region: 'East India', gender: 'Female', perf: 79, social: 72, verified: true, growth: 'Rising', budget: '₹1–5L' },
    { id: 5, name: 'Vikram P.', initials: 'VP', sport: 'Football', role: 'Forward', age: 20, region: 'North India', gender: 'Male', perf: 81, social: 78, verified: true, growth: 'Rising', budget: '₹5–20L' },
    { id: 6, name: 'Sneha T.', initials: 'ST', sport: 'Badminton', role: 'Doubles', age: 25, region: 'South India', gender: 'Female', perf: 85, social: 80, verified: true, growth: 'Stable', budget: '₹5–20L' },
    { id: 7, name: 'Rohan D.', initials: 'RD', sport: 'Cricket', role: 'All-rounder', age: 26, region: 'PAN India', gender: 'Male', perf: 90, social: 84, verified: true, growth: 'Stable', budget: '₹5–20L' },
    { id: 8, name: 'Kavya N.', initials: 'KN', sport: 'Football', role: 'Defender', age: 19, region: 'West India', gender: 'Female', perf: 72, social: 65, verified: false, growth: 'Rising', budget: '₹1–5L' },
    { id: 9, name: 'Arjun S.', initials: 'AS', sport: 'Cricket', role: 'Batsman', age: 27, region: 'North India', gender: 'Male', perf: 86, social: 79, verified: true, growth: 'Stable', budget: '₹5–20L' },
    { id: 10, name: 'Meera I.', initials: 'MI', sport: 'Badminton', role: 'Singles', age: 23, region: 'South India', gender: 'Female', perf: 83, social: 77, verified: true, growth: 'Rising', budget: '₹1–5L' },
    { id: 11, name: 'Dev K.', initials: 'DK', sport: 'Football', role: 'Midfielder', age: 22, region: 'East India', gender: 'Male', perf: 78, social: 71, verified: true, growth: 'Rising', budget: '₹1–5L' },
    { id: 12, name: 'Ishita G.', initials: 'IG', sport: 'Cricket', role: 'Bowler', age: 21, region: 'PAN India', gender: 'Female', perf: 80, social: 74, verified: false, growth: 'Rising', budget: '₹1–5L' }
  ];

  var STORAGE_KEYS = { shortlist: 'adc_shortlist', athleteProfile: 'adc_athlete_profile', brandProfile: 'adc_brand_profile' };

  function getAthletes(filters) {
    filters = filters || {};
    var list = ATHLETES.filter(function (a) {
      if (filters.sport && filters.sport !== 'All' && a.sport !== filters.sport) return false;
      if (filters.role && filters.role !== 'All' && a.role !== filters.role) return false;
      if (filters.ageMin != null && a.age < filters.ageMin) return false;
      if (filters.ageMax != null && a.age > filters.ageMax) return false;
      if (filters.region && filters.region !== 'Any' && filters.region !== '' && a.region.toLowerCase().indexOf((filters.region || '').toLowerCase()) === -1) return false;
      if (filters.perfMin != null && a.perf < filters.perfMin) return false;
      if (filters.perfMax != null && a.perf > filters.perfMax) return false;
      if (filters.socialMin != null && a.social < filters.socialMin) return false;
      if (filters.socialMax != null && a.social > filters.socialMax) return false;
      if (filters.verifiedOnly && !a.verified) return false;
      if (filters.gender && filters.gender !== 'All' && (a.gender || '') !== filters.gender) return false;
      if (filters.growth && filters.growth !== 'Any' && a.growth !== filters.growth) return false;
      if (filters.budget && filters.budget !== 'Any' && a.budget !== filters.budget) return false;
      if (filters.searchQuery) {
        var q = (filters.searchQuery || '').toLowerCase();
        if (!q) return true;
        var match = (a.name + ' ' + a.sport + ' ' + a.role + ' ' + a.region).toLowerCase().indexOf(q) !== -1;
        if (!match) return false;
      }
      return true;
    });
    return list;
  }

  function getAthleteById(id) {
    id = parseInt(id, 10);
    return ATHLETES.filter(function (a) { return a.id === id; })[0] || null;
  }

  function getShortlist() {
    try {
      var raw = localStorage.getItem(STORAGE_KEYS.shortlist);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function setShortlist(ids) {
    try {
      localStorage.setItem(STORAGE_KEYS.shortlist, JSON.stringify(ids));
    } catch (e) {}
  }

  function addToShortlist(id) {
    var list = getShortlist();
    if (list.indexOf(id) === -1) list.push(id);
    setShortlist(list);
  }

  function removeFromShortlist(id) {
    setShortlist(getShortlist().filter(function (x) { return x !== id; }));
  }

  function isInShortlist(id) {
    return getShortlist().indexOf(parseInt(id, 10)) !== -1;
  }

  global.ADC_DATA = {
    getAthletes: getAthletes,
    getAthleteById: getAthleteById,
    getShortlist: getShortlist,
    setShortlist: setShortlist,
    addToShortlist: addToShortlist,
    removeFromShortlist: removeFromShortlist,
    isInShortlist: isInShortlist,
    ATHLETES: ATHLETES
  };
})(typeof window !== 'undefined' ? window : this);
