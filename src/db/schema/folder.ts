import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"
import { file } from './file';

export const folder = pgTable("folder", {
    folderId: uuid("folderId").defaultRandom().primaryKey().notNull(),
    name: varchar("name").notNull()
});

export const folderRelations = relations(folder,
    ({ many }) => ({
        files: many(file)
    })
);

export type Folder = typeof folder.$inferSelect;