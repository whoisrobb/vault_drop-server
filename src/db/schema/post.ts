import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"
import { FileTable } from './file';

export const PostTable = pgTable("post", {
    postId: uuid("postId").defaultRandom().primaryKey(),
    title: varchar("title").notNull()
});

export const PostTableRelations = relations(PostTable,
    ({ many }) => ({
        files: many(FileTable)
    })
);

export type Post = typeof PostTable.$inferSelect;