// ==UserScript==
// @name         Feedly - Open in Background Tab
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.3
// @description  Open the currently-selected post in Feedly in a new background tab using the semicolon key. NOTE: this only works for the collapsed-titles layout - see the linked extension for more robust handling.
// @author       Gavin Borg
// @match        http*://feedly.com/*
// @grant        GM_openInTab
// ==/UserScript==

// Based on Feedly Background Tab by Aaron Saray: https://chrome.google.com/webstore/detail/feedly-background-tab/gjlijkhcebalcchkhgaiflaooghmoegk ( source: https://github.com/aaronsaray/feedlybackgroundtab )

(function() {
    'use strict';

    if(getHotkeyCode() == "") {
        console.log("FeedlyOpenInBackground: failed to determine hotkey");
        return;
    }

    document.onkeyup = function(e) {
        //console.log("Caught key code: " + e.which + ", hotkey is key code: " + getHotkeyCode());
        if (e.which == getHotkeyCode()) {
            var url = getURL();
            if(url) {
                console.log(url);
                var options = {active:false, insert:false}; // tweaks to open tabs in background after all other tabs (check options object below)
                GM_openInTab(url,options);
            }
        }
    };
})();

function getHotkeyCode() {
    var userAgent = navigator.userAgent;
    if(userAgent.includes("Chrome/")) {
        return 186; // Semicolon in Chrome
    }
    if(userAgent.includes("Firefox/")) {
        return 59; // Semicolon in Firefox
    }

    return "";
}

function getURL() {
    /*
    var selectors = [
		'.list-entries .entry--selected a.entry__title',     // Additional selector for recent Feedly changes
		'div.selectedEntry a.title',			// title bar for active entry, collapsed or expanded
		'.selectedEntry a.visitWebsiteButton',	// the button square button on list view
		'.list-entries .inlineFrame--selected a.visitWebsiteButton',	// the button square button on list view
		'a.visitWebsiteButton',					// the floating one for card view
		'.entry.selected a.title'				// title bar for active entry in React-based collapsed list view
    ];
    */
    //var selectors = ['#EntryTitleLink-selected','a.Article__title'];
    var selectors = ['a.EntryTitleLink-selected','a.Article__title'];

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
