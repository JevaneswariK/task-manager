import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// 🔹 Prevent multiple PrismaClient instances in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 🟢 CREATE a task (POST)
export async function POST(req: Request) {
  try {
    const { title, description, tag, priority } = await req.json();

    const task = await prisma.task.create({
      data: {
        title,
        description,
        completed: false,
        tag: tag || null,        // optional
        priority: priority || null, // optional
      },
    });

    return NextResponse.json(task);
  } catch (err) {
    console.error("Failed to create task:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// 🔵 READ all tasks (GET)
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// 🟡 UPDATE task (PUT)
export async function PUT(req: Request) {
  try {
    const { id, title, description, completed, tag, priority } = await req.json();

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        completed,
        tag: tag || null,
        priority: priority || null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update task:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// 🔴 DELETE task (DELETE)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Failed to delete task:", err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
