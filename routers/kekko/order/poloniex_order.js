var express = require('express');
var poloniex = require('../../../api/poloniex/poloniex');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('order/poloniex/poloniex_home', { title: 'Poloniex Home Page' });

});

module.exports = router;