/**
 * Created by khobsyzl28 on 11/22/2017.
 */

var db = require('../config/database/mysql');
module.exports = {
    getUser: function (params, callback) {
        db.executeSQL("SELECT * FROM kekko.user WHERE name = ? AND password = ?", [params.name, params.password], function (data, err) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                callback(data);
            }
        });

    }, getAllUsers: function (callback) {
        db.executeSQL("SELECT * FROM kekko.user", null, function (data, err) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    }, updateUser: function (params, callback) {
        db.executeSQL("UPDATE kekko.user SET password = ? WHERE name= ?", [params.password, params.name], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    }, insertUser: function (params, callback) {
        db.executeSQL("INSERT INTO kekko.user (name,password) VALUES (?,?)", [params.name, params.password], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    }
};