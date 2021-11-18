This script adds an export button to the subscription section of the youtube sidebar, that generates an OPML file of RSS feeds for your subscriptions. The OPML file can be imported into RSS readers to track your subscriptions as RSS feeds.

NOTE: this does not currently work with Greasemonkey, for reasons I've yet to determine. I'd recommend you use Tampermonkey instead (at least for this script) in the meantime.

### How to Use
1. Load a youtube "home" page (something that has the subscriptions list in the sidebar on the left).
2. Expand the list of subscriptions in the sidebar (click the "Show X More" button) - the script can only include feeds for channels that appear in the sidebar.
3. Click the extension option to download your OPML file.
4. Import it in the RSS reader of your choice.

If you get an invalid OPML file or are missing subscriptions that you expect, please include your subscription sidebar's HTML in your GitHub issue, as I've no way to tell what YouTube is serving any given user/browser/operating system.

---

#### Changelog
* 1.0 (12/12/20)
  * Initial release
* 1.1 (1/31/21)
  * Fix issue with slightly-differently-formatted links in sidebar
* 1.2 (2/6/21)
  * Add a fallback method for figuring out where to put the button when we can't find a "Subscriptions" label (use the second section header).
* 1.3 (3/3/21)
  * Reduce styling around button so it stays outside of the first subscription's click target.
* 1.4 (3/18/21)
  * Move option into the extension (Tampermonkey, Greasemonkey, etc.) menu instead of trying to add a button to YouTube's ever-variable layout.
* 1.5 (4/30/21)
  * Relax requirements for finding subscriptions slightly - now anything with "/channel/" in it (except studio.youtube.com links) should be found.
* 1.6 (5/3/21)
  * Better support Greasemonkey by trying GM.registerMenuCommand before GM_registerMenuCommand.
* 1.7 (9/9/21)
  * Update how we find channel IDs to support new sidebar link format (thanks bcc32!)

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/youtubeRSSExport ). Please direct all issues/questions there.

Available on [Greasy Fork](https://greasyfork.org/en/scripts/418574-export-youtube-subscriptions-to-rss-opml ) for easy installation.