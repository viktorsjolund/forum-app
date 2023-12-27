-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `forum_post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `forum_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
