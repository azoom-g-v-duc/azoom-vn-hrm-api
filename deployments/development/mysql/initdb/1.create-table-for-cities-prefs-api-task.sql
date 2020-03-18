CREATE TABLE `location_city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lat` decimal(24,20) NOT NULL,
  `lng` decimal(24,20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `name_furigana` varchar(255) NOT NULL,
  `city_type` int(10) unsigned NOT NULL,
  `is_important_for_marketing` tinyint(1) NOT NULL,
  `pref_id` int(11) NOT NULL,
  `tel_for_inquiry_id` int(11) DEFAULT NULL,
  `is_hot` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47769 DEFAULT CHARSET=utf8;

CREATE TABLE `location_region` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lat` decimal(24,20) NOT NULL,
  `lng` decimal(24,20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `name_furigana` varchar(255) NOT NULL,
  `name_initial` varchar(1) NOT NULL,
  `city_id` int(11) NOT NULL,
  `is_important_for_marketing` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `location_region_c33bcf38` (`name_furigana`),
  KEY `location_region_b376980e` (`city_id`),
  KEY `location_region_b068931c` (`name`),
  CONSTRAINT `location_region_city_id_716d74cc49256f88_fk_location_city_id` FOREIGN KEY (`city_id`) REFERENCES `location_city` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=473821121 DEFAULT CHARSET=utf8;

CREATE TABLE `statistic_marketsaboutcity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `summarized_at` date NOT NULL,
  `type` int(11) NOT NULL,
  `average_hire` int(11) NOT NULL,
  `min_hire` int(11) NOT NULL,
  `max_hire` int(11) NOT NULL,
  `count_parking` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `statistic_marketsaboutcity_summarized_at_6fad5e82e5be7d35_uniq` (`summarized_at`,`type`,`city_id`),
  KEY `statistic_marketsaboutcity_b762a31c` (`summarized_at`),
  KEY `statistic_marketsaboutcity_b376980e` (`city_id`),
  CONSTRAINT `city_id_refs_id_270b5ccc` FOREIGN KEY (`city_id`) REFERENCES `location_city` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3727 DEFAULT CHARSET=utf8;

CREATE TABLE `statistic_marketsaboutregion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `summarized_at` date NOT NULL,
  `type` int(11) NOT NULL,
  `average_hire` int(11) NOT NULL,
  `min_hire` int(11) NOT NULL,
  `max_hire` int(11) NOT NULL,
  `count_parking` int(11) NOT NULL,
  `region_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `statistic_marketsaboutregio_summarized_at_7942c2553c6151d7_uniq` (`summarized_at`,`type`,`region_id`),
  KEY `statistic_marketsaboutregion_b762a31c` (`summarized_at`),
  KEY `statistic_marketsaboutregion_55a4ce96` (`region_id`),
  CONSTRAINT `region_id_refs_id_73849a74` FOREIGN KEY (`region_id`) REFERENCES `location_region` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106983 DEFAULT CHARSET=utf8;

CREATE TABLE `company_telforinquiry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `tel` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
