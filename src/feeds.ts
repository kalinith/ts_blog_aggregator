import { XMLParser} from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    console.log(`Fetching feed from: ${feedURL}`);
    const response = await fetch(feedURL, {
        method: "GET",
        mode: "cors",
        headers: {
            "User-Agent": "gator",
        },
    });
    if (!response.ok) {
        throw new Error(`failed to fetch feed: ${response.status}`);
    }
    const rssText = await response.text();
    const parser = new XMLParser({
        processEntities: false,
    });
    const jObj = parser.parse(rssText);
    if (!jObj.rss || !jObj.rss.channel) {
        throw new Error("channel field missing from feed");
    }
    const channel = jObj.rss.channel;
    if (!channel.title || !channel.link || !channel.description) {
        throw new Error("malformed channel field");
    }
    let items;
    if (!channel.item) {
        items = [];
    } else if (Array.isArray(channel.item)) {
        items = channel.item;
    } else {
        items = [channel.item];
    };
    const rssItems: RSSItem[] = [];
    for (const item of items) {
        if (item.title && item.link && item.description && item.pubDate) {
            rssItems.push({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate,
            });
        }
    }
    return {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: rssItems,
        },
    };
}