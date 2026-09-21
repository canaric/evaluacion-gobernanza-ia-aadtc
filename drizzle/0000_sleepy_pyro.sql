CREATE TABLE `groups` (
	`id` text PRIMARY KEY NOT NULL,
	`group_name` text NOT NULL,
	`group_key` text NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`percentage` integer DEFAULT 0 NOT NULL,
	`correct_count` integer DEFAULT 0 NOT NULL,
	`level` text DEFAULT 'Inicial' NOT NULL,
	`answers_json` text DEFAULT '[]' NOT NULL,
	`attempts` integer DEFAULT 1 NOT NULL,
	`retake_allowed` integer DEFAULT false NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `groups_group_key_unique` ON `groups` (`group_key`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` text NOT NULL,
	`full_name` text NOT NULL,
	`dni` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade
);
