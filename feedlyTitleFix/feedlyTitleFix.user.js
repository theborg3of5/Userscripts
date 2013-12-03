// ==UserScript==
// @name       Title for cloud.feedly.com
// @namespace  http://www.niluge-kiwi.info
// @version    0.1
// @description  Append "feedly" to page <title> for feedly.com
// @include     https://feedly.com/*
// @run-at         document-start
// ==/UserScript==

// Based on: http://userscripts.org/scripts/show/172125, github: https://github.com/Niluge-KiWi/browser-scripts

(function(){

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

var suffix = " - feedly";
var appendFeedlyTitle = function() {
    if (!document.title.endsWith(suffix)) {
        document.title += suffix;
    }
}

window.addEventListener("DOMTitleChanged", appendFeedlyTitle, false);

var DOMTitle = document.getElementsByTagName('TITLE')[0];
DOMTitle.addEventListener('DOMSubtreeModified', appendFeedlyTitle, false);

appendFeedlyTitle();

})();