var Bittrex = require('./bittrex');

//hour
var longTermCount = 200;
var midTermCount = 90;
var shortTermCount = 40;
var quickTermCount = 14;

var bittrexClient = new Bittrex("bambam");

bittrexClient._getHistoricalData({ marketName: "BTC-LTC", tickInterval: "hour" }, function (data, err) {
    console.log(data);
})
/*
bittrexClient._getPairs(
    function (data, err) {
        if (err) {
            console.error(err);
        } else if (Object.keys(data.result).length > 0) {
            for (var i = 0; i < data.result.length; i++) {

                if ((data.result[i]["MarketName"]).startsWith("BTC")) {
                    console.log("MarketName : " + data.result[i]["MarketName"]);
                    var historyObj = {
                        marketName: data.result[i]["MarketName"],
                        tickInterval: "hour"
                    };

                    bittrexClient._getHistoricalData(historyObj,
                        function (data, err) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(data);
                            }
                        });
                }

            }
        }
    }
);
*/

