import { argv, exit } from "node:process";
import { CommandsRegistry, HandlerLogin, RegisterCommand, CommandHandler, RunCommand, HandlerRegister, HandlerReset, HandlerUsers, HandlerAgg, HandlerAddFeed, HandlerGetAllFeeds, HandlerFollow, HandlerFollowing, middlewareLoggedIn, HandlerUnFollow, HandlerBrowse } from "./commands";

async function main() {
  const commandRegistry: CommandsRegistry= {};
  const commands: Record<string, Function> = {
    "login": HandlerLogin,
    "register": HandlerRegister,
    "reset": HandlerReset,
    "users": HandlerUsers,
    "agg": HandlerAgg,
    "addfeed": middlewareLoggedIn(HandlerAddFeed),
    "feeds": HandlerGetAllFeeds,
    "follow": middlewareLoggedIn(HandlerFollow),
    "following": middlewareLoggedIn(HandlerFollowing),
    "unfollow": middlewareLoggedIn(HandlerUnFollow),
    "browse": middlewareLoggedIn(HandlerBrowse)
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
  exit(0);
}

main();
