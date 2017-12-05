var https = require('https');
var queryString = require('querystring');

function HitBTCClient(APIKey, APISecret, APIType) {
    this.APIKey = APIKey;
    this.APISecret = APISecret;
    this.APIType = APIType || 'live';
    this.APIVersion = '2';
};

HitBTCClient.HOSTS = {
    live: 'api.hitbtc.com',
    sandbox: 'demo-api.hitbtc.com'
};
//(ticker, 'public',  {}, callback);
HitBTCClient.prototype._get = function (destination, params, account, callback) {
    var options = {
        host: HitBTCClient.HOSTS[this.APIType],
        path: '/api/' + this.APIVersion + '/' + destination,
        method: 'get',
        headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)',
            'Content-Type': 'application/json'            
          }
    };

    if (!account.includes('public')) {
        this._authorize(options);
    }
    else if (Object.keys(params).length) {
        options.path = options.path + '?' + queryString.stringify(params);
    }
    console.log(options);
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

                return callback(err);
            }
            callback(null, json);
        });
    });

    req.on('error', function (err) {
        callback(err);
    });

    req.on('socket', function (socket) {
        socket.setTimeout(5000);
        socket.on('timeout', function () {
            req.abort();
        });
    });

    req.end();
};

HitBTCClient.prototype._post = function (destination, params, callback) {
    var options = {
        host: HitBTCClient.HOSTS[this.APIType],
        path: '/api/' + this.APIVersion + '/' + destination,
        method: 'post',
        headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)',
            'Content-Type': 'application/json'
        }
    };
    this._authorize(options);
    console.log(options);
    if (Object.keys(params).length) {
        options.path = options.path + '?' + queryString.stringify(params);
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
                return callback(err);
            }
            callback(null, json);
        });
    });

    req.on('error', function (err) {
        callback(err);
    });

    req.on('socket', function (socket) {
        socket.setTimeout(5000);
        socket.on('timeout', function () {
            req.abort();
        });
    });

    req.end();
};

HitBTCClient.prototype._delete = function (destination, params, callback) {
    var options = {
        host: HitBTCClient.HOSTS[this.APIType],
        path: '/api/' + this.APIVersion + '/' + destination,
        method: 'delete',
        headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)',
            'Content-Type': 'application/json'
        }
    };

    this._authorize(options);
    console.log(options);
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
                return callback(err);
            }
            callback(null, json);
        });
    });

    req.on('error', function (err) {
        callback(err);
    });

    req.on('socket', function (socket) {
        socket.setTimeout(5000);
        socket.on('timeout', function () {
            req.abort();
        });
    });
    req.end();
};

HitBTCClient.prototype._authorize = function (options) {
    options.headers = {
        "Authorization": "Basic " + new Buffer(this.APIKey + ":" + this.APISecret, "utf8").toString("base64"),
        'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)',
        'Content-Type': 'application/json'
    };
};

/*
 * Public API Methods
 */
HitBTCClient.prototype.tickerPair = function (pair, callback) {
    this._get('public/ticker/' + pair, {}, 'public', callback);
};

HitBTCClient.prototype.tickerAll = function (callback) {
    this._get('public/ticker', {}, 'public', callback);
};

/*
 * Trading API Methods
 */

HitBTCClient.prototype.activeOrders = function (callback) {
    this._get('order', {}, 'private', callback);
};

HitBTCClient.prototype.activeOrderById = function (orderClientId, callback) {
    this._get('order/' + orderClientId, {}, 'private', callback);
};

HitBTCClient.prototype.addOrder = function (obj, callback) {
    this._post('order', obj, callback);
};

HitBTCClient.prototype.cancelOrder = function (clientOrderId, callback) {
    this._delete('order/' + clientOrderId, {}, callback);
};

HitBTCClient.prototype.cancelAllOrders = function (callback) {
    this._delete('order', {}, callback);
};


module.exports = HitBTCClient;
