/*
  Warnings:

  - You are about to drop the column `details` on the `notification` table. All the data in the column will be lost.
  - Added the required column `trigger` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notification` DROP COLUMN `details`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `trigger` ENUM('COMMENT', 'EDIT') NOT NULL;
