// ==UserScript==
// @name         Anchor Hotkeys
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      0.5
// @description  Adds single-key hotkeys that jump to specific anchors on a page.
// @author       Gavin Borg
// ==/UserScript==

// GDB TODO: make keys/anchor names configurable somewhere
// GDB TODO: include warning about having to specify your own match/includes to make this work at all

(function() {
    'use strict';

    //alert(GM_info.script.options.override.use_matches[0]);
    //GM_info.script.options.override.use_includes[i];
    var sites = GM_info.script.options.override.use_matches;
    sites.concat(GM_info.script.options.override.use_includes);
    console.log(sites);

    // These are the keys and anchors (including leading #) that those keys should jump to.
    var anchorKeys = {
        t: "#TOP",
        d: "#DueDateInfo",
        e: "#People",
        a: "#AssociatedRecords",
        i: "#Issues",
        n: "#Notes",
    };

    document.onkeyup = function(e) {
        // Find the corresponding anchor name (if any)
        var anchorName = anchorKeys[e.key];
        if(!anchorName) {
            return;
        }

        // If the URL is already pointed to the spot we're interested in, remove it so we can re-add it and jump there again.
        if(window.location.hash == anchorName) {
            window.location.hash = "";
        }

        window.location.hash = anchorName;
    }
})();