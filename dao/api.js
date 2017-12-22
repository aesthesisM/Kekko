var db = require('../config/database/mysql');

module.exports = {
    getAllAPIs: function (callback) {
        db.executeSQL("SELECT * FROM kekko.api", {}, function (data, err) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    },
    updateAPI: function (params, callback) {
        db.executeSQL("UPDATE kekko.api SET publicKey=?,secretKey=? WHERE id=?", [params.publicKey, params.secretKey, params.id], function (data, err) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    },
    insertAPI: function (params, callback) {
        db.executeSQL("INSERT INTO kekko.api (api_name,publicKey,secretKey) VALUES (?,?,?)", [params.api_name, params.publicKey, params.secretKey], function (data, err) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    }
};