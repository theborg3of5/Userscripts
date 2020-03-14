// ==UserScript==
// @name         Jump to Text
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.2
// @description  Adds single-key hotkeys that jump to specific text (or anchors) on a page.
// @author       Gavin Borg
// @require      https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @match        https://greasyfork.org/en/scripts/395551-jump-to-text
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var configOpen = false; // Whether the config window is open, for our close-config hotkey (Escape).
var config = GM_config;

(function() {
    'use strict';

    var site = getMatchingSite();
    initConfig(site);

    document.onkeyup = function(e) {
        // Special cases: Ctrl+Comma (,) triggers config, Escape closes it
        if (e.ctrlKey && e.key === ",") {
            configOpen = true;
            config.open();
        }
        if (e.key === "Escape" && configOpen) {
            config.close();
        }

        // Otherwise, only single-button hotkeys are supported
        if (e.shiftKey || e.ctrlKey || e.altKey) { return; }

        // If there's a matching anchor name, jump to that anchor by updating the URL hash.
        var anchorName = getAnchorNameForKey(site, e.key);
        if(anchorName !== "") {
            // Make sure the anchor name starts with a hash (because that's how it's formatted in window.location.hash)
            if (!anchorName.startsWith("#")) {
                anchorName = "#" + anchorName;
            }

            // If the URL is already pointed to the spot we're interested in, remove it so we can re-add it and jump there again.
            if (window.location.hash == anchorName) {
                window.location.hash = "";
            }

            window.location.hash = anchorName;
            return;
        }

        // Otherwise try to find the first instance of the configured text
        var text = getTextForKey(site, e.key);
        if(text !== "") {
            var firstElement = document.evaluate("//span[contains(text(), '" + text + "')]").iterateNext();
            if(firstElement) {
                firstElement.scrollIntoView();
                return;
            }
        }
    }
})();

function getMatchingSite() {
    // Get sites that user has chosen to include or match (because that's what hotkeys are keyed to, not direct URLs)
    var sites = GM_info.script.options.override.use_matches;
    sites.concat(GM_info.script.options.override.use_includes);

    // Find matching site
    var currentURL = window.location.href;
    for (var site of sites) {
        // Use a RegExp to determine which of the user's includes/matches is currently open, since we allow different hotkeys/anchors per each of those.
        var siteRegex = new RegExp(site.replace(/\*/g, "[^ ]*")); // Replace * wildcards with regex-style [^ ]* wildcards
        if (siteRegex.test(currentURL)) {
            return site; // First match always wins
        }
    }
}

function initConfig(site) {
    // Build the fields for each of the 10 available hotkeys
    var fields = {};
    for (var i = 1; i <= 10; i++) {
        fields[keyField(site, i)] = {
            label: "Key(s) to press:",
            title: "The single key(s) to press to jump to this anchor/text. To have multiple keys jump to the same place, separate keys with a space (i.e. \"a r\" for both \"a\" and \"r\" keys ).",
            type: "text",
            labelPos: "above"
        };
        fields[anchorNameField(site, i)] = {
            label: "Anchor name:",
            title: "The name or id of the anchor to jump to",
            type: "text"
        };
        fields[textField(site, i)] = {
            label: "Text to jump to:",
            title: "We'll jump to the first instance of this text on the page. Ignored if anchor name is specified.",
            type: "text"
        };
    }

    config.init({
        id: 'JumpToTextConfig',
        title: "Jump to Text Config for: " + site,
        fields: fields,
        events: {
            'open': function() { configOpen = true; },
            'close': function() { configOpen = false; }
        }
    });

    // Add a menu item to the menu to launch the config
    GM_registerMenuCommand('Configure hotkeys for this site', () => {
        config.open();
    })
}

function getAnchorNameForKey(site, key) {
    for (var i = 1; i <= 10; i++) {
        var keyAry = config.get(keyField(site, i).split(" "));
        if (keyAry.includes(key)) {
            return config.get(anchorNameField(site, i));
        }
    }

    return "";
}
function getTextForKey(site, key) {
    for (var i = 1; i <= 10; i++) {
        var keyAry = config.get(keyField(site, i).split(" "));
        if (keyAry.includes(key)) {
            return config.get(textField(site, i));
        }
    }

    return "";
}

// We use the site as part of these IDs so that the configuration is separate per site.
function keyField(site, index) {
    return site + "_Keys_" + index;
}
function anchorNameField(site, index) {
    return site + "_AnchorName_" + index;
}
function textField(site, index) {
    return site + "_Text_" + index;
}