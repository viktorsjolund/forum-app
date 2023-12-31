/*
  Warnings:

  - Made the column `updated_at` on table `forum_post_comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `forum_post_reply` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `forum_post_comment` MODIFY `updated_at` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `forum_post_reply` MODIFY `updated_at` DATETIME(0) NOT NULL;
