import { setUser } from "./config";
import { createUser, getUser } from "./lib/db/queries/user";
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
    console.log(`successfully registered command "${cmdName}"`);
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
