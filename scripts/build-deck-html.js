const fs = require('fs');
const review = fs.readFileSync('deck-review.html', 'utf8');
const slidesMatch = review.match(/<!-- Slide 1[\s\S]*/);
if (!slidesMatch) {
  console.error('Could not extract slides');
  process.exit(1);
}
const slides = slidesMatch[0]
  .replace('</body>', '')
  .replace('</html>', '')
  .replace('class="slide slide-title"', 'class="slide slide-title active"');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ADC Pitch Deck — Athlete Data Company</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="deck.css" />
</head>
<body>
<div class="deck-app">
  <header class="deck-toolbar">
    <div class="deck-toolbar-left">
      <a href="/" class="deck-home-link">← Home</a>
    </div>
    <div class="deck-toolbar-center">
      <button type="button" class="deck-btn deck-btn-icon" id="deck-prev" aria-label="Previous">←</button>
      <span class="deck-page-info" id="deck-page-info">1 / 11</span>
      <button type="button" class="deck-btn deck-btn-icon" id="deck-next" aria-label="Next">→</button>
    </div>
    <div class="deck-toolbar-right">
      <a href="ADC-Pitch-Deck-Review.pdf" class="deck-btn" target="_blank" rel="noopener">PDF</a>
      <button type="button" class="deck-btn" id="deck-print">Print</button>
      <button type="button" class="deck-btn" id="deck-fullscreen">Fullscreen</button>
    </div>
  </header>
  <div class="deck-stage">
    <div class="deck-viewport" id="deck-viewport">
${slides}
    </div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script src="deck.js"></script>
</body>
</html>`;

fs.writeFileSync('deck.html', html);
console.log('deck.html written');
