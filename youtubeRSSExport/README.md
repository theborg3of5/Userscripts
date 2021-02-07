This script adds an export button to the subscription section of the youtube sidebar, that generates an OPML file of RSS feeds for your subscriptions. The OPML file can be imported into RSS readers to track your subscriptions as RSS feeds.

### How to Use
1. Load a youtube "home" page (something that has the subscriptions list in the sidebar on the left).
2. Expand the list of subscriptions in the sidebar (click the "Show X More" button) - the script can only include feeds for channels that appear in the sidebar.
3. Click the button to download your OPML file, and import it in the RSS reader of your choice.

---

#### Changelog
* 1.0 (12/12/20)
  * Initial release
* 1.1 (1/31/21)
  * Fix issue with slightly-differently-formatted links in sidebar
* 1.2 (2/6/21)
  * Add a fallback method for figuring out where to put the button when we can't find a "Subscriptions" label (use the second section header).

---

Source: [GitHub](https://github.com/theborg3of5/Userscripts/tree/master/youtubeRSSExport ). Please direct all issues/questions there.

Available on [Greasy Fork](https://greasyfork.org/en/scripts/418574-export-youtube-subscriptions-to-rss-opml ) for easy installation.