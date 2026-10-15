# Experimental modern LuCI port

Branch: `compat/luci-25.12`. This is source code under development, not a tested release.

## Target and current evidence

The reported test VM uses LEDE R26.10.11, LuCI openwrt-25.12 branch and kernel 6.18.55. These are user-reported identifiers, not independently verified build metadata. The old theme fails in `dispatcher.node()` because `__entries` is unset during template rendering.

Manual prototype testing demonstrated ucode template loading and basic navigation. This commit reorganizes that prototype into repository files, with small changes; the exact committed version has not yet been built or regression-tested.

## Changes

- Add native header/footer templates under `root/usr/share/ucode/luci/template/themes/opentopd/`.
- Add an independent menu module using `ui.menu.load()` and `ui.menu.getChildren()`.
- Keep original CSS and append a scoped compatibility layer; do not load Bootstrap cascade.css.
- Do not execute the old jQuery script or use legacy Lua menu-tree APIs in the new templates.
- Preserve original Lua files, existing package metadata and installation scripts in this initial commit.

## Known limitations

Typography, pagination, disabled-button contrast, responsive layout, login flow and plugin compatibility require further work. Empty package-manager data and missing disk information have not been diagnosed; do not assume they are CSS bugs. Random backgrounds and old page-specific JavaScript effects are not ported. Menu query parameters and unusual routes require testing. Native ucode templates are required; retained legacy files do not imply supported cross-version compatibility.

## Required checks before release

1. Verify the target build system installs all new `root/` and `htdocs/` files.
2. Build with the target firmware source/SDK and inspect package contents.
3. Test login/logout, overview, all menu levels and narrow-screen navigation.
4. Test network-interface forms, unsaved-change indicators and save/apply in an isolated VM.
5. Compare package-manager data and browser errors with a known-working native theme.
6. Test PassWall and representative modern JavaScript and legacy CBI pages.
7. Review license/attribution requirements and update version metadata before publishing artifacts.

Use a VM snapshot and retain SSH/console access. No compiled IPK or automatic deployment is provided by this commit. Do not publish this branch as production-ready.
