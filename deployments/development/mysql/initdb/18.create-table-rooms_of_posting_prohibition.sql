SET CHARACTER_SET_CLIENT = utf8;
SET CHARACTER_SET_CONNECTION = utf8;

CREATE TABLE `rooms_of_posting_prohibition` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `posting_prohibition_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_manager_id` int(10) unsigned DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `posting_prohibition_id` (`posting_prohibition_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2191 DEFAULT CHARSET=utf8;
