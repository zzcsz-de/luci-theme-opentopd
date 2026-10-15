/* Experimental opentopd menu. Apache-2.0.
 * Based on LuCI Bootstrap menu and opentopd's sidebar structure.
 */
'use strict';
'require baseclass';
'require ui';

return baseclass.extend({
 __init__: function() {
  return ui.menu.load().then(L.bind(function(tree) {
   this.render(tree);
   this.bindSidebar();
  }, this)).catch(function(err) {
   console.error('opentopd: menu initialization failed', err);
   ui.addNotification(null, E('p', {}, [ _('Unable to initialize the navigation menu.') ]), 'error');
  });
 },
 render: function(tree) {
  var modes = ui.menu.getChildren(tree);
  var modeList = document.querySelector('#modemenu');
  var path = L.env.dispatchpath || [];
  var request = L.env.requestpath || [];
  var selected = request[0] || path[0] || (modes[0] && modes[0].name);
  modes.forEach(L.bind(function(mode) {
   if (modeList) modeList.appendChild(E('li', { 'class': mode.name === selected ? 'active' : '' }, [
    E('a', { 'href': L.url(mode.name) }, [ _(mode.title) ])
   ]));
   if (mode.name === selected) this.renderMainMenu(mode, mode.name);
  }, this));
  if (modeList && modes.length > 1) modeList.style.display = '';
  var node = tree, parts = [];
  for (var i = 0; i < 3 && node; i++) {
   node = node.children && node.children[path[i]];
   if (node) parts.push(path[i]);
  }
  if (node && parts.length === 3) this.renderTabs(node, parts.join('/'), 3);
 },
 renderMainMenu: function(tree, root) {
  var container = document.querySelector('#topmenu');
  var path = L.env.dispatchpath || [];
  if (!container) return;
  ui.menu.getChildren(tree).forEach(function(group) {
   var children = ui.menu.getChildren(group);
   var active = path[1] === group.name;
   var li = E('li', { 'class': 'slide' });
   var link = E('a', {
    'class': 'menu' + (active ? ' active' : '') + (!children.length ? ' exit' : ''),
    'href': children.length ? '#' : L.url(root, group.name)
   }, [ _(group.title) ]);
   li.appendChild(link);
   if (children.length) {
    var sub = E('ul', { 'class': 'slide-menu' + (active ? ' active' : '') });
    link.setAttribute('aria-expanded', String(active));
    children.forEach(function(child) {
     sub.appendChild(E('li', { 'class': active && path[2] === child.name ? 'active' : '' }, [
      E('a', { 'href': L.url(root, group.name, child.name) }, [ _(child.title) ])
     ]));
    });
    link.addEventListener('click', function(ev) {
     ev.preventDefault();
     var open = !sub.classList.contains('active');
     container.querySelectorAll('.slide-menu').forEach(function(el) { el.classList.remove('active'); });
     container.querySelectorAll('a.menu').forEach(function(el) {
      el.classList.remove('active');
      if (el.hasAttribute('aria-expanded')) el.setAttribute('aria-expanded', 'false');
     });
     sub.classList.toggle('active', open);
     link.classList.toggle('active', open);
     link.setAttribute('aria-expanded', String(open));
    });
    li.appendChild(sub);
   }
   container.appendChild(li);
  });
 },
 renderTabs: function(tree, url, depth) {
  var container = document.querySelector('#tabmenu');
  var children = ui.menu.getChildren(tree);
  var path = L.env.dispatchpath || [];
  var selected = null;
  if (!container || !children.length) return;
  var ul = E('ul', { 'class': 'tabs' });
  children.forEach(function(child) {
   var active = path[depth] === child.name;
   ul.appendChild(E('li', { 'class': 'tabmenu-item-' + child.name + (active ? ' active' : '') }, [
    E('a', { 'href': L.url(url, child.name) }, [ _(child.title) ])
   ]));
   if (active) selected = child;
  });
  container.appendChild(ul);
  container.style.display = '';
  if (selected) this.renderTabs(selected, url + '/' + selected.name, depth + 1);
 },
 bindSidebar: function() {
  var button = document.querySelector('.showSide');
  var sidebar = document.querySelector('.main-left');
  var mask = document.querySelector('.darkMask');
  if (!button || !sidebar || !mask) return;
  var open = false;
  function setOpen(value) {
   open = value;
   sidebar.style.width = value ? '15rem' : '';
   mask.style.display = value ? 'block' : 'none';
   button.setAttribute('aria-expanded', String(value));
  }
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', function(ev) { ev.preventDefault(); setOpen(!open); });
  mask.addEventListener('click', function() { setOpen(false); });
  window.addEventListener('resize', function() { if (window.innerWidth > 921) setOpen(false); });
 }
});
