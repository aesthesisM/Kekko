/**
 * Created by khobsyzl28 on 11/26/2017.
 */

var HitBTC = require('../../api/hitbtc/hitbtc');
var api = new HitBTC('f39356b5f3bd407da77c042d55625dd7', '58f9d3ece954f73067485b11a5d5602a', 'live');
var db = require('../../config/database/mysql');

module.exports = {
    //api calls
    hitbtc_api_getAllPairs: function (callback) {
        return api.tickerAll(callback);
    },
    hitbtc_api_getPair: function (pair, callback) {
        return api.tickerPair(pair, callback);
    },
    hitbtc_api_getOrders: function (callback) {
        return api.activeOrders(callback);
    },
    hitbtc_api_addOrder: function (orderObj, callback) {
        var obj = {
            "symbol": orderObj.pair,
            "side": orderObj.side,
            "quantity": orderObj.quantity,
            "price": orderObj.price,
            "type": type,
            "timeInForce": orderObj.timeInForce
        };
        if (orderObj.timeInForce === 'GTD') {
            obj['expireTime'] = orderObj.expireTime;
        }
        return api.addOrder(obj, callback);
    },
    hitbtc_api_cancelOrder: function (clientOrderId, callback) {
        return api.cancelOrder(clientOrderId, callback);
    },
    //db calls
    hitbtc_db_addOrderChain: function (orderChainObj, callback) {
        db.executeSQL("INSERT INTO kekko.order_chain (order_chain_name,api_id_fk) VALUES (?,?)", [orderChainObj.order_chain_name, orderChainObj.api_id_fk], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_updateOrderChain: function (orderChainObj, callback) {
        db.executeSQL("UPDATE kekko.order_chain SET order_chain_name = ? WHERE id =? ", [orderChainObj.order_chain_name, orderChainObj.id], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_deleteOrderChain: function (orderChainObj, callback) {
        db.executeSQL("UPDATE  kekko.order_chain SET active = 0 WHERE id =? ", [orderChainObj.id], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_getAllOrderChainsByApi: function (api_id_fk, callback) {
        db.executeSQL("SELECT * FROM  kekko.order_chain WHERE active = 1 AND api_id_fk=?", [api_id_fk], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_addOrder: function (orderObj,order_chain_id_fk, callback) {
        db.executeSQL("INSERT INTO kekko.order (from,to,amount,price,total_price,next_order_id_fk,success,order_created_time,order_success_time,api_site_order_id,order_chain_id_fk) VALUES(?,?,?,?,?,?,?,?,?,?,?,?);",
            [orderObj.from, orderObj.to, orderObj.amount, orderObj.price, orderObj.total_price, orderObj.next_order_id, orderObj.success, orderObj.order_created_time, orderObj.order_success_time, orderObj.api_site_order_id, order_chain_id_fk],
            function (data, err) {
                if (err) {
                    console.error('err:' + err);
                    callback(err);
                } else {
                    callback(null, data);
                }
            });
    },
    hitbtc_db_updateOrder: function (orderObj, callback) {
        db.executeSQL("UPDATE kekko.order SET from=?,to=?,price=?,total_price=?,next_order_id_fk=?,success=?,order_success_time=?,api_site_order_id=?,active=? WHERE id = ?",
            [orderObj.from, orderObj.to, orderObj.price, orderObj.total_price, orderObj.next_order_id_fk, orderObj.success, orderObj.order_success_time, orderObj.api_site_order_id, orderObs.active, orderObj.id],
            function (data, err) {
                if (err) {
                    console.error('err:' + err);
                    callback(err);
                } else {
                    callback(null, data);
                }
            });
    },
    hitbtc_db_getOrdersByOrderChainId: function (order_chain_id_fk, callback) {
        db.executeSQL("SELECT * FROM kekko.order WHERE active=1 and order_chain_id_fk=? group by success", [order_chain_id_fk], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(err);
            } else {
                console.log(data);
                callback(null, data);
            }
        });
    }
};
exports.apiName = 'hitbtc';

