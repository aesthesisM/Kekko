var https = require('https');
var crypto = require('crypto');
var queryString = require('querystring');
var async = require('async');
var WebSocket = require('ws');

ws = new WebSocket('wss://api.hitbtc.com/api/2/ws', null, {
    handshakeTimeout: 12000
});

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
    })
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

var a = new HitBTCClient('f6162add43cb90c6750b111feeed0010', '');

setTimeout(function () {
    //1 authenticate
    var authObj = a._authorize();
    wsHitBTC(authObj, console.log);
    //2 listening active orders
    var orderObj = a._activeOrders();
    //wsHitBTC(orderObj, console.log);

    ws.send(JSON.stringify(orderObj));


}, 3000);