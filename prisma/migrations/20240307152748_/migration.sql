/*
  Warnings:

  - You are about to drop the `forum_post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forum_post_comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forum_post_dislikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forum_post_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forum_post_reply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `forum_post` DROP FOREIGN KEY `forum_post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_comment` DROP FOREIGN KEY `forum_post_comment_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_comment` DROP FOREIGN KEY `forum_post_comment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_dislikes` DROP FOREIGN KEY `forum_post_dislikes_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_likes` DROP FOREIGN KEY `forum_post_likes_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_reply` DROP FOREIGN KEY `forum_post_reply_comment_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_reply` DROP FOREIGN KEY `forum_post_reply_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_post_id_fkey`;

-- AlterTable
ALTER TABLE `notification` MODIFY `post_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `post_follow` MODIFY `post_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `forum_post`;

-- DropTable
DROP TABLE `forum_post_comment`;

-- DropTable
DROP TABLE `forum_post_dislikes`;

-- DropTable
DROP TABLE `forum_post_likes`;

-- DropTable
DROP TABLE `forum_post_reply`;

-- CreateTable
CREATE TABLE `post` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` VARCHAR(4000) NOT NULL,
    `topic` VARCHAR(255) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `authorId` VARCHAR(191) NOT NULL,

    INDEX `post_authorId_idx`(`authorId`),
    FULLTEXT INDEX `post_title_idx`(`title`),
    FULLTEXT INDEX `post_title_content_idx`(`title`, `content`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_comment` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `post_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `content` VARCHAR(500) NOT NULL,

    INDEX `post_comment_post_id_idx`(`post_id`),
    INDEX `post_comment_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_reply` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `comment_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `content` VARCHAR(500) NOT NULL,

    INDEX `post_reply_comment_id_idx`(`comment_id`),
    INDEX `post_reply_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `post_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `post_like_post_id_idx`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_dislike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `post_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `post_dislike_post_id_idx`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_reply` ADD CONSTRAINT `post_reply_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `post_comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_reply` ADD CONSTRAINT `post_reply_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_like` ADD CONSTRAINT `post_like_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_dislike` ADD CONSTRAINT `post_dislike_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
