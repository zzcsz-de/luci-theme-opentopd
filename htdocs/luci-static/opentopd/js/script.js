/**
* opentopd is a clean HTML5 theme for LuCI. It is based on luci-theme-Argon and MUI
* luci-theme-opentopd
*   Copyright 2019-2021 sirpdboy <sirpdboy@qq.com>
*	Have a bug? Please create an issue here on GitHub!
*	https://github.com/sirpdboy/luci-theme-opentopd/issues
*	
*	luci-theme-material:
*	Copyright 2015 Lutty Yang
*
*	luci-theme-bootstrap:
*	Copyright 2008 Steven Barth <steven@midlink.org>
*	Copyright 2008-2016 Jo-Philipp Wich <jow@openwrt.org>
*	Copyright 2012 David Menting <david@nut-bolt.nl>
*	MUI:
*	https://github.com/muicss/mui
*
*	Licensed to the public under the Apache License 2.0
 */
(function ($) {
    $(".main > .loading").fadeOut();

    /**
     * trim text, Remove spaces, wrap
     * @param text
     * @returns {string}
     */
    function trimText(text) {
        return text.replace(/[ \t\n\r]+/g, " ");
    }


    var lastNode;
    var path = (window.L && L.env.dispatchpath) || [];
    var mainNodeName = $('body').hasClass('logged-in')
        ? 'node-' + path.slice(1, 3).join('-').replace(/[ \t\n\r\/]+/g, '_').toLowerCase()
        : 'node-main-login';
    $('body').addClass(mainNodeName);

    /**
     * menu click
     */
    $('.main-left').on('click', '.nav > .slide > .menu', function () {
        var ul = $(this).next(".slide-menu");
        var menu = $(this);
        if (!menu.hasClass("exit")) {
            $(".main > .main-left > .nav > .slide > .active").next(".slide-menu").stop(true).slideUp("fast");
            $(".main > .main-left > .nav > .slide > .menu").removeClass("active");
            if (!ul.is(":visible")) {
                menu.addClass("active");
                ul.addClass("active");
                ul.stop(true).slideDown("fast");
            } else {
                ul.stop(true).slideUp("fast", function () {
                    menu.removeClass("active");
                    ul.removeClass("active");
                });
            }

            return false;
        }

    });

    /**
     * hook menu click and add the hash
     */
    $('.main-left').on('click', '.slide-menu > li > a', function () {
        if (lastNode != undefined)
            lastNode.removeClass("active");
        $(this).parent().addClass("active");
        $(".main > .loading").fadeIn("fast");
        return true;
    });

    $(".cbi-button-up").val("");
    $(".cbi-button-down").val("");


    /**
     * hook other "A Label" and add hash to it.
     */
    $("#maincontent > .container").find("a").each(function () {
        var that = $(this);
        var onclick = that.attr("onclick");
        if (onclick == undefined || onclick == "") {
            that.click(function () {
                var href = that.attr("href");
                if (href && href.indexOf("#") == -1) {
                    $(".main > .loading").fadeIn("fast");
                    return true;
                }
            });
        }
    });

    /**
     * Sidebar expand
     */
    var showSide = false;
    $(".showSide").click(function () {
        if (showSide) {
            $(".darkMask").stop(true).fadeOut("fast");
            $(".main-left").width(0);
            $(".main-right").css("overflow-y", "auto");
            showSide = false;
        } else {
            $(".darkMask").stop(true).fadeIn("fast");
            $(".main-left").width("15rem");
            $(".main-right").css("overflow-y", "hidden");
            showSide = true;
        }
    });


    $(".darkMask").click(function () {
        if (showSide) {
            showSide = false;
            $(".darkMask").stop(true).fadeOut("fast");
            $(".main-left").width(0);
            $(".main-right").css("overflow-y", "auto");
        }
    });

    $(window).resize(function () {
        if ($(window).width() > 921) {
            $(".main-left").css("width", "");
            $(".darkMask").stop(true);
            $(".darkMask").css("display", "none");
            showSide = false;
        }
    });

    /**
     * fix legend position
     */
    $("legend").each(function () {
        var that = $(this);
        that.after("<span class='panel-title'>" + that.text() + "</span>");
    });

    $(".cbi-section-table-titles, .cbi-section-table-descr, .cbi-section-descr").each(function () {
        var that = $(this);
        if (that.text().trim() == "") {
            that.css("padding", "0px");
        }
    });

    $(".node-main-login > .main .cbi-value.cbi-value-last .cbi-input-text").focus(function () {
        //$(".node-main-login > .main > .main-right > .login-bg").addClass("blur");
    });
    $(".node-main-login > .main .cbi-value.cbi-value-last .cbi-input-text").blur(function () {
        //$(".node-main-login > .main > .main-right > .login-bg").removeClass("blur");
    });


    $(".main-right").focus();
    $(".main-right").blur();
    $("input").attr("size", "0");

    if (mainNodeName != undefined) {
        switch (mainNodeName) {
            case "node-status-system_log":
            case "node-status-kernel_log":
                $("#syslog").focus(function () {
                    $("#syslog").blur();
                    $(".main-right").focus();
                    $(".main-right").blur();
                });
                break;
            case "node-status-firewall":
                var button = $(".node-status-firewall > .main fieldset li > a");
                button.addClass("cbi-button cbi-button-reset a-to-btn");
                break;
            case "node-system-reboot":
                var button = $(".node-system-reboot > .main > .main-right p > a");
                button.addClass("cbi-button cbi-input-reset a-to-btn");
                break;
        }
    }

})(jQuery);

