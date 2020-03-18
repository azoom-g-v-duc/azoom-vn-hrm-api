SET CHARACTER_SET_CLIENT = utf8;
SET CHARACTER_SET_CONNECTION = utf8;

CREATE TABLE `company_management` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_enabled` tinyint(1) NOT NULL,
  `login_id` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `fax` varchar(255) NOT NULL,
  `main_manager_id` int(11) DEFAULT NULL,
  `can_use_in_system` tinyint(1) NOT NULL,
  `can_use_in_asp` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `company_management_0b1a9b79` (`is_enabled`),
  KEY `company_management_dbd8def3` (`main_manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `company_manager` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_enabled` tinyint(1) NOT NULL,
  `manager_type` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `management_id` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `personal_id` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `photo` varchar(100) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `self_introduction` varchar(200) NOT NULL,
  `belonging_to_branch_office` int(11) DEFAULT NULL,
  `extension_num` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_manager_0b1a9b79` (`is_enabled`),
  KEY `company_manager_b35a5457` (`management_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE company_management ADD CONSTRAINT main_manager_id_refs_id_8f38b7b6 
FOREIGN KEY (`main_manager_id`) 
REFERENCES `company_manager` (`id`);

ALTER TABLE company_manager ADD CONSTRAINT management_id_refs_id_dfe5e6c0 
FOREIGN KEY (`management_id`) 
REFERENCES `company_management` (`id`);

CREATE TABLE `company_managementcontact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `representative_for_management` varchar(255) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `fax` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `invoice_to_address` varchar(255) NOT NULL,
  `management_id` int(11) DEFAULT NULL,
  `research_company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_managementcontact_b35a5457` (`management_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
