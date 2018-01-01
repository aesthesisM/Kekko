var Bittrex = require('./bittrex');
var async = require('async');
//hour

//MA
var MA_longTermPeriod = 200;
var MA_midTermPeriod = 90;
var MA_shortTermPeriod = 40;
var MA_quickTermPeriod = 9;

//CCI
var CCI_period = 14;
var CCI_Constant = 0.015;
//
var pairs = [];
var signals = [];
var runnerPairCount = 0;

var bittrexClient = new Bittrex();

function checkMA(data, pair) { //calculate depending on C which means close price
    if (data.length < MA_longTermPeriod) { //new added coins doesnt have enough data to check
        return;
    }
    var longTermAvarage = 0, midTermAvarage = 0, shortTermAvarage = 0, quickTermAvarage = 0, length = data.length - MA_longTermPeriod;
    var long_mid_difference = 0, mid_short_difference = 0, short_quick_difference = 0;
    var max = 0, min = 1;
    //first checking MA
    for (var i = 0; i < MA_longTermPeriod; i++) {
        if (MA_longTermPeriod - i < MA_quickTermPeriod) {
            quickTermAvarage += data[length + i].C;
        }
        if (MA_longTermPeriod - i < MA_shortTermPeriod) {
            shortTermAvarage += data[length + i].C;
        }
        if (MA_longTermPeriod - i < MA_midTermPeriod) {
            midTermAvarage += data[length + i].C;
        }

        longTermAvarage += data[length + i].C;

        if (data[length + i].H > max) {
            max = data[length + i].H;
        } else if (data[length + i].L < min) {
            min = data[length + i].L;
        }

    }

    longTermAvarage /= MA_longTermPeriod;
    midTermAvarage /= MA_midTermPeriod;
    shortTermAvarage /= MA_shortTermPeriod;
    quickTermAvarage /= MA_quickTermPeriod;

    long_mid_difference = ((longTermAvarage - midTermAvarage) / midTermAvarage) * 100;
    mid_short_difference = ((midTermAvarage - shortTermAvarage) / shortTermAvarage) * 100;
    short_quick_difference = ((shortTermAvarage - quickTermAvarage) / quickTermAvarage) * 100;

    if (longTermAvarage > midTermAvarage && midTermAvarage > shortTermAvarage && shortTermAvarage > quickTermAvarage) {
        if (long_mid_difference > 9 && mid_short_difference > 9 && short_quick_difference > 9) { //last part of dump
            var signalObj = {
                "pair": pair,
                "type": "LPOD (last part of dump)",
                "longTermAvarage": longTermAvarage,
                "midTermAvarage": midTermAvarage,
                "shortTermAvarage": shortTermAvarage,
                "quickTermAvarage": quickTermAvarage,
                "longTermMin": min,
                "longTermMax": max,
                "CCI": 0,
                "action": 0
            }
            signals[pair] = signalObj;
        } else if (long_mid_difference < 4, mid_short_difference < 4, short_quick_difference < 4) { //normal cycle of coin
            var signalObj = {
                "pair": pair,
                "type": "NCOP (normal cycle of price)",
                "longTermAvarage": longTermAvarage,
                "midTermAvarage": midTermAvarage,
                "shortTermAvarage": shortTermAvarage,
                "quickTermAvarage": quickTermAvarage,
                "longTermMin": min,
                "longTermMax": max,
                "CCI": 0,
                "action": 0
            }
            signals[pair] = signalObj;
        }
    }

}

function checkCCI(data, pair) {
    if (signals[pair] == undefined || signals[pair] == null) {
        return;
    }
    var mean = 0;
    var meanDeviation = 0;
    var CCIRate = 0;

    for (var i = 0; i < CCI_period; i++) {
        mean += data[data.length - CCI_period + i].C;
    }
    mean /= CCI_period;

    for (var i = 0; i < CCI_period; i++) {
        meanDeviation += Math.abs(mean - data[data.length - CCI_period + i].C)
    }
    meanDeviation /= CCI_period;

    CCIRate = (data[data.length - 1].C - mean) / (CCI_Constant * meanDeviation);

    signals[pair]["CCI"] = CCIRate;
    console.log(signals[pair]);
}


function runIndicators(data, pair) {
    if (data == undefined || data.length == 0) {
        console.log("socket null data");
        return;
    }
    checkMA(data, pair);
    checkCCI(data, pair);
}

//setInterval(function () {
if (pairs.length == 0) {
    bittrexClient._getPairs(
        function (data, err) {
            if (err) {
                console.error(err);
            } else if (Object.keys(data.result).length > 0) {
                for (var i = 0; i < data.result.length; i++) {

                    if ((data.result[i]["MarketName"]).startsWith("BTC-")) {
                        pairs.push(data.result[i]["MarketName"]);
                    }
                }
                bittrexClient._getHistoricalData({ marketName: pairs[runnerPairCount], tickInterval: "thirtyMin", _: new Date().getTime() }, recursive);
            }
        }
    );
} else {
    bittrexClient._getHistoricalData({ marketName: pairs[runnerPairCount], tickInterval: "thirtyMin", _: new Date().getTime() }, recursive);
}
// }, 1800000);//30 min
function recursive(data, err, pair) {
    if (err) {
        console.error(err);
        bittrexClient._getHistoricalData({ marketName: pair, tickInterval: "thirtyMin", _: new Date().getTime() }, recursive);
    } else {
        try {
            console.log("working pair " + pair);
            runIndicators(data.result, pair);
        } catch (err) {
            console.error(err);
        }
        if (runnerPairCount < pairs.length - 1) {
            runnerPairCount++;
            bittrexClient._getHistoricalData({ marketName: pairs[runnerPairCount], tickInterval: "thirtyMin", _: new Date().getTime() }, recursive);
        } else {
            console.log("finished for now ;)");
            runnerPairCount = 0;
        }
    }
}

//setInterval(checkSignals, 30000); //30 sec
//evaluate if the value has been surpassed one or more trend lines
function checkSignals() {
    if (signals.length > 0) {
        for (var i = 0; i < signals.length; i++) {

            bittrexClient._getPair({ market: signals[i].pair }, function (data, err) {
                if (err) {

                } else {

                }
            });

        }
    }
}
