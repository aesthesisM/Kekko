var mysql = require('mysql');
var async = require('async');
var dbConf = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3307',
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
        } else if (Object.keys(result).length>0) {
            callback(null, true);
        } else {
            callback(null, false)
        }
    })
}

module.exports = {

    initializeDb: function () {
        var con = getConnection();
        console.log('connected to ' + dbConf.host);

        //created database sql
        var create_db_sql = 'CREATE DATABASE IF NOT EXISTS kekko DEFAULT CHARACTER SET utf8';
        con.query(create_db_sql, function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log('Database KEKKO initialized successfully');
        });


        //create user table sql
        var create_table_user_sql = "CREATE TABLE IF NOT EXISTS kekko.user (" +
            "`id`  INT NOT NULL AUTO_INCREMENT," +
            "`user_name` VARCHAR(45) NOT NULL," +
            "`password` VARCHAR(45) NOT NULL," +
            "PRIMARY KEY (`id`))";
        con.query(create_table_user_sql, function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log('Table User initialized successfully');
        });
        //create api table sql
        var create_table_api_sql = "CREATE TABLE IF NOT EXISTS kekko.api (" +
            "`id` int(11) NOT NULL AUTO_INCREMENT," +
            "`api_name` varchar(45) NOT NULL," +
            "`publicKey` varchar(45) DEFAULT NULL," +
            "`secretKey` varchar(45) DEFAULT NULL," +
            "PRIMARY KEY (`id`)" +
            ") ENGINE=InnoDB DEFAULT CHARSET=utf8";

        con.query(create_table_api_sql, function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log('Table Api initialized successfully');
        });

        //create order chain table sql;
        var create_table_order_chain_sql = "CREATE TABLE kekko.order_chain (" +
            "`id` int(11) NOT NULL AUTO_INCREMENT," +
            "`order_chain_name` varchar(45) NOT NULL," +
            "`api_id_fk` int(11) DEFAULT NULL," +
            "PRIMARY KEY (`id`)," +
            "KEY `api_fk__idx` (`api_id_fk`)," +
            "CONSTRAINT `api_fk_` FOREIGN KEY (`api_id_fk`) REFERENCES `api` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION)";
        con.query(create_table_order_chain_sql, function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log('Table Order Chain initialized successfully');
        });

        //create order table sql
        var create_table_order_sql = "CREATE TABLE kekko.order (" +
            "`id` int(11) NOT NULL AUTO_INCREMENT," +
            "`from` varchar(10) NOT NULL," +
            "`to` varchar(10) NOT NULL," +
            "`amount` float NOT NULL," +
            "`price` float NOT NULL," +
            "`total_price` float NOT NULL," +
            "`nex_order_id_fk` int(11) DEFAULT NULL," +
            "`success` smallint(2) DEFAULT '0'," +
            "`order_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
            "`order_success_time` timestamp NULL DEFAULT NULL," +
            "`api_site_order_id` bigint(20) DEFAULT NULL," +
            "`order_chain_id_fk` int(11) DEFAULT NULL," +
            "PRIMARY KEY (`id`)," +
            "KEY `order_chain_fk_idx` (`order_chain_id_fk`)," +
            "CONSTRAINT `order_chain_fk` FOREIGN KEY (`order_chain_id_fk`) REFERENCES `order_chain` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION)";
        con.query(create_table_order_sql, function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log('Table Order initialized successfully');
        });

        //create index on order table for next order
        var create_index_on_next_order_id_sql = "ALTER TABLE kekko.order ADD INDEX `order_next_fk_idx` (`nex_order_id_fk` ASC)";
        con.query(create_index_on_next_order_id_sql, function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log('Index created on Order table with Next_order_id column');
        });
        //create fk on order with next_order_id
        var alter_table_order_next_order_id_fk = "ALTER TABLE kekko.order ADD CONSTRAINT `order_next_fk` FOREIGN KEY (`nex_order_id_fk`) REFERENCES `kekko`.`order` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION ";
        con.query(alter_table_order_next_order_id_fk, function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log('FK created on Order table with next order id and id column');
        });

        con.end();
    }, executeSQL: function (sql, params, callback) {
        var con = mysql.createConnection(dbConf);

        con.connect();
        con.query(sql, params, function (err, rows) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                console.log(rows);
                callback(rows);
            }
            con.end();
        });
    }
};


var dbInitialized = null;
async.parallel(
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





