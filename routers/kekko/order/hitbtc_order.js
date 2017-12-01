var express = require('express');
var hitBTC = require('../../../api/hitbtc/hitbtc');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('order/hitbtc/hitbtc_home', { title: 'HitBtc Home Page' });
});

module.exports = router;