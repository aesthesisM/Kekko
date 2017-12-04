var express = require('express');
var api = require('../../dao/api');
var async = require('async');
var router = express.Router();
var responseObject = require('../../util/response').response;

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
                responseObject.data = null;
                responseObject.message = 'API call couldnt get apis from db';
                responseObject.result = -1;
                res.render('error', {title: 'Error Page', respObj: responseObject});
            }
            responseObject.data = apis;
            responseObject.message = 'ok';
            responseObject.result = 1;

            res.render("dashboard/api", {
                title: 'KEKKO API Dashboard Page',
                respObj: responseObject
            });
        });


});

router.post('/update', function (req, res, next) {
    //apiObject must come from request
    var apiObj = {id: 1, api_name: 'hitbtc', publicKey: 'public', secretKey: 'secret'};
    api.updateAPI(apiObj, function (data, err) {
        if (err) {
            responseObject.data = null;
            responseObject.message = 'API call couldnt update apis in db';
            responseObject.result = -1;
            console.error(err);
            res.render('error', {respObj: responseObject});
        }
        responseObject.data = data;
        responseObject.message = 'ok';
        responseObject.result = 1;
        res.send({respObj: responseObject});
    });

});

module.exports = router;