CREATE TABLE `botStatus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`botName` varchar(64) NOT NULL,
	`isOnline` int NOT NULL DEFAULT 0,
	`currentTask` varchar(255),
	`blocksPlaced` int NOT NULL DEFAULT 0,
	`obsidianCount` int NOT NULL DEFAULT 0,
	`posX` int,
	`posY` int,
	`posZ` int,
	`lastUpdate` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `botStatus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `builds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`gridData` text NOT NULL,
	`originX` int NOT NULL DEFAULT 0,
	`originY` int NOT NULL DEFAULT 0,
	`originZ` int NOT NULL DEFAULT 0,
	`totalBlocks` int NOT NULL,
	`status` enum('pending','in_progress','completed','failed') DEFAULT 'pending',
	`blocksPlaced` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `builds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `serverConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`host` varchar(255) NOT NULL,
	`port` int NOT NULL DEFAULT 25565,
	`botUsernames` text NOT NULL,
	`whitelist` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `serverConfig_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `botStatus` ADD CONSTRAINT `botStatus_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `builds` ADD CONSTRAINT `builds_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `serverConfig` ADD CONSTRAINT `serverConfig_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;