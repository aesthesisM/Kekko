module.exports = {
    "up": "CREATE TABLE kekko.api (" +
    "`id` int(11) NOT NULL AUTO_INCREMENT," +
    "`name` varchar(45) NOT NULL," +
    "`publicKey` varchar(45) DEFAULT NULL," +
    "`secretKey` varchar(45) DEFAULT NULL," +
    "PRIMARY KEY (`id`)" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8",
    "down": ""
}