var express = require('express');
var router = express.Router();
var hitOrderManager = require('../../../dao/order/hitbtc');
var responseObject = require('../../../util/response').response;
router.get('/', function (req, res, next) {
    res.render('order/hitbtc/hitbtc', { title: 'HitBtc Home Page' });
});

router.get('/chains', function (req, res, next) {
    var take = req.query.take;
    var skip = req.quert.skip;
    hitOrderManager.hitbtc_db_getChains({ take: take, skip: skip }, function (data, err) {
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

router.post('/chains/update', function (res, req, next) {
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

router.post('/chains/:chainId/addOrder', function (res, req, next) {
    hitOrderManager.hitbtc_db_addOrder(req.body, req.params.chainId, function (data, err) {
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

module.exports = router;