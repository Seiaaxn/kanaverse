import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Dynamic import for prisma
async function getPrisma() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  // Get the webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // Get the event type
  const eventType = evt.type;

  const prisma = await getPrisma();
  if (!prisma) {
    console.error("Database not configured");
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        const email = email_addresses?.[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        if (!email) {
          console.error("No email found for user:", id);
          return NextResponse.json({ error: "No email found" }, { status: 400 });
        }

        // Create user in database
        await prisma.user.create({
          data: {
            clerkId: id,
            email,
            name,
            imageUrl: image_url || null,
          },
        });

        console.log(`User created: ${id} (${email})`);
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        const email = email_addresses?.[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        // Update user in database
        await prisma.user.update({
          where: { clerkId: id },
          data: {
            ...(email ? { email } : {}),
            name,
            imageUrl: image_url || null,
            updatedAt: new Date(),
          },
        });

        console.log(`User updated: ${id}`);
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        if (!id) {
          console.error("No user ID found in delete event");
          return NextResponse.json({ error: "No user ID found" }, { status: 400 });
        }

        // Delete user from database (cascade will delete bookmarks and history)
        await prisma.user.delete({
          where: { clerkId: id },
        });

        console.log(`User deleted: ${id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error processing webhook ${eventType}:`, error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
          }
        
