var io = require('socket.io-client')('http://localhost:50000');
var async = require('async');
var Bittrex = require('../rest/bittrex/bittrex');
var bittrexClient = new Bittrex();
io.on('signal', function (data) {
    console.log(data);
    runSignalOrder(data);
});
var happenedOrders = [];
var signals = [];
var orders = [];
var wallet = 1;

const MAX_ORDER_COUNT = 10;
const SELL_HIGHER_PERCENT = 2;
const STOP_LOSS_PERCENT = 2;
var current_order_count = 0;


function runSignalOrder(data) {
    if (current_order_count < MAX_ORDER_COUNT) {
        placeOrder(data, "buy", new Date().getTime() + 30 * 60 * 1000); //time+30 min for buy timeout);
        current_order_count++;
    }
}

function placeOrder(data, side, timeOut) {
    var quantity = parseFloat((wallet / (MAX_ORDER_COUNT - orders.length)) / data.lastClosePrice);
    wallet = wallet - quantity * data.lastClosePrice;
    quantity = quantity - (quantity * 0.0025);
    var orderObj = {
        "side": side,//"sell"
        "price": data.lastClosePrice,
        "quantity": quantity,
        "pair": data.pair,
        "stopLossPrice": 0,
        "interval": "oneMin",
        "timeOut": timeOut
    };

    orders.push(orderObj);
    console.log("Current orders :\nOrderLength : " + orders.length + "\n" + JSON.stringify(orders) + "\nWallet : " + wallet);
}

function checkOrders() {
    for (var i = 0; i < orders.length; i++) {
        var order = orders[i];
        var orderStatus;
        if (order.timeOut > new Date().getTime()) {
            async.series(
                [
                    function (callback) {
                        bittrexClient._getLatestTick({ marketName: order.pair, tickInterval: order.interval }, function (data, err) {
                            if (err) {
                                callback(err);
                            } else {
                                orderStatus = data;
                                callback();
                            }
                        });
                    },
                    function (callback) {
                        if (order.side === "buy") {
                            if (orderStatus.result[0].L < order.price) {//buy happened....
                                //put place order
                                order.side = "sell";
                                order.price = order.price + order.price * SELL_HIGHER_PERCENT;
                                order.stopLossPrice = order.price - order.price * STOP_LOSS_PERCENT;
                                order.timeOut = new Date().getTime() + 8 * 30 * 60 * 1000;//sell timeout
                                orders[i] = order;
                            }
                        } else if (order.side === "sell") {
                            if (order.stopLossPrice > orderStatus.result[0].L) { //stoploss worked
                                wallet = wallet + order.price * order.quantity - order.price * order.quantity * 0.0025;
                                orders.splice(i, 1);
                                current_order_count--;
                                happenedOrders.push({ "order": order, "stopLoss": true, "wallet": wallet });
                            } else if (order.price < orderStatus.result[0].H) { //sell happened
                                wallet = wallet + order.price * order.quantity - order.price * order.quantity * 0.0025;
                                orders.splice(i, 1);
                                current_order_count--;
                                happenedOrders.push({ "order": order, "stopLoss": false, "wallet": wallet });
                            }
                        }
                        callback();
                    }
                ],
                function (err) {
                    if (err) {
                        console.error(err);
                    } else {

                    }
                }
            );
        } else { //timeout remove order
            orders.splice(i, 1);
            if (order.side === "buy") {
                wallet = wallet + order.price * order.quantity;
            } else {
                //hodl forever :D :D :D or sell it with current price
            }
        }

    }
    if (happenedOrders.length > 0)
        console.log(happenedOrders);
}

setInterval(function () { checkOrders() }, 1 * 60 * 1000);
