-- CreateIndex
CREATE FULLTEXT INDEX `forum_post_title_content_idx` ON `forum_post`(`title`, `content`);
