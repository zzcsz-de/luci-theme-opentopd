'use strict';
'require baseclass';
'require ui';

// Based on LuCI's menu-bootstrap.js (The LuCI Team, Apache-2.0).
return baseclass.extend({
 __init__() {
  ui.menu.load().then(tree => this.render(tree)).catch(e => console.error('menu-opentopd: failed to load menu', e));
 },

 render(tree) {
  const modes = ui.menu.getChildren(tree);
  const mode = modes.find(child => child.name === L.env.requestpath[0]) || modes[0];
  const modemenu = document.querySelector('#modemenu');
  const topmenu = document.querySelector('#topmenu');
  if (!mode || !topmenu || !modemenu)
   return;

  modes.forEach(child => modemenu.appendChild(E('li', {
   'class': child === mode ? 'active' : ''
  }, [E('a', { 'href': L.url(child.name) }, [_(child.title)])])));
  modemenu.style.display = modes.length > 1 ? '' : 'none';

  ui.menu.getChildren(mode).forEach(child => {
   const children = ui.menu.getChildren(child);
   const active = L.env.dispatchpath[1] === child.name;
   const li = E('li', { 'class': 'slide' });
   li.appendChild(E('a', {
    'class': 'menu' + (active ? ' active' : '') + (children.length ? '' : ' exit'),
    'data-title': child.title.replace(/ /g, '_'),
    'href': children.length ? '#' : L.url(mode.name, child.name)
   }, [_(child.title)]));
   if (children.length) {
    const submenu = E('ul', {
     'class': 'slide-menu' + (active ? ' active' : ''),
     'style': active ? 'display:block' : 'display:none'
    });
    children.forEach(sub => submenu.appendChild(E('li', {
     'class': active && L.env.dispatchpath[2] === sub.name ? 'active' : ''
    }, [E('a', {
     'data-title': _(sub.title),
     'href': L.url(mode.name, child.name, sub.name)
    }, [_(sub.title)])])));
    li.appendChild(submenu);
   }
   topmenu.appendChild(li);
  });

  let node = tree;
  const path = L.env.dispatchpath;
  for (let i = 0; i < 3 && node; i++)
   node = node.children && node.children[path[i]];
  if (node)
   this.renderTabs(node, path.slice(0, 3).join('/'), 3);
 },

 renderTabs(tree, url, depth) {
  const children = ui.menu.getChildren(tree);
  const container = document.querySelector('#tabmenu');
  if (!children.length || !container)
   return;
  const ul = E('ul', { 'class': 'tabs' });
  let selected;
  children.forEach(child => {
   const active = L.env.dispatchpath[depth] === child.name;
   ul.appendChild(E('li', {
    'class': 'tabmenu-item-' + child.name + (active ? ' active' : '')
   }, [E('a', { 'href': L.url(url, child.name) }, [_(child.title)])]));
   if (active)
    selected = child;
  });
  container.appendChild(ul);
  container.style.display = '';
  if (selected)
   this.renderTabs(selected, url + '/' + selected.name, depth + 1);
 }
});
