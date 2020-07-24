This script adds customizable, one-button hotkeys to any site for jumping to anchor tags with a particular name.

### How to Use
1. Add the sites you want to either the user includes or user matches - this script only runs on the greasyfork installation page for this script by default (feel free to remove that one).
2. Open one of the pages that match your sites.
3. Open the settings page using either Ctrl+Comma or the sub-menu item for the script.
4. Enter the single-button hotkeys (to link multiple keys to the same anchor, separate with spaces) + either anchor names (`<a id="X">` or `<a name="X">`) or text to jump to.
5. Save and close the settings and reload the page.
6. Now, pressing the button in question should jump to the corresponding anchor or text.

### Notes
* This script uses the <b>first</b> matching user include/match to store/retrieve your settings, so I'd recommend against overlapping rules there.
* This script only supports single-button (non-modifier) hotkeys - that means hotkeys like `a`, not `Ctrl+a`.
* The settings are saved locally, so you should be able to export/import as needed using the "Storage" tab in Tampermonkey or similar.

---

#### Changelog
* 1.0 (1/22/20)
  * Initial release
* 1.1 (2/18/20)
  * Add support for multiple hotkeys per anchor (separate them with spaces)
  * Move settings to local storage so that they span sites.
    * **This does mean that you'll lose any existing hotkeys if you saved them on the previous version.**
    * This should allow users to export/import settings using the "Storage" tab in Tampermonkey
    * Sites like http*://www.google.com/* should now work from both HTTP and HTTPS versions of the page (not just the one you saved the hotkeys on)
* 1.2 (2/18/20)
  * Rename script (Anchor Hotkeys => Jump to Text)
  * Add support for jumping to specific text (within a single element) in addition to anchors
* 1.3 (3/14/20)
  * Add a default match (for this page) to abide by Greasy Fork's new guidelines. Feel free to disable this after install.
  * Fix issue with finding text in elements other than spans
* 1.4 (5/1/20)
  * Fix issue where saving any site would overwrite the config for all other sites
  * Close the config window on save, so it's clearer that something happened.
* 1.5 (6/4/20)
  * Slight tweak in how we store settings - any sites that contain periods (.) or question marks (?) will appear to lose their config - you can find the config in storage if needed.
* 1.6 (6/5/20)
  * Further simplifying how we store settings - you'll need to recreate your hotkeys after this update (but your old config will still be in storage if needed).
* 1.7 (7/24/20)
  * Ignore keys for 2 seconds after the context menu is opened, to avoid catching right-click + letter actions (from my own external scripts).

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/jumpToText)

Available on [Greasy Fork](https://greasyfork.org/en/scripts/395551-jump-to-text) for easy installation.
