This script removes the target attribute from links with the specified path, so that clicking them opens in the current tab/window instead of a new one.

### How to Use
1. Add the sites you want to either the user includes or user matches - this script only runs on the greasyfork installation page for this script by default (feel free to remove that one).
2. Open one of the pages that match your sites.
3. Open the settings page using the sub-menu item for the script.
4. Enter jQuery-style selectors for the links that you want to open in the same tab/window.
5. Save and close the settings.
6. Repeat for other sites.

After that, the links you've specified should always open in the same tab/window.

### Notes
* This script uses the <b>first</b> matching user include/match to store/retrieve your settings, so I'd recommend against overlapping rules there.
* The settings are saved locally, so you should be able to export/import as needed using the "Storage" tab in Tampermonkey or similar.

---

#### Changelog
* 1.0 (6/4/20)
  * Initial release

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/fixNewWindowLinks)

Available on [Greasy Fork](https://greasyfork.org/en/scripts/404695-fix-new-window-links-remove-target-attribute) for easy installation.
