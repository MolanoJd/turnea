(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: glass on scroll
  var top = document.querySelector('.top');
  function onScroll() { if (top) top.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu closes on link tap
  document.querySelectorAll('.mnav nav a').forEach(function (a) {
    a.addEventListener('click', function () { a.closest('details').removeAttribute('open'); });
  });

  // Scroll reveal with stagger
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Spotlight on bento cards
  document.querySelectorAll('.bx').forEach(function (card) {
    card.addEventListener('pointermove', function (ev) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--x', (ev.clientX - r.left) + 'px');
      card.style.setProperty('--y', (ev.clientY - r.top) + 'px');
    });
  });

  // Phone tilt follows pointer (desktop only)
  var mock = document.querySelector('.mock');
  var tilt = document.querySelector('.tilt');
  if (mock && tilt && !reduce && window.matchMedia('(hover: hover) and (min-width: 981px)').matches) {
    var hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', function (ev) {
      var r = mock.getBoundingClientRect();
      var dx = (ev.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
      tilt.style.setProperty('--ry', (-10 + dx * 12).toFixed(2) + 'deg');
      tilt.style.setProperty('--rx', (5 - dy * 10).toFixed(2) + 'deg');
    });
    hero.addEventListener('pointerleave', function () {
      tilt.style.removeProperty('--ry');
      tilt.style.removeProperty('--rx');
    });
  }

  // Audience tabs
  var seg = document.querySelector('.seg');
  if (seg) {
    var tabs = seg.querySelectorAll('[role="tab"]');
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on) { panel.classList.remove('enter'); void panel.offsetWidth; panel.classList.add('enter'); }
      });
      seg.setAttribute('data-active', tab.getAttribute('data-key'));
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
        }
      });
    });
    // Deep links: #trabajadores / #empresas pick the right tab
    function fromHash() {
      var h = location.hash.replace('#', '');
      tabs.forEach(function (t) { if (t.getAttribute('data-key') === h) select(t); });
    }
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  // FAQ accordion
  document.querySelectorAll('.qa button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var qa = btn.closest('.qa');
      var open = !qa.classList.contains('open');
      qa.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();
