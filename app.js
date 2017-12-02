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
var router_settings = require('./routers/kekko/settings');
var router_hitbtc_home = require('./routers/kekko/order/hitbtc_order');
var router_bittrex_home = require('./routers/kekko/order/bittrex_order');
var router_poloniex_home = require('./routers/kekko/order/poloniex_order');
/*
 // create a write stream (in append mode)
 var accessLogStream = fs.createWriteStream(
 path.join(__dirname, 'access.log'), {flags: 'a'}
 );
 // setup the logger
 app.use(morgan('combined', {stream: accessLogStream}));
 */
app.use(logger('dev'));

// view engine setup
app.engine('hbs', handleBars({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, '/views/layouts')
}));

app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public/')));

/*
 routers
 */
app.use('/', router_index);
app.use('/home', router_home);
app.use('/dashboard/api', router_settings);
app.use('/order/hitbtc', router_hitbtc_home);
app.use('/order/bittrex', router_bittrex_home);
app.use('/order/poloniex', router_poloniex_home);

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
    res.render('error', {title: 'Error Page', errorMessage: err.stack});
});


module.exports = app;