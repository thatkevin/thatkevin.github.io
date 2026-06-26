(function () {
  'use strict';

  var prose = document.getElementById('gallery-prose');
  if (!prose) return;

  var visibleFigures = [];

  // Replace image paragraphs with gallery figures
  var paragraphs = Array.from(prose.querySelectorAll('p'));

  paragraphs.forEach(function (p) {
    var img = p.querySelector('img');
    if (!img) return;

    var em = p.querySelector('em');
    var captionHTML = em ? em.innerHTML : null;

    var figure = document.createElement('figure');
    figure.className = 'gallery-figure';

    figure.appendChild(img);

    if (captionHTML) {
      var figcap = document.createElement('figcaption');
      figcap.className = 'gallery-caption';
      figcap.innerHTML = captionHTML;
      figure.appendChild(figcap);
    }

    p.parentNode.replaceChild(figure, p);
  });

  // Progress bar
  var progressBar = document.getElementById('gallery-progress');

  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrollTop / total) * 100 : 0) + '%';
  }

  // Parallax — runs after reveal animation completes
  function applyParallax() {
    for (var i = 0; i < visibleFigures.length; i++) {
      var figure = visibleFigures[i];
      if (!figure.classList.contains('parallax-ready')) continue;
      var img = figure.querySelector('img');
      if (!img) continue;
      var rect = figure.getBoundingClientRect();
      var progress = ((rect.top + rect.height / 2) - window.innerHeight / 2) / window.innerHeight;
      img.style.transform = 'translateY(' + (progress * 28) + 'px)';
    }
  }

  // Intersection observer — triggers reveal
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var figure = entry.target;
      figure.classList.add('is-visible');
      visibleFigures.push(figure);
      observer.unobserve(figure);

      // Hand off to JS parallax after CSS transition finishes
      setTimeout(function () {
        figure.classList.add('parallax-ready');
      }, 1150);
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -4% 0px'
  });

  document.querySelectorAll('.gallery-figure').forEach(function (fig) {
    observer.observe(fig);
  });

  window.addEventListener('scroll', function () {
    updateProgress();
    applyParallax();
  }, { passive: true });

  updateProgress();
}());
