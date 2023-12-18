import {
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const users = mysqlTable("user", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  email: varchar("email", { length: 50 }).unique(),
  username: varchar("username", { length: 36 }).unique().notNull(),
  description: varchar("description", { length: 150 }).$default(
    () => "User Description"
  ),
  password: text("password").notNull(),
});

export const posts = mysqlTable("post", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  authorId: varchar("authorId", { length: 128 }).notNull(),
  postedDate: datetime("postedDate", { mode: "date" })
    .$default(() => new Date())
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

export const comments = mysqlTable("comment", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  targetPostId: varchar("targetPostId", { length: 128 }).notNull(),
  authorId: varchar("authorId", { length: 128 }).notNull(),
  postedDate: datetime("postedDate", { mode: "date" })
    .$default(() => new Date())
    .notNull(),
  content: text("content").notNull(),
});

export const userPermissions = mysqlTable("userPerms", {
  userId: varchar("userId", { length: 128 }).notNull().primaryKey(),
  role: mysqlEnum("role", ["admin", "user"])
    .notNull()
    .$default(() => "user"),
});

export const permissionsRelations = relations(userPermissions, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  posts: many(posts),
  comments: many(comments),
  permissions: one(userPermissions, {
    fields: [users.id],
    references: [userPermissions.userId],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.targetPostId],
    references: [posts.id],
  }),
}));
