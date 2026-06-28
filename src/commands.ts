import { exists, isConfig } from "drizzle-orm";
import { readConfig, setUser } from "./config";
import { createUser, deleteUsers, getUser, getUserById, getUsers } from "./lib/db/queries/user";
import { fetchFeed } from "./feeds";
import { createFeed, getFeed, getFeeds } from "./lib/db/queries/feeds";
import { feeds, users } from "./lib/db/schema/schema";
import { createFeedFollow, getFeedFollows, getFeedFollowsForUser } from "./lib/db/queries/feedfollows";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export type CommandsRegistry = {
    [cmdName: string]: CommandHandler;
};

export function RegisterCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    if (cmdName === "") {
        throw new Error(`expected value for command name`);
    };
    registry[cmdName] = handler;
    //console.log(`successfully registered command "${cmdName}"`);
};

export async function RunCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    if (!registry[cmdName]) {
        throw new Error(`command "${cmdName}" is invalid`);
    }
    await registry[cmdName](cmdName, ...args);
};

export async function HandlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error(`Username is required for login command`);
    }
    const existingUser = await getUser(args[0]);
    if (existingUser === undefined) {
        throw new Error(`user ${args[0]} has not registered`);
    }
    setUser(args[0]);
    console.log(`User ${args[0]} logged in successfully`);
};

export async function HandlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0 || args[0] === "") {
        throw new Error(`Username is required for register command`);
    };
    const userName = args[0];
    const existing = await getUser(userName);
    if (existing !== undefined) {
        throw new Error(`Username ${userName} exists`);
    };
    const user = await createUser(userName);
    setUser(user.name);
    console.log(`user with name "${userName}" was created with the following data:\n`);
    console.log(user);
};

export async function HandlerReset(cmdName: string, ...args: string[]): Promise<void> {
    try {
        await deleteUsers();
        console.log(`User table cleared.`);
    } catch {
        console.log(`failed to clear user table.`);
        process.exit(1);
    }
};

export async function HandlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    const config = readConfig();
    const users = await getUsers();
    const currentUser = config.currentUserName;
    for (const user of users) {
        if (user.name === currentUser) {
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
        
    }

}

export async function HandlerAgg(cmdName: string, ...args: string[]): Promise<void> {
    // if (args.length === 0 || args[0] === "") {
    //     throw new Error(`URL is required for Aggregator`);
    // };
    const feedURL = "https://www.wagslane.dev/index.xml";
    const result = await fetchFeed(feedURL);
    console.log(result);
}

export async function HandlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0 || args[0] === "" || args[1] === "") {
         throw new Error(`URL and name are required for Aggregator`);
    };
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user || user.id === "") {
        throw new Error(`user not found: ${config.currentUserName}`);
    }
    const feed = await createFeed(args[0], args[1], user.id);
    const feedadded = await createFeedFollow(feed.id, user.id);
    printFeed(feed, user);
}

export async function HandlerGetAllFeeds(cmdName: string, ...args: string[]): Promise<void> {
    const feeds = await getFeeds();
    for (const feed of feeds) {
        const user = await getUserById(feed.userId);
        if (user === undefined) {
            throw new Error(`user does not exist`);
        }
        printFeed(feed, user);
    };
}

export async function HandlerFollow(cmdName: string, ...args: string[]): Promise<void> {
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user || user.id === "") {
        throw new Error(`user not found: ${config.currentUserName}`);
    }
    if (args.length === 0 || args[0] === "") {
         throw new Error(`URL required for following`);
    };
    const feed = await getFeed(args[0]);
    const feedFollows = await createFeedFollow(feed.id, user.id);
    if (feedFollows === undefined) {
        throw new Error(`unable to follow feed`)
    }
    console.log(feedFollows);
}

export async function HandlerFollowing(cmdName: string, ...args: string[]): Promise<void> {
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user || user.id === "") {
        throw new Error(`user not found: ${config.currentUserName}`);
    }
    const feeds = await getFeedFollowsForUser(user.name);
    if (feeds.length === 0) {
        throw new Error(`no feeds found`)
    }
    for (const feed of feeds) {
        console.log(feed);
    }
}

function printFeed(feed: Feed, user: User) {
    console.log(`Name: ${feed.name}`);
    console.log(`URL: ${feed.url}`);
    console.log(`Added by: ${user.name}`);
}