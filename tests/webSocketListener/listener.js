const WebSocket = require('ws');

var reconnectInterval = 1000 * 5; //5seconds
var ws;
var connect = function (kill) {
    ws = new WebSocket('wss://api.hitbtc.com/api/2/ws');
    ws.on('open', function open() {
        console.log('connected');
        var obj = {
            "method": "subscribeTicker",
            "params": {
                "symbol": "ETHUSD"
            },
            "id": 123

        };
        ws.send(JSON.stringify(obj));
    });
    /*
    ws.on('error', function () {
        console.log('socket error');
    });
    */
    ws.on('close', function () {
        console.log('socket close');
        if (kill != true)
            setTimeout(connect, reconnectInterval);
    });
    ws.on('message', function incoming(data) {
        console.log(data);
    });
};

connect(false);

