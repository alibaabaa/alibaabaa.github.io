/* Cycling word in the fold headline.

   Progressive enhancement, same contract as reveal.js: the markup already
   shows the first word, so everything here is optional. If this file never
   runs, or the browser prefers reduced motion, the headline is static and
   correct.

   Three things happen per swap, in this order:
   1. The outgoing word flickers twice, 300ms.
   2. It slides up and out while the incoming word slides up into place, and a
      hairline wipes across underneath.
   3. The span's width transitions to the new word's measured width, so the
      full stop after it moves with the word rather than the shorter word
      leaving a gap.

   It idles when the tab is in the background or the headline has scrolled
   away, because there is no reason to animate something nobody is looking at.
   */
(function () {
  var HOLD = 5000;   /* time a word stays put */
  var LEAD = 3600;   /* first swap, after the page entrance has settled */
  var BLINK = 300;   /* .cycle__word.is-flicker duration */
  var EXIT = 460;    /* .cycle__word transition duration, plus a little */

  var roots = Array.prototype.slice.call(document.querySelectorAll('[data-cycle]'));
  if (!roots.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  roots.forEach(function (root) {
    var words = Array.prototype.slice.call(root.querySelectorAll('.cycle__word'));
    if (words.length < 2) return;

    var index = Math.max(0, words.indexOf(root.querySelector('.cycle__word.is-active')));
    var widths = [];
    var timer = null;
    var visible = true;

    /* Measure once per layout. getBoundingClientRect keeps the subpixel, which
       matters: rounding up puts a visible sliver of space before the full
       stop. Safe to read while a width is already applied — every word is
       nowrap, so each reports its own text width whatever the box is doing. */
    function measure() {
      widths = words.map(function (w) { return w.getBoundingClientRect().width; });
      apply();
    }
    function apply() {
      if (widths[index]) root.style.setProperty('--cycle-w', widths[index].toFixed(2) + 'px');
    }

    function swap() {
      var out = words[index];
      index = (index + 1) % words.length;
      var into = words[index];

      out.classList.add('is-flicker');

      window.setTimeout(function () {
        out.classList.remove('is-flicker', 'is-active');
        out.classList.add('is-leaving');
        into.classList.add('is-active');
        root.classList.add('is-swapping');
        apply();

        /* Return the spent word to the incoming position without animating it
           back down through the headline. */
        window.setTimeout(function () {
          out.classList.add('is-reset');
          out.classList.remove('is-leaving');
          void out.offsetWidth;
          out.classList.remove('is-reset');
          root.classList.remove('is-swapping');
        }, EXIT);
      }, BLINK);
    }

    function tick() { if (visible) swap(); timer = window.setTimeout(tick, HOLD); }
    function start() { if (timer === null) timer = window.setTimeout(tick, LEAD); }
    function stop() { window.clearTimeout(timer); timer = null; }

    measure();

    /* Webfonts land after first paint and change the measurement. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);

    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { start(); } else { stop(); }
        });
      }, { threshold: 0 }).observe(root);
    } else {
      start();
    }
  });
})();
