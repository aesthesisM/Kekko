/**
 * Created by khobsyzl28 on 11/26/2017.
 */
// bittrex EMA analys formula will be here
//https://bittrex.com/api/v1.1/public/getmarkets  for gettin pairs (data.result[i].MarketName) 

var https = require('https');
var queryString = require('querystring');


function BittrexClient(bambam) {

}


BittrexClient.prototype._get = function (destination, params, callback) {
    var options = {
        host: "bittrex.com",
        path: destination,
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; Bittrex node.js client)',
            'Content-Type': 'application/json'
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
                return callback(null, err);
            }
            if (Object.keys(params).length > 0 && params.marketName != undefined) {
                callback(json, null, params.marketName);
            } else {
                callback(json);
            }

        });
    });

    req.on('error', function (err) {
        callback(null, err);
    });

    req.on('socket', function (socket) {
        socket.setTimeout(5000); //5 sec
        socket.on('timeout', function () {
            req.abort();
        });
    });

    req.end();


}

BittrexClient.prototype._getPairs = function (callback) {
    this._get("/api/v1.1/public/getmarkets", null, callback);
}

BittrexClient.prototype._getHistoricalData = function (params, callback) {
    this._get("/Api/v2.0/pub/market/GetTicks", params, callback);
}


module.exports = BittrexClient;