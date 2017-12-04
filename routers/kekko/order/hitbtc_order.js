var express = require('express');
var router = express.Router();
var hitOrderManager = require('../../../dao/order/hitbtc_order');
var responseObject = require('../../../util/response').response;
router.get('/', function (req, res, next) {
    res.render('order/hitbtc/hitbtc_home', {title: 'HitBtc Home Page'});
});

router.get('/chain/getAll', function (req, res, next) {
    hitOrderManager.hitbtc_db_getAllOrderChains(hitOrderManager.apiName, function (err, data) {
        if (err) {
            responseObject.data = null;
            responseObject.message = err;
            responseObject.result = -1;
            console.error(err);
            res.send({respObj: responseObject});
        } else {
            responseObject.data = data;
            responseObject.message = 'ok';
            responseObject.result = 1;
            res.send({respObj: responseObject});
        }
    });
});

router.post('/chain/add', function (req, res, next) {

    //var chainOrderObj = {order_chain_name: 'BAMBAM', api_id_fk: 1};
    hitOrderManager.hitbtc_db_addOrderChain(req.body, function (err, data) {
        if (err) {
            responseObject.data = null;
            responseObject.message = err;
            responseObject.result = -1;
            console.error(err);
            res.send({respObj: responseObject});
        } else {
            responseObject.data = data;
            responseObject.message = 'ok';
            responseObject.result = 1;
            res.send({respObj: responseObject});
        }
    });
});

router.post('/chain/update', function (req, res, next) {

    //var chainOrderObj = {order_chain_name: 'BAMBAM', api_id_fk: 1};
    hitOrderManager.hitbtc_db_updateOrderChain(req.body, function (err, data) {
        if (err) {
            responseObject.data = null;
            responseObject.message = err;
            responseObject.result = -1;
            console.error(err);
            res.send({respObj: responseObject});
        } else {
            responseObject.data = data;
            responseObject.message = 'ok';
            responseObject.result = 1;
            res.send({respObj: responseObject});
        }
    });
});

router.post('/chain/delete', function (req, res, next) {
    //var chainOrderObj = {order_chain_name: 'BAMBAM', api_id_fk: 1};
    hitOrderManager.hitbtc_db_deleteOrderChain(req.body, function (err, data) {
        if (err) {
            responseObject.data = null;
            responseObject.message = err;
            responseObject.result = -1;
            console.error(err);
            res.send({respObj: responseObject});
        } else {
            responseObject.data = data;
            responseObject.message = 'ok';
            responseObject.result = 1;
            res.send({respObj: responseObject});
        }
    });
});

router.get('/chain/:chainId/getOrders', function (req, res, next) {

    hitOrderManager.hitbtc_db_getOrdersByOrderChainId({order_chain_id_fk: req.params.chainId}, function (err, data) {
        if (err) {
            responseObject.data = null;
            responseObject.message = err;
            responseObject.result = -1;
            console.error(err);
            res.send({respObj: responseObject});
        } else {
            responseObject.data = data;
            responseObject.message = 'ok';
            responseObject.result = 1;
            res.send({respObj: responseObject});
        }
    });
});
//localhost:50000/order/hitbtc/chain/:chainId/addOrder
router.post('/chain/:chainId/addOrder', function (req, res, next) {
    var orderObj = req.body;

    hitOrderManager.hitbtc_db_addOrder({}, function (err, data) {
        if (err) {
            responseObject.data = null;
            responseObject.message = err;
            responseObject.result = -1;
            console.error(err);
            res.send({respObj: responseObject});
        } else {
            responseObject.data = data;
            responseObject.message = 'ok';
            responseObject.result = 1;
            res.send({respObj: responseObject});
        }
    });
});

router.post('/chain/:chainId/updateOrder', function (req, res, next) {
    var orderObj = req.body;

    hitOrderManager.hitbtc_db_updateOrder({}, function (err, data) {
        if (err) {
            responseObject.data = null;
            responseObject.message = err;
            responseObject.result = -1;
            console.error(err);
            res.send({respObj: responseObject});
        } else {
            responseObject.data = data;
            responseObject.message = 'ok';
            responseObject.result = 1;
            res.send({respObj: responseObject});
        }
    });
});


module.exports = router;