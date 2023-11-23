CREATE TABLE `comment` (
	`id` varchar(128) NOT NULL,
	`targetPostId` varchar(128) NOT NULL,
	`authorId` varchar(128) NOT NULL,
	`postedDate` datetime,
	`content` text,
	CONSTRAINT `comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` varchar(128) NOT NULL,
	`authorId` varchar(128) NOT NULL,
	`postedDate` datetime,
	`title` text NOT NULL,
	`content` text NOT NULL,
	CONSTRAINT `post_id` PRIMARY KEY(`id`)
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














--> statement-breakpoint
CREATE TABLE `cities` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`country_id` int,
	`popularity` enum('unknown','known','popular'),
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
