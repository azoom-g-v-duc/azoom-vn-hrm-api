CREATE TABLE `location_size` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `length` int(10) unsigned NOT NULL,
  `width` int(10) unsigned NOT NULL,
  `height` int(10) unsigned NOT NULL,
  `weight` int(10) unsigned NOT NULL,
  `ground_height` int(10) unsigned NOT NULL,
  `tire_width` int(10) unsigned NOT NULL,
  `remarks` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
