CREATE TABLE `transfers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` numeric NOT NULL,
	`payer` integer NOT NULL,
	`payee` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`notified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`payer`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`payee`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action
);
