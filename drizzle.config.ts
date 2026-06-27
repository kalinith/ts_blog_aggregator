import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const config = readConfig();
const connectionstring = config.dbUrl;

export default defineConfig({
  schema: "src/lib/db/schema/schema.ts",
  out: "src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionstring,
  },
});

