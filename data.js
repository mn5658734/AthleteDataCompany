/**
 * Athlete Data Company – multi-sport data layer
 * Primary universe: ADC_Consolidated_MultiSport_Cricket_League_Performance.xlsx
 * + IPL seed athletes for cricket commercial depth
 * Cricket season aggregates from open-web public stats pages
 */

(function (global) {
  var IPL_META = { season: 2026, totalMatches: 73, source: 'ipl_matches_2026.csv', athleteCount: 50 };
  var MULTISPORT_META = (global.ADC_MULTISPORT && global.ADC_MULTISPORT.meta) || {
    source: 'ADC_Consolidated_MultiSport_Cricket_League_Performance.xlsx',
    count: 0,
    sports: []
  };

  var IPL_SEED = [
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
    { id: 50, rank: 50, name: 'SN Thakur', initials: 'ST', sport: 'Cricket', league: 'IPL 2026', role: 'Batsman', age: 27, region: 'PAN India', gender: 'Male', perf: 50, social: 45, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Mumbai Indians', teamShort: 'MI', matches: 9, pom: 1, wins: 2, winRate: 22.2 }
  ];

  // Seed women athletes so gender-aware discovery has real Female profiles (esp. cricket / WPL)
  var WOMEN_SEED = [
    { name: 'Smriti Mandhana', initials: 'SM', sport: 'Cricket', league: 'WPL / India', role: 'Batter', age: 28, region: 'PAN India', gender: 'Female', perf: 88, social: 86, verified: true, growth: 'Rising', budget: '₹5–20L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 14, pom: 3, wins: 9, winRate: 64, tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'Harmanpreet Kaur', initials: 'HK', sport: 'Cricket', league: 'WPL / India', role: 'Batter', age: 35, region: 'PAN India', gender: 'Female', perf: 86, social: 84, verified: true, growth: 'Stable', budget: '₹5–20L', team: 'Mumbai Indians', teamShort: 'MI', matches: 14, pom: 2, wins: 10, winRate: 71, tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'Jemimah Rodrigues', initials: 'JR', sport: 'Cricket', league: 'WPL / India', role: 'Batter', age: 24, region: 'PAN India', gender: 'Female', perf: 82, social: 80, verified: true, growth: 'Rising', budget: '₹5–20L', team: 'Delhi Capitals', teamShort: 'DC', matches: 12, pom: 2, wins: 8, winRate: 67, tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'Shafali Verma', initials: 'SV', sport: 'Cricket', league: 'WPL / India', role: 'Batter', age: 21, region: 'PAN India', gender: 'Female', perf: 84, social: 78, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Delhi Capitals', teamShort: 'DC', matches: 12, pom: 2, wins: 7, winRate: 58, tier: 'TIER 1', opportunity: 'Rising Star' },
    { name: 'Deepti Sharma', initials: 'DS', sport: 'Cricket', league: 'WPL / India', role: 'All-rounder', age: 27, region: 'PAN India', gender: 'Female', perf: 83, social: 72, verified: true, growth: 'Stable', budget: '₹5–20L', team: 'UP Warriorz', teamShort: 'UPW', matches: 13, pom: 2, wins: 7, winRate: 54, tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'Richa Ghosh', initials: 'RG', sport: 'Cricket', league: 'WPL / India', role: 'Wicketkeeper', age: 21, region: 'PAN India', gender: 'Female', perf: 79, social: 74, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 12, pom: 1, wins: 8, winRate: 67, tier: 'TIER 2', opportunity: 'Rising Star' },
    { name: 'Amanjot Kaur', initials: 'AK', sport: 'Cricket', league: 'WPL / India', role: 'All-rounder', age: 24, region: 'PAN India', gender: 'Female', perf: 76, social: 68, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Mumbai Indians', teamShort: 'MI', matches: 11, pom: 1, wins: 7, winRate: 64, tier: 'TIER 2', opportunity: 'Value Pick' },
    { name: 'Renuka Singh', initials: 'RS', sport: 'Cricket', league: 'WPL / India', role: 'Bowler', age: 28, region: 'PAN India', gender: 'Female', perf: 78, social: 65, verified: true, growth: 'Stable', budget: '₹1–5L', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', matches: 12, pom: 1, wins: 7, winRate: 58, tier: 'TIER 2', opportunity: 'Value Pick' },
    { name: 'Pooja Vastrakar', initials: 'PV', sport: 'Cricket', league: 'WPL / India', role: 'All-rounder', age: 25, region: 'PAN India', gender: 'Female', perf: 77, social: 66, verified: true, growth: 'Rising', budget: '₹1–5L', team: 'Mumbai Indians', teamShort: 'MI', matches: 11, pom: 1, wins: 7, winRate: 64, tier: 'TIER 2', opportunity: 'Value Pick' },
    { name: 'Yastika Bhatia', initials: 'YB', sport: 'Cricket', league: 'WPL / India', role: 'Wicketkeeper', age: 24, region: 'PAN India', gender: 'Female', perf: 75, social: 67, verified: true, growth: 'Emerging', budget: '₹1–5L', team: 'Mumbai Indians', teamShort: 'MI', matches: 10, pom: 1, wins: 6, winRate: 60, tier: 'TIER 2', opportunity: 'Rising Star' },
    { name: 'Pooja Rani', initials: 'PR', sport: 'Boxing', league: 'National / India', role: 'Boxer', age: 30, region: 'PAN India', gender: 'Female', perf: 80, social: 70, verified: true, growth: 'Stable', budget: '₹1–5L', tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'Mary Kom', initials: 'MK', sport: 'Boxing', league: 'Olympic / India', role: 'Boxer', age: 41, region: 'PAN India', gender: 'Female', perf: 85, social: 88, verified: true, growth: 'Stable', budget: '₹5–20L', tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'Vinesh Phogat', initials: 'VP', sport: 'Athletic (25)', league: 'Olympic / India', role: 'Wrestler', age: 30, region: 'PAN India', gender: 'Female', perf: 84, social: 82, verified: true, growth: 'Rising', budget: '₹5–20L', tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'Mirabai Chanu', initials: 'MC', sport: 'Athletic (25)', league: 'Olympic / India', role: 'Weightlifter', age: 30, region: 'PAN India', gender: 'Female', perf: 86, social: 80, verified: true, growth: 'Stable', budget: '₹5–20L', tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'PV Sindhu', initials: 'PS', sport: 'Badminton', league: 'Olympic / BWF', role: 'Singles', age: 29, region: 'PAN India', gender: 'Female', perf: 90, social: 92, verified: true, growth: 'Stable', budget: '₹20L+', tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'Saina Nehwal', initials: 'SN', sport: 'Badminton', league: 'Olympic / BWF', role: 'Singles', age: 34, region: 'PAN India', gender: 'Female', perf: 82, social: 85, verified: true, growth: 'Stable', budget: '₹5–20L', tier: 'TIER 1', opportunity: 'Brand Anchor' },
    { name: 'Richa Mishra', initials: 'RM', sport: 'Swimming', league: 'National / India', role: 'Swimmer', age: 28, region: 'PAN India', gender: 'Female', perf: 72, social: 60, verified: true, growth: 'Emerging', budget: '₹1–5L', tier: 'TIER 2', opportunity: 'Value Pick' }
  ];

  // Obvious mislabels from Excel import (name ↔ gender)
  var GENDER_FORCE_MALE = {
    'anmolpreet singh': 1, 'anmol malhotra': 1, 'anmoljeet singh': 1,
    'himanshu singh': 1, 'himanshu': 1, 'himanshu narwal': 1, 'himanshu mishra': 1,
    'harmanpreet singh': 1
  };
  var GENDER_FORCE_FEMALE = {
    'pooja rani': 1, 'richa mishra': 1, 'shaili singh': 1, 'swapna barman': 1,
    'deepika': 1, 'deepika soreng': 1, 'rutuja dadaso pisal': 1, 'sakshi rana': 1,
    'sakshi chaudhary': 1, 'sakshi': 1, 'rutuja bhosale': 1, 'manika batra': 1,
    'sreeja akula': 1, 'aditi': 1, 'aditi satish hegde': 1, 'ridhima veerendrakumar': 1,
    'jaismine lamboria': 1, 'lovlina borgohain': 1, 'nikhat zareen': 1,
    'nitu ghanghas': 1, 'saweety boora': 1
  };

  var NAME_ALIASES = {
    'sv samson': 'sanju samson',
    'ss iyer': 'shreyas iyer',
    'rd gaikwad': 'ruturaj gaikwad',
    'ybk jaiswal': 'yashasvi jaiswal',
    'h klaasen': 'heinrich klaasen',
    'ra jadeja': 'ravindra jadeja',
    'sp narine': 'sunil narine',
    'pd salt': 'phil salt',
    'ma starc': 'mitchell starc',
    'th david': 'tim david',
    'rm patidar': 'rajat patidar',
    'jc archer': 'jofra archer',
    'jr hazlewood': 'josh hazlewood',
    'mr marsh': 'mitchell marsh',
    'cv varun': 'varun chakravarthy',
    'k rabada': 'kagiso rabada',
    'jo holder': 'jason holder',
    'nithish kumar reddy': 'nitish kumar reddy',
    'k nithish kumar reddy': 'nitish kumar reddy',
    'abishek porel': 'abhishek porel',
    'b sai sudharsan': 'sai sudharsan',
    'b. sai sudharsan': 'sai sudharsan',
    'shashwat rawat': 'shaswat rawat'
  };

  function normName(n) {
    n = String(n || '').toLowerCase().replace(/\./g, ' ').replace(/\s+/g, ' ').trim();
    return NAME_ALIASES[n] || n;
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }

  function hashCode(str) {
    var h = 0;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function sportCode(sport) {
    var map = {
      Cricket: 'CRI', Boxing: 'BOX', 'Athletic (25)': 'ATH', Football: 'FBL',
      Hockey: 'HOK', Kabaddi: 'KBD', 'Kho Kho': 'KHO', Tennis: 'TEN', TT: 'TTN', Swimming: 'SWM'
    };
    return map[sport] || 'ATH';
  }

  function assignUniqueIdentity(list) {
    var usedKeys = {};
    var usedCodes = {};
    list.forEach(function (a) {
      var sportSlug = slugify(a.sport || 'sport') || 'sport';
      var base = a.profileKey || (sportSlug + '-' + slugify(a.name));
      if (!base || base === sportSlug + '-') base = sportSlug + '-athlete';
      var key = base;
      var n = 2;
      while (usedKeys[key]) {
        key = base + '-' + n;
        n += 1;
      }
      usedKeys[key] = true;
      a.profileKey = key;

      var codeBase = 'ADC-' + sportCode(a.sport) + '-' + String(hashCode(key) % 100000).padStart(5, '0');
      var code = codeBase;
      var c = 2;
      while (usedCodes[code]) {
        code = 'ADC-' + sportCode(a.sport) + '-' + String((hashCode(key + '-' + c) % 100000)).padStart(5, '0');
        c += 1;
      }
      usedCodes[code] = true;
      a.profileCode = code;
    });
  }

  function buildAthleteUniverse() {
    var multi = (global.ADC_MULTISPORT && global.ADC_MULTISPORT.athletes) ? global.ADC_MULTISPORT.athletes.slice() : [];
    var byKey = {};
    multi.forEach(function (a) {
      byKey[a.sport + '|' + normName(a.name)] = a;
      if (a.aliases && a.aliases.length) {
        a.aliases.forEach(function (alias) {
          byKey[a.sport + '|' + normName(alias)] = a;
        });
      }
    });

    IPL_SEED.forEach(function (seed) {
      var key = 'Cricket|' + normName(seed.name);
      var existing = byKey[key];
      if (existing) {
        byKey[key] = Object.assign({}, existing, {
          name: existing.name || seed.name,
          league: existing.league && String(existing.league).indexOf('IPL') !== -1 ? existing.league : (seed.league || existing.league),
          team: seed.team || existing.team,
          teamShort: seed.teamShort || existing.teamShort,
          role: existing.role || seed.role,
          age: existing.age != null ? existing.age : seed.age,
          region: existing.region || seed.region,
          gender: existing.gender || seed.gender,
          perf: Math.max(existing.perf || 0, seed.perf || 0),
          social: Math.max(existing.social || 0, seed.social || 0),
          verified: true,
          growth: existing.growth || seed.growth,
          budget: existing.budget || seed.budget,
          matches: existing.matches != null ? existing.matches : seed.matches,
          pom: existing.pom != null ? existing.pom : seed.pom,
          wins: existing.wins != null ? existing.wins : seed.wins,
          winRate: existing.winRate != null ? existing.winRate : seed.winRate,
          runs: existing.runs != null ? existing.runs : seed.runs,
          wickets: existing.wickets != null ? existing.wickets : seed.wickets,
          batAvg: existing.batAvg != null ? existing.batAvg : seed.batAvg,
          strikeRate: existing.strikeRate != null ? existing.strikeRate : seed.strikeRate,
          highScore: existing.highScore != null ? existing.highScore : seed.highScore,
          economy: existing.economy != null ? existing.economy : seed.economy,
          recentForm: existing.recentForm || seed.recentForm,
          webSource: existing.webSource || seed.webSource,
          events: existing.events || seed.events,
          eventStats: existing.eventStats || seed.eventStats,
          pathwayEvents: existing.pathwayEvents || seed.pathwayEvents,
          profileKey: existing.profileKey,
          profileCode: existing.profileCode,
          tier: existing.tier || 'TIER 1',
          opportunity: existing.opportunity || 'Brand Anchor',
          source: existing.source || 'IPL scoring engine'
        });
      } else {
        byKey[key] = Object.assign({}, seed, {
          tier: 'TIER 1',
          opportunity: 'Brand Anchor',
          source: 'IPL scoring engine',
          sportRaw: 'Cricket'
        });
      }
    });

    WOMEN_SEED.forEach(function (seed) {
      var key = seed.sport + '|' + normName(seed.name);
      var existing = byKey[key];
      if (existing) {
        byKey[key] = Object.assign({}, existing, {
          gender: 'Female',
          verified: true,
          league: existing.league || seed.league,
          role: existing.role || seed.role,
          perf: Math.max(existing.perf || 0, seed.perf || 0),
          social: Math.max(existing.social || 0, seed.social || 0),
          growth: existing.growth || seed.growth,
          budget: existing.budget || seed.budget,
          team: existing.team || seed.team,
          teamShort: existing.teamShort || seed.teamShort,
          tier: existing.tier || seed.tier,
          opportunity: existing.opportunity || seed.opportunity,
          source: existing.source || 'Women athlete seed'
        });
      } else {
        byKey[key] = Object.assign({}, seed, {
          source: 'Women athlete seed',
          sportRaw: seed.sport
        });
      }
    });

    Object.keys(byKey).forEach(function (k) {
      var a = byKey[k];
      var nn = normName(a.name);
      if (GENDER_FORCE_MALE[nn]) a.gender = 'Male';
      else if (GENDER_FORCE_FEMALE[nn]) a.gender = 'Female';
      if (!a.gender) a.gender = 'Male';
    });

    var list = Object.keys(byKey).map(function (k) { return byKey[k]; });
    list.sort(function (a, b) {
      if (a.sport !== b.sport) return String(a.sport).localeCompare(String(b.sport));
      return ((b.perf || 0) + (b.social || 0)) - ((a.perf || 0) + (a.social || 0));
    });

    var sportRank = {};
    list.forEach(function (a, idx) {
      a.id = idx + 1;
      sportRank[a.sport] = (sportRank[a.sport] || 0) + 1;
      a.rank = sportRank[a.sport];
      if (!a.initials) {
        var parts = String(a.name || '').split(/\s+/).filter(Boolean);
        a.initials = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : String(a.name || 'NA').slice(0, 2).toUpperCase();
      }
    });
    assignUniqueIdentity(list);
    return list;
  }

  var ATHLETES = buildAthleteUniverse();

  var STORAGE_KEYS = { shortlist: 'adc_shortlist', athleteProfile: 'adc_athlete_profile', brandProfile: 'adc_brand_profile', requests: 'adc_requests' };

  function normalizeSport(sport) {
    if (!sport) return sport;
    var s = String(sport);
    var map = {
      'Athletics': 'Athletic (25)',
      'Athletic': 'Athletic (25)',
      'Table Tennis': 'TT',
      'TT': 'TT',
      'Volleyball': 'Volley Ball',
      'Volley Ball': 'Volley Ball'
    };
    return map[s] || s;
  }

  function getAthletes(filters) {
    filters = filters || {};

    function fitTier(a) {
      var fit = (a.perf != null && a.social != null) ? (a.perf + a.social) / 20 : 0;
      return fit >= 7 ? 'High' : fit >= 5 ? 'Medium' : 'Low';
    }

    function socialTier(a) {
      return a.social >= 70 ? 'High' : a.social >= 50 ? 'Medium' : 'Low';
    }

    function audienceSizeFromSocial(a) {
      if (a.social >= 75) return 'Mega';
      if (a.social >= 60) return 'Macro';
      if (a.social >= 45) return 'Mid';
      return 'Micro';
    }

    function trendFromGrowth(a) {
      if (a.growth === 'Rising' || a.growth === 'Emerging') return 'Up';
      if (a.growth === 'Stable') return 'Flat';
      return 'Down';
    }

    function availabilityFromMatches(a) {
      if (a.matches == null) return 'Available';
      if (a.matches >= 14) return 'Limited';
      if (a.matches >= 8) return 'Available';
      return 'Booked';
    }

    var wantSport = normalizeSport(filters.sport);

    var list = ATHLETES.filter(function (a) {
      if (wantSport && wantSport !== 'All' && normalizeSport(a.sport) !== wantSport) return false;
      if (filters.role && filters.role !== 'All' && a.role !== filters.role) return false;
      if (filters.team && filters.team !== 'All' && a.team !== filters.team) return false;
      if (filters.ageMin != null && a.age != null && a.age < filters.ageMin) return false;
      if (filters.ageMax != null && a.age != null && a.age > filters.ageMax) return false;
      if (filters.region && filters.region !== 'Any' && filters.region !== '' && (a.region || '').toLowerCase().indexOf((filters.region || '').toLowerCase()) === -1) return false;
      if (filters.targetGeography && filters.targetGeography !== 'Any') {
        var geo = filters.targetGeography;
        if (geo === 'PAN India' && a.region !== 'PAN India' && (a.region || '').indexOf('India') === -1) {
          /* allow regional athletes for pan-india campaigns */
        } else if (geo !== 'PAN India' && geo !== 'Metro Cities') {
          if ((a.region || '').toLowerCase().indexOf(geo.replace(' India', '').toLowerCase()) === -1 && a.region !== 'PAN India') return false;
        }
      }
      if (filters.perfMin != null && a.perf < filters.perfMin) return false;
      if (filters.perfMax != null && a.perf > filters.perfMax) return false;
      if (filters.socialMin != null && a.social < filters.socialMin) return false;
      if (filters.socialMax != null && a.social > filters.socialMax) return false;
      if (filters.verifiedOnly && !a.verified) return false;
      if (filters.gender && filters.gender !== 'All' && (a.gender || '') !== filters.gender) return false;
      if (filters.growth && filters.growth !== 'Any' && a.growth !== filters.growth) return false;
      if (filters.budget && filters.budget !== 'Any' && a.budget !== filters.budget) return false;
      if (filters.competition && filters.competition !== 'Any') {
        var league = (a.league || '').toLowerCase();
        if (filters.competition === 'IPL 2026' && league.indexOf('ipl') === -1) return false;
        if (filters.competition === 'Domestic' && league.indexOf('ipl') !== -1) return false;
      }
      var commercial = filters.commercialValue || filters.commercial;
      if (commercial && commercial !== 'Any' && fitTier(a) !== commercial) return false;
      if (filters.brandMatch && filters.brandMatch !== 'Any' && fitTier(a) !== filters.brandMatch) return false;
      if (filters.engagement && filters.engagement !== 'Any' && socialTier(a) !== filters.engagement) return false;
      if (filters.fanDemand && filters.fanDemand !== 'Any' && socialTier(a) !== filters.fanDemand) return false;
      if (filters.audienceSize && filters.audienceSize !== 'Any' && audienceSizeFromSocial(a) !== filters.audienceSize) return false;
      if (filters.perfTrend && filters.perfTrend !== 'Any' && trendFromGrowth(a) !== filters.perfTrend) return false;
      if (filters.brandSafety && filters.brandSafety !== 'Any') {
        if (filters.brandSafety === 'Clear' && !a.verified) return false;
        if (filters.brandSafety === 'Risk' && a.verified) return false;
      }
      if (filters.availability && filters.availability !== 'Any' && availabilityFromMatches(a) !== filters.availability) return false;
      if (filters.searchQuery) {
        var q = (filters.searchQuery || '').toLowerCase();
        if (!q) return true;
        if (filters.nameOrSportOnly) {
          var nameMatch = (a.name || '').toLowerCase().indexOf(q) !== -1;
          var sportMatch = (a.sport || '').toLowerCase().indexOf(q) !== -1;
          if (!nameMatch && !sportMatch) return false;
        } else {
          var aliasStr = (a.aliases && a.aliases.length) ? (' ' + a.aliases.join(' ')) : '';
          var match = (a.name + ' ' + a.sport + ' ' + a.role + ' ' + a.region + ' ' + a.team + ' ' + a.teamShort + ' ' + a.league + ' ' + (a.profileKey || '') + ' ' + (a.profileCode || '') + aliasStr).toLowerCase().indexOf(q) !== -1;
          if (!match) return false;
        }
      }
      return true;
    });
    list.sort(function (x, y) { return (x.rank || 999) - (y.rank || 999); });
    return list;
  }

  function getSports() {
    var seen = {};
    ATHLETES.forEach(function (a) {
      if (a.sport) seen[a.sport] = true;
    });
    return Object.keys(seen).sort();
  }

  function getTopAthletes(limit) {
    return ATHLETES.slice().sort(function (a, b) { return a.rank - b.rank; }).slice(0, limit || 50);
  }

  function getAthleteById(id) {
    id = parseInt(id, 10);
    return ATHLETES.filter(function (a) { return a.id === id; })[0] || null;
  }

  function getAthleteByProfileKey(key) {
    key = String(key || '').trim();
    if (!key) return null;
    return ATHLETES.filter(function (a) {
      return a.profileKey === key || a.profileCode === key || String(a.id) === key;
    })[0] || null;
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

  function getSponsorshipRequests() {
    try {
      var raw = localStorage.getItem(STORAGE_KEYS.requests);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function setSponsorshipRequests(list) {
    try {
      localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(list));
    } catch (e) {}
  }

  function addSponsorshipRequest(req) {
    var list = getSponsorshipRequests();
    req.id = 'req-' + Date.now();
    req.createdAt = new Date().toISOString();
    if (!req.status) req.status = 'Under review';
    list.unshift(req);
    setSponsorshipRequests(list);
    return req;
  }

  function updateSponsorshipRequestStatus(id, status) {
    var list = getSponsorshipRequests().map(function (r) {
      if (r.id === id) r.status = status;
      return r;
    });
    setSponsorshipRequests(list);
  }

  global.ADC_DATA = {
    getAthletes: getAthletes,
    getTopAthletes: getTopAthletes,
    getAthleteById: getAthleteById,
    getAthleteByProfileKey: getAthleteByProfileKey,
    getSports: getSports,
    getShortlist: getShortlist,
    setShortlist: setShortlist,
    addToShortlist: addToShortlist,
    removeFromShortlist: removeFromShortlist,
    isInShortlist: isInShortlist,
    getSponsorshipRequests: getSponsorshipRequests,
    addSponsorshipRequest: addSponsorshipRequest,
    updateSponsorshipRequestStatus: updateSponsorshipRequestStatus,
    IPL_META: IPL_META,
    MULTISPORT_META: MULTISPORT_META,
    SPORT_EVENTS: global.ADC_SPORT_EVENTS || null,
    ATHLETES: ATHLETES
  };
})(typeof window !== 'undefined' ? window : this);
