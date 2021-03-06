/**
 * Created by khobsyzl28 on 11/26/2017.
 */
var db = require('../../config/database/mysql');

module.exports = {

    //db calls
    //api_id_fk = 1 hitbtc
    hitbtc_db_getChains: function (params, callback) {
        db.executeSQL("SELECT * FROM kekko.chain WHERE api_id_fk=1 and active=1 order by id desc limit ?,? ", [params.start, params.take], function (data, err) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    },
    hitbtc_db_addChain: function (chainObj, callback) {
        db.executeSQL("INSERT INTO kekko.chain(name,api_id_fk) VALUES (?,1)", [chainObj.name], function (data, err) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    },

    //active = deleted
    //status = 0 waiting, 1 running , 2 success

    hitbtc_db_updateChain: function (chainObj, callback) {
        db.executeSQL("UPDATE kekko.chain set active=?,status=?,name=? WHERE id=?", [parseInt(chainObj.active), parseInt(chainObj.status), chainObj.name, parseInt(chainObj.id)], function (data, err) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    },
    hitbtc_db_getChainOrders: function (chainId, callback) {
        db.executeSQL("SELECT * FROM kekko.order WHERE active=1 and chain_id_fk=? order by order_ asc", [parseInt(chainId)], function (data, err) {
            if (err) {
                console.error(err);
                callback(null, err);
            } else {
                callback(data);
            }
        });
    },
    hitbtc_db_getChainNextOrder: function (chainId, callback) {
        db.executeSQL("SELECT * FROM kekko.order WHERE  active=1 and success=0  and chain_id_fk = ? order by order_ asc limit 1 ",
            [parseInt(chainId)],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(null, err);
                } else {
                    callback(data);
                }
            })
    },
    hitbtc_db_addOrder: function (orderObj, chain_id_fk, callback) {
        db.executeSQL("INSERT INTO kekko.order (pair,buysell,amount,price,total_price,order_,order_created_time,chain_id_fk,active,stop_loss,stop_loss_price) VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?,?)",
            [orderObj.pair, orderObj.buysell, parseFloat(orderObj.amount), parseFloat(orderObj.price), parseFloat(orderObj.amount) * parseFloat(orderObj.price), parseInt(orderObj.order_), parseInt(chain_id_fk), 1, 0, 0],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(null, err);
                } else {
                    callback(data);
                }
            });



    },
    hitbtc_db_getOrder: function (orderId, callback) {
        db.executeSQL("SELECT * FROM kekko.order WHERE id = ?",
            [orderId],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(null, err);
                } else {
                    callback(data);
                }
            })
    },
    hitbtc_db_updateOrder: function (orderObj, chainId, callback) {
        db.executeSQL("UPDATE kekko.order SET pair=?,buysell=?,amount=?,price=?,total_price=?,order_=?,active=?,stop_loss=?,stop_loss_price=? where id = ? and chain_id_fk = ?",
            [orderObj.pair, orderObj.buysell, parseFloat(orderObj.amount), parseFloat(orderObj.price), parseFloat(orderObj.total_price), parseInt(orderObj.order_), parseInt(orderObj.active), parseInt(orderObj.stop_loss), parseFloat(orderObj.stop_loss_price), parseInt(orderObj.id), parseInt(chainId)],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(null, err);
                } else {
                    callback(data);
                }
            });
    },
    hitbtc_db_cancelOrder: function (id, callback) {
        db.executeSQL("UPDATE kekko.order SET active=0 WHERE id =?", [id],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(null, err);
                } else {
                    calback(data);
                }
            });
    },
    hitbtc_db_completeOrder: function (orderId, result, callback) {
        var order_success_time = null;
        if (result > 0) {
            order_success_time = new Date().getTime();
        }

        db.executeSQL("UPDATE kekko.order SET success= ?,order_success_time=? where id = ?",
            [parseInt(result), order_success_time, parseInt(orderId)],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(null, err);
                } else {
                    callback(data);
                }
            })
    },
    hitbtc_db_chain_start_stop: function (chainId, startStop, callback) {
        //status 0 = stopped, 1 = waiting, 2 = running, 3 completed
        db.executeSQL("UPDATE kekko.chain SET status = ? WHERE id = ?", [startStop, chainId],
            function (data, err) {
                if (err) {
                    console.error(err);
                    callback(null, err);
                } else {
                    callback(data);
                }
            });
    }

}

exports.apiName = 'hitbtc';

