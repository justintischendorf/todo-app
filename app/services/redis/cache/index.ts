import Redis from "ioredis";

const redis = new Redis();

interface Todo {
  title: string;
  description: string;
}

export async function getMessageByIdFromCache(id: string) {
  await redis.get(id);
}

export async function deleteAllTodosFromCache() {
  await redis.flushdb();
}

export async function deleteTodoByIdFromCache(id: string) {
  await redis.del(id);
}

export async function updateTodoByIdInCache(data: Todo, id: string) {
  await redis.set(id, JSON.stringify(data), "EX", "600");
}
