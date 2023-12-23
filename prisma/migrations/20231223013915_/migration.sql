-- AlterTable
ALTER TABLE `forum_user` ADD COLUMN `role` ENUM('ADMIN', 'READER') NULL;
