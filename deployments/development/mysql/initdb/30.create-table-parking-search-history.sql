DROP TABLE IF EXISTS `parking_search_histories`;

CREATE TABLE `parking_search_histories` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `condition_name` VARCHAR(255) NULL,
  `result_name` VARCHAR(255) NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
