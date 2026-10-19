# LuCI openwrt-25.12 port

This branch targets `coolsnowwolf/lede` with the
`https://github.com/coolsnowwolf/luci.git;openwrt-25.12` feed.
The migration was inspected against LuCI commit
`2189eb728b6d8bbe30b455b989c5ba49b557e5e2`.
It replaces the old Lua dispatcher templates with native ucode templates.
Older Lua-only LuCI versions are not supported by this branch.

## Changes

- Keep the existing stylesheet, fonts, icons, images and page shell.
- Load permission-filtered menus through `ui.menu`, including modes, active
  sidebar items and nested tabs. Bind sidebar handlers by delegation because
  menus are loaded asynchronously.
- Use LuCI's `#indicators` for pending configuration changes and polling state.
- Preserve the standard LuCI login form and the theme's login background.
- Respect `blank_page`, translations, page CSS and the modern `data-page` hook.
- Declare `luci-base` and an architecture-independent package; use the standard
  LuCI package post-install handling rather than a router-only custom script.
- Register the theme without forcing a change to the selected theme.

## Build and select

In a Linux LEDE build tree with the requested LuCI feed installed:

```sh
git clone --branch luci-25.12 https://github.com/zzcsz-de/luci-theme-opentopd.git package/luci-theme-opentopd
make menuconfig # LuCI -> Themes -> luci-theme-opentopd
make package/luci-theme-opentopd/compile V=s
```

Remove any duplicate package with the same name from your build tree first.
After installing the generated package, select **Opentopd** under
**System -> System -> Language and Style**. To revert, select Bootstrap there.

## Verification

```sh
node --check htdocs/luci-static/opentopd/js/script.js
node --check htdocs/luci-static/resources/menu-opentopd.js
node tests/menu.test.cjs
sh -n root/etc/uci-defaults/30_luci-theme-opentopd
git diff --check
```

The GitHub workflow builds a native ucode compiler, compiles both templates,
and separately builds the actual LEDE package target with distro host tools and
`NO_DEPS=1`. This is an architecture-independent package smoke build: runtime
dependencies are declared but not cross-compiled, and no firmware image is built.
Template compilation
uses a host-only `luci.core` stub; it does not prove router module availability
or authentication behavior. LEDE and ucode commit hashes are printed in CI logs.

Before merging, test on a router or disposable VM: login/logout, desktop/mobile
sidebar, nested interface tabs, pending changes, save/apply/revert, polling,
package management, and an installed legacy Lua application if used.
No router or browser integration test has been performed yet; compilation alone
does not establish complete visual or runtime compatibility.
