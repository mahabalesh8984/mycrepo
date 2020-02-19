-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 01, 2018 at 01:04 PM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `s_one`
--

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `emid` int(11) NOT NULL,
  `fname` varchar(20) NOT NULL,
  `mname` varchar(20) NOT NULL,
  `lname` varchar(20) NOT NULL,
  `uname` varchar(20) NOT NULL,
  `password` varchar(50) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `photo` varchar(100) NOT NULL,
  `education` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `active` enum('Yes','No') NOT NULL DEFAULT 'Yes'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`emid`, `fname`, `mname`, `lname`, `uname`, `password`, `mobile`, `photo`, `education`, `dob`, `active`) VALUES
(1, 'Sandeep', 'Dattatray', 'Jadhav', 'sandeep', 'admin ', '7899551677', 'api/images/staff/1.jpg', 'B.E Information Science', '1988-11-15', 'Yes');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `mid` int(11) NOT NULL,
  `mnm` varchar(80) NOT NULL,
  `pid` int(11) NOT NULL,
  `url` varchar(80) NOT NULL,
  `icon` varchar(15) NOT NULL,
  `sort` int(11) NOT NULL,
  `active` enum('Yes','No') NOT NULL DEFAULT 'Yes'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`mid`, `mnm`, `pid`, `url`, `icon`, `sort`, `active`) VALUES
(1, 'Dashboard', 0, '', 'dashboard', 1, 'Yes'),
(2, 'Dashboard V1', 1, 'Dashboard', 'dashboard', 1, 'Yes'),
(3, 'Home', 1, 'Home', 'Home', 2, 'Yes'),
(4, 'Layout Options', 0, '', 'files-o', 2, 'Yes'),
(5, 'Top Navigation', 4, 'TopNavigation', '', 1, 'Yes'),
(6, 'Boxed', 4, 'Boxed', '', 2, 'Yes'),
(7, 'Fixed', 4, 'Fixed', '', 3, 'Yes'),
(8, 'ChartsJs', 0, '', 'pie-chart', 3, 'Yes'),
(9, 'ChartsJs', 8, 'ChartsJs', '', 1, 'Yes'),
(10, 'Morris', 8, 'Morris', '', 2, 'Yes'),
(11, 'Flot', 8, 'Flot', '', 3, 'Yes'),
(12, 'Inline Chart', 8, 'InlineChart', '', 4, 'Yes'),
(13, 'UI Elements', 0, '', 'laptop', 4, 'Yes'),
(14, 'General', 13, 'ChartsJs', '', 1, 'Yes'),
(15, 'Icons', 13, 'Morris', '', 2, 'Yes'),
(16, 'Buttons', 13, 'Flot', '', 3, 'Yes'),
(17, 'Time Line', 13, 'InlineChart', '', 4, 'Yes'),
(18, 'Modals', 13, 'InlineChart', '', 4, 'Yes'),
(19, 'Forms', 0, '', 'edit', 5, 'Yes'),
(20, 'General Elements', 19, 'GeneralElements', '', 1, 'Yes'),
(21, 'Advanced Elements', 19, 'AdvancedElements', '', 2, 'Yes'),
(22, 'Editors', 19, 'Editors', '', 3, 'Yes'),
(23, 'Tables', 0, '', 'table', 6, 'Yes'),
(24, 'Simple Tables', 23, 'SimpleTables', '', 1, 'Yes'),
(25, 'Data Tables', 23, 'DataTables', '', 2, 'Yes'),
(26, 'Calendar', 0, '', 'calendar', 7, 'Yes'),
(27, 'Mailbox', 0, '', 'folder', 8, 'Yes'),
(28, 'Documentation', 0, '', 'book', 9, 'Yes'),
(29, 'Important', 0, '', 'share', 10, 'Yes'),
(30, 'Warning', 0, '', 'share', 11, 'Yes'),
(31, 'INformation', 0, '', 'share', 12, 'Yes');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`emid`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`mid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `emid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `mid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
