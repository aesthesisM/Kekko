var https = require('https');
var crypto = require('crypto');
var queryString = require('querystring');
var async = require('async');
var WebSocket = require('ws');

var events = require('events');
var eventEmitter = new events.EventEmitter();


ws = new WebSocket('wss://api.hitbtc.com/api/2/ws', null, {
    handshakeTimeout: 12000
});

var ws2 = new WebSocket('wss://api.hitbtc.com/api/2/ws', null, {
    handshakeTimeout: 12000
});

var ws3 = new WebSocket('wss://api.hitbtc.com/api/2/ws', null, {
    handshakeTimeout: 12000
});



var wsOrderListener = function (obj, callback) {
    ws3.send(JSON.stringify(obj));
    ws3.on('open', function () {
        console.log('Websocket opened');
    });

    ws3.on('error', function (err) {
        callback(err);
        console.error(err);
    });

    ws3.on('close', function () {
        console.log('Websocket closed');
    });

    ws3.on('message', function (data) {
        callback(null, data);
    });
}

var wsOrderManager = function (obj, callback) {
    ws2.send(JSON.stringify(obj));
    ws2.on('open', function () {
        console.log('Websocket opened');
    });

    ws2.on('error', function (err) {
        callback(err);
        console.error(err);
    });

    ws2.on('close', function () {
        console.log('Websocket closed');
    });

    ws2.on('message', function (data) {
        callback(null, data);
    });
}





var wsHitBTC = function (obj, callback) {
    ws.send(JSON.stringify(obj));
    ws.on('open', function () {
        console.log('Websocket opened');
    });

    ws.on('error', function (err) {
        callback(err);
        console.error(err);
    });

    ws.on('close', function () {
        console.log('Websocket closed');
    });

    ws.on('message', function (data) {
        callback(null, data);
        //eventEmitter.removeListener('message',this);
    });

    
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

HitBTCClient.prototype._activeOrders = function (callback) {

    var activeOrdersObj = {};
    activeOrdersObj.method = "subscribeReports";
    activeOrdersObj.params = {};
    return activeOrdersObj;
}

var a = new HitBTCClient('f6162add43cb90c6750b111feeed0010', 'de7bf2ff1889ab9edd9cfad906fda42b');

setTimeout(function () {
    //1 authenticate
    var authObj = a._authorize();
    //wsHitBTC(authObj, console.log);
    wsOrderListener(authObj, console.log);
    //wsOrderManager(authObj, console.log);
    wsOrderListener(authObj, function (err, data) {
        console.log("BAMBAM");
    })
    /*wsOrderListener(a._activeOrders(), function (err, data) {
        //console.error(data);
    })*/

}, 3000);