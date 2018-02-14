
//var debug = require('debug')('Kekko:server');
var app = require('../app.js');
var server = require('http').Server(app);
var port = 50000;

app.set('port', port);

var socketIO = require('socket.io')(server);
/*collectors*/

//var hitbtcCollector = require('../api/collector/hitbtc');
var bittrexCollector = require('../api/collector/bittrex');
//var poloniexCollector = require('../api/collector/poloniex');
/*
hitbtcCollector.startRunner(function (data) {
    var signalObj = {};
    signalObj.data = data;
    signalObj.api = 1;
    socketIO.emit('signal', signalObj);
});
*/

bittrexCollector.startRunner(function (data) {
    var signalObj = {};
    signalObj.data = data;
    signalObj.api = 2;
    socketIO.emit('signal', data);
});

/*
poloniexCollector.startRunner(function (data) {
    var signalObj = {};
    signalObj.data = data;
    signalObj.api = 3;
    socketIO.emit('signal', signalObj);
});
*/

/*listeners*/
//var HitBtcListener = require('../api/socket/hitbtc');
//var BittirexListener = require('../api/rest/bittrexListener);
//var PoloniexListener = require('../api/rest/poloniexListener);/*  */
/*
hitbtcListener = new HitbtcListener(function(order){
    var socketObj = {};
    socketObj.api=1;
    socketObj.data = order;
    socketIO.emit('order',JSON.stringify(socketObj.data));
});

bittirexListener = new BittrexListener(function(order){
    var socketObj = {};
    socketObj.api=2;
    socketObj.data = order;
    socketIO.emit('order',JSON.stringify(socketObj.data));
});

poloniexListener = new PoloniexListener(function(order){
    var socketObj = {};
    socketObj.api=3;
    socketObj.data = order;
    socketIO.emit('order',JSON.stringify(socketObj.data));
});

socketIO.on("chainDump", function (data) { //api = 1,2,3 | type : dump,chain 
    if (data.api != undefined && data.api != null)
        try {
            switch (data.api) {
                case 1:
                    //hitbtcListener.chain(data);
                    break;
                case 2:
                    //bittrexListener.chain(data);
                    break;
                case 3:
                    //poloniexListener.chain(data);
                    break;
            }
            var resultObj = { api: data.api, result: 1, message="chain started and order placed", data: null };
            socketIO.emit("chainCallback", JSON.stringify(resultObj));
        } catch (err) {
            var resultObj = { api: data.api, result: -1, message="error occured", data: null };
            socketIO.emit("chainCallback", JSON.stringify(resultObj));
        }
});

*/
socketIO.sockets.on('connection', function (socket) {
    console.log("a user connected");
    socket.emit('connection', bittrexCollector.getSignals());
});
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port,"0.0.0.0",function(){
    var host = server.address().address;
    console.log("server listening at port:"+port+" and  host is :"+host);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    //debug('Listening on ' + bind);
}

