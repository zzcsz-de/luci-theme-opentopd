const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function element(tag, attrs = {}, children = []) {
 return { tag, attrs, children, style: {}, appendChild(child) { this.children.push(child); } };
}
const containers = Object.fromEntries(['topmenu', 'tabmenu', 'modemenu'].map(id => [id, element('div')]));
const context = {
 baseclass: { extend: obj => obj },
 ui: { menu: { getChildren: tree => Object.entries(tree.children || {})
  .filter(([, child]) => !child.hidden).map(([name, child]) => ({ ...child, name })) } },
 L: { env: { requestpath: ['admin', 'network', 'network', 'wan'], dispatchpath: ['admin', 'network', 'network', 'wan', 'advanced'] },
  url: (...parts) => '/cgi-bin/luci/' + parts.join('/') },
 document: { querySelector: selector => containers[selector.slice(1)] },
 E: element, _: s => s
};
const moduleSource = fs.readFileSync('htdocs/luci-static/resources/menu-opentopd.js', 'utf8');
const menu = vm.runInNewContext('(function(){' + moduleSource + '})()', context);
const tree = { children: {
 admin: { title: 'Administration', children: {
  network: { title: 'Network', children: {
   network: { title: 'Interfaces', children: {
    wan: { title: 'WAN', children: { advanced: { title: 'Advanced' } } }
   } }
  } },
  logout: { title: 'Logout' }, secret: { title: 'Hidden', hidden: true }
 } },
 other: { title: 'Other mode' }
} };
menu.render(tree);
assert.equal(containers.topmenu.children.length, 2);
assert.equal(containers.topmenu.children[0].children[0].attrs.class, 'menu active');
assert.equal(containers.topmenu.children[0].children[1].children[0].children[0].attrs.href, '/cgi-bin/luci/admin/network/network');
assert.equal(containers.topmenu.children[1].children[0].attrs.class, 'menu exit');
assert.equal(containers.tabmenu.children.length, 2);
assert.equal(containers.tabmenu.children[1].children[0].attrs.class, 'tabmenu-item-advanced active');
assert.equal(containers.modemenu.style.display, '');
// An unauthenticated/empty menu must render without dereferencing missing children.
menu.render({});
context.L.env.dispatchpath = ['admin', 'missing'];
menu.render(tree);
console.log('Menu: nested tabs, active path, modes, direct links and empty tree passed');
