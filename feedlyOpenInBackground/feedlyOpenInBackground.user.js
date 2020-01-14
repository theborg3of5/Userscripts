// ==UserScript==
// @name         Feedly - Open in Background Tab
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.1
// @description  Open the currently-selected post in Feedly in a new background tab using the semicolon key. NOTE: this only works for the collapsed-titles layout - see the linked extension for more robust handling.
// @author       Gavin Borg
// @match        http*://feedly.com/*
// @grant        GM_openInTab
// ==/UserScript==

// Based on Feedly Background Tab by Aaron Saray: https://chrome.google.com/webstore/detail/feedly-background-tab/gjlijkhcebalcchkhgaiflaooghmoegk ( source: https://github.com/aaronsaray/feedlybackgroundtab )

(function() {
    'use strict';

    document.onkeyup = function(e) {
        if (e.which == 186) { // Semicolon
            var url = getURL();
            if(url) {
                GM_openInTab(url);
            }
        }
    };
})();

function getURL() {
    var selectors = [".entry.selected a.title", ".list-entries .selected a.title"]; // Selected entry - collapsed, expanded
    var link;

    for(var selector of selectors) {
        link = document.querySelector(selector);
        if(link) {
            break;
        }
    }

    if(!link) {
        return "";
    }

    return link.href;
}