/*
  Warnings:

  - You are about to alter the column `updated_at` on the `forum_post` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `updated_at` on the `forum_post_comment` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `updated_at` on the `forum_post_reply` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.

*/
-- AlterTable
ALTER TABLE `forum_post` MODIFY `updated_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `forum_post_comment` MODIFY `updated_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `forum_post_reply` MODIFY `updated_at` DATETIME(0) NULL;
