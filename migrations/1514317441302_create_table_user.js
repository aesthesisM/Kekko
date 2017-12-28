module.exports = {
    "up": "CREATE TABLE kekko.user (" +
    "`id`  INT NOT NULL AUTO_INCREMENT," +
    "`name` VARCHAR(45) NOT NULL," +
    "`password` VARCHAR(45) NOT NULL," +
    "PRIMARY KEY (`id`))" +
    "ENGINE=InnoDB DEFAULT CHARSET=utf8",
    "down": "DROP TABLE kekko.user"
}