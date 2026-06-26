import { argv, exit } from "node:process";
//import { readConfig, setUser } from "./config";
import { CommandsRegistry, HandlerLogin, RegisterCommand, CommandHandler, RunCommand } from "./commands";

function async main() {
  const commandRegistry: CommandsRegistry= {};
  const commands: Record<string, Function> = {
    "login": HandlerLogin,
  };

  (Object.entries(commands) as [string, CommandHandler][]).forEach(([key, value]) => {
    RegisterCommand(commandRegistry, key, value);
  });

  const cmdName = argv[2];
  const args = argv.slice(3);

  if (cmdName === undefined || cmdName === "") {
    console.log(`no command entered`);
    exit(1);
  }
  try {
    await RunCommand(commandRegistry, cmdName, ...args);

  } catch (error) {
    console.error(`error running command: ${error}`)
    exit(1);
  };
  process.exit(0);
}

main();
