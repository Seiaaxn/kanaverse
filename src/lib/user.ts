import { auth, currentUser } from "@clerk/nextjs/server";

// Dynamic import for prisma
async function getPrisma() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

export interface DbUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get or create a user in the database based on Clerk authentication
 * This ensures the user exists in the database before any operations
 */
export async function getOrCreateUser(): Promise<DbUser | null> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  const prisma = await getPrisma();
  if (!prisma) {
    return null;
  }

  // Try to find existing user
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  // If user doesn't exist, create from Clerk data
  if (!user) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return null;
    }

    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

    try {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
          imageUrl: clerkUser.imageUrl || null,
        },
      });
    } catch (error) {
      // Handle race condition - user might have been created by webhook
      console.error("Error creating user, trying to fetch again:", error);
      user = await prisma.user.findUnique({
        where: { clerkId },
      });
    }
  }

  return user;
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string): Promise<DbUser | null> {
  const prisma = await getPrisma();
  if (!prisma) {
    return null;
  }

  return prisma.user.findUnique({
    where: { clerkId },
  });
}

/**
 * Update user information from Clerk
 */
export async function syncUserFromClerk(clerkId: string): Promise<DbUser | null> {
  const prisma = await getPrisma();
  if (!prisma) {
    return null;
  }

  const clerkUser = await currentUser();
  if (!clerkUser || clerkUser.id !== clerkId) {
    return null;
  }

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  return prisma.user.upsert({
    where: { clerkId },
    update: {
      ...(email ? { email } : {}),
      name,
      imageUrl: clerkUser.imageUrl || null,
      updatedAt: new Date(),
    },
    create: {
      clerkId,
      email: email || `${clerkId}@temp.local`,
      name,
      imageUrl: clerkUser.imageUrl || null,
    },
  });
                    }
                    
