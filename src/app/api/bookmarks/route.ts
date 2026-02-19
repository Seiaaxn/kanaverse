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

// GET /api/bookmarks - Get all bookmarks for current user
export async function GET(request: NextRequest) {
  try {
    // Check if Clerk is configured
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

    // Get type filter from query params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "komik" | "anime" | null

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

// POST /api/bookmarks - Add a bookmark
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
    const { type, itemId, title, thumbnail } = body;

    if (!type || !itemId || !title) {
      return NextResponse.json(
        { error: "Missing required fields: type, itemId, title" },
        { status: 400 }
      );
    }

    if (type !== "komik" && type !== "anime") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'komik' or 'anime'" },
        { status: 400 }
      );
    }

    // Create bookmark (upsert to handle duplicates)
    const bookmark = await prisma.bookmark.upsert({
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
      },
      create: {
        userId: user.id,
        type,
        itemId,
        title,
        thumbnail,
      },
    });

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}

// DELETE /api/bookmarks - Remove a bookmark
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

    if (!type || !itemId) {
      return NextResponse.json({ error: "Missing required params: type, itemId" }, { status: 400 });
    }

    // Delete bookmark
    await prisma.bookmark.delete({
      where: {
        userId_type_itemId: {
          userId: user.id,
          type,
          itemId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}
  
