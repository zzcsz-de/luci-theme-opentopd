/* Apache-2.0. Keep LuCI widget handlers authoritative. */
(function() {
 'use strict';
 var script = document.currentScript;
 var base = new URL('../', script.src);
 var titles = { status: 'Status', system: 'System', services: 'Services', nas: 'NAS', network: 'Network', vpn: 'VPN', control: 'Control', docker: 'Docker', statistics: 'Statistics', bandwidth: 'Bandwidth_Monitor', nlbw: 'Bandwidth_Monitor', istore: 'iStore', store: 'iStore', logout: 'Logout' };
 var entryKey = 'opentopd:interface-entry:v1';
 function isInterfacePath(path) { return /\/admin\/network\/network\/?$/.test(path); }
 document.addEventListener('click', function(ev) {
  if (ev.defaultPrevented || ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
  var link = ev.target instanceof Element ? ev.target.closest('#topmenu .slide-menu a') : null;
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  var url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !isInterfacePath(url.pathname)) return;
  try { sessionStorage.setItem(entryKey, JSON.stringify({ path: url.pathname, time: Date.now() })); } catch (err) { console.warn('opentopd: unable to record interface entry', err); }
 });
 function resetInterfaceTabOnce() {
  var entry;
  try { entry = JSON.parse(sessionStorage.getItem(entryKey)); sessionStorage.removeItem(entryKey); } catch (err) { return; }
  if (!entry || entry.path !== location.pathname || !isInterfacePath(location.pathname) || Date.now() - entry.time > 30000 || Date.now() < entry.time) return;
  var root = document.querySelector('#maincontent');
  if (!root) return;
  var observer, timeout;
  function stop() { if (observer) observer.disconnect(); clearTimeout(timeout); root.removeEventListener('pointerdown', cancel, true); root.removeEventListener('keydown', cancel, true); }
  function cancel(ev) { if (ev.isTrusted) stop(); }
  function select() {
   var pane = root.querySelector('[data-tab][data-tab-title]');
   if (!pane) return;
   var group = pane.parentElement;
   var menu = Array.prototype.find.call(group.children, function(el) { return el.matches('ul.cbi-tabmenu'); });
   var first = menu && menu.querySelector('li a');
   if (!first) return;
   stop();
   /* Use the original tab handler to synchronize panes, state and highlights. */
   if (pane.getAttribute('data-tab-active') !== 'true') first.click();
  }
  observer = new MutationObserver(select);
  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-tab-active'] });
  root.addEventListener('pointerdown', cancel, true);
  root.addEventListener('keydown', cancel, true);
  timeout = setTimeout(stop, 15000);
  select();
 }
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
  resetInterfaceTabOnce();
  update();
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true });
 }
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
 else start();
})();
