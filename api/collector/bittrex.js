var Bittrex = require('../rest/bittrex/bittrex');
var async = require('async');
require('dotenv').config();
var conf = process.env;

const { WebClient } = require('@slack/client');
const bot_token = 'token-slack-kanalında';
const web = new WebClient(conf.BITTREX_BOT_TOKEN);
const channelId = 'C8BNHBG1W';
//MA
var MA_longTermPeriod = 200;
var MA_midTermPeriod = 90;
var MA_shortTermPeriod = 40;
var MA_quickTermPeriod = 9;

//CCI
var CCI_period = 14;
var CCI_Constant = 0.015;

var pairs = [];
var signals = [];

//these datas will be held in memory
//30min and 1 day essentials for our signal search

var pairDataQueDay = [];
var pairDataQueThirtyMin = [];

//signals for ui
//will be united
var signalsDay = [];
var signalThirtyMin = [];
//collector
var bittrexClient = null;

function checkMA(data, pair, interval) { //calculate depending on C which means close price
    if (data.length < MA_longTermPeriod) { //new added coins doesnt have enough data to check
        return;
    }
    var longTermAvarage = 0, midTermAvarage = 0, shortTermAvarage = 0, quickTermAvarage = 0, length = data.length - MA_longTermPeriod;
    var long_mid_difference = 0, mid_short_difference = 0, short_quick_difference = 0;
    var max = 0, min = 1;
    //first checking MA
    for (var i = 0; i < MA_longTermPeriod; i++) {
        if (MA_longTermPeriod - i <= MA_quickTermPeriod) {
            quickTermAvarage += data[length + i].C;

        }
        if (MA_longTermPeriod - i <= MA_shortTermPeriod) {
            shortTermAvarage += data[length + i].C;

        }
        if (MA_longTermPeriod - i <= MA_midTermPeriod) {
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

    if ((longTermAvarage > midTermAvarage) && (midTermAvarage > shortTermAvarage) && (shortTermAvarage > quickTermAvarage)) {
        if ((long_mid_difference > 9) && (mid_short_difference > 9) && (short_quick_difference > 9)) { //last part of dump
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
                "action": 0,
                "lastTime": new Date(new Date(data[data.length - 1].T).getTime() + 180 * 60000).toLocaleString("tr"),
                "lastClosePrice": data[data.length - 1].C,
                "interval": interval
            }
            signals[pair] = signalObj;
        } else if ((long_mid_difference < 4) && (mid_short_difference < 4) && (short_quick_difference < 4)) { //normal cycle of coin
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
                "action": 0,
                "lastTime": new Date(new Date(data[data.length - 1].T).getTime() + 180 * 60000).toLocaleString("tr"),
                "lastClosePrice": data[data.length - 1].C,
                "interval": interval
            }
            web.chat.postMessage(channelId, signalObj)
                .then((res) => {
                    // `res` contains information about the posted message
                    console.log('Message sent: ', res.ts);
                })
                .catch(console.error);
            signals[pair] = signalObj;
        }
    }

}

function checkCCI(data, pair, interval) {
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
        meanDeviation += Math.abs(mean - data[data.length - CCI_period + i].C);
    }
    meanDeviation /= CCI_period;

    CCIRate = (data[data.length - 1].C - mean) / (CCI_Constant * meanDeviation);

    signals[pair]["CCI"] = CCIRate;
    console.log(signals[pair]);
    if (signalCallback != null) {
        signalCallback(signals[pair]);
        if (interval === "thirtyMin") {
            signalsThirtyMin[pair] = signals[pair];
        } else if (interval === "day") {
            signalsDay[pair] = signals[pair];
        }
        signals[pair] = null;
    }
}

function runIndicators(data, pair, interval) {
    if (data == null && data == undefined || data.length == 0) {
        console.log("socket null data");
        return;
    }
    checkMA(data, pair, interval);
    checkCCI(data, pair, interval);
}

function runner(interval) {
    console.log("bittrex collector started for " + interval + " interval at" + new Date().toLocaleString("tr"));
    if (interval === "thirtyMin") {
        if (pairDataQueThirtyMin.length == 0 || pairDataQueThirtyMin[pairs[0]] == undefined || pairDataQueThirtyMin[pairs[0]] == null || pairDataQueThirtyMin[pairs[0]].length == 0) {
            bittrexClient._getHistoricalData({ marketName: pairs[0], tickInterval: interval, _: new Date().getTime(), index: 0 }, recursive);
        } else {
            bittrexClient._getLatestTick({ marketName: pairs[0], tickInterval: interval, _: new Date().getTime(), index: 0 }, recursive);
        }
    } else if (interval === "day") {
        if (pairDataQueDay.length == 0 || pairDataQueDay[pairs[0]] == undefined || pairDataQueDay[pairs[0]] == null || pairDataQueDay[pairs[0]].length == 0) {
            bittrexClient._getHistoricalData({ marketName: pairs[0], tickInterval: interval, _: new Date().getTime(), index: 0 }, recursive);
        } else {
            bittrexClient._getLatestTick({ marketName: pairs[0], tickInterval: interval, _: new Date().getTime(), index: 0 }, recursive);
        }
    }
}

