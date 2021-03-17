This script redirects user-specified URLs to new ones, by replacing part of the URL.

### How to Use
1. Reload this Greasyfork installation page - the script only matches this page by default, but running here will create the default settings structure in the script's storage for you.
2. Add the sites you want to either the user includes or user matches - this script only runs on the greasyfork installation page for this script by default (feel free to remove that one).
3. Locate the storage for this script in your script manager (Greasemonkey, Tampermonkey, etc.). You should see some settings JSON already built. Fill out the settings as desired (see Settings section below).
4. Now, loading a matching page should redirect as you specified in the settings.

### Settings
The settings live in the script's storage as JSON. Here's what the different pieces mean:
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

The script will redirect `https://www.google.com/BIT/1/asdf` to `https://www.google.com/BIT/BLUE/asdf`, but will not change `https://www.google.com/1/asdf` (because it doesn't match the prefix).

---

#### Changelog
* 1.0 (5/11/20)
  * Initial release
* 1.1 (3/17/21)
  * Make URL matching case-insensitive

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/urlReplacerRedirector ). Please direct all issues/questions there.

Available on [Greasy Fork](https://greasyfork.org/en/scripts/403100-url-replacer-redirector ) for easy installation.