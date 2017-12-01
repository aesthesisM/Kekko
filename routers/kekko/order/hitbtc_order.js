var express = require('express');
var router = express.Router();
var HitBTC = require('../../../api/hitbtc/hitbtc');
router.get('/', function (req, res, next) {
    res.render('order/hitbtc/hitbtc_home', {title: 'HitBtc Home Page'});
});

module.exports = router;