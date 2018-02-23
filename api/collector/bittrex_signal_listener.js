var io = require("socket.io-client")("http://localhost:50000", { forceNew: true })//"http://gravja.com:8080");
var logger = require('morgan');
var async = require("async");
var Bittrex = require("../rest/bittrex/bittrex");
var bittrexClient = new Bittrex();


const MAX_ORDER_COUNT = 20;
const SELL_HIGHER_PERCENT = 0.012;
const STOP_LOSS_PERCENT = 0.05;

const SELL_HIGHER_CCI_100_150 = 0.012;
const SELL_HIGHER_CCI_150_200 = 0.015;
const SELL_HIGHER_CCI_200_250 = 0.02;
const SELL_HIGHER_CCI_250_000 = 0.025;
const USE_BTC_PROPERTIES = true;

var BTC_QUICK_TERM_AVARAGE = 0;
var BTC_SHORT_TERM_AVARAGE = 0;
var BTC_MID_TERM_AVARAGE = 0;
var BTC_LONG_TERM_AVARAGE = 0;
var BTC_CURRENT_PRICE = 0;
var BTC_PRICE_CHECK_RATE = 0;
var ABS_BTC_CHECK_RATE = 0;

var orderSignature = "BamTrex";
var happenedOrders = [];
var orders = [];
var wallet = 1;
var current_order_count = 0;

//logging 
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/bittrex_simulation.log', { flags: 'w' });

function log(args) {
	log_file.write(new Date() + " || " + util.format(args) + "\n");
}

io.on("connect", function () {
	console.log("socket connection established at " + new Date());
})

io.on("error", function () {
	console.log("socket error occured at " + new Date().getTime());
});

io.on("disconnect", function () {
	setTimeout(function () { io.connect(); }, 5000);
})

io.on("signal", function (data) {
	if (data.pair === "USDT-BTC") {
		BTC_QUICK_TERM_AVARAGE = data.quickTermAvarage;
		BTC_SHORT_TERM_AVARAGE = data.shortTermAvarage;
		BTC_MID_TERM_AVARAGE = data.midTermAvarage;
		BTC_LONG_TERM_AVARAGE = data.longTermAvarage;
		BTC_CURRENT_PRICE = parseFloat(data.price).toFixed(2);
		BTC_PRICE_CHECK_RATE = parseFloat(((BTC_CURRENT_PRICE - BTC_SHORT_TERM_AVARAGE) / BTC_CURRENT_PRICE) * 100);
		ABS_BTC_CHECK_RATE = Math.abs(BTC_PRICE_CHECK_RATE).toFixed(2);
	}

	if (USE_BTC_PROPERTIES) {//run with btc checks
		if ((BTC_QUICK_TERM_AVARAGE > BTC_SHORT_TERM_AVARAGE || (ABS_BTC_CHECK_RATE < 2 && BTC_PRICE_CHECK_RATE < 0)) && !(data.pair==="USDT-BTC")) {
			runSignalOrder(data);
		}
	} else if (!(data.pair === "USDT-BTC")) { //run in any case
		runSignalOrder(data);
	}

});

function runSignalOrder(data) {
	if (current_order_count < MAX_ORDER_COUNT) { // && data.lastClosePrice < 0.1 dont work with expensive coins in case of low wallet 
		placeOrder(data, "buy", new Date().getTime() + 30 * 60 * 1000); //time+30 min for buy timeout);
		current_order_count++;
	}
}

function placeOrder(data, side, timeOut) {
	var price = data.lastClosePrice;
	if (USE_BTC_PROPERTIES) {
		if (BTC_PRICE_CHECK_RATE < 0) {
			price = price - price * ABS_BTC_CHECK_RATE
			price = price.toFixed(8);
		}
	}
	var quantity = parseFloat(wallet / (MAX_ORDER_COUNT - orders.length) / price);
	wallet = wallet - quantity * price;
	var newQuantity = (quantity - quantity * 0.0025).toFixed(8);
	var fee = (quantity - newQuantity) * price;
	fee = fee.toFixed(8);
	var orderObj = {
		side: side, //"sell"
		pair: data.pair,
		price: parseFloat(price).toFixed(8),
		quantity: parseFloat(newQuantity).toFixed(8),
		stopLossPrice: parseFloat(price - price * STOP_LOSS_PERCENT).toFixed(8),
		interval: "oneMin",
		timeOut: timeOut,
		timeOutText: new Date(timeOut),
		boughtPrice: 0,
		soldPrice: 0,
		cci: data.CCI,
		clientOrderId: orderSignature + new Date().getTime(),
		fee: fee
	};

	orders.push(orderObj);
	console.log(
		"Current orders :\nOrderLength : " +
		orders.length +
		"\n" +
		JSON.stringify(orders, null, "\t") +
		"\nWallet : " +
		wallet
	);
}

function cancelOrder(data) {


}

function checkOrders() {

	if (USE_BTC_PROPERTIES) {
		if (BTC_QUICK_TERM_AVARAGE < BTC_SHORT_TERM_AVARAGE) {
			console.log("BTC IS NOW ON DOWN TREND. CANCEL ALL BUY ORDERS");
			for (var i = 0; i < orders.length; i++) {
				if (orders[i].side === "buy") {
					var cancelledOrder = orders.slice(i, 1);
					i--;
					console.log("cancelled buy order is " + JSON.stringify(cancelledOrder, null, "\t"));
				}
			}
		}
	} else if (orders.length > 0) {
		bittrexClient._getLatestTick(
			{
				marketName: orders[0].pair,
				tickInterval: orders[0].interval,
				index: 0
			},
			recursive
		);

	}
}

