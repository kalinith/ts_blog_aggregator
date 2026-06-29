import { and, eq, ne } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema/schema";
import { FirstOrUndefined } from "./utils";

export async function createFeedFollow(feedId: string, userId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({
        userId,
        feedId,
    }).returning();
    return await getFeedFollows(newFeedFollow.id)
}

export async function getFeedFollows(feedFollowsId: string) {
    const [feedFollow] = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userName: users.name,
        feedName: feeds.name,
    }).from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.id, feedFollowsId));
    if (feedFollow === undefined) {
        throw new Error(`failed to fetch feed`);
    }
    return feedFollow;    
}

export async function getFeedFollowsForUser(user: string) {

    const usersFeeds = await db.select({
        name: users.name,
        feedName: feeds.name,
    }).from(users)
        .innerJoin(feedFollows, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(users.name, user));
    return usersFeeds;    
}

export async function getFeedFollowsUserFeed(userID: string, feedID: string) {
    const feedFollow = await db.select().from(feedFollows).where(and(
        eq(feedFollows.userId, userID),
        eq(feedFollows.feedId,feedID)
    ))
    return FirstOrUndefined(feedFollow);
}
 
export async function deleteFeedFollows(feedFollowsID: string) {
    await db.delete(feedFollows).where(eq(feedFollows.id, feedFollowsID));
}