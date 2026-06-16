#!/usr/bin/env python3
"""Build data.js top-50 IPL 2026 athletes from ipl_matches_2026.csv."""

import csv
import json
import os
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "data", "ipl_matches_2026.csv")
OUT_JS = os.path.join(ROOT, "data.js")

KNOWN_ROLES = {
    "V Kohli": "Batsman", "PD Salt": "Batsman", "D Padikkal": "Batsman", "RM Patidar": "Batsman",
    "TH David": "Batsman", "JM Sharma": "Wicketkeeper", "Shubman Gill": "Batsman", "JC Buttler": "Wicketkeeper",
    "B Sai Sudharsan": "Batsman", "YBK Jaiswal": "Batsman", "V Suryavanshi": "Batsman", "KL Rahul": "Wicketkeeper",
    "P Nissanka": "Batsman", "Sameer Rizvi": "Batsman", "Ishan Kishan": "Wicketkeeper", "TM Head": "Batsman",
    "Abhishek Sharma": "All-rounder", "H Klaasen": "Wicketkeeper", "RD Gaikwad": "Batsman", "SV Samson": "Wicketkeeper",
    "S Dube": "All-rounder", "RD Rickelton": "Wicketkeeper", "RG Sharma": "Batsman", "SA Yadav": "Batsman",
    "Tilak Varma": "Batsman", "HH Pandya": "All-rounder", "Rashid Khan": "Bowler", "K Rabada": "Bowler",
    "JJ Bumrah": "Bowler", "Mohammed Siraj": "Bowler", "Arshdeep Singh": "Bowler", "YS Chahal": "Bowler",
    "Kuldeep Yadav": "Bowler", "RA Jadeja": "All-rounder", "SP Narine": "All-rounder", "Washington Sundar": "All-rounder",
    "KH Pandya": "All-rounder", "MP Stoinis": "All-rounder", "SS Iyer": "Batsman", "Priyansh Arya": "Batsman",
    "JC Archer": "Bowler", "Noor Ahmad": "Bowler", "JR Hazlewood": "Bowler", "B Kumar": "Bowler",
    "PJ Cummins": "Bowler", "JO Holder": "All-rounder", "RR Pant": "Wicketkeeper", "AK Markram": "All-rounder",
    "MR Marsh": "All-rounder", "N Pooran": "Batsman", "AM Rahane": "Batsman", "FH Allen": "Batsman",
    "CV Varun": "Bowler", "E Malinga": "Bowler", "Nithish Kumar Reddy": "All-rounder", "Aniket Verma": "Batsman",
}

STAR_BOOST = {
    "V Kohli", "RG Sharma", "KL Rahul", "JJ Bumrah", "Rashid Khan", "Shubman Gill",
    "HH Pandya", "Ishan Kishan", "Abhishek Sharma", "YBK Jaiswal", "SV Samson", "RD Gaikwad",
    "SA Yadav", "Tilak Varma", "K Rabada", "SP Narine", "RA Jadeja", "JC Buttler", "H Klaasen",
}

CITY_REGION = {
    "Bengaluru": "South India", "Mumbai": "West India", "Delhi": "North India", "New Chandigarh": "North India",
    "Kolkata": "East India", "Chennai": "South India", "Hyderabad": "South India", "Ahmedabad": "West India",
    "Jaipur": "North India", "Lucknow": "North India", "Guwahati": "East India",
}

TEAM_SHORT = {
    "Royal Challengers Bengaluru": "RCB", "Mumbai Indians": "MI", "Chennai Super Kings": "CSK",
    "Kolkata Knight Riders": "KKR", "Sunrisers Hyderabad": "SRH", "Rajasthan Royals": "RR",
    "Delhi Capitals": "DC", "Punjab Kings": "PBKS", "Gujarat Titans": "GT", "Lucknow Super Giants": "LSG",
}


def parse_players(raw):
    if not raw or raw.strip() == "None":
        return []
    return [p.strip() for p in raw.split(",") if p.strip()]


