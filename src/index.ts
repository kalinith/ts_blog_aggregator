import { readConfig, setUser } from "./config";
import { CommandsRegistry, HandlerLogin, RegisterCommand, RunCommand } from "./commands";

function main() {
  const commandRegistry: CommandsRegistry= {};

  RegisterCommand(commandRegistry, "login", HandlerLogin);

  const { argv } = require('node:process');
  if (length(argv) > 2) {
    console.log(argv)
  }
  // print process.argv
  // argv.forEach((val, index) => {
  // console.log(`${index}: ${val}`);
  // });  

}

main();
