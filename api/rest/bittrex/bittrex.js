/**
 * Created by khobsyzl28 on 11/26/2017.
 */

var https = require('https');
var queryString = require('querystring');

function BittrexClient() {

}

BittrexClient.prototype._get = function (destination, params, callback) {
    var options = {
        host: "bittrex.com",
        path: destination,
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; Bittrex node.js client)',
            'Content-Type': 'application/json',
            "Connection": "close",
            "Proof": "close"
        }
    }

    if (params != null && Object.keys(params).length > 0) {
        options.path += "?" + queryString.stringify(params);
    }


    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        var buffer = '';
        res.on('data', function (data) {
            buffer += data;
        });
        res.on('end', function () {
            try {
                var json = JSON.parse(buffer);
            } catch (err) {
                if (params != null && params.marketName != undefined && params.tickInterval != undefined && params.index != undefined) {
                    return callback(null, err, params.marketName, params.tickInterval, params.index);
                } else {
                    return callback(null, err);
                }
            }
            if (params != null && params.marketName != undefined && params.tickInterval != undefined && params.index != undefined) {
                callback(json, null, params.marketName, params.tickInterval, params.index);
            } else {
                callback(json);
            }

        });
    });

    req.on('error', function (err) {
        if (params != null && params.marketName != undefined && params.tickInterval != undefined && params.index != undefined) {
            return callback(null, err, params.marketName, params.tickInterval, params.index);
        } else {
            return callback(null, err);
        }
    });

    req.on('socket', function (socket) {
        //socket.setTimeout(7500); //7.5 sec
        socket.on('timeout', function () {
            req.abort();
        });
    });

    req.end();


}

BittrexClient.prototype._getPairs = function (callback) {
    this._get("/api/v1.1/public/getmarkets", null, callback);
}

BittrexClient.prototype._getPair = function (params, callback) {
    this._get("/api/v1.1/public/getticker", params, callback);
}

BittrexClient.prototype._getHistoricalData = function (params, callback) {
    this._get("/Api/v2.0/pub/market/GetTicks", params, callback);
}

BittrexClient.prototype._getLatestTick = function (params, callback) {
    this._get("/Api/v2.0/pub/market/GetLatestTick", params, callback);
}


module.exports = BittrexClient;