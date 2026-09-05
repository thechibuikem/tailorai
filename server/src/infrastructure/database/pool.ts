// import "dotenv/config";
// dotenv.config()

import { Pool } from "pg";
import { getUrls } from "../../config/urls.js";

const { databaseUrl } = getUrls();
console.log("databaseUrl", databaseUrl);

export const pool = new Pool({ connectionString: databaseUrl });

export async function connectDB() {
  // Tests the pool to make sure Postgres is actually online and responding
  await pool.query("SELECT 1");
  console.log("Database connected successfully");
}
