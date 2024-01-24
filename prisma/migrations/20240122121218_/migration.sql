-- DropForeignKey
ALTER TABLE `forum_post` DROP FOREIGN KEY `forum_post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_comment` DROP FOREIGN KEY `forum_post_comment_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_comment` DROP FOREIGN KEY `forum_post_comment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_dislikes` DROP FOREIGN KEY `forum_post_dislikes_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_reply` DROP FOREIGN KEY `forum_post_reply_comment_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum_post_reply` DROP FOREIGN KEY `forum_post_reply_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_initiator_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_post_id_fkey`;

-- AddForeignKey
ALTER TABLE `forum_post` ADD CONSTRAINT `forum_post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_post_comment` ADD CONSTRAINT `forum_post_comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `forum_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_post_comment` ADD CONSTRAINT `forum_post_comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_post_reply` ADD CONSTRAINT `forum_post_reply_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `forum_post_comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_post_reply` ADD CONSTRAINT `forum_post_reply_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_post_dislikes` ADD CONSTRAINT `forum_post_dislikes_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `forum_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `forum_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_initiator_id_fkey` FOREIGN KEY (`initiator_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
