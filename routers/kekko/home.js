var express = require('express');
var router = express.Router();
var HitBTC = require('../../api/rest/hitbtc/hitbtc');
var async = require('async');
router.get('/', function (req, res, next) {
    console.log('home get request has come to here');
    var client = new HitBTC('', '');

    var list = null;

    async.series([
        function (callback) {
            client.tickerAll(function (err, data) {
                if (err) {
                    return callback(err);
                }
                list = data;
                callback();
            });
        }
    ], function (err) {
        if (err) {
            console.error(err);
            return res.render('error', {title: 'Error Page', errorMessage: err});
        }
        res.send(list);
    });


});

module.exports = router;