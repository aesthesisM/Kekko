var async = require('async');
var db = require('../dao/order/hitbtc');
var HitBTC = require('../api/hitbtc/hitbtc');
var api = new HitBTC('', '');
const WebSocket = require('ws');

var reconnectInterval = 1000 * 5; //5seconds
var ws;

var connect = function (obj, callback) {

    var obj = {
        "method": "getCurrency",
        "params": {
            "symbol": "ETHUSD"
        },
        "id": 123

    };
    ws = new WebSocket('wss://api.hitbtc.com/api/2/ws');
    ws.on('open', function open() {
        console.log('connected');

        ws.send(JSON.stringify(obj));

    });

    ws.on('error', function () {
        console.log('socket error');
        callback(err);
    });

    ws.on('close', function () {
        console.log('socket close');
        /* if (kill != true)
             setTimeout(connect, reconnectInterval);
             */
    });

    ws.on('message', function incoming(data) {
        callback(null, data);
        ws.close();
    });
};

connect(null, console.log);


module.exports = {
    run: function () {
        var activeChains = null;

        async.series(
            [
                function () {
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
                function () {
                    //for every chain listen the orders state and if its done , update the order and make the new order request. update that request with new clientOrderId
                    //if all orders is done in chain than make it passive to not to run again
                    for (var i = 0; i < activeChains.length; i++) {
                        var activeOrders = null;
                        async.series(
                            [
                                function () {
                                    activeOrders = db.hitbtc_db_getChainOrders(activeChains[i], function (data, err) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            activeOrders = data;
                                            callback();
                                        }
                                    });
                                }
                            ],
                            function (err) {
                                if (err) {
                                    console.error(err);
                                }
                            }
                        );

                        //active orders
                        //for any of it
                        //listen all of their values
                        for (var j = 0; j < activeOrders.length; j++) {


                        }

                    }

                }
            ],
            function (err) {

            }
        );

    }
}
