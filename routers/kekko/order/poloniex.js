var express = require('express');
var poloniex = require('../../../api/poloniex/poloniex');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.send('ok');
});

module.exports = router;