# Copyright (C) 2019-2023 sirpdboy
# Licensed to the public under the Apache License 2.0.
include $(TOPDIR)/rules.mk

PKG_VERSION:=1.7.0
PKG_RELEASE:=1
PKG_LICENSE:=Apache-2.0
LUCI_TITLE:=Opentopd Theme
LUCI_DEPENDS:=+luci-base
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
