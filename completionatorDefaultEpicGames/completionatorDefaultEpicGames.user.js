// ==UserScript==
// @name         Completionator - Default Epic Games
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.0
// @description  Default values into the Completionator bulk import form, for weekly free Epic Games Store games.
// @author       Gavin Borg
// @match        https://www.completionator.com/Collection/BulkImport
// ==/UserScript==

document.querySelector("#ddlPlatform").value = 32; // Platform = PC / Windows
document.querySelector("#ddlPlatform").dispatchEvent(new Event("change")) // Trigger changed event so following fields populate appropriately
document.querySelector("#rdoDigital").click(); // Format = Digital, click instead of setting value so it makes other fields appear correctly

// The above fields show and populate the format dropdown
window.setTimeout(function() {
    document.querySelector("#ddlDigitalFormatProvider").value = 1028; // Digital Format = Epic Games Store
}, 2000);