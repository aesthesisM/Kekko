module.exports = {
    "up": "CREATE TABLE kekko.order (" +
    "`id` int(11) NOT NULL AUTO_INCREMENT," +
    "`pair` varchar(15) NOT NULL," +
    "`buysell` varchar(4) NOT NULL," +
    "`amount` float NOT NULL," +
    "`price` float NOT NULL," +
    "`total_price` float NOT NULL," +
    "`order_` int(11) DEFAULT NULL," +
    "`success` smallint(2) DEFAULT '0'," +
    "`order_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
    "`order_success_time` timestamp NULL DEFAULT NULL," +
    "`chain_id_fk` int(11) DEFAULT NULL," +
    "`active` tinyint(1) NOT NULL DEFAULT 1," +
    "`stop_loss` tinyint(1) DEFAULT NULL," +
    "`stop_loss_price` float DEFAULT NULL," +
    "`pump_dump_id_fk` int(11) DEFAULT NULL," +
    "PRIMARY KEY (`id`)," +
    "KEY `order_chain_fk_idx` (`chain_id_fk`)," +
    "KEY `pumdump_fk_idx` (`pump_dump_id_fk`)," +
    "CONSTRAINT `chain_fk` FOREIGN KEY (`chain_id_fk`) REFERENCES `chain` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION," +
    "CONSTRAINT `pumdump_fk` FOREIGN KEY (`pump_dump_id_fk`) REFERENCES `pump_dump` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION)" +
    "ENGINE=InnoDB DEFAULT CHARSET=utf8",
    "down": "DROP TABLE kekko.order"
}