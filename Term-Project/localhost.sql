-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 04, 2022 at 02:35 PM
-- Server version: 5.7.34-log
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project4537`
--
CREATE DATABASE IF NOT EXISTS `project4537` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `project4537`;

-- --------------------------------------------------------

--
-- Table structure for table `apiKeys`
--

CREATE TABLE `apiKeys` (
  `api_key_name` char(20) NOT NULL,
  `api_key_hash` char(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `apiKeys`
--

INSERT INTO `apiKeys` (`api_key_name`, `api_key_hash`) VALUES
('cFhSSyCiNtGdZ/EuKkpm', '$2b$10$27Sn5bpJJwdp/ZticcaAVu1mIhtzgh/7Iafz0WTSUk6sCFkwDqfvq'),
('uaANEutudZLd5lwsO3Qk', '$2b$10$gw1yl3UImwgQHs9P32UTbOinRqfTlfHe3lCluKz23SuDBIwFOQTXW');

-- --------------------------------------------------------

--
-- Table structure for table `color_changes`
--

CREATE TABLE `color_changes` (
  `api_key_name` char(20) NOT NULL,
  `server_time` char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `color_changes`
--

INSERT INTO `color_changes` (`api_key_name`, `server_time`) VALUES
('uaANEutudZLd5lwsO3Qk', '2022-04-04 06:06:54.027');

-- --------------------------------------------------------

--
-- Table structure for table `color_choice`
--

CREATE TABLE `color_choice` (
  `api_key_name` char(20) NOT NULL,
  `color_choice` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `color_choice`
--

INSERT INTO `color_choice` (`api_key_name`, `color_choice`) VALUES
('cFhSSyCiNtGdZ/EuKkpm', 'b'),
('uaANEutudZLd5lwsO3Qk', 'g');

-- --------------------------------------------------------

--
-- Table structure for table `map`
--

CREATE TABLE `map` (
  `ID` int(11) NOT NULL,
  `map` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `map`
--

INSERT INTO `map` (`ID`, `map`) VALUES
(0, '[[\"r\",\"r\",\"r\",\"r\",\"r\",\"b\",\"b\",\"b\",\"b\",\"b\"],[\"r\",\"r\",\"r\",\"r\",\"r\",\"b\",\"b\",\"b\",\"b\",\"b\"],[\"r\",\"r\",\"r\",\"r\",\"r\",\"b\",\"b\",\"b\",\"b\",\"b\"],[\"r\",\"r\",\"r\",\"r\",\"r\",\"b\",\"b\",\"b\",\"b\",\"b\"],[\"g\",\"g\",\"g\",\"g\",\"g\",\"g\",\"g\",\"b\",\"b\",\"b\"],[\"g\",\"g\",\"g\",\"g\",\"g\",\"y\",\"y\",\"y\",\"y\",\"y\"],[\"g\",\"g\",\"g\",\"g\",\"g\",\"y\",\"y\",\"y\",\"y\",\"y\"],[\"g\",\"g\",\"g\",\"g\",\"g\",\"y\",\"y\",\"y\",\"y\",\"y\"],[\"g\",\"g\",\"g\",\"g\",\"g\",\"y\",\"y\",\"y\",\"y\",\"y\"],[\"g\",\"g\",\"g\",\"g\",\"g\",\"y\",\"y\",\"y\",\"y\",\"y\"]]');

-- --------------------------------------------------------

--
-- Table structure for table `moves`
--

CREATE TABLE `moves` (
  `ID` int(11) NOT NULL,
  `column_pos` int(11) DEFAULT NULL,
  `row_pos` int(11) DEFAULT NULL,
  `time_stamp` char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `ID` int(11) NOT NULL,
  `red_score` int(11) NOT NULL,
  `blue_score` int(11) NOT NULL,
  `yellow_score` int(11) NOT NULL,
  `green_score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `score`
--

INSERT INTO `score` (`ID`, `red_score`, `blue_score`, `yellow_score`, `green_score`) VALUES
(0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `userlist`
--

CREATE TABLE `userlist` (
  `ID` int(11) NOT NULL,
  `username` varchar(30) DEFAULT NULL,
  `pwd_hash` char(60) DEFAULT NULL,
  `api_key_name` char(60) DEFAULT NULL,
  `api_key_hash` char(60) DEFAULT NULL,
  `admin_account` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userlist`
--

INSERT INTO `userlist` (`ID`, `username`, `pwd_hash`, `api_key_name`, `api_key_hash`, `admin_account`) VALUES
(1, 'admin', '$2b$10$KyJyVTB81o2VCv/TQzEnoud4Z6HZ4AYzl9CVZi4rp1iAulqSkV8Wy', NULL, NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apiKeys`
--
ALTER TABLE `apiKeys`
  ADD PRIMARY KEY (`api_key_name`);

--
-- Indexes for table `color_changes`
--
ALTER TABLE `color_changes`
  ADD PRIMARY KEY (`api_key_name`);

--
-- Indexes for table `color_choice`
--
ALTER TABLE `color_choice`
  ADD PRIMARY KEY (`api_key_name`);

--
-- Indexes for table `map`
--
ALTER TABLE `map`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `moves`
--
ALTER TABLE `moves`
  ADD PRIMARY KEY (`ID`,`time_stamp`);

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `userlist`
--
ALTER TABLE `userlist`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `userlist`
--
ALTER TABLE `userlist`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
