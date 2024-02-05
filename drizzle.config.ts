import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import type { Config } from 'drizzle-kit';

const config: Config = {
  driver: 'pg',
  schema: "./src/lib/db/scheema.ts",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};

export default config;
