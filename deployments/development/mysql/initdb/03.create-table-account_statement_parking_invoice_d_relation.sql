SET CHARACTER_SET_CLIENT = utf8;
SET CHARACTER_SET_CONNECTION = utf8;

CREATE TABLE `account_statement_parking_invoice_d_relation` (
  `account_statement_id` bigint(20) NOT NULL,
  `parking_invoice_id` int(11) NOT NULL,
  `attached_amount` decimal(12,0) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_statement_id`,`parking_invoice_id`),
  KEY `parking_invoice_id` (`parking_invoice_id`),
  CONSTRAINT `account_statement_parking_invoice_d_relation_ibfk_1` FOREIGN KEY (`account_statement_id`) REFERENCES `account_statement` (`id`),
  CONSTRAINT `account_statement_parking_invoice_d_relation_ibfk_2` FOREIGN KEY (`parking_invoice_id`) REFERENCES `parking_invoice_d` (`pi_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
