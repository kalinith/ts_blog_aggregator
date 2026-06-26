import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const config = readConfig();
const connectionstring = config.dbUrl;

export default defineConfig({
  schema: "src/schema.ts",
  out: "src/lib/db",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionstring,
  },
});

