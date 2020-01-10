// ==UserScript==
// @name         Feedly - Open in Background Tab
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.0
// @description  Open the currently-selected post in Feedly in a new background tab using the semicolon key. NOTE: this only works for the collapsed-titles layout - see the linked extension for more robust handling.
// @author       Gavin Borg
// @match        https://feedly.com/i/collection/*
// @grant        GM_openInTab
// ==/UserScript==

// Based on Feedly Background Tab by Aaron Saray: https://chrome.google.com/webstore/detail/feedly-background-tab/gjlijkhcebalcchkhgaiflaooghmoegk ( source: https://github.com/aaronsaray/feedlybackgroundtab )

(function() {
    'use strict';

    document.onkeyup = function(e) {
        if (e.which == 186) { // Semicolon
            var link = document.querySelector(".entry.selected a.title"); // Selected div, there's a .title link inside with the URL we want.
            if(!link) {
                return;
            }

            var url = link.href;
            if(!url) {
                return;
            }

            GM_openInTab(url);
        }
    };
})();