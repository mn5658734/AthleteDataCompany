/**
 * IPL 2026 Discovery Assistant – answers performance questions from ADC_DATA.
 */

(function (global) {
  var TEAM_ALIASES = {
    rcb: 'Royal Challengers Bengaluru',
    'royal challengers': 'Royal Challengers Bengaluru',
    mi: 'Mumbai Indians',
    'mumbai indians': 'Mumbai Indians',
    csk: 'Chennai Super Kings',
    'chennai super kings': 'Chennai Super Kings',
    kkr: 'Kolkata Knight Riders',
    'kolkata knight riders': 'Kolkata Knight Riders',
    srh: 'Sunrisers Hyderabad',
    'sunrisers hyderabad': 'Sunrisers Hyderabad',
    rr: 'Rajasthan Royals',
    'rajasthan royals': 'Rajasthan Royals',
    dc: 'Delhi Capitals',
    'delhi capitals': 'Delhi Capitals',
    pbks: 'Punjab Kings',
    'punjab kings': 'Punjab Kings',
    gt: 'Gujarat Titans',
    'gujarat titans': 'Gujarat Titans',
    lsg: 'Lucknow Super Giants',
    'lucknow super giants': 'Lucknow Super Giants'
  };

  function getAthletes() {
    return (global.ADC_DATA && global.ADC_DATA.ATHLETES) || [];
  }

  function getMeta() {
    return (global.ADC_DATA && global.ADC_DATA.IPL_META) || { season: 2026, totalMatches: 73, athleteCount: 50 };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatPlayerLine(a) {
    return '<strong>#' + a.rank + ' ' + escapeHtml(a.name) + '</strong> (' + escapeHtml(a.teamShort) + ') — Perf ' + a.perf + ', Social ' + a.social + ', POM ' + a.pom + ', ' + a.matches + ' matches, ' + a.winRate + '% win rate';
  }

  function findAthletesInQuery(q) {
    var athletes = getAthletes();
    var matches = [];
    athletes.forEach(function (a) {
      var parts = a.name.toLowerCase().split(/\s+/);
      var surname = parts[parts.length - 1];
      var full = a.name.toLowerCase();
      if (q.indexOf(full) !== -1 || (surname.length > 2 && q.indexOf(surname) !== -1)) {
        matches.push(a);
      }
    });
    matches.sort(function (x, y) {
      return y.name.length - x.name.length;
    });
    var seen = {};
    return matches.filter(function (a) {
      if (seen[a.id]) return false;
      seen[a.id] = true;
      return true;
    });
  }

  function resolveTeam(q) {
    var keys = Object.keys(TEAM_ALIASES).sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < keys.length; i++) {
      if (q.indexOf(keys[i]) !== -1) return TEAM_ALIASES[keys[i]];
    }
    return null;
  }

  function athleteSummary(a) {
    var tier = a.perf >= 75 ? 'Tier A' : a.perf >= 65 ? 'Tier B' : 'Tier C';
    return '<p><strong>' + escapeHtml(a.name) + '</strong> (' + escapeHtml(a.teamShort) + ' · ' + escapeHtml(a.role) + ') — IPL ' + getMeta().season + ' rank <strong>#' + a.rank + '</strong>.</p>' +
      '<ul>' +
        '<li>AI Performance score: <strong>' + a.perf + '</strong> (' + tier + ')</li>' +
        '<li>AI Social score: <strong>' + a.social + '</strong></li>' +
        '<li>Matches played: <strong>' + a.matches + '</strong> / ' + getMeta().totalMatches + ' completed games</li>' +
        '<li>Player of the Match: <strong>' + a.pom + '</strong></li>' +
        '<li>Team wins when in XI: <strong>' + a.wins + '</strong> (' + a.winRate + '%)</li>' +
        '<li>Growth signal: <strong>' + escapeHtml(a.growth) + '</strong> · Budget band: <strong>' + escapeHtml(a.budget) + '</strong></li>' +
      '</ul>' +
      '<p>Scoring uses POM impact (38%), team win rate when selected (32%), and squad availability (30%).</p>';
  }

  function topList(athletes, limit, sortFn) {
    return athletes.slice().sort(sortFn).slice(0, limit || 5);
  }

  function answerQuery(text) {
    if (!global.ADC_DATA) {
      return '<p>IPL 2026 data is not loaded yet. Open Brand Discovery first.</p>';
    }

    var q = (text || '').toLowerCase().trim();
    if (!q) {
      return '<p>Ask about any IPL 2026 athlete — e.g. <em>How is V Kohli performing?</em>, <em>Top POM winners</em>, or <em>Best RCB players by social score</em>.</p>';
    }

    var athletes = getAthletes();
    var meta = getMeta();

    if (/help|what can you|how do i/.test(q)) {
      return '<p>I can answer performance questions for all <strong>' + meta.athleteCount + '</strong> IPL ' + meta.season + ' athletes:</p>' +
        '<ul>' +
          '<li>Individual stats — <em>Performance of Ishan Kishan</em></li>' +
          '<li>Rankings — <em>Top 5 by performance score</em></li>' +
          '<li>POM leaders — <em>Most player of the match awards</em></li>' +
          '<li>Team squads — <em>Best GT bowlers</em></li>' +
          '<li>Comparisons — <em>Kohli vs Gill performance</em></li>' +
        '</ul>';
    }

    var named = findAthletesInQuery(q);
    if (named.length >= 2 && (/ vs | versus | compare|comparison/.test(q))) {
      var html = '<p><strong>Head-to-head (IPL ' + meta.season + '):</strong></p><ul>';
      named.slice(0, 2).forEach(function (a) {
        html += '<li>' + formatPlayerLine(a) + '</li>';
      });
      html += '</ul>';
      var a0 = named[0];
      var a1 = named[1];
      if (a0.perf > a1.perf) html += '<p><strong>' + escapeHtml(a0.name) + '</strong> leads on performance (' + a0.perf + ' vs ' + a1.perf + ').</p>';
      else if (a1.perf > a0.perf) html += '<p><strong>' + escapeHtml(a1.name) + '</strong> leads on performance (' + a1.perf + ' vs ' + a0.perf + ').</p>';
      else html += '<p>Both are tied on performance score (' + a0.perf + ').</p>';
      return html;
    }

    if (named.length === 1 && (/perform|stats|score|how is|how\'s|tell me about|show|win rate|pom|social/.test(q) || named[0].name.toLowerCase().split(/\s+/).some(function (p) { return p.length > 2 && q.indexOf(p) !== -1; }))) {
      return athleteSummary(named[0]);
    }

    if (/pom|player of the match|man of the match|motm/.test(q)) {
      var pomLeaders = topList(athletes, 5, function (a, b) { return b.pom - a.pom || a.rank - b.rank; });
      var htmlPom = '<p><strong>Top Player-of-the-Match winners</strong> (IPL ' + meta.season + '):</p><ul>';
      pomLeaders.forEach(function (a) {
        htmlPom += '<li>' + formatPlayerLine(a) + '</li>';
      });
      htmlPom += '</ul>';
      return htmlPom;
    }

    var team = resolveTeam(q);
    if (team || /team|franchise|squad/.test(q)) {
      var teamName = team || resolveTeam(q);
      var pool = teamName ? athletes.filter(function (a) { return a.team === teamName; }) : athletes;
      if (teamName && !pool.length) {
        return '<p>No athletes found for <strong>' + escapeHtml(teamName) + '</strong> in the top ' + meta.athleteCount + ' list.</p>';
      }
      if (teamName) {
        var byPerf = topList(pool, 5, function (a, b) { return b.perf - a.perf || a.rank - b.rank; });
        var roleFilter = null;
        if (/bowler/.test(q)) roleFilter = 'Bowler';
        else if (/batsman|batter/.test(q)) roleFilter = 'Batsman';
        else if (/wicketkeeper|keeper/.test(q)) roleFilter = 'Wicketkeeper';
        else if (/all-rounder|allrounder/.test(q)) roleFilter = 'All-rounder';
        if (roleFilter) byPerf = topList(pool.filter(function (a) { return a.role === roleFilter; }), 5, function (a, b) { return b.perf - a.perf || a.rank - b.rank; });
        if (!byPerf.length) return '<p>No matching ' + escapeHtml(roleFilter || 'players') + ' for <strong>' + escapeHtml(teamName) + '</strong>.</p>';
        var htmlTeam = '<p><strong>Top ' + escapeHtml(teamName) + (roleFilter ? ' ' + roleFilter + 's' : ' players') + '</strong> by performance:</p><ul>';
        byPerf.forEach(function (a) {
          htmlTeam += '<li>' + formatPlayerLine(a) + '</li>';
        });
        htmlTeam += '</ul>';
        return htmlTeam;
      }
    }

    if (/social|reach|brand|visibility|followers/.test(q)) {
      var socialTop = topList(athletes, 5, function (a, b) { return b.social - a.social || a.rank - b.rank; });
      var htmlSocial = '<p><strong>Highest social scores</strong> (IPL ' + meta.season + '):</p><ul>';
      socialTop.forEach(function (a) {
        htmlSocial += '<li>' + formatPlayerLine(a) + '</li>';
      });
      htmlSocial += '</ul>';
      return htmlSocial;
    }

    if (/win rate|winning|wins/.test(q)) {
      var winTop = topList(athletes, 5, function (a, b) { return b.winRate - a.winRate || b.matches - a.matches; });
      var htmlWin = '<p><strong>Best team win rate</strong> when selected in XI:</p><ul>';
      winTop.forEach(function (a) {
        htmlWin += '<li>' + formatPlayerLine(a) + '</li>';
      });
      htmlWin += '</ul>';
      return htmlWin;
    }

    if (/top|best|highest|leading|rank|perform/.test(q)) {
      var limit = 5;
      var m = q.match(/top\s*(\d+)/);
      if (m) limit = Math.min(parseInt(m[1], 10), 10);
      var perfTop = topList(athletes, limit, function (a, b) { return a.rank - b.rank; });
      var htmlTop = '<p><strong>Top ' + limit + ' IPL ' + meta.season + ' athletes</strong> by discovery rank:</p><ul>';
      perfTop.forEach(function (a) {
        htmlTop += '<li>' + formatPlayerLine(a) + '</li>';
      });
      htmlTop += '</ul>';
      return htmlTop;
    }

    if (/average|avg|mean/.test(q)) {
      var sumPerf = 0;
      var sumSocial = 0;
      var sumPom = 0;
      athletes.forEach(function (a) {
        sumPerf += a.perf;
        sumSocial += a.social;
        sumPom += a.pom;
      });
      var n = athletes.length || 1;
      return '<p><strong>IPL ' + meta.season + ' pool averages</strong> (top ' + n + ' athletes):</p>' +
        '<ul>' +
          '<li>Avg performance score: <strong>' + (sumPerf / n).toFixed(1) + '</strong></li>' +
          '<li>Avg social score: <strong>' + (sumSocial / n).toFixed(1) + '</strong></li>' +
          '<li>Avg POM per player: <strong>' + (sumPom / n).toFixed(2) + '</strong></li>' +
          '<li>Dataset: <strong>' + meta.totalMatches + '</strong> completed matches</li>' +
        '</ul>';
    }

    if (named.length === 1) {
      return athleteSummary(named[0]);
    }

    if (named.length > 1) {
      var htmlMulti = '<p>I found multiple players. Here are their IPL ' + meta.season + ' summaries:</p><ul>';
      named.slice(0, 4).forEach(function (a) {
        htmlMulti += '<li>' + formatPlayerLine(a) + '</li>';
      });
      htmlMulti += '</ul>';
      return htmlMulti;
    }

    return '<p>I could not match that query to the IPL ' + meta.season + ' dataset. Try asking about a player name, team (RCB, MI, CSK…), POM leaders, or <em>top 5 by performance</em>.</p>';
  }

  global.IPL_ASSISTANT = { answerQuery: answerQuery };
})(typeof window !== 'undefined' ? window : this);
