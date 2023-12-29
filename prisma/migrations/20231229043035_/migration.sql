-- DropIndex
DROP INDEX `notification_user_id_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `forum_post` MODIFY `topic` VARCHAR(255) NULL;