function recursive(orderStatus, err, pair, interval, index) {

	var order = orders[index];
	order.price = parseFloat(order.price);
	order.stopLossPrice = parseFloat(order.stopLossPrice);
	order.quantity = parseFloat(order.quantity);
	//if btc is on down trend then dont place buy orders.
	//and check sell orders if they caught with stoploss price
	if (orderStatus != null && orderStatus.result != null && orderStatus.result != undefined && orderStatus.result.length > 0 && orderStatus.result[0] != undefined && orderStatus.result[0] != null) {
		orderStatus = orderStatus.result[0];
		//console.log("order.pair :" + order.pair + " | currentTimeText :" + new Date()+ " | order.timeOutText :" + order.timeOutText);
		if (order.timeOut > new Date().getTime()) {
			//if result data is not null
			if (order.side === "buy" && orderStatus != null && orderStatus != undefined && orderStatus.L != undefined && orderStatus.L != null && orderStatus.L < order.price) {
				//buy happened....
				//put place order
				order.side = "sell";
				order.boughtPrice = order.price;

				if (order.cci > SELL_HIGHER_CCI_250_000) {
					order.price = order.price + order.price * SELL_HIGHER_CCI_250_000;
				} else if (order.cci > SELL_HIGHER_CCI_200_250) {
					order.price = order.price + order.price * SELL_HIGHER_CCI_200_250;
				} else if (order.cci > SELL_HIGHER_CCI_150_200) {
					order.price = order.price + order.price * SELL_HIGHER_CCI_150_200;
				} else if (order.cci > SELL_HIGHER_CCI_100_150) {
					order.price = order.price + order.price * SELL_HIGHER_CCI_100_150;
				} else {
					order.price = order.price + order.price * SELL_HIGHER_PERCENT;
				}
				order.price = order.price.toFixed(8);
				order.timeOut = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; //sell timeout 1 month o.O // no need to check for stop loss. there will be 30 order active so it would be tolerated what price it get any lower 
				order.timeOutText = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
				orders[index] = order;
				console.log("buy happened || " + JSON.stringify(order));
				log("buy happened || " + JSON.stringify(order));
				console.log("Current orders :\nOrderLength : " +
					orders.length +
					"\n" +
					JSON.stringify(orders, null, "\t") +
					"\nWallet : " +
					wallet
				);
			} else if (order.side === "sell" && orderStatus != null && orderStatus != undefined && orderStatus.H != undefined && orderStatus.H != null && order.price < orderStatus.H) {
				//sell happened
				wallet = parseFloat(wallet) + parseFloat(order.price) * parseFloat(order.quantity) - parseFloat(order.fee);
				wallet = wallet.toFixed(8);
				orders.splice(index, 1);
				index--;
				current_order_count--;
				order.soldPrice = order.price;
				happenedOrders.push({
					order: order,
					stopLoss: false,
					wallet: wallet,
					activeOrders: orders,
				});
				console.log("sell happened" + JSON.stringify(order));
				log("sell happened || " + JSON.stringify(order));
				log("happened Orders || " + JSON.stringify(happenedOrders, null, "\t"));
				console.log("happened Orders: \n" + JSON.stringify(happenedOrders, null, "\t"));
			} /*else if (order.side === "sell" && orderStatus != null && orderStatus != undefined && orderStatus.L != undefined && orderStatus.L != null && order.stopLossPrice > orderStatus.L) {
				//stoploss worked
				wallet = parseFloat(wallet) + parseFloat(order.stopLossPrice) * parseFloat(order.quantity) - parseFloat(order.fee);
				wallet = wallet.toFixed(8);
				orders.splice(index, 1);
				index--;
				current_order_count--;
				order.soldPrice = order.stopLossPrice;
				happenedOrders.push({
					order: order,
					stopLoss: true,
					wallet: wallet,
					activeOrders: orders,
				});
				console.log("stoploss happened" + JSON.stringify(order));
				log("stoploss happened || " + JSON.stringify(order));
				console.log("happened Orders: \n" + JSON.stringify(happenedOrders, null, "\t"));
			}*/
		} else {
			//timeout remove order 
			//dont remove sell orders.
			//sell with profit or stop loss no other less
			if (order.side === "buy") {
				wallet = parseFloat(wallet) + parseFloat(order.price) * parseFloat(order.quantity) + parseFloat(order.fee); //at first removed 0.0025 quantity as fee
				wallet = wallet.toFixed(8);
				orders.splice(index, 1);
				index--;

				console.log("buy timeout happened. order removed. order :" + JSON.stringify(order));
				log("buy timeout happened. order removed. || " + JSON.stringify(order));
				console.log(
					"Current orders :\nOrderLength : " +
					orders.length +
					"\n" +
					JSON.stringify(orders, null, "\t") +
					"\nWallet : " +
					wallet
				);
			}
		}
	}


	if (index < orders.length - 1) {
		index++;
		bittrexClient._getLatestTick(
			{
				marketName: orders[index].pair,
				tickInterval: orders[index].interval,
				index: index
			},
			recursive
		);
	}
}

setInterval(function () { checkOrders(); }, 1 * 60 * 1000);
