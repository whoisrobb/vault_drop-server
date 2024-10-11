import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { PostTable } from "./post";
import { relations } from "drizzle-orm";

export const FileTable = pgTable("file", {
    fileId: uuid("fileId").defaultRandom().primaryKey(),
    filename: varchar("filename").notNull(),
    type: varchar("type").notNull(),
    postId: uuid("postId").references(() => PostTable.postId).notNull()
});

export const FileTableRelations = relations(FileTable,
    ({ one }) => ({
        post: one(PostTable, {
            fields: [FileTable.postId],
            references: [PostTable.postId]
        })
    })
);

export type File = typeof FileTable.$inferSelect;