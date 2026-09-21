import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  groupName: text("group_name").notNull(),
  groupKey: text("group_key").notNull().unique(),
  status: text("status").notNull().default("in_progress"),
  score: integer("score").notNull().default(0),
  percentage: integer("percentage").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  level: text("level").notNull().default("Inicial"),
  answersJson: text("answers_json").notNull().default("[]"),
  attempts: integer("attempts").notNull().default(1),
  retakeAllowed: integer("retake_allowed", { mode: "boolean" }).notNull().default(false),
  startedAt: text("started_at").notNull(),
  completedAt: text("completed_at"),
});

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupId: text("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  dni: text("dni").notNull(),
}, (table) => [index("idx_members_group_id").on(table.groupId)]);

export const certificates = sqliteTable("certificates", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  verificationCode: text("verification_code").notNull().unique(),
  status: text("status").notNull().default("active"),
  issuedAt: text("issued_at").notNull(),
}, (table) => [uniqueIndex("idx_certificates_group_member").on(table.groupId, table.memberId)]);
