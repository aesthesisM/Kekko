var https = require('https');
var crypto = require('crypto');
var queryString = require('querystring');
var async = require('async');
var WebSocket = require('ws');
var orderDao = require('../../dao/order/hitbtc');

var hitBTCClient;
var hitBTCSocketUrl = "wss://api.hitbtc.com/api/2/ws";
var orderListener = new wsOrderListener(orderManager);
var dumpListener = new wsDumpListener(dumpManager);
var walletListener = new wsWalletListener(walletManager);
var chainOrderSignature = "Kekko.chain#";
var dumpOrderSignature = "Kekko.dump#";

//Socket dump Listener
function wsDumpListener(callback) {
    var ws = null;
    ws = new WebSocket(hitBTCSocketUrl, null, {
        handshakeTimeout: 5500
    });

    ws.on('open', function () {
        console.log('wsDumpListener Websocket opened');
    });
    ws.on('close', function () {
        console.log('wsDumpListener Websocket closed');
    });

    ws.on('error', function (err) {
        callback(err);
        console.error("wsDumpListener error :" + err);
    });

    ws.on('message', function (data) {
        callback(null, data);
    });

    this.ws = ws;

}

wsDumpListener.prototype._listen = function (pair, listening) {

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

wsDumpListener.prototype._close = function () {
    this.ws.close();
}

wsDumpListener.prototype._authorize = function (data) {
    this.ws.send(JSON.stringify(data));
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
wsOrderListener.prototype._placeOrder = function (orderId, pair, price, amount, buysell, orderSignature) {
    var obj = {
        "method": "newOrder",
        "params": {
            "clientOrderId": orderSignature + orderId + "$" + (new Date().getTime()),
            "symbol": pair,
            "side": buysell,
            "price": price,
            "quantity": amount
        },
        "id": "Kekko BamBam"
    };

    this.ws.send(JSON.stringify(obj));

}

wsOrderListener.prototype._cancelOrder = function (orderSignature, orderId) {
    var obj = {
        "method": "cancelOrder",
        "params": {
            "clientOrderId": orderSignature + orderId
        },
        "id": 123
    }

    this.ws.send(JSON.stringify(obj));
}

wsOrderListener.prototype._close = function () {
    this.ws.close();
}

//Socket Wallet Listener
function wsWalletListener(callback) {
    var ws = new WebSocket(hitBTCSocketUrl, null, {
        handshakeTimeout: 5500
    });

    ws.on('open', function () {
        console.log('wsWalletListener Websocket connected');
    });

    ws.on('close', function () {
        console.log('wsWalletListener Websocket closed');
    });

    ws.on('error', function (err) {
        callback(err);
        console.error('wsWalletListener error:' + err);
    });

    ws.on('message', function (data) {
        callback(null, data);
    });

    this.ws = ws;
}

wsWalletListener.prototype._authorize = function (data) {
    this.ws.send(JSON.stringify(data));
}

wsWalletListener.prototype._listen = function () {
    var obj = {
        "method": "getTradingBalance",
        "params": {},
        "id": "Kekko BamBam"
    };
    this.ws.send(JSON.stringify(obj));
}

wsWalletListener.prototype._close = function () {
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

function _has(object, key) {
    return object ? hasOwnProperty.call(object, key) : false;
}
function tryParseInt(str) {
    var result = -1;
    if (str !== null) {
        if (str.length > 0) {
            if (!isNaN(str)) {
                result = parseInt(str);
            }
        }
    }
    return result;
}

var dumpPairs = {
    /*
    "ETHUSD":{
        buyHappened: false,
        sellHappened:false,
        ordered:false
    }*/
}
//status 0 = canceled , 1 = waiting, 2 running, 3 completed
function dumpManager(err, socketData) {
    console.log(socketData);
    var rightNow = new Date().getTime();
    var lastTime = null;
    if (err) {
        console.error(err);
    } else {

        if (_has(socketData, 'method') && socketData.method == 'ticker') { //which means pair data is streaming
            if (_has(dumpPairs, socketData.params.symbol)) {
                if (dumpPairs[socketData.params.symbol].buyHappened == true && dumpPairs[socketData.params.symbol].sellHappened == false) {
                    //which is a buy order happened and this dump has been catched
                    //now place a new order depending on this. last price  but first check percentages

                } else if (dumpPairs[socketData.params.symbol].ordered == true && dumpPairs[socketData.params.symbol].buyHappened == false) {
                    //check current price. if its below given percents then cancel order 
                    if (lastTime == null || rightNow + 10000 > lastTime) { // check prices every 10 second
                        lastTime = rightNow + 10000; /*  *///update lasttime



                    }
                } else if (dumpPairs[socketData.params.symbol].ordered == false) {//check current price and put order with given percentages

                }
            }
        }


        console.log(JSON.stringify(socketData));


    }
}

var currentWallet = null;

module.exports.getWalletInfo = function () {
    return currentWallet;
}

function walletManager(err, socketData) {
    if (err) {
        console.error(err);
    } else {
        console.log(socketData);
        if (_has(socketData, 'result')) {
            /*
wallet data response
{
"jsonrpc": "2.0",
"result": [
{
"currency": "BCN",
"available": "100.000000000",
"reserved": "0"
},
{
"currency": "BTC",
"available": "0.013634021",
"reserved": "0"
}
],
"id": 123
}
*/
            currentWallet = socketData.result;
        }
    }
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
            //clientOrderid is the id of our order so if its a integer and if it exist in db then its Kekko's order.
            var orderId = null;
            var chainId = null;
            var nextOrder = null;
            var success = false;
            if (socketData.params.clientOrderId.indexOf(chainOrderSignature) > 0) { //kekko chain order listener
                orderId = tryParseInt(socketData.params.clientOrderId.substring(socketData.params.clientOrderId.indexOf("#") + 1, socketData.params.clientOrderId.indexOf("$")));
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
                            orderDao.hitbtc_db_getChainNextOrder(chainId, function (data, err) {
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
                    //orderListener._placeOrder(nextOrder.id, nextOrder.pair, nextOrder.price, nextOrder.amount, nextOrder.buysell,chainOrderSignature);
                    console.log("next Order :" + JSON.stringify(nextOrder) + " has been successfully placed");
                } else {
                    console.error("next Order :" + JSON.stringify(nextOrder) + " has not placed. Error occured");
                }
            } else if (socketData.params.clientOrderId.indexOf(dumpOrderSignature) > 0) { //dump_listener works here for completed orders
                //pump_dump order has been completed with success lets update it and give another order by giving conditions
                orderId = tryParseInt(socketData.params.clientOrderId.substring(socketData.params.clientOrderId.indexOf("#") + 1, socketData.params.clientOrderId.indexOf("$")));

                dumpPairs[socketData.params.symbol].ordered = false;
                dumpPairs[socketData.params.symbol].buyHappened = false;
                dumpPairs[socketData.params.symbol].sellHappened = false;

                if (socketData.params.side == 'buy') {
                    dumpPairs[socketData.params.symbol].buyHappened = true;
                    dumpPairs[socketData.params.symbol].sellHappened = false;
                } else if (socketData.params.side == 'sell') {
                    dumpPairs[socketData.params.symbol].buyHappened = false;
                    dumpPairs[socketData.params.symbol].sellHappened = true;
                }

                var completedOrder = null;
                async.series(
                    [
                        function (callback) {
                            orderDao.hitbtc_db_getOrder(orderId, function (data, err) {
                                if (err) {
                                    completedOrder = null;
                                } else {
                                    completedOrder = data;
                                }
                            });
                        },
                        function (callback) {
                            orderDao.hitbtc_db_completeOrder(orderId, 1, function (data, err) {
                                if (errr) {
                                    callback(err);
                                } else {
                                    completedOrder = data;
                                    callback();
                                }
                            });
                        },
                        function (callback) {

                        }
                    ],
                    function (err) {
                        if (err) {

                        } else {
                            if (completedOrder != null) {
                                if (compltederOrder.buysell == 'buy') {
                                    // buy completed
                                    //put a sell order

                                } else if (completedOrder.buysell == 'sell') {
                                    //sell completed
                                    //put a buy order
                                }
                            }
                        }
                    });

            }

        } else if (socketData.params.status == 'canceled' || socketData.params.status == 'expired') { // if any order is expired or cancelled then stop the whole chain if its a chain order
            if (socketData.params.clientOrderId.indexOf(chainOrderSignature) > 0) {//found chain order id and will stop chain and update canceled order

            } else if (socketData.params.clientOrderId.indexOf(dumpOrderSignature) > 0) {

            }
            console.log('cancelled order :' + JSON.stringify(socketData));
        } else if (socketData.params.status == 'new') { // no need to listen this event. just in case 
            console.log('newOrder :' + JSON.stringify(socketData));
        }
    } else if (_has(socketData, 'result')) {//result attribute used to check if new order has been successfully defined

    }
}

setTimeout(function () {
    //
    hitBTCClient = new HitBTCAuth('', '');
    //1 authenticate
    orderListener._authorize(hitBTCClient.auth);
    //walletListener._authorize(hitBTCClient.auth);
    //dumpListener._authorize(hitBTCClient.auth);
    //dumpListener._listen("EOSUSD", true);
    //dumpListener._listen("XRPUSDT", true);
    orderListener._listen();
    //walletListener._listen();
    setTimeout(function () {
        //dumpListener._listen("EOSUSD", false);
        //dumpListener._listen("XRPUSDT", false);
        //dumpListener._close();
        //orderListener._close();
    }, 5000);
}, 6000);