// }, 1800000);//30 min
function recursive(data, err, pair, interval, index) {
    try {
        if (err) {
            console.error(err);
            //if there is an error then remove all data about this index. otherwise we will work with corrupted data.
            if (interval === "thirtyMin") {
                pairDataQueThirtyMin[pair[index]] = null;
            } else if (interval === "day") {
                pairDataQueDay[pair[index]] = null;
            }
        } else if (data != null && data.result != null && data.result != undefined && data.result.length > 0) {
            console.log("pair:" + pair + " | interval:" + interval + " | index:" + index + " | data.length:" + data.result.length);
            if (interval === "thirtyMin") {
                if (data.result.length > 200) { //historical
                    pairDataQueThirtyMin[pairs[index]] = data.result.splice(data.result.length - 200, data.result.length);
                } else if (data.result.length == 1 && pairDataQueThirtyMin[pairs[index]] != null && pairDataQueThirtyMin[pairs[index]] != undefined) {
                    pairDataQueThirtyMin[pairs[index]].shift();
                    pairDataQueThirtyMin[pairs[index]].push(data.result);
                } else {
                    //doesnt care
                }
                runIndicators(pairDataQueThirtyMin[pairs[index]], pair, interval);
            } else if (interval === "day") {
                if (data.result.length > 200) { //historica
                    pairDataQueDay[pairs[index]] = data.result.splice(data.result.length - 200, data.result.length);
                } else if (data.result.length == 1 && pairDataQueDay[pairs[index]] != null && pairDataQueDay[pairs[index]] != undefined) {

                    pairDataQueDay[pairs[index]].shift();
                    pairDataQueDay[pairs[index]].push(data.result);
                } else {
                    //doesnt care
                }
                runIndicators(pairDataQueDay[pairs[index]], pair, interval);
            }
        }
    } catch (err) {
        console.error(err);
    }

    if (index < pairs.length - 1) {
        index++;
        if (interval === "thirtyMin") {
            if (pairDataQueThirtyMin[pairs[index]] == undefined || pairDataQueThirtyMin[pairs[index]] == null || pairDataQueThirtyMin[pairs[index]].length == 0) {
                bittrexClient._getHistoricalData({ marketName: pairs[index], tickInterval: interval, _: new Date().getTime(), index: index }, recursive);
            } else {
                bittrexClient._getLatestTick({ marketName: pairs[index], tickInterval: interval, _: new Date().getTime(), index: index }, recursive);
            }
        } else if (interval === "day") {
            if (pairDataQueThirtyMin[pairs[index]] == undefined || pairDataQueThirtyMin[pairs[index]] == null || pairDataQueThirtyMin[pairs[index]].length == 0) {
                bittrexClient._getHistoricalData({ marketName: pairs[index], tickInterval: interval, _: new Date().getTime(), index: index }, recursive);
            } else {
                bittrexClient._getLatestTick({ marketName: pairs[index], tickInterval: interval, _: new Date().getTime(), index: index }, recursive);
            }
        }

    } else {
        console.log("finished for now ;) at " + new Date().toLocaleString() + " | interval: " + interval);
    }

}

var intervalHandlerThirtyMin, intervalHandlerDay;
var signalCallback = null;
module.exports = {
    startRunner: function (signal) {
        signalCallback = signal;
        bittrexClient = new Bittrex();

        async.series(
            [
                function (callback) {
                    if (pairs.length == 0) {
                        bittrexClient._getPairs(
                            function (data, err) {
                                if (err) {
                                    console.error(err);
                                } else if (Object.keys(data.result).length > 0) {
                                    console.log("pairs");
                                    for (var i = 0; i < data.result.length; i++) {
                                        if ((data.result[i]["MarketName"]).startsWith("BTC-")) {
                                            pairs.push(data.result[i]["MarketName"]);
                                        }
                                    }
                                    callback();
                                }
                            }
                        );

                    }
                },
                function (callback) {
                    runner("thirtyMin");
                    runner("day");
                    intervalHandlerThirtyMin = setInterval(function () { runner("thirtyMin"); }, 30 * 60 * 1000); //30min
                    intervalHandlerDay = setInterval(function () { runner("day"); }, 24 * 60 * 60 * 1000); //day
                    callback();
                }
            ],
            function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("bittirex collector started successfully");
                }
            })

    },
    stopRunner: function () {
        clearInterval(intervalHandlerThirtyMin);
        clearInterval(intervalHandlerDay);
    },
    getSignals: function () {
        var signalArray = [];
        signalArray.push(signalsThirtyMin);
        signalArray.push(signalsDay);
        return ({ api: "bittrex", result: signalArray });
    }
}

//module.exports.startRunner();