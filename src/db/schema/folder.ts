import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"
import { FileTable } from './file';

export const FolderTable = pgTable("post", {
    folderId: uuid("folderId").defaultRandom().primaryKey(),
    name: varchar("name").notNull()
});

export const FolderTableRelations = relations(FolderTable,
    ({ many }) => ({
        files: many(FileTable)
    })
);

export type Folder = typeof FolderTable.$inferSelect;