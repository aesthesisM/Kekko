var express = require('express');
var router = express.Router();
var user = require('../dao/user.js');
var responseObject = require('../util/response').response;
//enterance page
router.get('/', function (req, res, next) {
    console.log('index router called');
    res.render('login', { title: 'KEKKO Simple Chain Order Application', layout: false });
});

//login form posted url
router.post('/login', function (req, res, next) {
    //thats how you get post params from posted request
    //console.log('username :' + req.body.username);
    //console.log('password :' + req.body.password);

    user.getAllUsers(function (data, err) {
        if (err) {
            //res.render('login', { title: 'Simple Chain Order Application', layout: false }); //error message will be added
        } else if (data.length == 1) {//if there is a user then check if its ours
            if (data[0].name == req.body.username && data[0].password == req.body.password) {
                console.log(data);
                data[0].password = '';
                responseObject.data = data[0];
                responseObject.message = 'success';
                responseObject.result = 1;
                res.send({ respObj: responseObject });
            } else {
                responseObject.data = null;
                responseObject.message = 'Username & password doesn\'t match';
                responseObject.result = -1;
                res.send({ respObj: responseObject });
            }
        } else {//user doesnt exist and sing up that user for the first time
            user.insertUser({ name: req.body.username, password: req.body.password }, function (data, err) {
                if (err) {
                    responseObject.data = null;
                    responseObject.message = 'Insert User DB Problem.';
                    responseObject.result = -1;
                    res.send({ respObj: responseObject });
                } else {
                    responseObject.data = { name: req.body.username, password: '' };
                    responseObject.message = 'success';
                    responseObject.result = 1;
                    res.send({ respObj: responseObject });
                }
            });
        }
    });

});

module.exports = router;
