/**
 * Athlete Data Company – IPL 2026 data layer
 * Top 50 athletes derived from ipl_matches_2026.csv
 * Performance score: POM impact (38%) + team win rate (32%) + availability (30%)
 * Social score: performance + POM visibility + star recognition boost
 */

(function (global) {
  var IPL_META = { season: 2026, totalMatches: 73, source: 'ipl_matches_2026.csv', athleteCount: 50 };
  var ATHLETES = [
    { id: 1, rank: 1, name: 'V Kohli', initials: 'VK', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 29, region: 'PAN India', gender: 'Male', perf: 66, social: 82, verified: true, growth: 'Stable', budget: '₹5–20L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 16, pom: 3, wins: 11, winRate: 68.8 },
    { id: 2, rank: 2, name: 'Ishan Kishan', initials: 'IK', sport: 'Cricket', league: 'IPL 2026', role: 'Wicketkeeper', age: 24, region: 'PAN India', gender: 'Male', perf: 64, social: 80, verified: true, growth: 'Stable', budget: '₹1–5L', team: 'Sunrisers Hyderabad', teamShort: 'SRH', matches: 15, pom: 3, wins: 9, winRate: 60.0 },
    { id: 3, rank: 3, name: 'SV Samson', initials: 'SS', sport: 'Cricket', league: 'IPL 2026', role: 'Wicketkeeper', age: 24, region: 'PAN India', gender: 'Male', perf: 59, social: 75, verified: true, growth: 'Stable', budget: '₹1–5L', team: 'Chennai Super Kings', teamShort: 'CSK', matches: 14, pom: 3, wins: 6, winRate: 42.9 },
    { id: 4, rank: 4, name: 'V Suryavanshi', initials: 'VS', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 24, region: 'PAN India', gender: 'Male', perf: 62, social: 66, verified: true, growth: 'Stable', budget: '₹1–5L', team: 'Rajasthan Royals', teamShort: 'RR', matches: 16, pom: 3, wins: 9, winRate: 56.2 },
    { id: 5, rank: 5, name: 'Shubman Gill', initials: 'SG', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 28, region: 'PAN India', gender: 'Male', perf: 53, social: 66, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Gujarat Titans', teamShort: 'GT', matches: 16, pom: 2, wins: 10, winRate: 62.5 },
    { id: 6, rank: 6, name: 'Rashid Khan', initials: 'RK', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 25, region: 'PAN India', gender: 'Male', perf: 53, social: 65, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Gujarat Titans', teamShort: 'GT', matches: 17, pom: 2, wins: 10, winRate: 58.8 },
    { id: 7, rank: 7, name: 'K Rabada', initials: 'KR', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 26, region: 'PAN India', gender: 'Male', perf: 53, social: 65, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Gujarat Titans', teamShort: 'GT', matches: 17, pom: 2, wins: 10, winRate: 58.8 },
    { id: 8, rank: 8, name: 'KL Rahul', initials: 'KR', sport: 'Cricket', league: 'IPL 2026', role: 'Wicketkeeper', age: 27, region: 'PAN India', gender: 'Male', perf: 50, social: 63, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Delhi Capitals', teamShort: 'DC', matches: 14, pom: 2, wins: 7, winRate: 50.0 },
    { id: 9, rank: 9, name: 'M Tiwari', initials: 'MT', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 27, region: 'PAN India', gender: 'Male', perf: 53, social: 60, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Delhi Capitals', teamShort: 'DC', matches: 3, pom: 1, wins: 3, winRate: 100.0 },
    { id: 10, rank: 10, name: 'JO Holder', initials: 'JH', sport: 'Cricket', league: 'IPL 2026', role: 'All-rounder', age: 27, region: 'PAN India', gender: 'Male', perf: 54, social: 56, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Gujarat Titans', teamShort: 'GT', matches: 11, pom: 2, wins: 7, winRate: 63.6 },
    { id: 11, rank: 11, name: 'Tilak Varma', initials: 'TV', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 25, region: 'PAN India', gender: 'Male', perf: 50, social: 58, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Mumbai Indians', teamShort: 'MI', matches: 14, pom: 2, wins: 4, winRate: 28.6 },
    { id: 12, rank: 12, name: 'JR Hazlewood', initials: 'JH', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 27, region: 'PAN India', gender: 'Male', perf: 53, social: 54, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 13, pom: 2, wins: 8, winRate: 61.5 },
    { id: 13, rank: 13, name: 'JA Duffy', initials: 'JD', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 25, region: 'PAN India', gender: 'Male', perf: 52, social: 55, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 6, pom: 1, wins: 6, winRate: 100.0 },
    { id: 14, rank: 14, name: 'YBK Jaiswal', initials: 'YJ', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 27, region: 'PAN India', gender: 'Male', perf: 50, social: 54, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Rajasthan Royals', teamShort: 'RR', matches: 16, pom: 1, wins: 9, winRate: 56.2 },
    { id: 15, rank: 15, name: 'Abhishek Sharma', initials: 'AS', sport: 'Cricket', league: 'IPL 2026', role: 'All-rounder', age: 25, region: 'PAN India', gender: 'Male', perf: 50, social: 55, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Sunrisers Hyderabad', teamShort: 'SRH', matches: 15, pom: 1, wins: 9, winRate: 60.0 },
    { id: 16, rank: 16, name: 'H Klaasen', initials: 'HK', sport: 'Cricket', league: 'IPL 2026', role: 'Wicketkeeper', age: 24, region: 'PAN India', gender: 'Male', perf: 50, social: 55, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Sunrisers Hyderabad', teamShort: 'SRH', matches: 15, pom: 1, wins: 9, winRate: 60.0 },
    { id: 17, rank: 17, name: 'RA Jadeja', initials: 'RJ', sport: 'Cricket', league: 'IPL 2026', role: 'All-rounder', age: 30, region: 'PAN India', gender: 'Male', perf: 50, social: 54, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Rajasthan Royals', teamShort: 'RR', matches: 14, pom: 1, wins: 8, winRate: 57.1 },
    { id: 18, rank: 18, name: 'Priyansh Arya', initials: 'PA', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 28, region: 'PAN India', gender: 'Male', perf: 51, social: 52, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Punjab Kings', teamShort: 'PBKS', matches: 13, pom: 2, wins: 7, winRate: 53.8 },
    { id: 19, rank: 19, name: 'SS Iyer', initials: 'SI', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 31, region: 'PAN India', gender: 'Male', perf: 51, social: 52, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Punjab Kings', teamShort: 'PBKS', matches: 13, pom: 2, wins: 7, winRate: 53.8 },
    { id: 20, rank: 20, name: 'CV Varun', initials: 'CV', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 24, region: 'PAN India', gender: 'Male', perf: 50, social: 51, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Kolkata Knight Riders', teamShort: 'KKR', matches: 11, pom: 2, wins: 5, winRate: 45.5 },
    { id: 21, rank: 21, name: 'Sameer Rizvi', initials: 'SR', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 30, region: 'North India', gender: 'Male', perf: 50, social: 49, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Delhi Capitals', teamShort: 'DC', matches: 11, pom: 2, wins: 4, winRate: 36.4 },
    { id: 22, rank: 22, name: 'RD Gaikwad', initials: 'RG', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 26, region: 'PAN India', gender: 'Male', perf: 50, social: 51, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Chennai Super Kings', teamShort: 'CSK', matches: 14, pom: 1, wins: 6, winRate: 42.9 },
    { id: 23, rank: 23, name: 'SP Narine', initials: 'SN', sport: 'Cricket', league: 'IPL 2026', role: 'All-rounder', age: 28, region: 'PAN India', gender: 'Male', perf: 50, social: 51, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Kolkata Knight Riders', teamShort: 'KKR', matches: 13, pom: 1, wins: 5, winRate: 38.5 },
    { id: 24, rank: 24, name: 'MR Marsh', initials: 'MM', sport: 'Cricket', league: 'IPL 2026', role: 'All-rounder', age: 26, region: 'PAN India', gender: 'Male', perf: 50, social: 47, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Lucknow Super Giants', teamShort: 'LSG', matches: 13, pom: 2, wins: 4, winRate: 30.8 },
    { id: 25, rank: 25, name: 'PP Hinge', initials: 'PH', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 25, region: 'PAN India', gender: 'Male', perf: 50, social: 47, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Sunrisers Hyderabad', teamShort: 'SRH', matches: 7, pom: 1, wins: 5, winRate: 71.4 },
    { id: 26, rank: 26, name: 'PD Salt', initials: 'PS', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 24, region: 'PAN India', gender: 'Male', perf: 50, social: 47, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 6, pom: 1, wins: 4, winRate: 66.7 },
    { id: 27, rank: 27, name: 'MA Starc', initials: 'MS', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 25, region: 'PAN India', gender: 'Male', perf: 50, social: 47, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Delhi Capitals', teamShort: 'DC', matches: 6, pom: 1, wins: 4, winRate: 66.7 },
    { id: 28, rank: 28, name: 'MK Pandey', initials: 'MP', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 31, region: 'PAN India', gender: 'Male', perf: 50, social: 47, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Kolkata Knight Riders', teamShort: 'KKR', matches: 6, pom: 1, wins: 4, winRate: 66.7 },
    { id: 29, rank: 29, name: 'Mohammed Siraj', initials: 'MS', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 29, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Gujarat Titans', teamShort: 'GT', matches: 17, pom: 1, wins: 10, winRate: 58.8 },
    { id: 30, rank: 30, name: 'TH David', initials: 'TD', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 25, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 16, pom: 1, wins: 11, winRate: 68.8 },
    { id: 31, rank: 31, name: 'B Kumar', initials: 'BK', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 27, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 16, pom: 1, wins: 11, winRate: 68.8 },
    { id: 32, rank: 32, name: 'JC Archer', initials: 'JA', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 30, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Rajasthan Royals', teamShort: 'RR', matches: 16, pom: 1, wins: 9, winRate: 56.2 },
    { id: 33, rank: 33, name: 'E Malinga', initials: 'EM', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 25, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Sunrisers Hyderabad', teamShort: 'SRH', matches: 15, pom: 1, wins: 9, winRate: 60.0 },
    { id: 34, rank: 34, name: 'RM Patidar', initials: 'RP', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 27, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 15, pom: 1, wins: 10, winRate: 66.7 },
    { id: 35, rank: 35, name: 'D Ferreira', initials: 'DF', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 28, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Rajasthan Royals', teamShort: 'RR', matches: 15, pom: 1, wins: 8, winRate: 53.3 },
    { id: 36, rank: 36, name: 'Nithish Kumar Reddy', initials: 'NR', sport: 'Cricket', league: 'IPL 2026', role: 'All-rounder', age: 25, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Sunrisers Hyderabad', teamShort: 'SRH', matches: 14, pom: 1, wins: 9, winRate: 64.3 },
    { id: 37, rank: 37, name: 'Noor Ahmad', initials: 'NA', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 29, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Chennai Super Kings', teamShort: 'CSK', matches: 14, pom: 1, wins: 6, winRate: 42.9 },
    { id: 38, rank: 38, name: 'T Stubbs', initials: 'TS', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 24, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Delhi Capitals', teamShort: 'DC', matches: 14, pom: 1, wins: 7, winRate: 50.0 },
    { id: 39, rank: 39, name: 'RK Singh', initials: 'RS', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 31, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Kolkata Knight Riders', teamShort: 'KKR', matches: 13, pom: 1, wins: 5, winRate: 38.5 },
    { id: 40, rank: 40, name: 'N Burger', initials: 'NB', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 29, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Rajasthan Royals', teamShort: 'RR', matches: 13, pom: 1, wins: 8, winRate: 61.5 },
    { id: 41, rank: 41, name: 'C Connolly', initials: 'CC', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 25, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Punjab Kings', teamShort: 'PBKS', matches: 13, pom: 1, wins: 7, winRate: 53.8 },
    { id: 42, rank: 42, name: 'Arshdeep Singh', initials: 'AS', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 24, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Punjab Kings', teamShort: 'PBKS', matches: 13, pom: 1, wins: 7, winRate: 53.8 },
    { id: 43, rank: 43, name: 'Mohammed Shami', initials: 'MS', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 31, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Lucknow Super Giants', teamShort: 'LSG', matches: 13, pom: 1, wins: 4, winRate: 30.8 },
    { id: 44, rank: 44, name: 'RD Rickelton', initials: 'RR', sport: 'Cricket', league: 'IPL 2026', role: 'Wicketkeeper', age: 28, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Mumbai Indians', teamShort: 'MI', matches: 12, pom: 1, wins: 3, winRate: 25.0 },
    { id: 45, rank: 45, name: 'M Prasidh Krishna', initials: 'MK', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 29, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Gujarat Titans', teamShort: 'GT', matches: 12, pom: 1, wins: 6, winRate: 50.0 },
    { id: 46, rank: 46, name: 'Kuldeep Yadav', initials: 'KY', sport: 'Cricket', league: 'IPL 2026', role: 'Bowler', age: 27, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Delhi Capitals', teamShort: 'DC', matches: 12, pom: 1, wins: 5, winRate: 41.7 },
    { id: 47, rank: 47, name: 'FH Allen', initials: 'FA', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 28, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Kolkata Knight Riders', teamShort: 'KKR', matches: 10, pom: 1, wins: 4, winRate: 40.0 },
    { id: 48, rank: 48, name: 'J Overton', initials: 'JO', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 31, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Chennai Super Kings', teamShort: 'CSK', matches: 10, pom: 1, wins: 6, winRate: 60.0 },
    { id: 49, rank: 49, name: 'MD Choudhary', initials: 'MC', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 28, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Lucknow Super Giants', teamShort: 'LSG', matches: 10, pom: 1, wins: 3, winRate: 30.0 },
    { id: 50, rank: 50, name: 'SN Thakur', initials: 'ST', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 27, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Mumbai Indians', teamShort: 'MI', matches: 9, pom: 1, wins: 2, winRate: 22.2 },
  ];

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
