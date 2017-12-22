var express = require('express');
var session = require('express-session');
var app = express();

//Here ‘secret‘ is used for cookie handling etc but we have to put some secret for managing Session in Express.
app.use(session({ secret: 'bambambam' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var sess;
app.get('/', function (req, res) {
    sess = req.session;
    /*
    * Here we have assign the 'session' to 'sess'.
    * Now we can create any number of session variable we want.
    * in PHP we do as $_SESSION['var name'].
    * Here we do like this.
    */
    sess.email; // equivalent to $_SESSION['email'] in PHP.
    sess.username; // equivalent to $_SESSION['username'] in PHP.
    sess.logged = true;



    if (sess.email) {
        /*
        * This line check Session existence.
        * If it existed will do some action.
        */
        res.redirect('/login');
    } else {
        res.render('index.html');
    }
});

app.post('/login', function (req, res) {
    sess = req.session;
    //In this we are assigning email to sess.email variable.
    //email comes from HTML page.
    sess.email = req.body.email;
    res.end('done');
});

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.listen(3000, function () {
    console.log("App Started on PORT 3000");
});
