import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
    userId: uuid("userId").defaultRandom().primaryKey(),
    firstName: varchar("firstName").notNull(),
    lastName: varchar("lastName").notNull(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull()
});

export type User = typeof UserTable.$inferSelect;