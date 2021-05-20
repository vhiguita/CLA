CREATE TABLE `vehicle_vehicle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Plate` varchar(10) NOT NULL,
  `Model` varchar(4) NOT NULL,
  `Repowering` tinyint(1) NOT NULL,
  `Displacement` varchar(4) NOT NULL,
  `SerialNumber` varchar(30) NOT NULL,
  `MotorNumber` varchar(30) NOT NULL,
  `ChassisNumber` varchar(30) NOT NULL,
  `SatellitalWebAddress` varchar(50) NOT NULL,
  `RegistrationDate` date NOT NULL,
  `ExpeditionDate` date NOT NULL,
  `User` varchar(20) NOT NULL,
  `Pwd` varchar(20) NOT NULL,
  `Weight` decimal(10,2) DEFAULT NULL,
  `Capacity` decimal(10,2) DEFAULT NULL,
  `OwnFleet` tinyint(1) NOT NULL,
  `Pledgee` varchar(20) NOT NULL,
  `Observations` varchar(250) NOT NULL,
  `Mileage` varchar(20) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `Brand_id` int(11) NOT NULL,
  `Color_id` int(11) NOT NULL,
  `Company_id` int(11) NOT NULL,
  `Driver_id` int(11) NOT NULL,
  `FuelType_id` int(11) NOT NULL,
  `Line_id` int(11) DEFAULT NULL,
  `VehicleClass_id` int(11) NOT NULL,
  `VehicleType_id` int(11) NOT NULL,
  `OwnerIdentification` varchar(50) NOT NULL,
  `PropertyIdentification` varchar(50) NOT NULL,
  `TransitLicence` varchar(30) NOT NULL,
  `serviceType` varchar(45) NOT NULL,
  `Vin` varchar(45) NOT NULL,
  `MobilityRestriction` varchar(100) DEFAULT NULL,
  `Armor` varchar(15) DEFAULT NULL,
  `ImportDeclaration` varchar(45) DEFAULT NULL,
  `Power` int(11) DEFAULT NULL,
  `Ie` varchar(45) DEFAULT NULL,
  `ImportationDate` date DEFAULT NULL,
  `NumDoors` int(11) DEFAULT NULL,
  `PropertyLimitations` varchar(1000) DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  `BodyWork_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicle_vehicle_Brand_id_d1eb10de_fk_vehicle_brand_id` (`Brand_id`),
  KEY `vehicle_vehicle_Color_id_c84ab335_fk_vehicle_color_id` (`Color_id`),
  KEY `vehicle_vehicle_FuelType_id_90e92842_fk_vehicle_fueltype_id` (`FuelType_id`),
  KEY `vehicle_vehicle_VehicleClass_id_57271d78_fk_vehicle_v` (`VehicleClass_id`),
  KEY `vehicle_vehicle_Company_id_65903b28_fk_adminUser_company_id` (`Company_id`),
  KEY `vehicle_vehicle_Driver_id_941f4f0d_fk_third_third_id` (`Driver_id`),
  KEY `vehicle_vehicle_Line_id_b70d3dba_fk_vehicle_line_id` (`Line_id`),
  KEY `fk_vehicle_vehicle_BodyWork_id_idx` (`BodyWork_id`),
  CONSTRAINT `vehicle_vehicle_Brand_id_d1eb10de_fk_vehicle_brand_id` FOREIGN KEY (`Brand_id`) REFERENCES `vehicle_brand` (`id`),
  CONSTRAINT `vehicle_vehicle_Color_id_c84ab335_fk_vehicle_color_id` FOREIGN KEY (`Color_id`) REFERENCES `vehicle_color` (`id`),
  CONSTRAINT `vehicle_vehicle_Company_id_65903b28_fk_adminUser_company_id` FOREIGN KEY (`Company_id`) REFERENCES `adminUser_company` (`id`),
  CONSTRAINT `vehicle_vehicle_Driver_id_941f4f0d_fk_third_third_id` FOREIGN KEY (`Driver_id`) REFERENCES `third_third` (`id`),
  CONSTRAINT `vehicle_vehicle_FuelType_id_90e92842_fk_vehicle_fueltype_id` FOREIGN KEY (`FuelType_id`) REFERENCES `vehicle_fueltype` (`id`),
  CONSTRAINT `vehicle_vehicle_Line_id_b70d3dba_fk_vehicle_line_id` FOREIGN KEY (`Line_id`) REFERENCES `vehicle_line` (`id`),
  CONSTRAINT `vehicle_vehicle_VehicleClass_id_57271d78_fk_vehicle_v` FOREIGN KEY (`VehicleClass_id`) REFERENCES `vehicle_vehicleclass` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=latin1;



















