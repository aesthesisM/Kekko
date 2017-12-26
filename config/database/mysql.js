var mysql = require('mysql');
var async = require('async');
require('dotenv').config();
var conf = process.env;

var dbConf = {
    //vmware win7 mysql ip 172.16.166.128
    host: conf.DB_HOST,
    user: conf.DB_USER,
    password: conf.DB_PASSWORD, //vmware win7 mysql root password 11231123
    port: conf.DB_PORT,
    database: conf.DB_NAME,
    multipleStatements: true,
    acquireTimeout: 900000 //15 min
};

function getConnection() {
    return mysql.createConnection(dbConf);
}

function checkDB(con, callback) {
    var check_sql = "SHOW DATABASES LIKE 'kekko' ";
    con.query(check_sql, function (err, result) {
        if (err) {
            console.error(err);
            callback(err);
        } else if (Object.keys(result).length > 0) {
            callback(null, true);
        } else {
            callback(null, false)
        }
    })
}

module.exports = {
    initializeDb: function () {
        console.log(config);
        var con = getConnection();
        console.log('connected to ' + dbConf.host);

        async.series(
            [
                function (callback) {
                    //created database sql
                    var create_db_sql = 'CREATE DATABASE IF NOT EXISTS kekko DEFAULT CHARACTER SET utf8';
                    con.query(create_db_sql, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('Database KEKKO initialized successfully');
                            callback();
                        }
                    });
                },
                function (callback) {
                    //create user table sql
                    var create_table_user_sql = "USE kekko; " +
                        "CREATE TABLE kekko.user (" +
                        "`id`  INT NOT NULL AUTO_INCREMENT," +
                        "`name` VARCHAR(45) NOT NULL," +
                        "`password` VARCHAR(45) NOT NULL," +
                        "PRIMARY KEY (`id`))" +
                        "ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                    con.query(create_table_user_sql, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('Table User initialized successfully');
                            callback();
                        }
                    });
                },
                function (callback) {
                    //create api table sql
                    var create_table_api_sql = "USE kekko;" +
                        "CREATE TABLE kekko.api (" +
                        "`id` int(11) NOT NULL AUTO_INCREMENT," +
                        "`name` varchar(45) NOT NULL," +
                        "`publicKey` varchar(45) DEFAULT NULL," +
                        "`secretKey` varchar(45) DEFAULT NULL," +
                        "PRIMARY KEY (`id`)" +
                        ") ENGINE=InnoDB DEFAULT CHARSET=utf8";
                    con.query(create_table_api_sql, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('Table Api initialized successfully');
                            callback();
                        }
                    });
                },
                function (callback) {
                    //create order chain table sql;
                    var create_table_chain_sql = "USE kekko;" +
                        "CREATE TABLE kekko.chain (" +
                        "`id` int(11) NOT NULL AUTO_INCREMENT," +
                        "`name` varchar(45) NOT NULL," +
                        "`api_id_fk` int(11) DEFAULT NULL," +
                        "`active` tinyint(1) NOT NULL DEFAULT 1," +
                        "`status` tinyint(1) DEFAULT '1'," +
                        "PRIMARY KEY (`id`)," +
                        "KEY `api_fk__idx` (`api_id_fk`)," +
                        "CONSTRAINT `api_fk_` FOREIGN KEY (`api_id_fk`) REFERENCES `api` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION)" +
                        "ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                    con.query(create_table_chain_sql, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('Table Order Chain initialized successfully');
                            callback();
                        }
                    });
                }, function (callback) {
                    var pump_dump_sql = "USE kekko;" +
                        "CREATE TABLE `kekko`.`pump_dump` (" +
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
                        "ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                    con.query(pump_dump_sql, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('Table Pump_Dump initialized successfully');
                            callback();
                        }
                    });
                },
                function (callback) {
                    //create order table sql
                    var create_table_order_sql = "USE kekko;" +
                        "CREATE TABLE kekko.order (" +
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
                        "ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                    con.query(create_table_order_sql, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('Table Order initialized successfully');
                            callback();
                        }
                    });
                },
                function (callback) {
                    var api_insert_sql = "USE kekko;" +
                        "INSERT INTO kekko.api (name,publicKey,secretKey) VALUES ('hitbtc',null,null);" +
                        "INSERT INTO kekko.api (name,publicKey,secretKey) VALUES ('poloniex',null,null);" +
                        "INSERT INTO kekko.api (name,publicKey,secretKey) VALUES ('bittrex',null,null);";

                    con.query(api_insert_sql, function (err, result) {
                        if (err) {
                            callback(err);
                        }
                        callback();
                        console.log('api rows inserted successfully!');
                    });
                }
            ], function (err) {
                if (err) {
                    console.error(err);
                }
                con.end();
            });

    }, executeSQL: function (sql, params, callback) {
        var con = mysql.createConnection(dbConf);
        con.connect();
        con.query(sql, params, function (err, rows) {
            if (err) {
                callback(null, err);
            } else {
                callback(rows);
            }
            con.end();
        });
    }
};

var dbInitialized = null;
async.series(
    [
        function (callback) {
            var con = getConnection();
            checkDB(con, function (err, result) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    if (result) {
                        dbInitialized = true;
                    } else {
                        dbInitialized = false;
                    }
                    callback();
                }
            });
            con.end();
        }
    ],
    function (err) {
        if (err) {
            console.error(err);
        } else {
            if (!dbInitialized) {
                module.exports.initializeDb();
            } else {
                console.log('DB ALREADY INITIALIZED');
            }
        }
    }
);





