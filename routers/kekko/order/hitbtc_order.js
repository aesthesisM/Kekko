var express = require('express');
var router = express.Router();
var hitOrderManager = require('../../../dao/order/hitbtc_order');
router.get('/', function (req, res, next) {
    res.render('order/hitbtc/hitbtc_home', {title: 'HitBtc Home Page'});
});

router.get('/chain/getAll', function (req, res, next) {
    hitOrderManager.hitbtc_db_getAllOrderChains(hitOrderManager.apiName, function (err, data) {
        if (err) {
            res.send({errMessage: err});
        } else {
            res.send(data);
        }
    });
});

router.post('/chain/add', function (req, res, next) {

    //var chainOrderObj = {order_chain_name: 'BAMBAM', api_id_fk: 1};
    hitOrderManager.hitbtc_db_addOrderChain(req.body, function (err, data) {
        if (err) {
            console.log(err);
            res.send({errMessage: err});
        } else {
            res.send(data);
        }
    });
});

router.post('/chain/update', function (req, res, next) {

    //var chainOrderObj = {order_chain_name: 'BAMBAM', api_id_fk: 1};
    hitOrderManager.hitbtc_db_updateOrderChain(req.body, function (err, data) {
        if (err) {
            console.log(err);
            res.send({errMessage: err});
        } else {
            res.send(data);
        }
    });
});

router.post('/chain/delete', function (req, res, next) {

    //var chainOrderObj = {order_chain_name: 'BAMBAM', api_id_fk: 1};
    hitOrderManager.hitbtc_db_deleteOrderChain(req.body, function (err, data) {
        if (err) {
            console.log(err);
            res.send({errMessage: err});
        } else {
            res.send(data);
        }
    });
});


module.exports = router;