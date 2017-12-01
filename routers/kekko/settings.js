var express = require('express');
var api = require('../../dao/api');
var async = require('async');
var router = express.Router();

router.get('/api', function (req, res, next) {

    var apis = null;

    async.parallel(
        [
            function (callback) {
                api.getAllAPIs(function (data, err) {
                    if (err) {
                        console.error(err);
                        callback(err);
                    } else {
                        apis = data;
                        callback();
                    }
                });
            }
        ], function (err) {
            if (err) {
                console.error(err);
                res.render('error', {title: 'Error Page', errorMessage: 'API call couldnt get apis from db'});
            }
            res.render("settings/api", {
                title: 'KEKKO API Dashboard Page',
                modelAPI: apis
            });
        });


});

module.exports = router;