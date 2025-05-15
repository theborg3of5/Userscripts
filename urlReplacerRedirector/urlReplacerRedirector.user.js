// ==UserScript==
// @name         URL Replacer/Redirector
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.1
// @description  Redirect specific sites by replacing part of the URL.
// @author       Gavin Borg
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @match        https://greasyfork.org/en/scripts/403100-url-replacer-redirector
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

// GM_* are for legacy Greasemonkey, GM. is for modern (GM 4+ sounds like)

//gdbtodo do I need GM.registerMenuCommand too?

//gdbtodo figure out a conversion from old to new settings style?
//         - Should basically be able to load the old settings, add them to the GM_config fields, and save it, right? Or do I need a new reload or something then?
//gdbtodo figure out an escape hatch to remove redirect settings for a specific site
//           Maybe a menu option? But that would require the target site to be on the include/match list too?
//gdbtodo consider defaulting prefix to matched site?

//gdbtodo new idea for config handling: use the greasy fork page and/or the github page to host the config
//         - That way there's always a reliable spot they can go to
//         - Just make the config available via menu on any included/matched site
//         - Include a "delete redirects for this site" button at the site level

// var config = GM_config;
var Config;

(function () 
{
    'use strict';

    initConfig(); // Calls into doRedirect() once it's finished initializing

    // doRedirect();

    return;


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

function initConfig() {
    // var siteClean = cleanSite(site);
    
    // Build config fields for each available site
    var fields = {};
    var sites = GM_info.script.options.override.use_matches;
    sites.concat(GM_info.script.options.override.use_includes);
    for (var site of sites)
    {
        fields[fieldSection(site)] = {
            section: site,
            type: "hidden", // Using a hidden field just to create the section header (could technically go on the prefix field below)
        }
        fields[fieldPrefix(site)] = {
            label: "Prefix",
            labelPos: "left",
            type: "text",
            title: "gdbdoc",
        }
        fields[fieldSuffix(site)] = {
            label: "Suffix",
            labelPos: "left",
            type: "text",
            title: "gdbdoc",
        }
        fields[fieldTargetStrings(site)] = {
            label: "Strings to replace",
            labelPos: "above",
            type: "textarea",
            title: "gdbdoc",
        }
        fields[fieldReplacementStrings(site)] = {
            label: "Replace with strings",
            labelPos: "above",
            type: "textarea",
            title: "gdbdoc",
        }
    }

    // Float the target strings fields to the left so that they can line up with their corresponding replacements
    // const styles = floatIDs.join(", ") + " { float: left; }";
    const styles = "div[id*=" + fieldTargetStrings("") + "] { float: left; }";

    Config = new GM_config({
        id: "URLReplacerRedirectorConfig",
        title: "URL Replacer/Redirector Config",
        fields: fields,
        css: styles,
        events: {
            init: doRedirect,
        }
    });

    // Add a menu item to the menu to launch the config
    GM_registerMenuCommand('Configure redirect sites and settings', () => {
        Config.open();
    })
}

// This gets called by initConfig() after the config is finished loading (because we use config 
// values and need them loaded first).
function doRedirect()
{
    const site = getMatchingSite();
    console.log("Matching site: " + site);
    if (!site)
    {
        console.log("URL Replacer/Redirector: no matching site found in config");
        return;
    }

    // Retrieve config for the current site
    const prefix             = Config.get(fieldPrefix(site));
    const suffix             = Config.get(fieldSuffix(site));
    const targetStrings      = Config.get(fieldTargetStrings(site)).split("\n");
    const replacementStrings = Config.get(fieldReplacementStrings(site)).split("\n");
    console.log("Prefix: " + prefix + "\nSuffix: " + suffix + "\nTargets: " + targetStrings + "\nReplacements: " + replacementStrings);

    // Build the new URL
    var newURL = window.location.href;
    for (let i = 0; i < targetStrings.length; i++)
    {
        var toReplace = prefix + targetStrings[i] + suffix;
        var replaceWith = prefix + replacementStrings[i] + suffix;

        // Use a RegEx to allow case-insensitive matching
        toReplace = new RegExp(escapeRegex(toReplace), "i");

        newURL = newURL.replace(toReplace, replaceWith);
    }
    console.log("Original URL: " + window.location.href);
    console.log("New URL: " + newURL);

    // Redirect to the new URL
    if (window.location.href !== newURL)
    {
        window.location.replace(newURL);
    }
}

function getMatchingSite() {
    // Get sites that user has chosen to include or match (because that's what hotkeys are keyed to, not direct URLs)
    var sites = GM_info.script.options.override.use_matches;
    sites.concat(GM_info.script.options.override.use_includes);

    // Find matching site
    var currentURL = window.location.href;
    for (var site of sites)
    {
        // Use a RegExp to determine which of the user's includes/matches is currently open, since we allow different hotkeys/anchors per each of those.
        var siteRegex = new RegExp(site.replace(/\*/g, "[^ ]*")); // Replace * wildcards with regex-style [^ ]* wildcards
        if (siteRegex.test(currentURL)) {
            return site; // First match always wins
        }
    }
}

function cleanSite(site) // gdbtodo is this worth keeping?
{
    return site.replace(/[\*/:\?\.]/g, ""); // Drop */:?. characters from site for use in ID
}

// From https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
function escapeRegex(string)
{
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

//#region Field name "constants" based on their corresponding sites
function fieldSection(site) 
{
    return "Section_" + site;
}
function fieldPrefix(site) 
{
    return "Prefix_" + site;
}
function fieldSuffix(site) 
{
    return "Suffix_" + site;
}
function fieldTargetStrings(site)
{
    return "TargetString_" + site;
}
function fieldReplacementStrings(site) 
{
    return "ReplacementString_" + site;
}
//#endregion Field name "constants" based on their corresponding sites
