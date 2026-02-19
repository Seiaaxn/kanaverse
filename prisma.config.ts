// Prisma configuration for Vercel + Supabase
// See: https://pris.ly/d/config-datasource
import "dotenv/config";
import { defineConfig } from "prisma/config";

// Use DATABASE_URL if available, otherwise use a placeholder for build
const databaseUrl =
  process.env["DATABASE_URL"] || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
