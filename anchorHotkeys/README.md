This script adds customizable, one-button hotkeys to any site for jumping to anchor tags with a particular name.

### HOW TO USE
1. Add the sites you want to either the user includes or user matches - this script does not run on any sites by default.
2. Open one of the pages that match your sites.
3. Open the settings page using either Ctrl+Comma or the sub-menu item for the script.
4. Pick the single-button hotkeys and the corresponding anchor names (`<a id="X">` or `<a name="X">`) that go with them
5. Save and close the settings and reload the page.
6. Now, pressing the button in question should jump to the corresponding anchor.

### NOTES
* This script uses the <b>first</b> matching user include/match to store/use your settings, so I'd recommend against overlapping rules there.
* This script only supports single-button (non-modifier) hotkeys - that means hotkeys like `a`, not `Ctrl+a`.

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/anchorHotkeys)

Available on [Greasy Fork](https://greasyfork.org/en/scripts/395551-anchor-hotkeys) for easy installation.
