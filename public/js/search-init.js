/*
  Pagefind search initialiser. Served as a static self-hosted file so it loads
  under the strict CSP (script-src 'self') with no inline script. Runs after
  /pagefind/pagefind-ui.js has defined window.PagefindUI.
*/
(function () {
  function initPagefind() {
    var PF = window.PagefindUI;
    if (!PF) return; // /pagefind/ is generated at build; absent in dev
    document.querySelectorAll('[data-pagefind-search]').forEach(function (node) {
      if (node.dataset.pfInit) return;
      node.dataset.pfInit = '1';
      new PF({
        element: node,
        showImages: false,
        showSubResults: true,
        resetStyles: false,
        pageSize: 5,
      });
    });
  }
  if (document.readyState !== 'loading') initPagefind();
  else document.addEventListener('DOMContentLoaded', initPagefind);
})();
