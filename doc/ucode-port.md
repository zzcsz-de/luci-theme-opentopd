# Experimental modern LuCI port

Branch: `compat/luci-25.12`. This is source code under development, not a tested release. Package metadata currently specifies version `1.6.1`, release `1`; the exact artifact version format depends on the target build system.

## Target and current evidence

The reported test VM uses LEDE R26.10.11, LuCI openwrt-25.12 branch and kernel 6.18.55. These are user-reported identifiers, not independently verified build metadata. The original theme fails in `dispatcher.node()` because `__entries` is unset during template rendering.

Manual prototype testing demonstrated ucode template loading and basic navigation. The repository contains an experimental reorganization of that prototype with subsequent packaging changes. The exact current source has not been built or regression-tested. A reported LuCI branch name does not establish that the LEDE build rules match upstream OpenWrt.

## Current implementation

- Native header/footer templates reside under `root/usr/share/ucode/luci/template/themes/opentopd/`.
- An independent menu module uses `ui.menu.load()` and `ui.menu.getChildren()`.
- Original CSS is followed by a scoped compatibility layer; Bootstrap cascade.css is not loaded.
- New templates do not execute the old jQuery script or use legacy Lua menu-tree APIs.
- Obsolete `luasrc/view/themes/opentopd/header.htm` and `footer.htm` have been removed from this branch, leaving no `luasrc/` source directory. Original implementations remain available in Git history and the unchanged `master` branch.

## Packaging and dependencies

- The Makefile explicitly declares `+luci-base`, architecture `all` and license metadata `Apache-2.0`.
- With no `luasrc/` files, the inspected upstream modern `luci.mk` no longer adds `luci-lua-runtime` on that basis. Verify the actual built package dependency metadata in the target SDK. This does not imply that Lua compatibility packages can be removed from the device: other applications may require them.
- The custom legacy postinst has been removed; install/postinst behavior is delegated to the target build system's `luci.mk`.
- The uci-defaults script registers `luci.themes.Opentopd` without changing `luci.main.mediaurlbase`. UCI failures return nonzero. Users must explicitly choose the theme; an existing selection is not reset.
- Upstream install rules copy `root/` into the package root and `htdocs/` into `/www`. Templates under `root/` are copied directly; do not assume they receive the version substitutions used for the standard `ucode/` source directory. Current static asset query strings require manual maintenance.
- No compiled IPK/APK, automatic build workflow or deployment is provided by these source changes. Build artifacts must match the actual target firmware and package manager.

## Known limitations

Typography, pagination, disabled-button contrast, responsive layout, login flow and plugin compatibility require further work. Empty package-manager data and missing disk information have not been diagnosed; do not assume they are CSS bugs. Random backgrounds and old page-specific JavaScript effects are not ported. Menu query parameters and unusual routes require testing. Native ucode templates are required; this branch does not promise compatibility with legacy LuCI. Existing devices may retain manually installed files from earlier experiments; repository cleanup does not alter those devices.

## Required checks before release

1. Verify the target build system installs all new `root/` and `htdocs/` files.
2. Build with the target firmware source/SDK; inspect package contents, dependency metadata and version. Confirm obsolete Lua theme templates are absent.
3. Verify installation registers the theme without changing the previously selected theme. Test upgrade behavior from the old package separately.
4. Test login/logout, overview, all menu levels and narrow-screen navigation.
5. Test network-interface forms, unsaved-change indicators and save/apply in an isolated VM.
6. Compare package-manager data and browser errors with a known-working native theme.
7. Test PassWall and representative modern JavaScript and legacy CBI pages. Supporting legacy CBI applications is distinct from supporting old LuCI releases.
8. Review license/attribution requirements and release metadata before publishing artifacts.

Use a VM snapshot and retain SSH/console access. Do not publish this branch as production-ready.
