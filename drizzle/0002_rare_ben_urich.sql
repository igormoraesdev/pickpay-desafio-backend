PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`balance` numeric DEFAULT 0 NOT NULL,
	`userId` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_wallets`("id", "balance", "userId") SELECT "id", "balance", "userId" FROM `wallets`;--> statement-breakpoint
DROP TABLE `wallets`;--> statement-breakpoint
ALTER TABLE `__new_wallets` RENAME TO `wallets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;