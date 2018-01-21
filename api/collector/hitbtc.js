var ws = require("ws");

var socketURL = "";

var pairs = [];
var signals = [];



function getCandles(pair, interval) {
    //period is One of: M1 (one minute), M3, M5, M15, M30, H1, H4, D1, D7, 1M (one month). Default is M30 (30 minutes).
    var obj = {
        "method": "subscribeCandles",
        "params": {
            "symbol": "ETHBTC",
            "period": "H1",
            "limit": "200"
        },
        "id": "Kekko BamBam"
    };
    this.ws.send(JSON.stringify(obj));
}

function getLatestCandle(pair, interval) {
    var obj = {
        "method": "subscribeCandles",
        "params": {
            "symbol": "ETHBTC",
            "period": "H1",
            "limit": "1"
        },
        "id": "Kekko BamBam"
    };
    this.ws.send(JSON.stringify(obj));
}

