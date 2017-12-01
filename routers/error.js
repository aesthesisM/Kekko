var express = require('express');
var router = express.Router();

//enterance page
router.get('/error', function (req, res, next) {
    console.log('index router called');
    res.render('error', { title: 'Error': errorMessage: err });
});

module.exports = router;
