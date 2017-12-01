var express = require('express');
var router = express.Router();
var HitBTC = require('../../api/hitbtc/hitbtc');
var async = require('async');
router.get('/', function (req, res, next) {
    console.log('home get request has come to here');
    var client = new HitBTC('f39356b5f3bd407da77c042d55625dd7', '58f9d3ece954f73067485b11a5d5602a', 'live');

    var list = null;

    async.parallel([
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
        res.render('home/home', {title: 'Home Page', pairs: list});
    });


});

module.exports = router;