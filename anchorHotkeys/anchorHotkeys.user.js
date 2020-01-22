// ==UserScript==
// @name         Anchor Hotkeys
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      0.8
// @description  Adds single-key hotkeys that jump to specific anchors on a page.
// @author       Gavin Borg
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_registerMenuCommand
// ==/UserScript==

// GDB TODO: include warning about having to specify your own match/includes to make this work at all
// GDB TODO: include warning about not having overlapping includes and/or matches

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

        // Find the corresponding anchor name (if any)
        var anchorName = getAnchorNameForKey(site, e.key);
        if (!anchorName) { return; }

        // Make sure the anchor name starts with a hash (because that's how it's formatted in window.location.hash)
        if (!anchorName.startsWith("#")) {
            anchorName = "#" + anchorName;
        }

        // If the URL is already pointed to the spot we're interested in, remove it so we can re-add it and jump there again.
        if (window.location.hash == anchorName) {
            window.location.hash = "";
        }

        window.location.hash = anchorName;
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
    // Build the key and anchorName fields for each of the 10 available hotkeys
    var fields = {};
    for (var i = 1; i <= 10; i++) {
        fields[keyField(site, i)] = {
            label: "Key to press:",
            title: "The single key to press to jump to this anchor",
            type: "text",
            labelPos: "above"
        };
        fields[anchorNameField(site, i)] = {
            label: "Anchor name:",
            title: "The anchor to jump to",
            type: "text"
        };
    }

    config.init({
        id: 'AnchorHotkeysConfig',
        title: "Anchor Hotkeys Config for: " + site,
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
        if (config.get(keyField(site, i)) == key) {
            return config.get(anchorNameField(site, i));
        }
    }

    return "";
}

// We use the site as part of these IDs so that the IDs are unique per site.
function keyField(site, index) {
    return site + "_Key_" + index;
}
function anchorNameField(site, index) {
    return site + "_AnchorName_" + index;
}