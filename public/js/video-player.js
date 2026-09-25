/*
 * Click-to-load, privacy-enhanced YouTube player for the ProofWipe how-to video
 * (markup: src/components/VideoWalkthrough.astro). Static self-hosted file so it
 * runs under the strict CSP (no inline scripts). Nothing is requested from
 * YouTube until the visitor presses play or picks a chapter; then a
 * youtube-nocookie.com iframe is created (the only frame-src the CSP allows).
 */
(function () {
  function mount(root, t) {
    var frame = root.querySelector('.pw-frame');
    if (!frame) return;
    var src = 'https://www.youtube-nocookie.com/embed/' + root.getAttribute('data-yt') +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1&start=' + Math.max(0, Math.floor(t));
    var iframe = frame.querySelector('iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.title = root.getAttribute('data-yt-title') || 'Video';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.setAttribute('allowfullscreen', '');
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.replaceChildren(iframe);
      frame.classList.add('is-playing');
    }
    iframe.src = src;
    iframe.focus();
    root.querySelectorAll('[data-yt-seek]').forEach(function (b) {
      b.toggleAttribute('aria-current', Number(b.getAttribute('data-yt-seek')) === t);
    });
  }
  function init() {
    document.querySelectorAll('.pw-video').forEach(function (root) {
      if (root.hasAttribute('data-yt-bound')) return;   // safe if the script is included twice
      root.setAttribute('data-yt-bound', '');
      var play = root.querySelector('[data-yt-play]');
      if (play) play.addEventListener('click', function () { mount(root, Number(root.getAttribute('data-yt-start') || 0)); });
      root.querySelectorAll('[data-yt-seek]').forEach(function (b) {
        b.addEventListener('click', function () {
          mount(root, Number(b.getAttribute('data-yt-seek')));
          var f = root.querySelector('.pw-frame');
          if (f) f.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
