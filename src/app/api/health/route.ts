import { NextResponse } from "next/server";
import packageJson from "../../../../package.json";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: "connected" | "disconnected" | "skipped";
    api: "operational";
  };
}

export async function GET() {
  const startTime = Date.now();

  const health: HealthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: packageJson.version,
    checks: {
      database: "skipped",
      api: "operational",
    },
  };

  // Check database connection if available
  try {
    const skipDB = process.env.SKIP_DB_CONNECTION === "true";
    const dbUrl = process.env.DATABASE_URL;

    if (!skipDB && dbUrl && !dbUrl.includes("dummy")) {
      const { prisma } = await import("@/lib/prisma");

      if (prisma) {
        await prisma.$queryRaw`SELECT 1`;
        health.checks.database = "connected";
      } else {
        health.checks.database = "disconnected";
      }
    }
  } catch {
    health.checks.database = "disconnected";
    // Don't fail health check for DB issues in development
    if (process.env.NODE_ENV === "production") {
      health.status = "unhealthy";
    }
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      ...health,
      responseTime: `${responseTime}ms`,
    },
    {
      status: health.status === "healthy" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
    }
