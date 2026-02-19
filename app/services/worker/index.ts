import { CloudEvent } from "cloudevents";
import Redis from "ioredis";
import { prisma } from "../../../packages/database/prisma";
import { z } from "zod";

while (true) {
  const redis = new Redis();

  const TodoSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
  });

  try {
    const result = await redis.blpop("todo-inbox", 0);
    if (result) {
      const data = JSON.parse(result[1]);
      const event = new CloudEvent(data);
      if (event.data === undefined) {
        throw new Error("Missing required data.");
      } else {
        const validation = TodoSchema.safeParse(event.data);
        if (!validation.success) {
          throw new Error("Ungültiges Event Format:" + validation.error);
        }
        const message = await prisma.todo.create({
          data: {
            id: validation.data.id,
            title: validation.data.title,
            description: validation.data.description,
          },
        });
        //addTodoToCache(message);
        console.log("Processing Event ID: " + event.id);
      }
    }
  } catch (e) {
    console.error("Error processing job: ", e);
  }
}