/* LuCI ui.Dropdown determines its scrolling ancestor before it opens.
 * Never force overflow:visible on every parent during opening: doing so
 * changes the scroll container mid-positioning and displaces zone lists.
 * Compatibility CSS now opens only the necessary modal section ancestors. */
(function() {
    if (typeof MutationObserver !== 'undefined') {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                // Keep Save&Apply ComboButton orange regardless of selected action
                if (m.target.classList && m.target.classList.contains('cbi-dropdown')) {
                    fixApplyButton(m.target);
                }
            });
            // Also check on childList changes (text content may change)
            mutations.forEach(function(m) {
                if (m.type === 'childList') {
                    var dd = m.target.closest ? m.target.closest('.cbi-dropdown') : null;
                    if (dd) fixApplyButton(dd);
                }
            });
        });
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['open', 'class'],
            childList: true,
            subtree: true
        });
    }

    // Force orange styling on Save&Apply/Force Apply ComboButton
    // Find by position: it's always before the Save button
    function fixApplyButtonByPosition() {
        var saveBtn = document.querySelector('.cbi-button-save');
        if (saveBtn) {
            var prev = saveBtn.previousElementSibling;
            if (prev && prev.classList.contains('cbi-dropdown')) {
                prev.style.setProperty('background-color', '#f36c21', 'important');
                prev.style.setProperty('background', '#f36c21', 'important');
                // Style only the visible button face; do not recolor menu items.
                Array.from(prev.children).forEach(function(child) {
                    if (child.tagName === 'SPAN' || child.tagName === 'DIV') {
                        child.style.setProperty('background-color', '#f36c21', 'important');
                        child.style.setProperty('color', '#ffffff', 'important');
                    }
                });
            }
        }
    }

    function fixApplyButton(dd) {
        var txt = dd.textContent || '';
        if (txt.indexOf('保存并应用') !== -1 || txt.indexOf('强制应用') !== -1) {
            dd.style.setProperty('background-color', '#f36c21', 'important');
            dd.style.setProperty('border-color', '#c65621', 'important');
            dd.style.setProperty('color', '#ffffff', 'important');
            // Recolor only the button face, never spans inside the popup list.
            Array.from(dd.children).forEach(function(child) {
                if (child.tagName === 'SPAN' || child.tagName === 'DIV') {
                    child.style.setProperty('background-color', '#f36c21', 'important');
                    child.style.setProperty('color', '#ffffff', 'important');
                }
            });
        }
    }

    // Run on load for existing buttons
    document.querySelectorAll('.cbi-dropdown').forEach(fixApplyButton);
    fixApplyButtonByPosition();

    // Debug: log Save&Apply button HTML structure
    setTimeout(function() {
        document.querySelectorAll('.cbi-dropdown').forEach(function(dd) {
            var txt = dd.textContent || '';
            if (txt.indexOf('保存并应用') !== -1) {
                console.log('=== SaveApply Button HTML ===');
                console.log(dd.outerHTML.substring(0, 500));
            }
        });
        fixApplyButtonByPosition();
    }, 2000);
})();
