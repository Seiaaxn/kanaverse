import { NextRequest, NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/auth-config";
import { getOrCreateUser } from "@/lib/user";

// Dynamic import for prisma to avoid build errors when DB is not configured
async function getPrisma() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

// GET /api/history - Get reading/watching history for current user
export async function GET(request: NextRequest) {
  try {
    if (!isClerkConfigured()) {
      return NextResponse.json({ error: "Authentication not configured" }, { status: 501 });
    }

    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getPrisma();
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 501 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const history = await prisma.history.findMany({
      where: {
        userId: user.id,
        ...(type ? { type } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

// POST /api/history - Add or update reading/watching progress
export async function POST(request: NextRequest) {
  try {
    if (!isClerkConfigured()) {
      return NextResponse.json({ error: "Authentication not configured" }, { status: 501 });
    }

    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getPrisma();
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 501 });
    }

    const body = await request.json();
    const { type, itemId, title, thumbnail, progress, progressTitle } = body;

    if (!type || !itemId || !title || !progress) {
      return NextResponse.json(
        { error: "Missing required fields: type, itemId, title, progress" },
        { status: 400 }
      );
    }

    if (type !== "komik" && type !== "anime") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'komik' or 'anime'" },
        { status: 400 }
      );
    }

    // Upsert history entry
    const historyEntry = await prisma.history.upsert({
      where: {
        userId_type_itemId: {
          userId: user.id,
          type,
          itemId,
        },
      },
      update: {
        title,
        thumbnail,
        progress,
        progressTitle,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        type,
        itemId,
        title,
        thumbnail,
        progress,
        progressTitle,
      },
    });

    return NextResponse.json({ history: historyEntry }, { status: 201 });
  } catch (error) {
    console.error("Error updating history:", error);
    return NextResponse.json({ error: "Failed to update history" }, { status: 500 });
  }
}

// DELETE /api/history - Remove history entry
export async function DELETE(request: NextRequest) {
  try {
    if (!isClerkConfigured()) {
      return NextResponse.json({ error: "Authentication not configured" }, { status: 501 });
    }

    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getPrisma();
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 501 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const itemId = searchParams.get("itemId");
    const clearAll = searchParams.get("clearAll") === "true";

    if (clearAll) {
      // Clear all history for user
      await prisma.history.deleteMany({
        where: {
          userId: user.id,
          ...(type ? { type } : {}),
        },
      });
    } else if (type && itemId) {
      // Delete specific history entry
      await prisma.history.delete({
        where: {
          userId_type_itemId: {
            userId: user.id,
            type,
            itemId,
          },
        },
      });
    } else {
      return NextResponse.json(
        { error: "Missing required params: (type and itemId) or clearAll" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting history:", error);
    return NextResponse.json({ error: "Failed to delete history" }, { status: 500 });
  }
}
