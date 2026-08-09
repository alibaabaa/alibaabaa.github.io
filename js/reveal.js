/* Scroll reveal.
   Progressive enhancement: without this file every .u-reveal element is
   visible, because the hidden state is gated behind the .js class that the
   inline script in <head> adds.

   Three guarantees, in order of how much we trust them:
   1. IntersectionObserver reveals a block as soon as its top edge crosses the
      viewport. threshold:0 matters — a block taller than the viewport can
      never satisfy a percentage threshold, which is how a section could sit
      half on screen and stay blank.
   2. A short timer reveals anything still hidden. Covers the case where the
      observer never fires because the page is short enough that nothing
      scrolls, and any future layout that puts a reveal somewhere unexpected.
   3. Reduced motion and missing IntersectionObserver reveal everything up
      front, as before. */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.u-reveal'));
  if (!items.length) return;

  function show(el) { el.classList.add('is-visible'); }
  function showAll() { items.forEach(show); }

  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (noMotion || !('IntersectionObserver' in window)) { showAll(); return; }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });

  items.forEach(function (el) { observer.observe(el); });

  /* Failsafe. Nothing on this site is important enough to stay invisible
     because an animation did not fire. */
  window.setTimeout(showAll, 2500);
})();
