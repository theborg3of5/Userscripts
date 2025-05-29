This script redirects user-specified URLs to new ones, by replacing part of the URL.


# How to Use
1. Install with your extension of choice (Tampermonkey, Greasemonkey, etc.)
2. In the script settings, add the sites you want to affect to either the **user includes** or **user matches**.
3. Navigate to one of your included/matched sites - this script should be active, and you should see a **Configure redirect settings** option.
  * If you don't, then you haven't set up your user includes/matches correctly.
4. Click the **Configure redirect settings** option to show the config pane. See the **Settings** section below for how to use it.
5. After saving your settings, redirection should be active - navigate to a matching page to test it.


# Settings
This script works by replacing pieces of the URL.

## Simple
Each line in the **Targets** field will be replaced by the same line in the **Replacements** field.

For example, consider these settings:
| Targets | Replacements |
| ------- | ------------ |
| <font color="red">**In**</font>   | <font color="green">**Out**</font>    |
| <font color="orange">**Up**</font> | <font color="violet">**Down**</font> |

With these settings, we would redirect as follows:
| Page | Redirects To | Notes
| ---- | ------------ | -----
| https://www.google.com/<font color="red">**In**</font>/query | https://www.google.com/<font color="green">**Out**</font>/query | 
| https://www.google.com/<font color="red">**IN**</font>/query | https://www.google.com/<font color="green">**Out**</font>/query | We ignore case when matching (replacements match config casing)
| https://www.google.com/<font color="red">**IN**</font>/query/<font color="orange">**Up**</font>/<font color="red">**in**</font>/blog | https://www.google.com/<font color="green">**Out**</font>/query/<font color="violet">**Down**</font>/<font color="green">**Out**</font>/blog | All matches are replaced (including multiple of same target)

## Advanced
A URL-wide find/replace can be too much - it's very easy to replace something you don't want.

For example, say you want to redirect from company.com/**phone** to company.com/**call**. You might use these settings:
| Targets | Replacements |
| ------- | ------------ |
| <font color="red">**action**</font>   | <font color="green">**do**</font>    |
| <font color="orange">**phone**</font> | <font color="violet">**call**</font> |

That mostly works, but there's an issue:
| Page | Redirects To | Notes
| ---- | ------------ | -----
| company.com/<font color="orange">**phone**</font> | company.com/<font color="violet">**call**</font> | 
| company.com/<font color="red">**action**</font>/getinfo | company.com/<font color="green">**do**</font>/getinfo |
| company.com/<font color="red">**action**</font>/find-my-<font color="orange">**phone**</font> | company.com/<font color="green">**do**</font>/find-my-<font color="violet">**call**</font> | <-- We didn't want to replace <font color="orange">**phone**</font> here!

### Option 1: Make targets more specific

On way to get around this is add more text to the start and/or end of the targets (and since we want to keep that text, also add it to their replacements).

For example, we might add **company.com/** to the start to make sure we only replace our desired bit:
| Targets | Replacements |
| ------- | ------------ |
| <font color="red">**company.com/action**</font>   | <font color="green">**company.com/do**</font>    |
| <font color="orange">**company.com/phone**</font> | <font color="violet">**company.com/call**</font> |

This works fine, but it's clunky when we're adding the same text to the start/end of every target and replacement.

### Option 2: Prefix/Suffix options

If you're always adding the same text to the start/end of your targets (and replacements), you can instead use the **Prefix** and **Suffix** options.

Any text in these fields is added to the start/end of every target and replacement, so you don't have to add it manually.

So for our example above, we could instead use:

Prefix = **company.com/**

| Targets | Replacements |
| ------- | ------------ |
| <font color="red">**action**</font>   | <font color="green">**do**</font>    |
| <font color="orange">**phone**</font> | <font color="violet">**call**</font> |


# Changelog
* 1.0 (5/11/20)
  * Initial release
* 1.1 (3/17/21)
  * Make URL matching case-insensitive
* 1.2 (5/29/25): Major rewrite!
  * Added a proper settings page using [GM_Config](https://github.com/sizzlemctwizzle/GM_config):
    * No more messing around with JSON in extension/script storage!
    * The settings page can be launched from any included/matched site - look for the "Configure redirect settings" option under your extension (Tampermonkey, Greasemonkey, etc.) menu.
  * Added support for different settings per site (previously all sites used the same settings).

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/urlReplacerRedirector). Please direct all issues/questions there.

Available on [Greasy Fork](https://greasyfork.org/en/scripts/403100-url-replacer-redirector) for easy installation.