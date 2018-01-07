var async = require('async')
var mongodb = require('mongodb').MongoClient;
var dbURL = "mongodb://172.16.169.129:27017";

mongodb.connect(dbURL, function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log("connected to mongodb server");
    }
    data.close();
});
function initializeDB() {
    mongodb.connect(dbURL, function (err, data) {

        if (err) {
            console.error(err);
        } else {
            var testDB = data.db("test_db");
            console.log(testDB);
            testDB.createCollection("api", function (err, result) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("api collection created");
                }
               
            });
        }

    });
}

