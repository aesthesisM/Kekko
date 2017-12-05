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
                res.send({ respObj: responseObject });
            } else {
                responseObject.data = apis;
                responseObject.message = 'ok';
                responseObject.result = 1;
                res.send({ respObj: responseObject });
            }
        });


});

router.post('/update', function (req, res, next) {
    //apiObject must come from request
    console.log(req);

    api.updateAPI(req.body, function (data, err) {
        if (err) {
            responseObject.data = null;
            responseObject.message = 'API call couldnt update apis in db';
            responseObject.result = -1;
            console.error(err);
            res.send({ respObj: responseObject });
        } else {
            responseObject.data = data;
            responseObject.message = 'ok';
            responseObject.result = 1;
            res.send({ respObj: responseObject });
        }
    });

});

module.exports = router;