var http = require('http');
var async = require('async');

function req(destination, method, obj, callback) {
    var options = {
        host: '127.0.0.1',
        path: destination,
        port: 50000,
        method: method,
        headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)',
            'Connection': ' keep-alive',
        }
    }
    if (obj != null && obj != undefined && Object.keys(obj).length > 0) {
        options['data'] = {
            'Content-Type': 'application/json',
            body: obj
        }
        options['json'] = true;
        options.headers['Content-Length'] = Buffer.byteLength(obj.toString());
        console.log(options);
    } else {
        options.headers['Content-Length'] = Buffer.byteLength("");
    }

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');

        var buffer = '';

        res.on('data', function (data) {
            buffer += data;
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
    req.end();
}
module.exports = {
    testApiUrls: function () {

        async.series(
            [
                function (callback) {//get
                    console.log('/api get called');
                    req('/api', 'get', null, callback);
                },
                function (callback) { //update   
                    console.log('/api/update post called');
                    var obj = { id: 1, name: 'hitbtc', publicKey: 'public', secretKey: 'secret' };
                    req('/api/update', 'post', obj, callback);
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


