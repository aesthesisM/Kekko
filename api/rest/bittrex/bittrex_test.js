var Bittrex = require('./bittrex');
var async = require('async');
//hour
var longTermCount = 200;
var midTermCount = 90;
var shortTermCount = 40;
var quickTermCount = 18;

var bittrexClient = new Bittrex("bambam");


function calculateMovingAvarage(data) { //calculate depending on C which means close price
    if(data==undefined){
        console.log("socket null data");
        return;
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
        console.log("longTerm :" + longTermAvarage + " | midTerm :" + midTermAvarage + " | shortTerm :" + shortTermAvarage + " | quicTerm :" + quickTermAvarage + " | maxDifference :" + maxDifference);
    }
}
/*
bittrexClient._getHistoricalData({ marketName: "BTC-RDD", tickInterval: "thirtyMin", _: new Date().getTime() },
                        function (data, err) {
                            if (err) {
                                console.error(err)
                            } else {
                                //console.log("Working with :" + data.pair);
                                calculateMovingAvarage(data.result);
                            }
                        }
                    );
                    */
var pairs = [];
var j = 0;
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
            console.log("working with :"+pairs[0]);
            bittrexClient._getHistoricalData({ marketName: pairs[j], tickInterval: "thirtyMin", _: new Date().getTime() },recursive
            );

        }
    }
);

var recursive = function (data, err) {
    if (err) {
        console.error(err);
        console.log("working with :"+pairs[j]);
        bittrexClient._getHistoricalData({ marketName: pairs[j], tickInterval: "thirtyMin", _: new Date().getTime() },recursive);
    } else {
        calculateMovingAvarage(data.result);
        if (j < pairs.length-1) {
            j++;
            console.log("working with :"+pairs[j]);
            bittrexClient._getHistoricalData({ marketName: pairs[j], tickInterval: "thirtyMin", _: new Date().getTime() },recursive);
        }else{
            console.log("finished");
        }
    }
}