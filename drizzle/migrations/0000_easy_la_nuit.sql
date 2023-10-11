CREATE TABLE `post` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text,
	`content` text,
	CONSTRAINT `post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(36),
	`password` text,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
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
