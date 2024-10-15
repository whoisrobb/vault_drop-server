import { AnyPgColumn, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"
import { FileTable } from './file';

export const FolderTable = pgTable("post", {
    folderId: uuid("folderId").defaultRandom().primaryKey(),
    parentFolderId: uuid("parentFolderId").references((): AnyPgColumn => FolderTable.folderId, { onDelete: "cascade" }),
    name: varchar("name").notNull()
});

export const FolderTableRelations = relations(FolderTable,
    ({ one, many }) => ({
        parent: one(FolderTable, {
            fields: [FolderTable.folderId],
            references: [FolderTable.folderId],
        }),
        children: many(FolderTable),
        files: many(FileTable)
    })
);

export type Folder = typeof FolderTable.$inferSelect;