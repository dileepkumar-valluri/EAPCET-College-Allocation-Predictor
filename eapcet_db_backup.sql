-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: eapcet_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `guest_prediction_usage`
--

DROP TABLE IF EXISTS `guest_prediction_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_prediction_usage` (
  `guest_id` varchar(64) NOT NULL,
  `used_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`guest_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_prediction_usage`
--

LOCK TABLES `guest_prediction_usage` WRITE;
/*!40000 ALTER TABLE `guest_prediction_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `guest_prediction_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prediction_history`
--

DROP TABLE IF EXISTS `prediction_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prediction_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `state` varchar(2) NOT NULL,
  `exam_rank` int NOT NULL,
  `category` varchar(20) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `preferred_branch` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `fk_prediction_student` (`student_id`),
  CONSTRAINT `fk_prediction_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prediction_history`
--

LOCK TABLES `prediction_history` WRITE;
/*!40000 ALTER TABLE `prediction_history` DISABLE KEYS */;
INSERT INTO `prediction_history` VALUES (1,2,'TG',5000,'OC','BOYS','CSE','2026-10-19 04:15:10'),(2,2,'TG',80000,'OC','boys','CSE','2026-10-19 06:25:07'),(3,2,'TG',80000,'OC','boys','CSE','2026-10-19 07:43:36'),(4,2,'TG',12,'OC','boys','CSE','2026-10-19 07:58:05'),(5,2,'TG',12,'OC','boys','CSE','2026-10-19 07:59:39'),(6,2,'TG',8000,'SC_I','boys','CSE','2026-10-19 09:28:41'),(7,2,'TG',80000,'OC','boys','CSE','2026-10-19 09:53:05'),(8,2,'TG',9000,'OC','boys','CSE','2026-10-19 14:41:58'),(9,2,'TG',9000,'OC','boys','CSE','2026-10-19 14:42:01'),(10,2,'TG',9000,'OC','boys','CSE','2026-10-19 14:42:03'),(11,2,'TG',9000,'OC','boys','CSE','2026-10-19 14:42:06'),(12,2,'TG',9000,'OC','boys','CSE','2026-10-19 14:42:08'),(13,2,'TG',9000,'OC','boys','CSE','2026-10-19 14:42:08'),(14,2,'TG',80000,'OC','boys','CSE','2026-10-19 14:58:27'),(15,2,'TG',80000,'OC','boys','CSE','2026-10-19 15:00:13'),(16,2,'TG',7000,'OC','boys','CSE','2026-10-19 15:00:17');
/*!40000 ALTER TABLE `prediction_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `location` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Test Student','test.student@example.com','9876543210','scrypt:32768:8:1$pBwE6xGS807VEVUx$ef9c7cd178efe3c149cad64d82a1207e9a8043594c0e9b7ffb6a3ab0224132982718ad251e1440dc9c19f0fa19fb228528fe7a5b8fe30cad7d30a707a37791f9','2026-10-19 03:24:22','2026-10-19 03:24:22',NULL),(2,'Location Test','location.test@example.com','9876543210','scrypt:32768:8:1$QZMbGarzzLjhAftj$f099a6cf5b48653460bfc52717db9d8e4ff44dccfe297e1879207dceb2003462add7121a339cc4c8466834895a58a5cf2f9e17c987948f3003380dfe299dfc03','2026-10-19 03:36:53','2026-10-19 03:36:53','Eluru, Andhra Pradesh');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-19 21:51:11
