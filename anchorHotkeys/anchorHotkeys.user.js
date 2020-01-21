// ==UserScript==
// @name         Anchor Hotkeys
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      0.6
// @description  Adds single-key hotkeys that jump to specific anchors on a page.
// @author       Gavin Borg
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// ==/UserScript==
/// @grant        GM_getValue
/// @grant        GM_setValue

// GDB TODO: make keys/anchor names configurable somewhere
// GDB TODO: include warning about having to specify your own match/includes to make this work at all
// GDB TODO: include warning about not having overlapping includes and/or matches
// GDB TODO: don't respond when modifier keys are held down

(function() {
    'use strict';

    // Get sites that user has chosen to include or match
    var sites = GM_info.script.options.override.use_matches;
    sites.concat(GM_info.script.options.override.use_includes);
    console.log(sites);

    var url = window.location.href;
    var matchingSite = "";
    for (var site of sites) {
        // Use a RegExp to determine which of the user's includes/matches is currently open, since we allow different hotkeys/anchors per each of those.
        var siteRegex = new RegExp(site.replace(/\*/g, "[^ ]*")); // Replace * wildcards with regex-style [^ ]* wildcards
        if (siteRegex.test(url)) {
            matchingSite = site; // First match always wins
            break;
        }
    }

//     console.log(matchingSite);
//     return;

//     var fields = {};
//     for (var site of sites) {
//         for (var keyIndex = 1; keyIndex <= 6; keyIndex++) {
//             fields[site + "_Key_" + keyIndex] = {
//                 label: "Key to press",
//                 type: "text"
//             };
//             fields[site + "_AnchorName_" + keyIndex] = {
//                 label: "Anchor name",
//                 type: "text"
//             };
//         }
//     }

    var fields = {};
    for (var keyIndex = 1; keyIndex <= 10; keyIndex++) {
        fields[matchingSite + "_Key_" + keyIndex] = {
            label: "Key to press:",
            title: "The single key to press to jump to this anchor",
            type: "text",
            labelPos: "above"
        };
        fields[matchingSite + "_AnchorName_" + keyIndex] = {
            label: "Anchor name:",
            title: "The anchor to jump to",
            type: "text"
        };
    }

    GM_config.init({
        id: 'AnchorHotkeysConfig',
        title: "Anchor Hotkeys Config for: " + matchingSite,
        fields: fields
    });

//     GM_config.init(
//         {
//             id: 'AnchorHotkeysConfig',
//             title: "Anchor Hotkeys Config",
//             fields:
//             {
//                 Site: {
//                     label: "Site (from user includes + matches)",
//                     type: "select",
//                     options: sites
//                 },
//                 Key: {
//                     label: "Key to press",
//                     type: "text"
//                 },
//                 AnchorName: {
//                     label: "Name of anchor to jump to",
//                     type: "text"
//                 }
//             }
//         });

//     var site = GM_config.get("Site");
//     var key = GM_config.get("Key");
//     var anchorName = GM_config.get("AnchorName");
//     alert(site + " " + key + " " + anchorName);

    GM_config.open();

    // These are the keys and anchors (including leading #) that those keys should jump to.
    var anchorKeys = {
        t: "#TOP",
        d: "#DueDateInfo",
        e: "#People",
        a: "#AssociatedRecords",
        i: "#Issues",
        n: "#Notes",
    };

    document.onkeyup = function(e) {
        // Find the corresponding anchor name (if any)
//         var anchorName = anchorKeys[e.key];
        var anchorName;
        for (var keyIndex = 1; keyIndex <= 10; keyIndex++) {
            if (GM_config.get(matchingSite + "_Key_" + keyIndex) == e.key) {
                anchorName = GM_config.get(matchingSite + "_AnchorName_" + keyIndex);
                break;
            }
        }
        if(!anchorName) { return; }

        // If the URL is already pointed to the spot we're interested in, remove it so we can re-add it and jump there again.
        if(window.location.hash == anchorName) {
            window.location.hash = "";
        }

        window.location.hash = anchorName;
    }
})();