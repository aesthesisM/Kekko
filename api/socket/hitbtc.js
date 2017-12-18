var https = require('https');
var crypto = require('crypto');
var queryString = require('querystring');
var async = require('async');
var WebSocket = require('ws');

var hitBTCClient;

var orderListener = new wsOrderListener(console.log);
var pairListener = new wsPairListener(console.log);

//Socket Pair Listener
function wsPairListener(callback) {
    var ws;
    ws = new WebSocket('wss://api.hitbtc.com/api/2/ws', null, {
        handshakeTimeout: 12000
    });
    ws.on('open', function () {
        console.log('WSOrderListener Websocket opened');
    });
    ws.on('close', function () {
        console.log('WSOrderListener Websocket closed');
    });

    ws.on('error', function (err) {
        callback(err);
        console.error(err);
    });

    ws.on('message', function (data) {
        callback(null, data);
    });

    this.ws = ws;
}

wsPairListener.prototype._listen = function (pair, listening) {
    var obj = {
        "method": "subscribeTicker",
        "params": {
            "symbol": pair
        },
        "id": "Kekko"
    }
    if (!listening) {
        obj.method = "unsubscribeTicker";
        console.log("closed ears for " + pair);
    } else {
        console.log("listening " + pair);
    }
    this.ws.send(JSON.stringify(obj));

}

wsPairListener.prototype._authorize = function (data) {
    this.ws.send(JSON.stringify(data));
}

wsPairListener.prototype._close = function () {
    this.ws.close();
}


//Socket Order Listener
function wsOrderListener(callback) {
    var ws = new WebSocket('wss://api.hitbtc.com/api/2/ws', null, {
        handshakeTimeout: 12000
    });

    ws.on('open', function () {
        console.log('wsPairListener connected');
    });

    ws.on('close', function () {
        console.log('wsPairListener Websocket closed');
    });

    ws.on('error', function (err) {
        callback(err);
        console.error('WSOrderListener error:' + err);
    });

    ws.on('message', function (data) {
        callback(null, data);
    });
    
    this.ws = ws;
}

wsOrderListener.prototype._authorize = function (data) {
    this.ws.send(JSON.stringify(data));
}

wsOrderListener.prototype._listenOrders = function (listen) {
    //order status = new, suspended, partiallyFilled, filled, canceled, expired
    var obj = {
        "method": "subscribeReports",
        "params": {}
    }

    if (!listen) {
        obj.method = "unsubscribeReports";
    }
    this.ws.send(JSON.stringify(obj));

}

wsPairListener.prototype._close = function () {
    this.ws.close();
}

function HitBTCClient(APIKey, APISecret) {
    this.APIKey = APIKey;
    this.APISecret = APISecret;
    this.APIVersion = '2';
    this.APIType = 'live';
    this.AuthorizationType = 'BASIC';
};

HitBTCClient.HOSTS = {
    live: 'api.hitbtc.com',
    sandbox: 'demo-api.hitbtc.com'
}; "111"

HitBTCClient.prototype._authorize = function (callback) {
    var authObj = {};

    authObj.method = "login";
    authObj.params = {};
    authObj.params.algo = "HS256";
    authObj.params.pKey = this.APIKey;
    authObj.params.nonce = Date.now().toString();
    authObj.params.signature = crypto.createHmac('sha256', this.APISecret).update(authObj.params.nonce, "utf8").digest('hex');

    return authObj;
}

setTimeout(function () {
    hitBTCClient = new HitBTCClient('f6162add43cb90c6750b111feeed0010', 'de7bf2ff1889ab9edd9cfad906fda42b');
    //1 authenticate
    var authObj = hitBTCClient._authorize();

    orderListener._authorize(authObj);
    pairListener._authorize(authObj);

    pairListener._listen("EOSUSD", true);
    pairListener._listen("XRPUSDT", true);
    orderListener._listenOrders(true);
    setTimeout(function () {
        pairListener._listen("EOSUSD", false);
        pairListener._listen("XRPUSDT", false);
        orderListener._listenOrders(false);
    }, 5000);

}, 3000);

exports = wsOrderListener;
exports = wsPairListener;


