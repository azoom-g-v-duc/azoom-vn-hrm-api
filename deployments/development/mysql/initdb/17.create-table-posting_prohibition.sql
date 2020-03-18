SET CHARACTER_SET_CLIENT = utf8;
SET CHARACTER_SET_CONNECTION = utf8;

CREATE TABLE `posting_prohibition` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classification` varchar(30) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `prefecture` int(10) unsigned DEFAULT NULL,
  `city` int(10) unsigned DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lat` double NOT NULL DEFAULT '0',
  `lng` double NOT NULL DEFAULT '0',
  `notes` text,
  `created_manager_id` int(10) unsigned DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `classification` (`classification`),
  KEY `prefecture` (`prefecture`)
) ENGINE=InnoDB AUTO_INCREMENT=4170 DEFAULT CHARSET=utf8;
