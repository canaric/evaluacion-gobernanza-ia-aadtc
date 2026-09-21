CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`member_id` integer NOT NULL,
	`verification_code` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`issued_at` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `certificates_verification_code_unique` ON `certificates` (`verification_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_certificates_group_member` ON `certificates` (`group_id`,`member_id`);