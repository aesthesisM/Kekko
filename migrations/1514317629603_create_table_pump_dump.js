module.exports = {
    "up": "CREATE TABLE `pump_dump` (" +
    "`id` INT NOT NULL AUTO_INCREMENT," +
    "`pair` VARCHAR(10) NOT NULL," +
    "`amount` FLOAT NOT NULL," +
    "`buysell` VARCHAR(4) NOT NULL," +
    "`buy_lower_percent` INT NOT NULL," +
    "`sell_higher_percent` INT NOT NULL," +
    "`check_price` FLOAT NOT NULL," +
    "`active` SMALLINT(2) NOT NULL," +
    "`status` SMALLINT(2) NOT NULL," +
    "PRIMARY KEY (`id`))" +
    "ENGINE=InnoDB DEFAULT CHARSET=utf8",
    "down": "DROP TABLE pump_dump"
}