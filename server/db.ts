import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;
let db: any = null;

try {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set. Database features will be disabled.");
  } else {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 10
    });
    db = drizzle({ client: pool, schema });
    console.log("Database connection initialized");
  }
} catch (error) {
  console.error("Failed to initialize database:", error);
  console.warn("Continuing without database connection");
}

export { pool, db };
