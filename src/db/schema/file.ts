import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { folder } from "./folder";
import { relations } from "drizzle-orm";

export const file = pgTable("file", {
    fileId: uuid("fileId").defaultRandom().primaryKey().notNull(),
    filename: varchar("filename").notNull(),
    key: varchar("key").notNull(),
    // fileUrl: varchar("fileUrl").notNull(),
    type: varchar("type").notNull(),
    size: integer("size").notNull(),
    folderId: uuid("folderId").references(() => folder.folderId, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const fileRelations = relations(file,
    ({ one }) => ({
        folder: one(folder, {
            fields: [file.folderId],
            references: [folder.folderId]
        })
    })
);

export type File = typeof file.$inferSelect;