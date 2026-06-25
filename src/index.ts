import { readConfig, setUser } from "./config";

function main() {
  console.log("Hello, world!");
  const config = readConfig();
  setUser(config, "Neil");
  const updatedConfig = readConfig();
  console.log("Updated config:", updatedConfig);
}


main();
