var https = require('https');
var crypto = require('crypto');
var queryString = require('querystring');
var async = require('async');
var WebSocket = require('ws');
var orderDao = require('../../dao/order/hitbtc');

var hitBTCClient;
var hitBTCSocketUrl = "wss://api.hitbtc.com/api/2/ws";
var orderListener = new wsOrderListener(orderManager);
var pairListener = new wsPairListener(pairManager);

//Socket Pair Listener
function wsPairListener(callback) {
    var ws = null;
    ws = new WebSocket(hitBTCSocketUrl, null, {
        handshakeTimeout: 5500
    });

    ws.on('open', function () {
        console.log('WSPairListener Websocket opened');
    });
    ws.on('close', function () {
        console.log('WSPairListener Websocket closed');
    });

    ws.on('error', function (err) {
        callback(err);
        console.error("wsPairListener error :" + err);
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
    var ws = new WebSocket(hitBTCSocketUrl, null, {
        handshakeTimeout: 5500
    });

    ws.on('open', function () {
        console.log('wsOrderListener connected');
    });

    ws.on('close', function () {
        console.log('wsOrderListener Websocket closed');
    });

    ws.on('error', function (err) {
        callback(err);
        console.error('wsOrderListener error:' + err);
    });

    ws.on('message', function (data) {
        callback(null, data);
    });

    this.ws = ws;
}

wsOrderListener.prototype._authorize = function (data) {
    this.ws.send(JSON.stringify(data));
}

wsOrderListener.prototype._listen = function () {
    //order status = new, suspended, partiallyFilled, filled, canceled, expired
    var obj = {
        "method": "subscribeReports",
        "params": {}
    }
    this.ws.send(JSON.stringify(obj));
}

wsOrderListener.prototype._close = function () {
    this.ws.close();
}

function HitBTCClient(APIKey, APISecret) {
    this.APIKey = APIKey;
    this.APISecret = APISecret;
    this.APIVersion = '2';
};

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

var pairCount = 0;
function pairManager(err, socketData) {
    if (err) {
        console.error(err);
    } else {
        console.log((++pairCount) + " - " + socketData);
    }
}
function _has(object, key) {
    return object ? hasOwnProperty.call(object, key) : false;
}
function orderManager(err, socketData) {
    socketData = JSON.parse(socketData);
    if (err) { //socket error
        console.error(err);
    } else if (_has(socketData, 'error')) {//socket api order error
        console.error(socketData.error.message + "," + socketData.error.description);
    } else if (_has(socketData, 'method') && socketData.method == 'report') {//check order status if the socketData is about orders
        if (socketData.params.status == 'filled') { //order has completed with success
            //then lets check if there is a waiting orther for this chain
            //first get this filled orders id,
            //second get this orders chain id,
            //thirth and last, find next order id if it exist then make a order request else close the chain
        } else if (socketData.params.status == 'canceled' || socketData.params.status == 'expired') { // if any order is expired or cancelled then stop the whole chain
            console.log('cancelled order :' + JSON.stringify(socketData));
        } else if (socketData.params.status == 'new') {
            console.log('newOrder :' + JSON.stringify(socketData));
        }
    } else if (_has(socketData, 'result')) {//result attribute used to check if new order has been successfully defined

    } else if (_has(socketData, 'method') && socketData.method == 'activeReports') {//at first hitbtc sends all defined orders and send it with activeReports method
        //we will use this method to determine which order made on hitbtc site and which order made by Kekko.
    }
}


setTimeout(function () {

    hitBTCClient = new HitBTCClient('ca50230befd43870f2510003414e4e67', '');
    //1 authenticate
    var authObj = hitBTCClient._authorize();

    orderListener._authorize(authObj);
    //pairListener._authorize(authObj);

    //pairListener._listen("EOSUSD", true);
    //pairListener._listen("XRPUSDT", true);
    orderListener._listen();

    setTimeout(function () {
        //pairListener._listen("EOSUSD", false);
        //pairListener._listen("XRPUSDT", false);
        pairListener._close();
        //orderListener._close();
    }, 5000);

}, 6000);

