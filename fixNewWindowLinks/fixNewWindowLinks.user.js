// ==UserScript==
// @name         Fix New-Window Links (Remove target Attribute)
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.0
// @description  Remove the target attribute from the links matching the given string.
// @author       Gavin Borg
// @match        
// @grant        none
// ==/UserScript==

var linkQueryStrings = [""];

(function() {
    'use strict';

    fixLinks();
})();

function fixLinks() {
    for(var i = 0; i < linkQueryStrings.length; i++) {
        fixLinksWithQuery(linkQueryStrings[i]);
    }
}

function fixLinksWithQuery(queryString) {
    if (document.querySelector(queryString)) { // Make sure the links we want to fix exist, in case they show up via AJAX a little later than page load.
        document.querySelectorAll(queryString).forEach(link => link.removeAttribute("target"));
    } else {
        setTimeout(fixLinksWithQuery.bind(null, queryString), 0);
    }
}