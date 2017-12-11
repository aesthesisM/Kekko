/**
 * Created by khobsyzl28 on 11/26/2017.
 */
var db = require('../../config/database/mysql');

module.exports = {

    //db calls
    //api_id_fk = 1 hitbtc
    hitbtc_db_getChains: function (params, callback) {
        db.executeSQL("SELECT * FROM kekko.chain WHERE api_id_fk=1 and active=1 order by id desc limit ?,? ", [params.take, params.skip], function (data, err) {
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
        db.executeSQL("UPDATE kekko.chain set active=?,status=?,name=? WHERE id=?", [parseInt(chainObj.active), parseInt(chainObj.status), chainObj.name, parseInt(chainObj.id)], function (data, err) {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_getChainOrders: function (chainId, callback) {
        db.executeSQL("SELECT * FROM kekko.order WHERE active=1 and chain_id_fk=? order by order_ asc", [parseInt(chainId)], function (data, err) {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_getChainWaitingOrders: function (chainId, callback) {
        db.executeSQL("SELECT * FROM kekko.order WHERE active=1 and success=0 and chain_id_fk = ? order by order_ asc", [parseInt(chainId)], function (data, err) {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    hitbtc_db_addOrder: function (orderObj, chainId, callback) {
        db.executeSQL("INSERT INTO kekko.order (from,to,amount,price,total_price,order_,order_created_time,chain_id_fk,active,stop_loss,stop_loss_price) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [orderObj.from, orderObj.to, parseFloat(orderObj.amount), parseFloat(orderObj.price), parseFloat(orderObj.total_price), parseInt(orderObj.order_), new Date(orderObj.order_created_time), parseInt(chain_id_fk), parseInt(orderObj.active), parseInt(orderObj.stop_loss), parseFloat(orderObj.stop_loss_price)],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null, data);
                }
            });
    },
    hitbtc_db_updateOrder: function (orderObj, chainId, callback) {
        db.executeSQL("UPDATE kekko.order SET from=?,to=?,amount=?,price=?,total_price=?,order_=?,active=?,stop_loss=?,stop_loss_price=? where id = ? and chain_id_fk = ?",
            [orderObj.from, orderObj.to, parseFloat(orderObj.amount), parseFloat(orderObj.price), parseFloat(orderObj.total_price), parseInt(orderObj.order_), parseInt(orderObj.active), parseInt(orderObj.stop_loss), parseFloat(orderObj.stop_loss_price), parseInt(orderObj.id), parseInt(chainId)],
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

