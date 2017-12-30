var Bittrex = require('./bittrex');
var async = require('async');
//hour
var longTermCount = 200;
var midTermCount = 90;
var shortTermCount = 40;
var quickTermCount = 18;

var bittrexClient = new Bittrex("bambam");


function calculateMovingAvarage(data, pair) { //calculate depending on C which means close price
    if (data == undefined) {
        console.log("socket null data");
        return;
    } else if (pair != null) {
        console.log("working pair :" + pair);
    }
    var longTermAvarage = 0, midTermAvarage = 0, shortTermAvarage = 0, quickTermAvarage = 0, length = data.length - longTermCount - 1;
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
    }
    longTermAvarage /= longTermCount;
    midTermAvarage /= midTermCount;
    shortTermAvarage /= shortTermCount;
    quickTermAvarage /= quickTermCount;

    var maxDifference = ((longTermAvarage - quickTermAvarage) / longTermAvarage) * 100;
    if (longTermAvarage > midTermAvarage && midTermAvarage > shortTermAvarage && shortTermAvarage > quickTermAvarage) {
        console.log("pair : " + pair + " | longTerm :" + longTermAvarage + " | midTerm :" + midTermAvarage + " | shortTerm :" + shortTermAvarage + " | quicTerm :" + quickTermAvarage + " | maxDifference :" + maxDifference);
    }
}
/*
bittrexClient._getHistoricalData({ marketName: "BTC-RDD", tickInterval: "thirtyMin", _: new Date().getTime() },
                        function (data, err,pair) {
                            if (err) {
                                console.error(err)
                            } else {
                                calculateMovingAvarage(data.result,pair);
                            }
                        }
                    );
                    */
var pairs = [];
var j;

//setInterval(function () {
j = 0;
if (pairs.length ==0) {
    bittrexClient._getPairs(
        function (data, err) {
            if (err) {
                console.error(err);
            } else if (Object.keys(data.result).length > 0) {
                var historyObj = {};
                for (var i = 0; i < data.result.length; i++) {

                    if ((data.result[i]["MarketName"]).startsWith("BTC")) {
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
        calculateMovingAvarage(data.result, pair);
        if (j < pairs.length - 1) {
            j++;
            bittrexClient._getHistoricalData({ marketName: pairs[j], tickInterval: "thirtyMin", _: new Date().getTime() }, recursive);
        } else {
            console.log("finished for now ;)");
            j = 0;
        }
    }
}