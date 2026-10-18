// Host smoke test: exercise template execution with a minimal LuCI environment.
const header = loadfile('ucode/template/themes/opentopd/header.ut', { raw_mode: false });
const footer = loadfile('ucode/template/themes/opentopd/footer.ut', { raw_mode: false });
const scope = proto({
 media: '/luci-static/opentopd', resource: '/luci-static/resources',
 ubus: { call: () => ({ hostname: 'test-router', rootfs_type: 'initramfs' }) },
 http: { prepare_content: () => null },
 dispatcher: { lang: 'en', build_url: (...parts) => '/cgi-bin/luci/' + join('/', parts), lookup: () => true },
 ctx: { authsession: 'test', request_path: ['admin', 'status', 'overview'] },
 node: { title: 'Overview' }, blank_page: false,
 version: { luciname: 'LuCI', luciversion: 'test', distname: 'LEDE', distversion: 'test' },
 _: s => s, striptags: s => s,
 entityencode: s => replace(s, /[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}, global);
function check(condition, message) { if (!condition) die(message); }
let output = render(() => { call(header, null, scope); call(footer, null, scope); });
check(index(output, 'id="topmenu"') >= 0, 'Missing sidebar');
check(index(output, 'id="indicators"') >= 0, 'Missing LuCI indicators');
check(index(output, 'recovery (initramfs)') >= 0, 'Missing recovery warning');
check(index(output, '/img/bg1.jpg') >= 0, 'Missing fallback background');
check(index(output, 'data-page="admin-status-overview"') >= 0, 'Missing page hook');
check(index(output, '<%') < 0, 'Legacy Lua syntax leaked into rendered output');
scope.ctx.authsession = null;
output = render(() => call(header, null, scope));
check(index(output, 'node-main-login') >= 0, 'Missing login styling');
scope.blank_page = true;
output = render(() => { call(header, null, scope); call(footer, null, scope); });
check(index(output, 'id="topmenu"') < 0, 'Blank pages must not render a sidebar');
check(index(output, "L.require('menu-opentopd')") < 0, 'Blank pages must not load menus');
print('Template execution: authenticated, login, blank page and recovery cases passed\n');
