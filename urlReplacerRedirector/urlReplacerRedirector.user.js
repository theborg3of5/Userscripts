// ==UserScript==
// @name         URL Replacer/Redirector
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.1
// @description  Redirect specific sites by replacing part of the URL.
// @author       Gavin Borg
// @require      https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @match        https://greasyfork.org/en/scripts/403100-url-replacer-redirector
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

//gdbtodo figure out a conversion from old to new settings style?
//gdbtodo are the GM_getValue/GM_setValue grants above still needed? Might be a dependency of GM_config, or GM_config might replace that?
//gdbtodo figure out an escape hatch to remove redirect settings for a specific site
//           Maybe a menu option? But that would require the target site to be on the include/match list too?

//gdbtodo new idea for config handling: use the greasy fork page and/or the github page to host the config
//         - That way there's always a reliable spot they can go to
//         - Also make it available on all includes/matches>
//            - Maybe filter down to just the current site in that case, with a notice + link to the page(s) where they could see all sites together?
//            - Make this super clear in the updated README
//         - Include a "delete redirects for this site" button at the site level (regardless of whether it's filtered)

var config = GM_config;

(function() {
    'use strict';

    initConfig(getMatchingSite());

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

        // Use a RegEx to allow case-insensitive matching
        toReplace = new RegExp(escapeRegex(toReplace), "i");

        newURL = newURL.replace(toReplace, replaceWith);
    }
//     console.table({"Original URL":window.location.href, "New URL":newURL});

    if(window.location.href !== newURL) {
        window.location.replace(newURL);
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
    var siteClean = cleanSite(site);

    // // Build the fields for each of the available hotkeys
    // var fields = {};
    // for (var i = 1; i <= maxNumHotkeys; i++) {
    //     fields[keyField(i)] = {
    //         label: "Key(s) to press:",
    //         title: "The single key(s) to press to jump to this anchor/text. To have multiple keys jump to the same place, separate keys with a space (i.e. \"a r\" for both \"a\" and \"r\" keys ).",
    //         type: "text",
    //         labelPos: "above"
    //     };
    //     fields[anchorNameField(i)] = {
    //         label: "Anchor name:",
    //         title: "The name or id of the anchor to jump to",
    //         type: "text"
    //     };
    //     fields[textField(i)] = {
    //         label: "Text to jump to:",
    //         title: "We'll jump to the first instance of this text on the page. Ignored if anchor name is specified.",
    //         type: "text"
    //     };
    // }

    config.init({
        id: "URLReplacerRedirectorConfig-" + siteClean,
        title: "Redirector Config for: " + site,
        fields: fields
    });

    // Add a menu item to the menu to launch the config
    GM_registerMenuCommand('Configure hotkeys for this site', () => {
        config.open();
    })
}

function cleanSite(site) {
    return site.replace(/[\*/:\?\.]/g, ""); // Drop */:?. characters from site for use in ID
}

// From https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
function escapeRegex(string) { // gdbtodo only keep this if I actually end up needing it
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// gdbtodo example of how to get values from the config
// function getAnchorNameForKey(key) {
//     for (var i = 1; i <= maxNumHotkeys; i++) {
//         var keyAry = config.get(keyField(i).split(" "));
//         if (keyAry.includes(key)) {
//             return config.get(anchorNameField(i));
//         }
//     }

//     return "";
// }