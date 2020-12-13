// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/
// @grant        none
// ==/UserScript==

function exportSubscriptions() {
    var channels = [];
    var inChannels = false;

    var links = document.querySelectorAll("div#items a#endpoint[href]"); // Sidebar links
    for(var i = 0; i < links.length; i++) {
        var href = links[i].href;
        var title = links[i].getAttribute("title");

        if(href.indexOf("www.youtube.com/channel/") > -1) { // Found our first channel
            inChannels = true;
        }

        if(inChannels) {
            if(href.indexOf("www.youtube.com/channel/") === -1) { // Once we're in the channels block, any link that's not to a channel means we've exited it and are finished.
                break;
            }

            var channelId = href.substring(href.lastIndexOf("www.youtube.com/channel/") + "www.youtube.com/channel/".length, href.length);
            channels.push({"title":title, "id":channelId});
        }
    }

    // Build XML for OPML file
    var xml = buildXML(channels);

    var fileType = "text/plain";
    var blob = new Blob([xml], {type: fileType});
    var blobURL = window.URL.createObjectURL(blob);

    var filename = "youtubeSubscriptions.opml";
    var downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", blobURL);
    downloadLink.setAttribute("download", filename);
    downloadLink.dataset.downloadurl = fileType + ":" + filename + ":" + blobURL;
    downloadLink.click();
}

function buildXML(channels) {
    // Goal structure:
    //  <opml version="1.0">
    //   <head>
    //    <title>YouTube Subscriptions as RSS</title>
    //   </head>
    //   <body>
    //    <outline text="YouTube Subscriptions" title="YouTube Subscriptions">
    //     <outline type="rss" text="" title="" xmlURL="" />
    //     ...
    //    </outline>
    //   </body>
    //  </opml>

    var xmlDoc = document.implementation.createDocument("", "", null);
    var opml = xmlDoc.createElement("opml");
    opml.setAttribute("version", "1.0");

    var head = xmlDoc.createElement("head");
    var title = xmlDoc.createElement("title");
    title.innerHTML = "YouTube Subscriptions as RSS";
    head.appendChild(title);
    opml.appendChild(head);

    var body = xmlDoc.createElement("body");
    var parentOutline = xmlDoc.createElement("outline");
    parentOutline.setAttribute("text", "YouTube Subscriptions")
    parentOutline.setAttribute("title", "YouTube Subscriptions")

    var youtubeRSSPrefix = "https://www.youtube.com/feeds/videos.xml?channel_id=";
    for(var j = 0; j < channels.length; j++) {
        var outline = xmlDoc.createElement("outline");
        outline.setAttribute("type", "rss");
        outline.setAttribute("text", channels[j].title);
        outline.setAttribute("title", channels[j].title);
        outline.setAttribute("xmlUrl", youtubeRSSPrefix + channels[j].id);
        parentOutline.appendChild(outline);
    }

    body.appendChild(parentOutline);

    opml.appendChild(body);
    xmlDoc.appendChild(opml);

    var s = new XMLSerializer();
    return s.serializeToString(xmlDoc);
}

function addButton() {
    // Find the subscriptions section label
    var sectionLabels = document.querySelectorAll("yt-formatted-string#guide-section-title");
    var subscriptionLabel;
    for(var i = 0; i < sectionLabels.length; i++) {
        if(sectionLabels[i].innerHTML === "Subscriptions") {
            subscriptionLabel = sectionLabels[i].parentElement;
            break;
        }
    }

    // Create and insert button
    var button = document.createElement("button");
    button.title = "Export subscriptions as OPML file for RSS readers. Make sure to expand subscriptions in sidebar first.";
    button.innerHTML = "Export";
    button.style.fontWeight = "bold";
    button.style.float = "right";
    button.style.marginBottom = "2px";
    button.style.marginRight = "30px";
    button.id = "exportOPMLButton";
    button.addEventListener("click", exportSubscriptions);
    subscriptionLabel.appendChild(button);
}

window.onload = addButton;