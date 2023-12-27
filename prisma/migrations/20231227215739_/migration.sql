/*
  Warnings:

  - You are about to drop the column `ref_id` on the `notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `notification` DROP COLUMN `ref_id`,
    ADD COLUMN `element_id` VARCHAR(255) NULL;
