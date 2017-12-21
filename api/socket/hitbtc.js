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
        "id": "Kekko BamBam"
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
        console.log('wsOrderListener Websocket connected');
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
wsOrderListener.prototype._placeOrder = function (clientOrderId, pair, price, amount, buysell) {
    var obj = {
        "method": "newOrder",
        "params": {
            "clientOrderId": clientOrderId,
            "symbol": pair,
            "side": buysell,
            "price": price,
            "quantity": amount
        },
        "id": "Kekko BamBam"
    };

    this.ws.send(JSON.stringify(obj));

}

wsOrderListener.prototype._close = function () {
    this.ws.close();
}

function HitBTCAuth(APIKey, APISecret) {

    var authObj = {};
    authObj.method = "login";
    authObj.params = {};
    authObj.params.algo = "HS256";
    authObj.params.pKey = APIKey;
    authObj.params.nonce = Date.now().toString();
    authObj.params.signature = crypto.createHmac('sha256', APISecret).update(authObj.params.nonce, "utf8").digest('hex');

    this.auth = authObj;

};


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
function tryParseInt(str) {
    var result = -1;
    if (str !== null) {
        if (str.length > 0 && str.length < 32) { // hitbtc generated clientOrderId example e9cae3fd9c8f4bbd9373d3e49dacafea, length = 32
            if (!isNaN(str)) {
                result = parseInt(str);
            }
        }
    }
    return result;
}

function orderManager(err, socketData) {
    socketData = JSON.parse(socketData);

    if (err) { //socket error
        console.error(err);
    } else if (_has(socketData, 'error')) {//socket api order error
        console.error(socketData.error.message + "," + socketData.error.description);
    } else if (_has(socketData, 'method') && socketData.method == 'activeOrders') {
        console.log("site awakening orders : " + JSON.stringify(socketData));
    } else if (_has(socketData, 'method') && socketData.method == 'report') {//check order status if the socketData is about orders

        if (socketData.params.status == 'filled') { //order has completed with success
            //then lets check if there is a waiting orther for this chain
            //clientOrderid is the id of our order so if its a integer and if it exist in db then its Kekko's order. if itsnot then keep it on siteOrder list.
            var orderId = null;
            var chainId = null;
            var nextOrder = null;
            var success = false;

            orderId = tryParseInt(socketData.params.clientOrderId);
            if (orderId > 0) { //Kekko order
                //first finish order in db.
                async.series(
                    [
                        function (callback) {
                            orderDao.hitbtc_db_updateOrder(orderId, 1, function (data, err) { //1 = success 0 = fail
                                if (err) {
                                    callback(err);
                                } else {
                                    callback();
                                }
                            });
                        },
                        //second get order and find which chain its in
                        function (callback) {
                            orderDao.hitbtc_db_getOrder(id, function (data, err) {
                                if (err) {
                                    callback(err);
                                } else {
                                    if (Object.keys(data).length > 0) {
                                        chainId = data.chain_id_fk;
                                        callback();
                                    } else {
                                        callback(null);
                                    }
                                }
                            });
                        },
                        function (callback) {
                            orderDao.hitbtc_db_getChainNextOrder(orderId, chainId, function (data, err) {
                                if (err) {
                                    callback(err);
                                } else {
                                    nextOrder = data;
                                    callback();
                                }
                            })
                        }
                    ],
                    function (err) {
                        if (err) {
                            success = false;
                            console.error(err);
                        } else {
                            success = true;
                        }
                    }
                );

                //check if order successfully placed
                if (success && nextOrder != null && Object.keys(nextOrder).length > 0) {
                    //orderListener._placeOrder(nextOrder.id, nextOrder.pair, nextOrder.price, nextOrder.amount, nextOrder.buysell);
                    console.log("next Order :" + JSON.stringify(nextOrder) + " has been successfully placed");
                } else {
                    console.error("next Order :" + JSON.stringify(nextOrder) + " has not placed. Error occured");
                }
            } else {// site order filled
                //forget about it right now...
                console.log("site order has been filled successfully" + JSON.stringify(socketData));
            }
        } else if (socketData.params.status == 'canceled' || socketData.params.status == 'expired') { // if any order is expired or cancelled then stop the whole chain
            console.log('cancelled order :' + JSON.stringify(socketData));
        } else if (socketData.params.status == 'new') { // no need to listen this event. just in case 
            console.log('newOrder :' + JSON.stringify(socketData));
        }
    } else if (_has(socketData, 'result')) {//result attribute used to check if new order has been successfully defined

    }
}

setTimeout(function () {

    hitBTCClient = new HitBTCAuth('ca50230befd43870f2510003414e4e67', '');
    //1 authenticate
    orderListener._authorize(hitBTCClient.auth);
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