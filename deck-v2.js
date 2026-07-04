/**
 * ADC Interactive Pitch Deck — V2
 * Rebuilt narrative per Investment Committee feedback.
 * Navigation is decoupled from slide count / order (no hardcoded indices).
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

  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;
    slides.forEach(function (s, i) {
      s.classList.remove('active', 'exit-left');
      if (i === index) s.classList.add('active');
      else if (i < index) s.classList.add('exit-left');
    });
    current = index;
    if (pageInfo) pageInfo.textContent = (current + 1) + ' / ' + slides.length;
    history.replaceState(null, '', '#slide-' + (current + 1));
  }

  function next() { showSlide(Math.min(current + 1, slides.length - 1)); }
  function prev() { showSlide(Math.max(current - 1, 0)); }

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
