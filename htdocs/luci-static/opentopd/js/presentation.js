/* Apache-2.0. Presentation only: do not replace LuCI widget handlers. */
(function() {
 'use strict';
 var script = document.currentScript;
 var base = new URL('../', script.src);
 var titles = { status: 'Status', system: 'System', services: 'Services', nas: 'NAS', network: 'Network', vpn: 'VPN', control: 'Control', docker: 'Docker', statistics: 'Statistics', bandwidth: 'Bandwidth_Monitor', nlbw: 'Bandwidth_Monitor', istore: 'iStore', store: 'iStore', logout: 'Logout' };
 function repairImage(img) {
  if (!img.closest('#maincontent') || !img.closest('.ifacebadge') || img.dataset.opentopdFallback) return;
  img.dataset.opentopdFallback = 'true';
  img.src = new URL('icons/interface.svg', base).href;
 }
 document.addEventListener('error', function(ev) {
  if (ev.target instanceof HTMLImageElement) repairImage(ev.target);
 }, true);
 function update() {
  document.querySelectorAll('#topmenu > li.slide > a.menu').forEach(function(link) {
   var child = link.parentElement.querySelector('.slide-menu a');
   var href = child ? child.href : link.href;
   var parts = new URL(href, location.href).pathname.split('/');
   var admin = parts.lastIndexOf('admin');
   var key = admin >= 0 ? parts[admin + 1] : '';
   if (titles[key] && link.getAttribute('data-title') !== titles[key]) link.setAttribute('data-title', titles[key]);
  });
  document.querySelectorAll('#maincontent .ifacebadge img').forEach(function(img) {
   if (img.complete && img.naturalWidth === 0) repairImage(img);
  });
 }
 function start() {
  update();
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true });
 }
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
 else start();
})();
