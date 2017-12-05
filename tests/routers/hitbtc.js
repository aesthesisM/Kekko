var http = require('http');
var async = require('async');

var options = {
    host: 'localhost',
    path: '',
    port: 50000,
    method: '',
    headers: {
        'User-Agent': 'Mozilla/4.0 (compatible; HitBTC node.js client)',
        'Content-Type': 'application/json'
    }
};

function request(options_) {
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
}
module.exports = {
    testApiUrls: function () {

        async.series(
            [
                function (callback) {//get
                    console.log('/api get called');
                    options.path = '/api';
                    options.method = 'get';
                    request(options);
                },
                function (callback) { //update   
                    console.log('/api/update post called');
                    options.method = 'post';
                    options.path = '/api/update';
                    var apiObj = { id: 1, api_name: 'hitbtc', publicKey: 'public', secretKey: 'secret' };
                    options['body'] = apiObj;
                    request(options);
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



