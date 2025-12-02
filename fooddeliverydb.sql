-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 02, 2025 at 02:27 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fooddeliverydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE IF NOT EXISTS `activity_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`id`, `message`, `timestamp`, `type`) VALUES
(1, 'New application received: Emerson\'s Canteen', '2025-12-02 21:35:59.555185', 'INFO'),
(2, 'Approved seller: Emerson\'s Canteen', '2025-12-02 21:37:59.195541', 'SUCCESS'),
(5, 'Rejected application: Oval Canteen', '2025-12-02 22:03:08.556046', 'DANGER'),
(6, 'Approved seller: Emerson\'s Canteen', '2025-12-02 22:03:11.854010', 'SUCCESS'),
(7, 'New application received: Oval Canteen', '2025-12-02 22:17:07.765667', 'INFO');

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

DROP TABLE IF EXISTS `food_items`;
CREATE TABLE IF NOT EXISTS `food_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `is_available` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `seller_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5apmg3nf13nxp6s4tr1cuyfup` (`seller_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','READY_FOR_PICKUP','COMPLETED','CANCELLED') DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  `seller_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsjfs85qf6vmcurlx43cnc16gy` (`customer_id`),
  KEY `FK6iqcph1rn5xhvmgpw9rtay7lm` (`seller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `food_item_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbmnfj15j0ngros6mbdx7q5c01` (`food_item_id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seller_profiles`
--

DROP TABLE IF EXISTS `seller_profiles`;
CREATE TABLE IF NOT EXISTS `seller_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `canteen_name` varchar(255) DEFAULT NULL,
  `is_approved` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_2264dwvu9q06u7388998fl3he` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `seller_profiles`
--

INSERT INTO `seller_profiles` (`id`, `canteen_name`, `is_approved`, `user_id`) VALUES
(2, 'Emerson\'s Canteen', b'1', 6),
(3, 'Oval Canteen', b'0', 7);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `role` enum('CUSTOMER','SELLER','ADMIN') DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `campus` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `role`, `username`, `campus`, `phone_number`) VALUES
(1, 'admin123', 'ADMIN', 'admin', NULL, NULL),
(2, 'student123', 'CUSTOMER', 'student', 'SLU Mary Heights Campus', '09760974461'),
(4, 'mj123', 'CUSTOMER', 'lvbjustine', 'SLU Mary Heights Campus', '09760974461'),
(6, 'emer', 'SELLER', 'Emersons', 'SLU Mary Heights Campus', '09760974461'),
(7, 'oval', 'SELLER', 'Oval', 'SLU Mary Heights Campus', '09760974461');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `FK5apmg3nf13nxp6s4tr1cuyfup` FOREIGN KEY (`seller_id`) REFERENCES `seller_profiles` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK6iqcph1rn5xhvmgpw9rtay7lm` FOREIGN KEY (`seller_id`) REFERENCES `seller_profiles` (`id`),
  ADD CONSTRAINT `FKsjfs85qf6vmcurlx43cnc16gy` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `FKbmnfj15j0ngros6mbdx7q5c01` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`);

--
-- Constraints for table `seller_profiles`
--
ALTER TABLE `seller_profiles`
  ADD CONSTRAINT `FKcpr5ibp9058g7a9u58wh7xf2y` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
