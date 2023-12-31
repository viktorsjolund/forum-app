-- AlterTable
ALTER TABLE `forum_post` MODIFY `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `forum_post_comment` MODIFY `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `forum_post_reply` MODIFY `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE INDEX `notification_initiator_id_fkey` ON `notification`(`initiator_id` ASC);

-- CreateIndex
CREATE INDEX `notification_post_id_fkey` ON `notification`(`post_id` ASC);

