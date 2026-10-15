# Copyright (C) 2008-2019 Jerrykuku
# Copyright (C) 2019-2023 sirpdboy
# http://www.github.com/sirpdboy/luci-theme-opentopd
# This is free software, licensed under the Apache License, Version 2.0.

include $(TOPDIR)/rules.mk

THEME_NAME:=opentopd
PKG_NAME:=luci-theme-$(THEME_NAME)

# Experimental modern LuCI port; not a stable release.
PKG_VERSION:=1.6.1
PKG_RELEASE:=1
PKG_LICENSE:=Apache-2.0

LUCI_TITLE:=Opentopd Theme (experimental ucode port)
LUCI_DEPENDS:=+luci-base
LUCI_PKGARCH:=all

# Retained luasrc/ files cause modern luci.mk to add luci-lua-runtime.
# Native templates do not establish compatibility with legacy LuCI.
# Use luci.mk's default install and postinst rules.
include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
