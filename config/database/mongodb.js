var mongodb = require('mongodb').MongoClient;

var dbURL = "mongodb://localhost:27017/test_db";

mongodb.connect(dbURL, function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log("connected");
    }
    data.close();
});

mongodb.connect(dbURL, function (err, data) {

    if (err) {
        console.error(err);
    } else {
        data.createCollection("api", function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log("api collection created");
            }
        });
    }
    data.close();
});