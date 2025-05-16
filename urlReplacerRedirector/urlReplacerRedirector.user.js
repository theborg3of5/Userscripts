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

//gdbtodo dropping support for included sites, only matched sites are allowed - need to document that thoroughly
//           ...or do I need to add it back in? I was supporting includes before...

//gdbtodo new idea for config handling: use the greasy fork page and/or the github page to host the config
//         - That way there's always a reliable spot they can go to
//         - Just make the config available via menu on any included/matched site
//         - Include a "delete redirects for this site" button at the site level
//         - When you're on an included page, consider highlighting it somehow (to make it easier when adding new redirects)

// Our configuration object - this loads/saves settings and handles the config popup.
var Config = new GM_config();

(async function ()
{
    'use strict';
    
    // Add a menu item to the menu to launch the config
    GM_registerMenuCommand('Configure redirect sites and settings', () => Config.open());
    
    // Set up and load config
    let configSettings = buildConfigSettings();
    await initConfigAsync(configSettings); // await because we need to read from these (async-loaded) values
    console.log("First site's prefix: " + Config.get(fieldPrefix(getUserSites()[0]))); //gdbremove
    
    // Get replacement settings for the current URL
    const startURL = window.location.href;
    const replaceSettings = getSettingsForURL(startURL);
    if (!replaceSettings)
    {
        return;
    }
    console.log("Site replacement settings: " + replaceSettings); //gdbremove

    // Get new URL
    const newURL = transformURL(startURL, replaceSettings);
    console.log("Original URL: " + startURL + "\nNew URL: " + newURL); //gdbremove
    
    // Redirect to the new URL
    if (startURL === newURL)
    { 
        console.log("URL Replacer/Redirector: current URL is same as redirection target: " + newURL);
        return
    }
    window.location.replace(newURL);



//     // Initial creation of settings structure if it doesn't exist
//     if(!GM_getValue("replaceTheseStrings")) {
//         GM_setValue("replacePrefix", "");
//         GM_setValue("replaceSuffix", "");
//         GM_setValue("replaceTheseStrings", {"toReplace": "replaceWith"});
//         console.log("Created settings structure");
//     }

//     // Prefix/suffix apply to both sides
//     var replacePrefix = GM_getValue("replacePrefix");
//     var replaceSuffix = GM_getValue("replaceSuffix");
//     var replaceAry = GM_getValue("replaceTheseStrings");
// //     console.log(replacePrefix, replaceSuffix, replaceAry);

})();

//gdbdoc talk about how we only support USER matched sites, not the default ones (and not user included sites, assuming we don't revert that bit)
function getUserSites()
{ 
    return GM_info.script.options.override.use_matches;
}

// Build the settings object for GM_config.init()
function buildConfigSettings()
{
    // Build fields for each site
    const fields = buildSiteFields();

    // Float the target strings fields to the left so that they can line up with their
    // corresponding replacements
    const styles = "div[id*=" + fieldTargetStrings("") + "] { float: left; }"; // id contains the the target strings id prefix

    return {
        id: "URLReplacerRedirectorConfig",
        title: "URL Replacer/Redirector Config",
        fields: fields,
        css: styles,
    };
}

//gdbdoc
function buildSiteFields()
{ 
    var fields = {};
    for (var site of getUserSites())
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

// This is just a Promise wrapper for GM_config.init that allows us to await initialization.
async function initConfigAsync(settings)
{
    return new Promise((resolve) =>
    {
        // Have the init event (which should fire once config is done loading) resolve the promise
        settings["events"] = {init: resolve};

        Config.init(settings);
    });
}

function getSettingsForURL(startURL)
{
    // Find the site that we matched
    const site = getUserSiteForURL(startURL);
    if (!site)
    {
        console.log("No matching site found for URL: " + startURL);
        return null;
    }

    // Retrieve and return the settings
    return {
        prefix:             Config.get(fieldPrefix(site)),
        suffix:             Config.get(fieldSuffix(site)),
        targetStrings:      Config.get(fieldTargetStrings(site)).split("\n"),
        replacementStrings: Config.get(fieldReplacementStrings(site)).split("\n"),
    }
}

//gdbdoc
function getUserSiteForURL(startURL)
{
    for (var site of getUserSites())
    {
        // Use a RegExp to determine which of the user's includes/matches is currently open, since we allow different hotkeys/anchors per each of those. //gdbredoc
        var siteRegex = new RegExp(site.replace(/\*/g, "[^ ]*")); // Replace * wildcards with regex-style [^ ]* wildcards
        if (siteRegex.test(startURL)) {
            return site; // First match always wins
        }
    }
}

//gdbdoc
function transformURL(startURL, siteSettings)
{
    const { prefix, suffix, targetStrings, replacementStrings } = siteSettings;
    console.log("Prefix: " + prefix + "\nSuffix: " + suffix + "\nTargets: " + targetStrings + "\nReplacements: " + replacementStrings); //gdbremove

    // Transform the URL
    var newURL = startURL;
    for (let i = 0; i < targetStrings.length; i++)
    {
        var toReplace = prefix + targetStrings[i] + suffix;
        var replaceWith = prefix + replacementStrings[i] + suffix;

        // Use a RegEx to allow case-insensitive matching
        toReplace = new RegExp(escapeRegex(toReplace), "i");

        newURL = newURL.replace(toReplace, replaceWith);
    }

    return newURL;
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
