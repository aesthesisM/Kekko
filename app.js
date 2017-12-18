//var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var handleBars = require('express-handlebars');
var logger = require('morgan');
var expressValidator = require('express-validator');
var expressSession = require('express-session');


var app = express();
var router_index = require('./routers/index');
var router_home = require('./routers/kekko/home');
var router_api = require('./routers/kekko/api');
var router_hitbtc = require('./routers/kekko/order/hitbtc');
var router_bittrex = require('./routers/kekko/order/bittrex');
var router_poloniex = require('./routers/kekko/order/poloniex');

//create a write stream (in append mode)
/*
 var accessLogStream = fs.createWriteStream(
 path.join(__dirname, 'access.log'), {flags: 'a'}
 );
 // setup the logger
 app.use(morgan('combined', {stream: accessLogStream}));
 */
app.use(logger('dev'));

//// view engine setup
app.engine('html', handleBars({
    extname: 'html',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, '/public/views/')
}));

app.set('views', path.join(__dirname, 'public/views/'));
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public/')));

/*
session configuration
Here ‘secret‘ is used for cookie handling etc but we have to put some secret for managing Session in Express.
*/

app.use(expressSession({ secret: 'KekkoSecret' }));
/*
 routers
 */
app.use('/', router_index);
app.use('/home', router_home);
app.use('/api', router_api);
app.use('/hitbtc', router_hitbtc);
app.use('/bittrex', router_bittrex);
app.use('/poloniex', router_poloniex);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Error Page', errorMessage: err.stack });
});


module.exports = app;