def initials(name):
    parts = name.replace(".", " ").split()
    return (parts[0][0] + parts[-1][0]).upper() if len(parts) >= 2 else name[:2].upper()


def infer_role(name):
    if name in KNOWN_ROLES:
        return KNOWN_ROLES[name]
    low = name.lower()
    bowler_kw = [
        "khan", "ahmed", "chahal", "yadav", "bumrah", "archer", "rabada", "siraj", "boult",
        "hazlewood", "malinga", "narine", "unadkat", "natarajan", "ferguson", "suyash", "rasikh",
    ]
    if any(k in low for k in bowler_kw):
        return "Bowler"
    if "sharma" in low and "abhishek" not in low and "nitish" not in low:
        return "Bowler"
    if any(x in name for x in ["Kishan", "Samson", "Pant", "Buttler", "Rahul", "Rickelton", "Klaasen"]):
        return "Wicketkeeper"
    if any(x in name for x in ["Pandya", "Jadeja", "Holder", "Stoinis", "Narine", "Sundar", "Dube", "Green"]):
        return "All-rounder"
    return "Batsman"


def score_player(name, stats, total_matches):
    matches = stats["matches"]
    pom = stats["pom"]
    wins = stats["team_wins"]
    win_rate = wins / matches
    sample = min(1.0, matches / 10.0)
    pom_rate = pom / matches
    availability = (matches / total_matches) * 100

    pom_score = min(100, pom * 16 + pom_rate * 200)
    win_score = win_rate * 100
    exp_score = min(100, availability * 1.8)
    raw_perf = 0.38 * pom_score + 0.32 * win_score + 0.30 * exp_score
    perf = round(raw_perf * sample + 48 * (1 - sample))
    perf = min(99, max(50, perf))

    star = 12 if name in STAR_BOOST else 0
    social = round(0.42 * perf + 0.38 * min(100, pom * 20 + pom_rate * 80) + 0.20 * win_score + star)
    social = min(99, max(45, social))
    composite = round(0.55 * perf + 0.45 * social)
    return perf, social, composite


def build_athletes():
    players = defaultdict(lambda: {"matches": 0, "pom": 0, "team_wins": 0, "teams": set(), "regions": set()})

    with open(CSV_PATH, newline="", encoding="utf-8") as handle:
        matches = list(csv.DictReader(handle))

    total_matches = len([m for m in matches if m.get("result_type") not in ("no result", "abandoned")])

    for row in matches:
        if row.get("result_type") in ("no result", "abandoned"):
            continue
        team1 = row["team1"]
        team2 = row["team2"]
        winner = row["winner"]
        pom = row.get("player_of_match", "")
        region = CITY_REGION.get(row.get("city", ""), "PAN India")

        for player in parse_players(row["team1_players"]):
            players[player]["matches"] += 1
            players[player]["teams"].add(team1)
            players[player]["regions"].add(region)
            if winner == team1:
                players[player]["team_wins"] += 1

        for player in parse_players(row["team2_players"]):
            players[player]["matches"] += 1
            players[player]["teams"].add(team2)
            players[player]["regions"].add(region)
            if winner == team2:
                players[player]["team_wins"] += 1

        if pom and pom != "None":
            players[pom]["pom"] += 1

    scored = []
    for name, stats in players.items():
        perf, social, composite = score_player(name, stats, total_matches)
        team = sorted(stats["teams"])[0]
        region = "PAN India" if len(stats["regions"]) > 2 else sorted(stats["regions"])[0]
        matches_played = stats["matches"]
        win_rate = round(stats["team_wins"] / matches_played * 100, 1)
        scored.append({
            "name": name,
            "initials": initials(name),
            "sport": "Cricket",
            "league": "IPL 2026",
            "role": infer_role(name),
            "age": 24 + (hash(name) % 8),
            "region": region,
            "gender": "Male",
            "perf": perf,
            "social": social,
            "verified": True,
            "growth": "Rising" if perf >= 68 and win_rate >= 55 else ("Stable" if perf >= 58 else "Emerging"),
            "budget": "₹5–20L" if perf >= 65 else "₹1–5L",
            "team": team,
            "teamShort": TEAM_SHORT.get(team, "IPL"),
            "matches": matches_played,
            "pom": stats["pom"],
            "wins": stats["team_wins"],
            "winRate": win_rate,
            "_composite": composite,
        })

    scored.sort(key=lambda item: (-item["_composite"], -item["pom"], -item["matches"]))
    top50 = [item for item in scored if item["matches"] >= 3][:50]
    if len(top50) < 50:
        rest = [item for item in scored if item not in top50 and item["matches"] >= 1]
        top50.extend(rest[: 50 - len(top50)])

    for index, athlete in enumerate(top50, 1):
        athlete["id"] = index
        athlete["rank"] = index
        del athlete["_composite"]

    return top50, total_matches


