module.exports = {
    "up": "CREATE TABLE kekko.chain (" +
    "`id` int(11) NOT NULL AUTO_INCREMENT," +
    "`name` varchar(45) NOT NULL," +
    "`api_id_fk` int(11) DEFAULT NULL," +
    "`active` tinyint(1) NOT NULL DEFAULT 1," +
    "`status` tinyint(1) DEFAULT '1'," +
    "PRIMARY KEY (`id`)," +
    "KEY `api_fk__idx` (`api_id_fk`)," +
    "CONSTRAINT `api_fk_` FOREIGN KEY (`api_id_fk`) REFERENCES `api` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION)" +
    "ENGINE=InnoDB DEFAULT CHARSET=utf8",
    "down": "DROP TABLE kekko.chain"
}