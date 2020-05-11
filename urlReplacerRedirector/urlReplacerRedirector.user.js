// ==UserScript==
// @name         URL Replacer/Redirector
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.0
// @description  Redirect specific sites by replacing part of the URL.
// @author       Gavin Borg
// @match        https://greasyfork.org/en/scripts/403100-url-replacer-redirector
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Initial creation of settings structure if it doesn't exist
    if(!GM_getValue("replaceTheseStrings")) {
        GM_setValue("replacePrefix", "");
        GM_setValue("replaceSuffix", "");
        GM_setValue("replaceTheseStrings", {"toReplace": "replaceWith"});
        console.log("Created settings structure");
    }

    // Prefix/suffix apply to both sides
    var replacePrefix = GM_getValue("replacePrefix");
    var replaceSuffix = GM_getValue("replaceSuffix");
    var replaceAry = GM_getValue("replaceTheseStrings");
//     console.log(replacePrefix, replaceSuffix, replaceAry);

    var newURL = window.location.href;
    for(var key in replaceAry) {
        var toReplace = replacePrefix + key + replaceSuffix;
        var replaceWith = replacePrefix + replaceAry[key] + replaceSuffix;

        newURL = newURL.replace(toReplace, replaceWith);
    }
//     console.table({"Original URL":window.location.href, "New URL":newURL});

    if(window.location.href !== newURL) {
        window.location.replace(newURL);
    }
})();