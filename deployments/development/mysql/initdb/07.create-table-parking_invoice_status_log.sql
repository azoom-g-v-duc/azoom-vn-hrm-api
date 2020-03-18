SET CHARACTER_SET_CLIENT = utf8;
SET CHARACTER_SET_CONNECTION = utf8;

CREATE TABLE `parking_invoice_status_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pi_id` int(11) NOT NULL DEFAULT '0',
  `pi_status` int(11) NOT NULL DEFAULT '0',
  `mu_id` int(11) NOT NULL DEFAULT '0',
  `datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;