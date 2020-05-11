This script redirects user-specified URLs to new ones, by replacing part of the URL.

### How to Use
1. Add the sites you want to either the user includes or user matches - this script only runs on the greasyfork installation page for this script by default (feel free to remove that one).
2. Open one of the pages that you added (or reload the greasyfork installation page for this script). This will create the settings structure in the script's storage.
3. Edit the script in Tampermonkey, and switch to the Storage tab. You should see some JSON already built. Fill out the settings as desired (see Settings section below).
4. Now, loading a matching page should redirect as you specified in the settings.

### Settings
The settings live in the scripts storage as JSON. Here's what the different pieces mean:
* replacePrefix: this is the prefix that will be added to both sides of the replaceTheseStrings array.
* replaceSuffix: this is the suffix that will be added to both sides of the replaceTheseStrings array.
* replaceTheseStrings: this is an associative array of strings to replace in the URL when this script runs.

### Example
If your settings are as follows:

    {
      "replacePrefix": "/BIT/",
      "replaceSuffix": "/",
      "replaceTheseStrings": {
        "1": "BLUE",
        "2": "RED",
        "4": "WHITE",
        "9": "PURPLE"
      }
    }

The script will redirect pages (which match the script-level includes/matches) that contain `/BIT/1/` to the same URL, but with `/BIT/BLUE/` for the matched piece instead.

---

#### Changelog
* 1.0 (5/11/20)
  * Initial release

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/urlReplacerRedirector)

Available on [Greasy Fork](https://greasyfork.org/en/scripts/403100-url-replacer-redirector) for easy installation.