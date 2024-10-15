import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { FolderTable } from "./folder";
import { relations } from "drizzle-orm";

export const FileTable = pgTable("file", {
    fileId: uuid("fileId").defaultRandom().primaryKey(),
    filename: varchar("filename").notNull(),
    type: varchar("type").notNull(),
    size: integer("size").notNull(),
    folderId: uuid("folderId").references(() => FolderTable.folderId, { onDelete: "cascade" }).notNull()
});

export const FileTableRelations = relations(FileTable,
    ({ one }) => ({
        post: one(FolderTable, {
            fields: [FileTable.folderId],
            references: [FolderTable.folderId]
        })
    })
);

export type File = typeof FileTable.$inferSelect;