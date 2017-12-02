var express = require('express');
var api = require('../../dao/api');
var async = require('async');
var router = express.Router();
var responseObject = require('../../util/response');

router.get('/', function (req, res, next) {

    var apis = null;

    async.series(
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
            res.render("dashboard/api", {
                title: 'KEKKO API Dashboard Page',
                modelAPI: apis
            });
        });


});

router.post('/update', function (req, res, next) {
    //apiObject must come from request
    var apiObj = {id: 1, api_name: 'hitbtc', publicKey: 'public', secretKey: 'secret'};
    api.updateAPI(apiObj, function (data, err) {
        if (err) {
            console.error(err);
            res.render('error', {errorMessage: err});
        }
        res.send(data);
    });

});

module.exports = router;