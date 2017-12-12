var async = require('async');
var db = require('../dao/order/hitbtc');
var HitBTC = require('../api/hitbtc/hitbtc');
var api = new HitBTC('', '');

const WebSocket = require('ws');

var reconnectInterval = 1000 * 10; //10 seconds
ws = new WebSocket('wss://api.hitbtc.com/api/2/ws', null, {
    handshakeTimeout: 12000
});



var connect = function (obj, callback) {
    ws.send(JSON.stringify(obj));
    ws.on('open', function open() {
        console.log('connected');
        socketInitialized = true;
    });

    ws.on('error', function () {
        console.log('socket error');
        callback(err);
    });

    ws.on('close', function () {
        console.log('socket close');

    });

    ws.on('message', function incoming(data) {
        callback(null, data);
    });
};

var obj = {
    "method": "subscribeTicker",
    "params": {
        "symbol": "ETHUSD"
    },
    "id": 123

};


/*
connect(obj, console.log);
setTimeout(function () {
    if (socketInitialized) {
        ws.send(JSON.stringify(obj2));
    }
}, 3000);
*/
api.activeOrders(console.log);


var activeChains = null;
var activeOrders = null;
var socketInitialized = false;

function getChainOrdersFromDB() {
    activeChains = new Array();
    activeOrders = new Array();

    async.series(
        [
            function (callback) {
                //get all active chain orders which on hitbtc
                db.hitbtc_db_getChains(0, 1000, function (err, data) {
                    if (err) {
                        console.error(err);
                        callback(err);
                    } else {
                        activeChains = data;
                        callback();
                    }
                });
            },
            function (callback) {
                //for every chain listen the orders state and if its done , update the order and make the new order request. update that request with new clientOrderId
                //if all orders is done in chain than make it passive to not to run again
                for (var i = 0; i < activeChains.length; i++) {
                    db.hitbtc_db_getChainOrders(activeChains[i], function (data, err) {
                        if (err) {
                            callback(err);
                        } else {
                            activeOrders[i] = data;
                        }
                    });
                }
                callback();
            }
        ],
        function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log('db call ok');
            }
        }
    );
}

function startHitbtcStalk() {

    setInterval(
        function () {
            if (activeOrders.length > 0) {
                for (var i = 0; i < activeOrders.length; i++) {
                    if (activeOrders[i].length > 0) {
                        async.series(
                            [
                                function (callback) {
                                    if (socketInitialized) {
                                        var object = {};
                                        object.params.symbol = activeOrders[i][0].from + activeOrders[i][0].to;
                                        object.method = "subscribeTicker";
                                        object.id = "bambam";
                                        ws.send(object, function (err, data) {
                                            if (err) {
                                                console.error(err);
                                            } else {
                                                object.method = "unsubscribeTicker";

                                                ws.send(object, function (err, data) {

                                                });
                                            }
                                        });
                                    } else {
                                        connect(null, console.log);
                                    }
                                }
                            ],
                            function (err) {

                            })
                    }
                }
            }
        }, reconnectInterval);
}