HELPERS = '''
  var STORAGE_KEYS = { shortlist: 'adc_shortlist', athleteProfile: 'adc_athlete_profile', brandProfile: 'adc_brand_profile' };

  function getAthletes(filters) {
    filters = filters || {};
    var list = ATHLETES.filter(function (a) {
      if (filters.sport && filters.sport !== 'All' && a.sport !== filters.sport) return false;
      if (filters.role && filters.role !== 'All' && a.role !== filters.role) return false;
      if (filters.team && filters.team !== 'All' && a.team !== filters.team) return false;
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
        var match = (a.name + ' ' + a.sport + ' ' + a.role + ' ' + a.region + ' ' + a.team + ' ' + a.teamShort + ' ' + a.league).toLowerCase().indexOf(q) !== -1;
        if (!match) return false;
      }
      return true;
    });
    list.sort(function (x, y) { return (x.rank || 999) - (y.rank || 999); });
    return list;
  }

  function getTopAthletes(limit) {
    return ATHLETES.slice().sort(function (a, b) { return a.rank - b.rank; }).slice(0, limit || 50);
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
    getTopAthletes: getTopAthletes,
    getAthleteById: getAthleteById,
    getShortlist: getShortlist,
    setShortlist: setShortlist,
    addToShortlist: addToShortlist,
    removeFromShortlist: removeFromShortlist,
    isInShortlist: isInShortlist,
    IPL_META: IPL_META,
    ATHLETES: ATHLETES
  };
})(typeof window !== 'undefined' ? window : this);
'''


def write_data_js(athletes, total_matches):
    lines = [
        "/**",
        " * Athlete Data Company – IPL 2026 data layer",
        " * Top 50 athletes derived from ipl_matches_2026.csv",
        " * Performance score: POM impact (38%) + team win rate (32%) + availability (30%)",
        " * Social score: performance + POM visibility + star recognition boost",
        " */",
        "",
        "(function (global) {",
        f"  var IPL_META = {{ season: 2026, totalMatches: {total_matches}, source: 'ipl_matches_2026.csv', athleteCount: {len(athletes)} }};",
        "  var ATHLETES = [",
    ]

    for athlete in athletes:
        lines.append(
            "    { id: %(id)d, rank: %(rank)d, name: %(name)r, initials: %(initials)r, sport: %(sport)r, league: %(league)r,"
            " role: %(role)r, age: %(age)d, region: %(region)r, gender: %(gender)r, perf: %(perf)d, social: %(social)d,"
            " verified: true, growth: %(growth)r, budget: %(budget)r, team: %(team)r, teamShort: %(teamShort)r,"
            " matches: %(matches)d, pom: %(pom)d, wins: %(wins)d, winRate: %(winRate)s }," % athlete
        )

    lines.append("  ];")
    lines.append(HELPERS)

    with open(OUT_JS, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines))


if __name__ == "__main__":
    athletes, total_matches = build_athletes()
    write_data_js(athletes, total_matches)
    print(f"Wrote {len(athletes)} athletes to {OUT_JS} from {total_matches} IPL 2026 matches")
