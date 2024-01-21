-- AlterTable
ALTER TABLE `forum_post_dislikes` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `forum_post_likes` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `notification` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `post_follow` MODIFY `user_id` VARCHAR(191) NOT NULL;
