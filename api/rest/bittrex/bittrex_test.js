var Bittrex = require('./bittrex');
var async = require('async');
//hour
var longTermCount = 200;
var midTermCount = 90;
var shortTermCount = 40;
var quickTermCount = 9;

var bittrexClient = new Bittrex();
var watch = [];
function checkMA(data, pair) { //calculate depending on C which means close price
    if (data == undefined || data.length == 0) {
        console.log("socket null data");
        return;
    } else if (pair != null) {
        console.log("working pair :" + pair);
    }
    var longTermAvarage = 0, midTermAvarage = 0, shortTermAvarage = 0, quickTermAvarage = 0, length = data.length - longTermCount - 1;
    var long_mid_difference = 0, mid_short_difference = 0, short_quick_difference = 0;
    var max = 0, min = 1;
    //first checking MA
    for (var i = 0; i <= longTermCount; i++) {
        if (longTermCount - i < quickTermCount) {
            quickTermAvarage += data[length + i].C;
        }
        if (longTermCount - i < shortTermCount) {
            shortTermAvarage += data[length + i].C;
        }
        if (longTermCount - i < midTermCount) {
            midTermAvarage += data[length + i].C;
        }

        longTermAvarage += data[length + i].C;

        if (data[length + i].H > max) {
            max = data[length + i].H;
        } else if (data[length + i].L < min) {
            min = data[length + i].L;
        }

    }
    longTermAvarage /= longTermCount;
    midTermAvarage /= midTermCount;
    shortTermAvarage /= shortTermCount;
    quickTermAvarage /= quickTermCount;

    long_mid_difference = ((longTermAvarage - midTermAvarage) / midTermAvarage) * 100;
    mid_short_difference = ((midTermAvarage - shortTermAvarage) / shortTermAvarage) * 100;
    short_quick_difference = ((shortTermAvarage - quickTermAvarage) / quickTermAvarage) * 100;

    if (longTermAvarage > midTermAvarage && midTermAvarage > shortTermAvarage && shortTermAvarage > quickTermAvarage) {

        if (long_mid_difference > 9 && mid_short_difference > 9 && short_quick_difference > 9) { //last part of dump
            console.log("Perpect Match!!! Last part of dump!");
            console.log("pair : " + pair + " | longTerm :" + longTermAvarage + " | midTerm :" + midTermAvarage + " | shortTerm :" + shortTermAvarage + " | \nquicTerm :" + quickTermAvarage + " | max : " + max + " | min : " + min + " | enterancePrice :" + data[data.length - 1].C);
        } else if (long_mid_difference < 4, mid_short_difference < 4, short_quick_difference < 4) { //normal cycle of coin
            console.log("Perfect Match!!! Normal cycle of price")
            console.log("pair : " + pair + " | longTerm :" + longTermAvarage + " | midTerm :" + midTermAvarage + " | shortTerm :" + shortTermAvarage + " | \nquicTerm :" + quickTermAvarage + " | max : " + max + " | min : " + min + " | enterancePrice :" + data[data.length - 1].C);
        }
    }

}

function checkCCI(data, pair) {

}
//check CCI here

//then desice if its worth to signal ;)

/*
bittrexClient._getHistoricalData({ marketName: "BTC-UKG", tickInterval: "thirtyMin", _: new Date().getTime() },
                        function (data, err,pair) {
                            if (err) {
                                console.error(err)
                            } else {
                                checkIfThereIsSignal(data.result,pair);
                            }
                        }
                    );
                    */
var pairs = [];
var signals = [];
var j;

//setInterval(function () {
j = 0;
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
                bittrexClient._getHistoricalData({ marketName: pairs[j], tickInterval: "thirtyMin", _: new Date().getTime() }, recursive);
            }
        }
    );
} else {
    bittrexClient._getHistoricalData({ marketName: pairs[j], tickInterval: "thirtyMin", _: new Date().getTime() }, recursive);
}
// }, 1800000);//30 min
function recursive(data, err, pair) {
    if (err) {
        console.error(err);
        bittrexClient._getHistoricalData({ marketName: pair, tickInterval: "thirtyMin", _: new Date().getTime() }, recursive);
    } else {
        checkMA(data.result, pair);
        if (j < pairs.length - 1) {
            j++;
            bittrexClient._getHistoricalData({ marketName: pairs[j], tickInterval: "thirtyMin", _: new Date().getTime() }, recursive);
        } else {
            console.log("finished for now ;)");
            j = 0;
        }
    }
}