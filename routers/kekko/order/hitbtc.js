var express = require('express');
var router = express.Router();
var hitOrderManager = require('../../../dao/order/hitbtc');
var HitBTC = require('../../../api/rest/hitbtc/hitbtc');
var responseObject = require('../../../util/response').response;
var async = require('async');
//localhost:50000/hitbtc/chains
//sql's will be changed with chains
//active = deleted
//status = 0 removed, 1 = waiting, 2 running , 3success
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
            responseObject.data = data.insertId;
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
            responseObject.data = data.insertId;
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
//status 0 canceled, 1 waiting, 2 running, 3 completed
router.get('/chains/:chainId/start', function (req, res, next) {
    async.series(
        [
            function (callback) {
                hitOrderManager.hitbtc_db_chain_start_stop(req.params.chainId, 2, function (data, err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                })
            },
            function (callback) {

            }
        ],
        function (err) {
            if (err) {
                responseObject.data = null;
                responseObject.message = 'Failed at starting chain in hitbtc with chain id:' + req.params.chainId;
                responseObject.result = -1;
                res.send({ respObj: responseObject });
            } else {
                responseObject.data = null;
                responseObject.message = 'Chain started successfully!';
                responseObject.result = 1;
                res.send({ respObj: responseObject });
            }
        }
    )

});
//status 0 canceled, 1 waiting, 2 running, 3 completed
router.get('/chains/:chainId/stop', function (req, res, next) {
    async.series(
        [
            function (callback) {
                hitOrderManager.hitbtc_db_chain_start_stop(req.params.chainId, 0, function (data, err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                })
            }
        ],
        function (err) {
            if (err) {
                responseObject.data = null;
                responseObject.message = 'Failed at starting chain in hitbtc with chain id:' + req.params.chainId;
                responseObject.result = -1;
                res.send({ respObj: responseObject });
            } else {
                
                responseObject.data = null;
                responseObject.message = 'Chain stopped successfully!';
                responseObject.result = 1;
                res.send({ respObj: responseObject });
            }
        }
    )
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