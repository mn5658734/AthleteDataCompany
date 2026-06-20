/**
 * ADC Interactive Pitch Deck
 */
(function () {
  var viewport = document.getElementById('deck-viewport');
  var pageInfo = document.getElementById('deck-page-info');
  var prevBtn = document.getElementById('deck-prev');
  var nextBtn = document.getElementById('deck-next');
  var printBtn = document.getElementById('deck-print');
  var fsBtn = document.getElementById('deck-fullscreen');

  if (!viewport) return;

  var slides = Array.prototype.slice.call(viewport.querySelectorAll('.slide'));
  var current = 0;
  var charts = {};

  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;
    slides.forEach(function (s, i) {
      s.classList.remove('active', 'exit-left');
      if (i === index) s.classList.add('active');
      else if (i < index) s.classList.add('exit-left');
    });
    current = index;
    if (pageInfo) pageInfo.textContent = (current + 1) + ' / ' + slides.length;
    animateMetrics(slides[current]);
    initChartsForSlide(current);
    history.replaceState(null, '', '#slide-' + (current + 1));
  }

  function next() { showSlide(Math.min(current + 1, slides.length - 1)); }
  function prev() { showSlide(Math.max(current - 1, 0)); }

  function animateMetrics(slide) {
    slide.querySelectorAll('.metric-value').forEach(function (el) {
      el.classList.remove('animate');
      void el.offsetWidth;
      el.classList.add('animate');
    });
  }

  function initChartsForSlide(index) {
    if (typeof Chart === 'undefined') return;
    var slide = slides[index];

    if (index === 3 && !charts.traction) {
      var tractionWrap = slide.querySelector('.diagram-wrap');
      if (tractionWrap && !slide.querySelector('#traction-chart')) {
        tractionWrap.innerHTML = '<canvas id="traction-chart" class="chart-canvas" height="200"></canvas><p class="chart-note">Illustrative growth across tournament windows</p>';
        var ctx = document.getElementById('traction-chart');
        if (ctx) {
          charts.traction = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['IPL', 'BGT', 'CT', 'Now'],
              datasets: [{
                label: 'Beta volume',
                data: [12, 22, 35, 48],
                borderColor: '#00d4aa',
                backgroundColor: 'rgba(0,212,170,0.12)',
                fill: true,
                tension: 0.35,
                pointRadius: 5,
                pointBackgroundColor: '#00d4aa'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Beta transaction volume (illustrative)', color: '#8b9cad', font: { size: 11 } }
              },
              scales: {
                x: { ticks: { color: '#8b9cad' }, grid: { color: '#2a3544' } },
                y: { display: false, grid: { display: false } }
              }
            }
          });
        }
      }
    }

    if (index === 5 && !charts.market) {
      var marketWrap = slide.querySelectorAll('.diagram-wrap')[0];
      if (marketWrap && !slide.querySelector('#market-chart')) {
        marketWrap.innerHTML = '<canvas id="market-chart" class="chart-canvas" height="200"></canvas>';
        var mctx = document.getElementById('market-chart');
        if (mctx) {
          charts.market = new Chart(mctx, {
            type: 'bar',
            data: {
              labels: ['600M+ Fans', '1.5M+ Athletes', '$10B+ Economy', '$2B+ Sponsorship'],
              datasets: [{
                data: [100, 25, 82, 50],
                backgroundColor: ['#00d4aa', '#6c9fff', '#c084fc', '#fbbf24'],
                borderRadius: 4
              }]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Market opportunity (relative scale)', color: '#8b9cad', font: { size: 11 } }
              },
              scales: {
                x: { display: false },
                y: { ticks: { color: '#e6edf3', font: { size: 10 } }, grid: { display: false } }
              }
            }
          });
        }
      }
    }

    if (index === 9 && !charts.funds) {
      var fundsWrap = slide.querySelectorAll('.diagram-wrap')[0];
      if (fundsWrap && !slide.querySelector('#funds-chart')) {
        fundsWrap.innerHTML = '<canvas id="funds-chart" class="chart-canvas" height="225"></canvas>';
        var fctx = document.getElementById('funds-chart');
        if (fctx) {
          charts.funds = new Chart(fctx, {
            type: 'doughnut',
            data: {
              labels: ['Product 30%', 'GTM 40%', 'Ops 30%'],
              datasets: [{
                data: [30, 40, 30],
                backgroundColor: ['#00d4aa', '#6c9fff', '#c084fc'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom', labels: { color: '#8b9cad', font: { size: 11 } } },
                title: { display: true, text: 'Use of Funds · ₹1.5 Cr Seed', color: '#e6edf3', font: { size: 14, weight: '600' } }
              }
            }
          });
        }
      }
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
  if (fsBtn) {
    fsBtn.addEventListener('click', function () {
      document.body.classList.toggle('deck-fullscreen');
      viewport.classList.toggle('fullscreen');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'Home') { e.preventDefault(); showSlide(0); }
    if (e.key === 'End') { e.preventDefault(); showSlide(slides.length - 1); }
    if (e.key === 'p' || e.key === 'P') { window.print(); }
    if (e.key === 'f' || e.key === 'F') {
      document.body.classList.toggle('deck-fullscreen');
      viewport.classList.toggle('fullscreen');
    }
  });

  var hash = window.location.hash.match(/slide-(\d+)/);
  if (hash) showSlide(Math.max(0, Math.min(parseInt(hash[1], 10) - 1, slides.length - 1)));
  else showSlide(0);

  var homeLink = document.getElementById('deck-home-link');
  if (homeLink) {
    homeLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = '/';
    });
  }
})();
