DROP TABLE IF EXISTS `parking_search_conditions`;

CREATE TABLE `parking_search_conditions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parking_search_history_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` TINYINT NOT NULL COMMENT '1: 直営物件, 2: 駐車場, 3: 駐車場を借りている人, 4: 問い合わせされた場所',
  `condition` JSON NULL,
  `result` JSON NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `parking_search_history_id` FOREIGN KEY(`parking_search_history_id`) REFERENCES `parking_search_histories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
