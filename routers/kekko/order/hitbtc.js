var express = require('express');
var router = express.Router();
var hitOrderManager = require('../../../dao/order/hitbtc');
var HitBTC = require('../../../api/rest/hitbtc/hitbtc');
var responseObject = require('../../../util/response').response;
var async = require('async');
//localhost:50000/hitbtc/chains
router.get('/chains', function (req, res, next) {

    var start = parseInt(req.query.start);
    var take = parseInt(req.query.take);

    hitOrderManager.hitbtc_db_getChains({ start: start, take: take }, function (data, err) {
        if (err) {
            console.error(err);
            responseObject.data = null;
            responseObject.message = 'Failed at getting chains in hitbtc';
            responseObject.result = -1;
            res.send({ respObj: responseObject });
        } else {
            responseObject.data = data;
            responseObject.message = 'successful';
            responseObject.result = 1;
            res.send({ respObj: responseObject });
        }
    });

});
//localhost:50000/hitbtc/chains/add
router.post('/chains/add', function (req, res, next) {
    hitOrderManager.hitbtc_db_addChain(req.body, function (data, err) {
        if (err) {
            console.error(err);
            responseObject.data = null;
            responseObject.message = 'Failed at getting chains in hitbtc';
            responseObject.result = -1;
            res.send({ respObj: responseObject });
        } else {
            responseObject.data = null;
            responseObject.message = 'successful';
            responseObject.result = 1;
            res.send({ respObj: responseObject });
        }
    });

});
//localhost:50000/hitbtc/chains/update
router.post('/chains/update', function (req, res, next) {
    hitOrderManager.hitbtc_db_updateChain(req.body, function (data, err) {
        if (err) {
            console.error(err);
            responseObject.data = null;
            responseObject.message = 'Failed at getting chains in hitbtc';
            responseObject.result = -1;
            res.send({ respObj: responseObject });
        } else {
            responseObject.data = null;
            responseObject.message = 'successful';
            responseObject.result = 1;
            res.send({ respObj: responseObject });
        }
    });

});
//localhost:50000/hitbtc/chains/:id
router.get('/chains/:chainId', function (req, res, next) {
    hitOrderManager.hitbtc_db_getChainOrders(req.params.chainId, function (data, err) {
        if (err) {
            console.error(err);
            responseObject.data = null;
            responseObject.message = 'Failed at getting chains in hitbtc';
            responseObject.result = -1;
            res.send({ respObj: responseObject });
        } else {
            responseObject.data = data;
            responseObject.message = 'successful';
            responseObject.result = 1;
            res.send({ respObj: responseObject });
        }
    })
});

router.post('/chains/:chainId/addOrder', function (req, res, next) {
    hitOrderManager.hitbtc_db_addOrder(req.body, req.params.chainId, function (data, err) {
        if (err) {
            console.error(err);
            responseObject.data = null;
            responseObject.message = 'Failed at getting chains in hitbtc';
            responseObject.result = -1;
            res.send({ respObj: responseObject });
        } else {
            responseObject.data = data;
            responseObject.message = 'successful';
            responseObject.result = 1;
            res.send({ respObj: responseObject });
        }
    });
});
//localhost:50000/hitbtc/chains/:id/updateOrder
router.post('/chains/:chainId/updateOrder', function (req, res, next) {
    hitOrderManager.hitbtc_db_updateOrder(req.body, req.params.chainId, function (data, err) {
        if (err) {
            console.error(err);
            responseObject.data = null;
            responseObject.message = 'Failed at getting chains in hitbtc';
            responseObject.result = -1;
            res.send({ respObj: responseObject });
        } else {
            responseObject.data = null;
            responseObject.message = 'successful';
            responseObject.result = 1;
            res.send({ respObj: responseObject });
        }
    });

});

//localhost:50000/hitbtc/tickers
router.get('/tickers', function (req, res, next) {
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
            responseObject.data = null;
            responseObject.message = 'Failed at getting pairs in hitbtc';
            responseObject.result = -1;
            res.send({ respObj: responseObject });
        } else {
            responseObject.data = list;
            responseObject.message = 'successful';
            responseObject.result = 1;
            res.send({ respObj: responseObject });
        }
    });

});

module.exports = router;