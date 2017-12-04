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
    //api_id_fk = 1 hitbtc
    hitbtc_db_getChains: function (params, callback) {
        db.executeSQL("SELECT * FROM kekko.chain WHERE api_fk_id=1 and active=1 order by id desc limit ?,?", [params.take, params.skip], function (data, err) {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_addChain: function (chainObj, callback) {
        db.executeSQL("INSERT INTO kekko.chain(name,api_id_fk) VALUES (?,1)", [chainObj.order_chain_name], function (data, err) {
            if (err) {
                console.error('err:' + err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_updateChain: function (chainObj, callback) {
        db.executeSQL("UPDATE kekko.chain set active=?,status=?,name=? WHERE id=?", [chainObj.active, chainObj.status, chainObj.name, chainObj.id], function (data, err) {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_addOrder: function (orderObj, chainId, callback) {
        db.executeSQL("INSERT INTO kekko.order (from,to,amount,price,total_price,next_order_id_fk,order_created_time,chain_id_fk,active,stop_loss,stop_loss_price) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [orderObj.from, orderObj.to, orderObj.amount, orderObj.price, orderObj.total_price, orderObj.next_order_id_fk, orderObj.order_created_time, chain_id_fk, orderObj.active, orderObj.stop_loss, orderObj.stop_loss_price],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null, data);
                }
            });
    },
    hitbtc_db_updateOrder: function (orderObj, callback) {
        db.executeSQL("UPDATE kekko.order SET from=?,to=?,amount=?,price=?,total_price=?,next_order_id_fk=?,active=?,stop_loss=?,stop_loss_price=? where id = ?",
            [orderObj.from, orderObj.to, orderObj.amount, orderObj.price, orderObj.total_price, orderObj.next_order_id_fk, orderObj.active, orderObj.stop_loss, orderObj.stop_loss_price],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null, data);
                }
            });
    }

};
exports.apiName = 'hitbtc';

