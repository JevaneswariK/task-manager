import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // path to your NextAuth

// 🔹 Prevent multiple PrismaClient instances in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 🔹 Get the logged-in user session
async function getSession(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

// 🟢 CREATE a task (POST)
export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    const { title, description, tag, priority } = await req.json();

    const task = await prisma.task.create({
      data: {
        title,
        description,
        completed: false,
        userId: session.user.id, // Save user ID
        tag: tag || null,
        priority: priority || null,
      },
    });

    return NextResponse.json(task);
  } catch (err: any) {
    console.error("Failed to create task:", err);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// 🔵 READ all tasks (GET)
export async function GET() {
  try {
    const session = await getSession(new Request("")); // Get session
    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id }, // Only user's tasks
      orderBy: { id: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (err: any) {
    console.error("Failed to fetch tasks:", err);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// 🟡 UPDATE task (PUT)
export async function PUT(req: Request) {
  try {
    const session = await getSession(req);
    const { id, title, description, completed, tag, priority } = await req.json();

    const updated = await prisma.task.updateMany({
      where: { id, userId: session.user.id }, // Only update if task belongs to user
      data: {
        title,
        description,
        completed,
        tag: tag || null,
        priority: priority || null,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Failed to update task:", err);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// 🔴 DELETE task (DELETE)
export async function DELETE(req: Request) {
  try {
    const session = await getSession(req);
    const { id } = await req.json();

    await prisma.task.deleteMany({
      where: { id, userId: session.user.id }, // Only delete if task belongs to user
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    console.error("Failed to delete task:", err);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
