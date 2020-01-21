// ==UserScript==
// @name         Anchor Hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds single-key hotkeys that jump to specific anchors on a page.
// @author       Gavin Borg
// ==/UserScript==

// GDB TODO: update namespace before uploading anywhere
// GDB TODO: make keys/anchor names configurable somewhere
// GDB TODO: include warning about having to specify your own match/includes to make this work at all

(function() {
    'use strict';

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