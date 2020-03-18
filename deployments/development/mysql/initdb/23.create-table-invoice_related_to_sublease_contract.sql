CREATE TABLE `invoice_related_to_sublease_contract` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sublease_user_contract_d_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sublease_user_contract_d_id_idx` (`sublease_user_contract_d_id`),
  KEY `invoice_id_idx` (`invoice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40815 DEFAULT CHARSET=utf8;
