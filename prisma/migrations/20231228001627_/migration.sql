/*
  Warnings:

  - Added the required column `initiator_id` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_user_id_fkey`;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `initiator_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_initiator_id_fkey` FOREIGN KEY (`initiator_id`) REFERENCES `forum_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
