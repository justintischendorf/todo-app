import { CloudEvent } from "cloudevents";
import Redis from "ioredis";
import { z } from "zod";
import { prisma } from "../../../packages/database/prisma";
import { updateTodoByIdInCache } from "../redis/cache";

const redis = new Redis();

const TodoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

console.log("👷 Worker gestartet");

while (true) {
  try {
    const result = await redis.blpop("todo-inbox", 0);
    if (!result) continue;

    const event = new CloudEvent(JSON.parse(result[1]));
    if (!event.data) throw new Error("Missing event data");

    const parsed = TodoSchema.parse(event.data);

    const created = await prisma.todo.create({
      data: parsed,
    });
    updateTodoByIdInCache(created, created.id);

    console.log("✅ Event verarbeitet:", event.id);
  } catch (e) {
    console.error("❌ Worker Error:", e);
  }
}