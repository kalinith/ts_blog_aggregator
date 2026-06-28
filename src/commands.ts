import { exists, isConfig } from "drizzle-orm";
import { readConfig, setUser } from "./config";
import { createUser, deleteUsers, getUser, getUsers } from "./lib/db/queries/user";
import { fetchFeed } from "./feeds";
// import { users } from "./schema";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

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
