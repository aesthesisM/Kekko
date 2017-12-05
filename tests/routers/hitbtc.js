var http = require('http');
var async = require('async');

function req(destination, method, obj, callback) {
    var options = {
        host: 'localhost',
        path: destination,
        port: 50000,
        method: method,
        headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)',
            'Content-Type': 'application/json'
        }
    }
    if (obj != null && obj != undefined && Object.keys(obj).length > 0) {
        options['body'] = obj;
    }

    var req = http.request(options, function (res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
        res.setHeader('Access-Control-Allow-Credentials', true); // If needed
        res.setEncoding('utf8');

        var buffer = '';

        res.on('data', function (data) {
            buffer += data;
            console.log(buffer);
        });
        res.on('end', function () {
            try {
                var json = JSON.parse(buffer);
                console.log(json);
            } catch (err) {

                return callback(err);
            }
            callback();
        });
    });
}
module.exports = {
    testApiUrls: function () {

        async.parallel(
            [
                function (callback) {//get
                    console.log('/api get called');
                    req('/api', 'get', null, callback);
                },
                function (callback) { //update   
                    console.log('/api/update post called');
                    var obj = { id: 1, api_name: 'hitbtc', publicKey: 'public', secretKey: 'secret' };
                    req('api/update', 'post', obj, callback);
                }
            ]
            , function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Api urls works perfectly');
                }
            })
    }
}

module.exports.testApiUrls();


