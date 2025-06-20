This script redirects user-specified URLs to new ones, by replacing part of the URL.


NOTE: this script does NOT work in ViolentMonkey (as the extension does not provide access to user-overridden matches/includes, which this script requires).


----
# How to Use
1. Install with your extension of choice (Tampermonkey, Greasemonkey, etc.)
2. In the script settings, add the sites you want to affect to either the **user includes** or **user matches**.
3. Navigate to one of your included/matched sites - this script should be active, and you should see a **Configure redirect settings** option. *If not, something is wrong with your user includes/matches.*
4. Click the **Configure redirect settings** option to show the config pane. See the **Settings** section below for how to use it.
5. After saving your settings, redirection should be active - navigate to a matching page to test it.


----
# Settings
This script works by replacing pieces of the URL.

## Simple
Each line in the **Targets** field will be replaced by the same line in the **Replacements** field.

For example, consider these settings:

| Targets | Replacements |
| ------- | ------------ |
| <span style="color:red">**In**</span>    | <span style="color:green">**Out**</span>   |
| <span style="color:orange">**Up**</span> | <span style="color:violet">**Down**</span> |

With these settings, we would redirect as follows:

| Page | Redirects To | Notes
| ---- | ------------ | -----
| https://www.google.com/<span style="color:red">**In**</span>/query | https://www.google.com/<span style="color:green">**Out**</span>/query | 
| https://www.google.com/<span style="color:red">**IN**</span>/query | https://www.google.com/<span style="color:green">**Out**</span>/query | We ignore case when matching (replacements match config casing)
| https://www.google.com/<span style="color:red">**IN**</span>/query/<span style="color:orange">**Up**</span>/<span style="color:red">**in**</span>/blog | https://www.google.com/<span style="color:green">**Out**</span>/query/<span style="color:violet">**Down**</span>/<span style="color:green">**Out**</span>/blog | All matches are replaced (including multiple of same target)

## Advanced
A URL-wide find/replace can be too much - it's very easy to replace something you don't want.

For example, say you want to redirect from company.com/**phone** to company.com/**call**. You might use these settings:

| Targets | Replacements |
| ------- | ------------ |
| <span style="color:red">**action**</span>   | <span style="color:green">**do**</span>    |
| <span style="color:orange">**phone**</span> | <span style="color:violet">**call**</span> |

That mostly works, but there's an issue:

| Page | Redirects To | Notes
| ---- | ------------ | -----
| company.com/<span style="color:orange">**phone**</span> | company.com/<span style="color:violet">**call**</span> | 
| company.com/<span style="color:red">**action**</span>/getinfo | company.com/<span style="color:green">**do**</span>/getinfo |
| company.com/<span style="color:red">**action**</span>/find-my-<span style="color:orange">**phone**</span> | company.com/<span style="color:green">**do**</span>/find-my-<span style="color:violet">**call**</span> | <-- We didn't want to replace <span style="color:orange">**phone**</span> here!

### Option 1: Make targets more specific

One way to get around this is add more text to the start and/or end of the targets (and since we want to keep that text, also add it to their replacements).

For example, we might add **company.com/** to the start to make sure we only replace our desired bit:

| Targets | Replacements |
| ------- | ------------ |
| <span style="color:red">**company.com/action**</span>   | <span style="color:green">**company.com/do**</span>    |
| <span style="color:orange">**company.com/phone**</span> | <span style="color:violet">**company.com/call**</span> |

This works fine, but it's clunky when we're adding the same text to the start/end of every target and replacement.

### Option 2: Prefix/Suffix options

If you're always adding the same text to the start/end of your targets (and replacements), you can instead use the **Prefix** and **Suffix** options.

Any text in these fields is added to the start/end of every target and replacement, so you don't have to add it manually.

So for our example above, we could instead use:

Prefix = **company.com/**

| Targets | Replacements |
| ------- | ------------ |
| <span style="color:red">**action**</span>   | <span style="color:green">**do**</span>    |
| <span style="color:orange">**phone**</span> | <span style="color:violet">**call**</span> |


----
# Changelog
* 1.0 (5/11/20)
  * Initial release
* 1.1 (3/17/21)
  * Make URL matching case-insensitive
* 2.0 (5/29/25): Major rewrite!
  * Added a proper settings page using [GM_Config](https://github.com/sizzlemctwizzle/GM_config):
    * No more messing around with JSON in extension/script storage!
    * The settings page can be launched from any included/matched site - look for the "Configure redirect settings" option under your extension (Tampermonkey, Greasemonkey, etc.) menu.
  * Added support for different settings per site (previously all sites used the same settings).

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/urlReplacerRedirector). Please direct all issues/questions there.

Available on [Greasy Fork](https://greasyfork.org/en/scripts/403100-url-replacer-redirector) for easy installation.