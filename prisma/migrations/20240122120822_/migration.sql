-- DropForeignKey
ALTER TABLE `forum_post_likes` DROP FOREIGN KEY `forum_post_likes_post_id_fkey`;

-- AddForeignKey
ALTER TABLE `forum_post_likes` ADD CONSTRAINT `forum_post_likes_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `forum_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
