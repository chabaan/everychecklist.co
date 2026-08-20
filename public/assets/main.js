// EveryChecklist — lightweight, dependency-free interactions
document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Hero ticking checklist (signature element)
  var rows = document.querySelectorAll('.tick-row');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rows.length) {
    if (reduceMotion) {
      rows.forEach(function (r) { r.classList.add('done'); });
    } else {
      rows.forEach(function (row, i) {
        setTimeout(function () { row.classList.add('done'); }, 500 + i * 550);
      });
    }
  }

  // Print / save-as-PDF buttons
  document.querySelectorAll('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });
});
