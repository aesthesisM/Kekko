/**
 * Created by khobsyzl28 on 11/22/2017.
 */

var db = require('../config/database/mysql');
module.exports = {
    getUser: function (params, callback) {
        db.executeSQL("SELECT * FROM kekko.user WHERE user_name = ? AND password = ?", [params.user_name, params.password], function (data, err) {
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
        db.executeSQL("UPDATE kekko.user SET password = ? WHERE user_name= ?", [params.password, params.user_name], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    }, insertUser: function (params, callback) {
        db.executeSQL("INSERT INTO kekko.user (user_name,password) VALUES (?,?)", [params.user_name, params.password], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    }
};