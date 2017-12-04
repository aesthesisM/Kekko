var express = require('express');
var router = express.Router();
var user = require('../dao/user.js');

//enterance page
router.get('/', function (req, res, next) {
    console.log('index router called');
    res.render('login', {title: 'KEKKO Simple Chain Order Application', layout:false});
});

//login form posted url
router.post('/login', function (req, res, next) {
    //thats how you get post params from posted request
    //console.log('username :' + req.body.username);
    //console.log('password :' + req.body.password);
    
    user.getAllUsers(function (data, err) {
        if (err) {
            res.render('login', { title: 'Simple Chain Order Application', layout: false}); //error message will be added
        } else if (data.length == 1) {//if there is a user then check if its ours
            if (data[0].name == req.body.username && data[0].password == req.body.password) {
                console.log(data);
                res.redirect('/home');
            } else {
                res.render('login', { title: 'Simple Chain Order Application', layout: false}); //error message will be added
            }
        } else {//user doesnt exist and sing up that user for the first time
            user.insertUser({name: req.body.username, password: req.body.password}, function (data, err) {
                if (err) {
                    res.render('login', { title: 'Simple Chain Order Application', layout: false}); //error message will be added
                } else {
                    res.redirect('/home');
                }
            });
        }
    });

});

module.exports = router;
