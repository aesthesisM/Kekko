var express = require('express');
var router = express.Router();
var hitOrderManager = require('../../../dao/order/hitbtc');
var responseObject = require('../../../util/response').response;

router.get('/chains', function (req, res, next) {
    
    var take = parseInt(req.query.take);
    var skip = parseInt(req.query.skip);

    hitOrderManager.hitbtc_db_getChains({ take: take, skip: skip }, function (err, data) {
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

router.post('/chains/add', function (res, req, next) {
    hitOrderManager.hitbtc_db_addChain(req.body, function (err, data) {
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

router.post('/chains/update', function (res, req, next) {
    hitOrderManager.hitbtc_db_updateChain(req.body, function (err, data) {
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

router.get('/chains/:chainId', function (req, res, next) {
    hitOrderManager.hitbtc_db_getChainOrders(req.params.chainId, function (err, data) {
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
    })
});

router.post('/chains/:chainId/addOrder', function (res, req, next) {
    hitOrderManager.hitbtc_db_addOrder(req.body, req.params.chainId, function (err, data) {
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

router.post('/chains/:chainId/updateOrder', function (res, req, next) {
    hitOrderManager.hitbtc_db_updateOrder(req.body, req.params.chainId, function (err, data) {
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

module.exports = router;