require('dotenv').config();
var conf = process.env;
var mysql = require('mysql');
var migration = require('mysql-migrations');

var connection = mysql.createPool({
    connectionLimit : 10,
    host: conf.DB_HOST,
    user: conf.DB_USER,
    password: conf.DB_PASSWORD,
    port: conf.DB_PORT,
    database: conf.DB_NAME
});

migration.init(connection, __dirname + '/migrations');