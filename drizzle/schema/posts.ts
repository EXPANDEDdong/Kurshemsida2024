import { int, mysqlSchema, mysqlTable, text } from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});

export const posts = mysqlTable("post", {
  id: int("id").primaryKey().autoincrement(),
  title: text("title"),
  content: text("content"),
});
