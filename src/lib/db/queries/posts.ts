import { RSSItem } from "src/feeds";
import { db } from "..";
import { feedFollows, posts, users } from "../schema/schema";
import { timeCheck } from "src/lib/time";
import { asc, eq } from "drizzle-orm";


// Create a createPost function. This should insert a new post into the database.
export async function createPost(feedId:string, rssItem: RSSItem) {
    const [result] = await db.insert(posts).values({
          title: rssItem.title,
          url: rssItem.link,
          description: rssItem.description,
          publishedAt: timeCheck(rssItem.pubDate),
          feedId: feedId
    }).returning();
    if (result === undefined) {
        console.log(`post failed to save: ${rssItem.title}`);
        return;
    }
    if (timeCheck(rssItem.pubDate) === null) {
        console.log(`time issue discovered with : "${rssItem.pubDate}"`);
    }
    console.log(`Post "${result.title}" saved`);
}

// Create a getPostsForUser function. Order the results so that the most recent posts are first.
//  Make the number of posts returned configurable.
export async function getPostsForUser(userId: string, PostsQty: number) {
    return await db.select()
        .from(posts)
        .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
        .where(eq(feedFollows.userId, userId))
        .orderBy(asc(posts.publishedAt))
        .limit(PostsQty);
}

