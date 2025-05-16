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

// Grant GM_*value for legacy Greasemonkey, GM.*value for Greasemonkey 4+

//gdbtodo figure out a conversion from old to new settings style?
//         - Should basically be able to load the old settings, add them to the GM_config fields, and save it, right? Or do I need a new reload or something then?
//gdbtodo figure out an escape hatch to remove redirect settings for a specific site
//           Maybe a menu option? But that would require the target site to be on the include/match list too?
//gdbtodo consider defaulting prefix to matched site?

//gdbtodo dropping support for included sites, only matched sites are allowed - need to document that thoroughly
//           ...or do I need to add it back in? I was supporting includes before...

//gdbtodo new idea for config handling: use the greasy fork page and/or the github page to host the config
//         - That way there's always a reliable spot they can go to
//         - Just make the config available via menu on any included/matched site
//         - Include a "delete redirects for this site" button at the site level

var Config = new GM_config({});

(async function ()
{
    'use strict';

    // Add a menu item to the menu to launch the config
    GM_registerMenuCommand('Configure redirect sites and settings', () => Config.open());

    // Load the config (await because we'll use that data to do the redirect)
    await loadConfig();

    const site = getMatchingSite();
    console.log("Matching site: " + site); //gdbremove
    
    if (!site)
    {
        console.log("URL Replacer/Redirector: no settings found for matching site: " + site);
        return;
    }
    doRedirect();

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

})();

// This is basically a wrapper to let us await GM_config.init()
async function loadConfig()
{
    // Build fields for each site
    const fields = buildSiteFields();

    // Float the target strings fields to the left so that they can line up with their
    // corresponding replacements
    const styles = "div[id*=" + fieldTargetStrings("") + "] { float: left; }"; // id contains the the target strings id prefix

    return await initConfig({
        id: "URLReplacerRedirectorConfig",
        title: "URL Replacer/Redirector Config",
        fields: fields,
        css: styles,
    });
}

// This is just a Promise wrapper that lets us await GM_config's initialization.
async function initConfig(settings)
{
    return new Promise((resolve) =>
    {
        // Have the init event (which should fire once config is done loading) resolve the promise
        settings["events"] = {init: resolve};

        Config.init(settings);
    });
}

function buildSiteFields()
{ 
    var fields = {};
    for (var site of getMatchSites())
    {
        fields[fieldSection(site)] = {
            type: "hidden", // Using a hidden field just to create the section header (could technically go on the prefix field below)
            section: site,
        }
        fields[fieldPrefix(site)] = {
            type: "text",
            label: "Prefix",
            labelPos: "left",
            // size: gdbtodo,
            title: "gdbdoc",
        }
        fields[fieldSuffix(site)] = {
            type: "text",
            label: "Suffix",
            labelPos: "left",
            // size: gdbtodo,
            title: "gdbdoc",
        }
        fields[fieldTargetStrings(site)] = {
            type: "textarea",
            label: "Strings to replace",
            labelPos: "above",
            // size: gdbtodo,
            title: "gdbdoc",
        }
        fields[fieldReplacementStrings(site)] = {
            type: "textarea",
            label: "Replace with strings",
            labelPos: "above",
            // size: gdbtodo,
            title: "gdbdoc",
        }
        fields[fieldClearSite(site)] = {
            type: "button",
            label: "Clear redirects for this site",
            title: "gdbdoc",
            // size: gdbtodo,
            click: function (siteToClear)
            {
                return () => {
                    console.log("Clearing redirects for site: " + siteToClear); //gdbremove
                    Config.set(fieldPrefix(siteToClear), "");
                    Config.set(fieldSuffix(siteToClear), "");
                    Config.set(fieldTargetStrings(siteToClear), "");
                    Config.set(fieldReplacementStrings(siteToClear), "");
                }
            }(site), // Immediately invoke this wrapper with the current site so the inner function can capture it
        }
    }

    return fields;
}

//gdbdoc talk about how we only support USER matched sites, not included sites (assuming we don't revert that bit)
function getMatchSites() // gdbtodo should this just be a parameter passed around instead of a standalone function?
{ 
    return GM_info.script.options.override.use_matches;
}

function getMatchingSite() {
    // Get sites that user has chosen to include or match (because that's what hotkeys are keyed to, not direct URLs)
    // const sites = GM_info.script.options.override.use_matches;
    // const sites = GM_info.script.options.override.use_matches.concat(GM_info.script.options.override.use_includes);
    // console.log("Matches: " + GM_info.script.options.override.use_matches);
    // console.log("Includes: " + GM_info.script.options.override.use_includes);
    // console.log("Combined: " + sites);

    // Find matching site
    var currentURL = window.location.href;
    for (var site of getMatchSites())
    {
        // Use a RegExp to determine which of the user's includes/matches is currently open, since we allow different hotkeys/anchors per each of those.
        var siteRegex = new RegExp(site.replace(/\*/g, "[^ ]*")); // Replace * wildcards with regex-style [^ ]* wildcards
        if (siteRegex.test(currentURL)) {
            return site; // First match always wins
        }
    }
}

function doRedirect(site)
{

    // Retrieve config for the current site
    const prefix             = Config.get(fieldPrefix(site));
    const suffix             = Config.get(fieldSuffix(site));
    const targetStrings      = Config.get(fieldTargetStrings(site)).split("\n");
    const replacementStrings = Config.get(fieldReplacementStrings(site)).split("\n");
    console.log("Prefix: " + prefix + "\nSuffix: " + suffix + "\nTargets: " + targetStrings + "\nReplacements: " + replacementStrings); //gdbremove

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
    console.log("Original URL: " + window.location.href + "\nNew URL: " + newURL); //gdbremove

    if (window.location.href !== newURL)
    { 
        console.log("URL Replacer/Redirector: current URL is same as redirection target: " + newURL);
        return
    }

    // Redirect to the new URL
    if (window.location.href !== newURL)
    {
        window.location.replace(newURL);
    }
}

function cleanSite(site) // gdbtodo is this worth keeping?
{
    return site.replace(/[\*/:\?\.]/g, ""); // Drop */:?. characters from site for use in ID
}

// From https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
function escapeRegex(string)
{
    return string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
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
function fieldClearSite(site)
{
    return "ClearSite_" + site;
}
//#endregion Field name "constants" based on their corresponding sites
