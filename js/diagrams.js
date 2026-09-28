/* Mermaid diagrams in posts.

   Write a ```mermaid fence in Markdown. Kramdown renders it as an ordinary
   code block (code.language-mermaid), so with no JavaScript, and in the RSS
   feed, readers see the diagram source. That is the fallback.

   On a page that has at least one such block, this swaps each block for a
   div.mermaid and loads the self-hosted library (js/mermaid.min.js, fetched
   by scripts/fetch-mermaid.sh). Pages without diagrams load nothing extra.

   Colours and font are read from the tokens in css/tokens.css, so diagrams
   follow the site rather than Mermaid's default theme.

   The prose column is narrow, so diagrams render small. Clicking one (or
   Enter/Space on it) opens it in a near full-screen <dialog>. The SVG is
   moved into the dialog and back again on close rather than cloned, so the
   ids Mermaid uses for arrowhead markers stay unique. Esc, a click anywhere
   or the close button dismisses it; the browser returns focus. */
(function () {
  var blocks = document.querySelectorAll('code.language-mermaid');
  if (!blocks.length) return;

  blocks.forEach(function (block) {
    var fig = document.createElement('div');
    fig.className = 'mermaid';
    fig.textContent = block.textContent;   // decodes &gt; etc. back to -->
    fig.setAttribute('role', 'button');
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('aria-label', 'Diagram. Open larger view');
    fig.addEventListener('click', function () { open(fig); });
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(fig); }
    });
    // Replace the whole Rouge wrapper, not just <code>, so the diagram
    // doesn't sit inside the padded, tinted <pre>.
    (block.closest('.highlighter-rouge') || block.closest('pre') || block).replaceWith(fig);
  });

  var dialog = document.createElement('dialog');
  dialog.className = 'diagram-overlay';
  dialog.setAttribute('aria-label', 'Diagram');
  dialog.innerHTML = '<button type="button" class="diagram-overlay__close" aria-label="Close">&times;</button>';
  document.body.appendChild(dialog);

  var home = null;   // the figure the SVG currently in the dialog came from

  function open(fig) {
    var svg = fig.querySelector('svg');
    if (!svg || !dialog.showModal) return;   // not rendered yet, or no <dialog>
    home = fig;
    dialog.appendChild(svg);
    dialog.showModal();
  }

  dialog.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () {
    var svg = dialog.querySelector('svg');
    if (svg && home) home.appendChild(svg);
    home = null;
  });

  var s = document.createElement('script');
  s.src = '/js/mermaid.min.js';
  s.onload = function () {
    var css = getComputedStyle(document.documentElement);
    var v = function (n) { return css.getPropertyValue(n).trim(); };
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: {
        fontFamily: v('--font-sans'),
        fontSize: '14px',
        primaryColor: v('--c-surface-1'),
        primaryBorderColor: v('--c-ink-muted'),
        primaryTextColor: v('--c-ink'),
        lineColor: v('--c-ink-muted'),
        clusterBkg: v('--c-surface-2'),
        clusterBorder: v('--c-line'),
        edgeLabelBackground: v('--c-surface-1')
      }
    });
    mermaid.run({ querySelector: '.mermaid' });
  };
  document.body.appendChild(s);
})();
