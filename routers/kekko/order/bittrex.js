var express = require('express');
var bittrex = require('../../../api/bittrex/bittrex');
var router = express.Router();

router.get('/', function (req, res, next) {
    //res.render('order/bittrex/bittrex_home', { title: 'Bittrex Home Page' });
    res.send('ok');
});

module.exports = router;