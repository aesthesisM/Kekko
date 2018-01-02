
//var debug = require('debug')('Kekko:server');
var app = require('../app.js');
var server = require('http').Server(app);
var port = 50000;

app.set('port', port);

var socketIO = require('socket.io')(server);


socketIO.sockets.on('connection', function (socket) {
    console.log("a user connected");

    socket.emit('message', 'you are connected the socket');

    socket.on('message', function (data) {
        console.log("message sended from client is :" + JSON.stringify(data));
    });

    socket.on("getAllAPIs", function (data) {

    });

    socket.on("updateAPI", function (data) {

    });

    socket.on("getPairs", function (data) {

    });

    socket.on("getChains", function (data) {

    });

    socket.on("addChain", function (data) {

    });

    socket.on("updateChain", function (data) {

    });

    socket.on("startChain", function (data) {

    });

    socket.on("stopChain", function (data) {

    });

    socket.on("getChainOrders", function (data) {

        socket.emit("getChainOrdersCallback",data);
    });

    socket.on("addOrder", function (data) {

    });

    socket.on("updateOrder", function (data) {

    });

});
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
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

