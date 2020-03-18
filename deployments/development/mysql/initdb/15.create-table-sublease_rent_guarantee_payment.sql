CREATE TABLE `sublease_rent_guarantee_payment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `information_id` bigint(20) NOT NULL,
  `amount` decimal(12,0) NOT NULL COMMENT '支払額',
  `recorded_amount` decimal(12,0) NOT NULL COMMENT '計上額',
  `occational_amount` decimal(12,0) NOT NULL COMMENT '月中支払い',
  `balance_amount` decimal(12,0) NOT NULL COMMENT '差額',
  `payment_month` int(6) NOT NULL COMMENT '支払い月',
  `recording_month` int(6) NOT NULL COMMENT '計上月',
  `note` text,
  `status` tinyint(4) DEFAULT '0',
  `tags` json DEFAULT NULL,
  `logs` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_payment_information_id__id` (`information_id`),
  CONSTRAINT `fk_payment_information_id__id` FOREIGN KEY (`information_id`) REFERENCES `sublease_rent_guarantee_payment_information` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB CHARSET=utf8