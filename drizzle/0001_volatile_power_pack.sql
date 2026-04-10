CREATE TABLE `wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`balance` numeric DEFAULT 0 NOT NULL,
	`userId` integer NOT NULL,
	`typeUser` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`typeUser`) REFERENCES `users`(`type`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `transfers`;