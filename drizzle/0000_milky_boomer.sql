CREATE TABLE `transfers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` integer NOT NULL,
	`payer_id` integer NOT NULL,
	`payee_id` integer NOT NULL,
	FOREIGN KEY (`payer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`payee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`cpf_cnpj` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`type` text DEFAULT 'payee' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_cpf_cnpj_unique` ON `users` (`cpf_cnpj`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);