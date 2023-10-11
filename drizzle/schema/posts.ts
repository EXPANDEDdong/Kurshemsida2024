import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 36 }).unique(),
  password: text("password"),
});

export const posts = mysqlTable("post", {
  id: int("id").primaryKey().autoincrement(),
  title: text("title"),
  content: text("content"),
});
