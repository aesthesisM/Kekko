/**
 * Created by khobsyzl28 on 11/26/2017.
 */

var HitBTC = require('../../api/hitbtc/hitbtc');
var client = new HitBTC('f39356b5f3bd407da77c042d55625dd7', '58f9d3ece954f73067485b11a5d5602a', 'live');

module.exports = {
    //api calls
    hitbtc_api_getAllPairs: function (callback) {
        return client.tickerAll(callback);
    },
    hitbtc_api_getPair: function (pair, callback) {
        return client.tickerPair(pair, callback);
    },
    hitbtc_api_getOrders: function (callback) {
        return client.activeOrders(callback);
    },
    hitbtc_api_addOrder: function (pair, side, price, quantity, type, timeInForce, expireTime, callback) {
        var obj = {
            "symbol": pair,
            "side": side,
            "quantity": quantity,
            "price": price,
            "type": type,
            "timeInForce": timeInForce
        };
        if (timeInForce === 'GTD') {
            obj['expireTime'] = expireTime;
        }
        return client.addOrder(obj, callback);
    },
    hitbtc_api_cancelOrder: function (clientOrderId, callback) {
        return client.cancelOrder(clientOrderId, callback);
    }
    //db calls

};


