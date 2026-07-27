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
  var downloadBtn = document.getElementById('deck-download');
  var fsBtn = document.getElementById('deck-fullscreen');

  if (!viewport) return;

  var slides = Array.prototype.slice.call(viewport.querySelectorAll('.slide:not(.slide-hidden)'));
  var current = 0;
  var isExporting = false;

  var PDF_WIDTH = 1280;
  var PDF_HEIGHT = 720;
  var HTML2CANVAS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  var JSPDF_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

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

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute('data-loaded') === 'true') resolve();
        else existing.addEventListener('load', resolve, { once: true });
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = function () {
        script.setAttribute('data-loaded', 'true');
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function setDownloadLoading(loading) {
    if (!downloadBtn) return;
    downloadBtn.classList.toggle('is-loading', loading);
    downloadBtn.disabled = loading;
    downloadBtn.setAttribute('aria-busy', loading ? 'true' : 'false');
  }

  async function downloadDeckPdf() {
    if (isExporting) return;
    isExporting = true;
    setDownloadLoading(true);

    var savedIndex = current;
    document.body.classList.add('deck-exporting');
    viewport.classList.add('deck-export-capture');

    try {
      await loadScript(HTML2CANVAS_SRC);
      await loadScript(JSPDF_SRC);

      var jsPDF = window.jspdf.jsPDF;
      var pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [PDF_WIDTH, PDF_HEIGHT],
        compress: true
      });

      for (var i = 0; i < slides.length; i++) {
        showSlide(i);
        await wait(80);

        var canvas = await window.html2canvas(slides[i], {
          backgroundColor: '#0a0e14',
          scale: 2,
          useCORS: true,
          logging: false,
          width: PDF_WIDTH,
          height: PDF_HEIGHT,
          windowWidth: PDF_WIDTH,
          windowHeight: PDF_HEIGHT
        });

        var imgData = canvas.toDataURL('image/jpeg', 0.92);
        if (i > 0) pdf.addPage([PDF_WIDTH, PDF_HEIGHT], 'landscape');
        pdf.addImage(imgData, 'JPEG', 0, 0, PDF_WIDTH, PDF_HEIGHT);
      }

      pdf.save('ADC-Pitch-Deck.pdf');
      showSlide(savedIndex);
    } catch (err) {
      console.error('PDF download failed:', err);
      window.alert('Could not generate the PDF. Please try again in a moment.');
      showSlide(savedIndex);
    } finally {
      viewport.classList.remove('deck-export-capture');
      document.body.classList.remove('deck-exporting');
      setDownloadLoading(false);
      isExporting = false;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (downloadBtn) downloadBtn.addEventListener('click', downloadDeckPdf);
  if (fsBtn) {
    fsBtn.addEventListener('click', function () {
      document.body.classList.toggle('deck-fullscreen');
      viewport.classList.toggle('fullscreen');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (isExporting) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'Home') { e.preventDefault(); showSlide(0); }
    if (e.key === 'End') { e.preventDefault(); showSlide(slides.length - 1); }
    if (e.key === 'd' || e.key === 'D') { e.preventDefault(); downloadDeckPdf(); }
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
