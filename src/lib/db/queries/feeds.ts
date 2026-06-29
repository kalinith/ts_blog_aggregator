import { db } from "..";
import { feeds, users } from "../schema/schema";
import { eq } from "drizzle-orm";
//import { FirstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds).values({
        name: name,
        url: url,
        userId: userId,
  }).returning();
  return result;
}

export async function getFeeds() {
    return await db.select().from(feeds)
}

export async function getFeed(url: string) {
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
    if (feed === undefined) {
        throw new Error(`URL not found, create feed first: ${url}`);
    }
    return feed;
}

export async function markFeedFetched(feedId: string) {
    const dateTime = new Date();
    const feed = await db.update(feeds).set({
        updatedAt: dateTime,
        lastFetchedAt: dateTime
    }).where(eq(feeds.id,feedId)).returning();
    if (feed === undefined) {
        console.log(`no feeds updated`);
        return;
    }
    console.log(`updated ${feed.length} feeds`);
}

export async function getNextFeedToFetch() {
    if () {
        
    }
}