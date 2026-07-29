/* Scroll reveal.
   Progressive enhancement: without this file every .u-reveal element is
   visible, because the hidden state is gated behind the .js class that the
   inline script in <head> adds. */
(function () {
  var items = document.querySelectorAll('.u-reveal');
  if (!items.length) return;

  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (noMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  items.forEach(function (el) { observer.observe(el); });
})();
