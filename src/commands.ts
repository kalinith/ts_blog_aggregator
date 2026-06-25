import { setUser } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

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

export function RunCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (!registry[cmdName]) {
        console.log(`command "${cmdName}" is invalid`);
    }
    const result = registry[cmdName](cmdName, ...args);
    console.log(result);
};

export function HandlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length === 0) {
        throw new Error(`Username is required for login command`);
    }
    setUser(args[0]);
    console.log(`User ${args[0]} logged in successfully`);
};

