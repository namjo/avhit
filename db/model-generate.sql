-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`student`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`student` ;

CREATE TABLE IF NOT EXISTS `mydb`.`student` (
  `id` INT UNSIGNED NOT NULL COMMENT '',
  `first` VARCHAR(45) NOT NULL COMMENT '',
  `last` VARCHAR(45) NOT NULL COMMENT '',
  `dob` DATE NULL COMMENT '',
  `lane` INT UNSIGNED NULL COMMENT '',
  `repeat` INT UNSIGNED NULL COMMENT '',
  `entrance` YEAR NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '')
ENGINE = MyISAM;


-- -----------------------------------------------------
-- Table `mydb`.`teacher`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`teacher` ;

CREATE TABLE IF NOT EXISTS `mydb`.`teacher` (
  `id` INT UNSIGNED NOT NULL COMMENT '',
  `first` VARCHAR(45) NOT NULL COMMENT '',
  `last` VARCHAR(45) NOT NULL COMMENT '',
  `abbr` VARCHAR(5) NOT NULL COMMENT '',
  `pwd` VARCHAR(45) NOT NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  UNIQUE INDEX `abbr_UNIQUE` (`abbr` ASC)  COMMENT '')
ENGINE = MyISAM;


-- -----------------------------------------------------
-- Table `mydb`.`subject`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`subject` ;

CREATE TABLE IF NOT EXISTS `mydb`.`subject` (
  `id` VARCHAR(45) NOT NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '')
ENGINE = MyISAM;


-- -----------------------------------------------------
-- Table `mydb`.`class`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`class` ;

CREATE TABLE IF NOT EXISTS `mydb`.`class` (
  `id` INT UNSIGNED NOT NULL COMMENT 'All classes conducted in AvH history as of 2017.',
  `subject_id` VARCHAR(45) NOT NULL COMMENT '',
  `term` VARCHAR(45) NULL COMMENT '',
  `room` VARCHAR(45) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  INDEX `subject_id` (`subject_id` ASC)  COMMENT '')
ENGINE = MyISAM;


-- -----------------------------------------------------
-- Table `mydb`.`manages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`manages` ;

CREATE TABLE IF NOT EXISTS `mydb`.`manages` (
  `teacher_id` INT UNSIGNED NOT NULL COMMENT '',
  `class_id` INT UNSIGNED NOT NULL COMMENT '',
  `from` DATE NULL COMMENT '',
  `to` DATE NULL COMMENT '',
  INDEX `class` (`class_id` ASC)  COMMENT '',
  INDEX `teacher` (`teacher_id` ASC)  COMMENT '',
  UNIQUE INDEX `teacher_class` (`teacher_id` ASC, `class_id` ASC)  COMMENT '')
ENGINE = MyISAM;


-- -----------------------------------------------------
-- Table `mydb`.`attends`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`attends` ;

CREATE TABLE IF NOT EXISTS `mydb`.`attends` (
  `student_id` INT UNSIGNED NOT NULL COMMENT '',
  `class_id` INT UNSIGNED NOT NULL COMMENT '',
  `exam1` INT NULL COMMENT '',
  `exam2` INT NULL COMMENT '',
  INDEX `class_id` (`class_id` ASC)  COMMENT '',
  INDEX `student_id` (`student_id` ASC)  COMMENT '')
ENGINE = MyISAM;


-- -----------------------------------------------------
-- Table `mydb`.`teaches`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`teaches` ;

CREATE TABLE IF NOT EXISTS `mydb`.`teaches` (
  `subject_id` VARCHAR(45) NOT NULL COMMENT '',
  `teacher_id` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_subject_has_teacher_teacher1_idx` (`teacher_id` ASC)  COMMENT '',
  INDEX `fk_subject_has_teacher_subject1_idx` (`subject_id` ASC)  COMMENT '')
ENGINE = MyISAM;

SET SQL_MODE = '';
GRANT USAGE ON *.* TO superadmin;
 DROP USER superadmin;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'superadmin' IDENTIFIED BY '2143';

GRANT ALL ON `mydb`.* TO 'superadmin';
SET SQL_MODE = '';
GRANT USAGE ON *.* TO superuser;
 DROP USER superuser;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'superuser';


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
