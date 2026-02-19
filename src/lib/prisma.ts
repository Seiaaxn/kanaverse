import "server-only";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Global singleton pattern for Vercel serverless
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production";

// Validate DATABASE_URL exists (fail fast)
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Please set it in your environment variables.");
}

// Create connection pool optimized for Vercel serverless + Supabase
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    // Serverless optimization: minimal connections
    max: isProduction ? 1 : 5, // 1 connection per serverless function in prod
    min: 0, // Allow scaling to zero
    idleTimeoutMillis: 10000, // Close idle connections after 10s
    connectionTimeoutMillis: 5000, // Fast fail for serverless cold starts
  });

const adapter = new PrismaPg(pool);

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["error", "warn"],
  });

// ALWAYS cache globally (critical for serverless to prevent connection exhaustion!)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export { prisma };
