This script adds customizable, one-button hotkeys to any site for jumping to anchor tags with a particular name.

### HOW TO USE
1. Add the sites you want to either the user includes or user matches - this script does not run on any sites by default.
2. Open one of the pages that match your sites.
3. Open the settings page using either Ctrl+Comma or the sub-menu item for the script.
4. Pick the single-button hotkeys (to link multiple keys to the same anchor, separate with spaces) and the corresponding anchor names (`<a id="X">` or `<a name="X">`) that go with them
5. Save and close the settings and reload the page.
6. Now, pressing the button in question should jump to the corresponding anchor.

### NOTES
* This script uses the <b>first</b> matching user include/match to store/use your settings, so I'd recommend against overlapping rules there.
* This script only supports single-button (non-modifier) hotkeys - that means hotkeys like `a`, not `Ctrl+a`.
* The settings are saved locally, so you should be able to export/import as needed using the "Storage" tab in Tampermonkey or similar.

---

#### Changelog
* 1.0 (1/22/20) - Initial release
* 1.1 (2/18/20)
  * Add support for multiple hotkeys per anchor (separate them with spaces)
  * Move settings to local storage so that they span sites.
    * **This does mean that you'll lose any existing hotkeys if you saved them on the previous version.**
    * This should allow users to export/import settings using the "Storage" tab in Tampermonkey
    * Sites like http*://www.google.com/* should now work from both HTTP and HTTPS versions of the page (not just the one you saved the hotkeys on)

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/anchorHotkeys)

Available on [Greasy Fork](https://greasyfork.org/en/scripts/395551-anchor-hotkeys) for easy installation.
