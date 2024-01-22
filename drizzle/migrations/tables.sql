CREATE TABLE `comment` (
	`id` varchar(128) NOT NULL,
	`targetPostId` varchar(128) NOT NULL,
	`authorId` varchar(128) NOT NULL,
	`postedDate` datetime NOT NULL,
	`content` text NOT NULL,
	CONSTRAINT `comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` varchar(128) NOT NULL,
	`authorId` varchar(128) NOT NULL,
	`postedDate` datetime NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	CONSTRAINT `post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPerms` (
	`userId` varchar(128) NOT NULL,
	`role` enum('admin','user') NOT NULL,
	CONSTRAINT `userPerms_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(128) NOT NULL,
	`email` varchar(50),
	`username` varchar(36) NOT NULL,
	`description` varchar(150),
	`password` text NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
