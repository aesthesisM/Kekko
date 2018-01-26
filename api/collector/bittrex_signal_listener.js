var io = require("socket.io-client")("http://localhost:50000");
var async = require("async");
var Bittrex = require("../rest/bittrex/bittrex");
var bittrexClient = new Bittrex();
io.on("signal", function (data) {
	console.log(data);
	runSignalOrder(data);
});
var happenedOrders = [];
var holdingOrders = [];
var orders = [];
var wallet = 1;

const MAX_ORDER_COUNT = 10;
const SELL_HIGHER_PERCENT = 0.009;
const STOP_LOSS_PERCENT = 0.05;

const SELL_HIGHER_CCI_100_150 = 0.01;
const SELL_HIGHER_CCI_150_200 = 0.012;
const SELL_HIGHER_CCI_200_000 = 0.015;

var current_order_count = 0;

function runSignalOrder(data) {
	if (current_order_count < MAX_ORDER_COUNT) {
		placeOrder(data, "buy", new Date().getTime() + 30 * 60 * 1000); //time+30 min for buy timeout);
		current_order_count++;
	}
}

function placeOrder(data, side, timeOut) {
	var quantity = parseFloat(wallet / (MAX_ORDER_COUNT - orders.length) / data.lastClosePrice);
	wallet = wallet - quantity * data.lastClosePrice;
	quantity = quantity - quantity * 0.0025;
	var orderObj = {
		side: side, //"sell"
		price: data.lastClosePrice,
		quantity: quantity,
		pair: data.pair,
		stopLossPrice: 0,
		interval: "oneMin",
		timeOut: timeOut,
		boughtPrice: 0,
		soldPrice: 0,
		cci: data.CCI
	};

	orders.push(orderObj);
	console.log(
		"Current orders :\nOrderLength : " +
		orders.length +
		"\n" +
		JSON.stringify(orders) +
		"\nWallet : " +
		wallet
	);
}

function checkOrders() {
	if (orders.length > 0)
		bittrexClient._getLatestTick(
			{
				marketName: orders[0].pair,
				tickInterval: orders[0].interval,
				index: 0
			},
			recursive
		);
}

function recursive(orderStatus, err, pair, interval, index) {
	var order = orders[index];
	if (orderStatus != null && orderStatus.result != null && orderStatus.result != undefined && orderStatus.result.length > 0)
		if (order.timeOut > new Date().getTime()) {
			//if result data is not null
			if (order.side === "buy" && orderStatus.result[0].L < order.price) {
				//buy happened....
				//put place order
				order.side = "sell";
				order.boughtPrice = order.price;
				if (order.cci > SELL_HIGHER_CCI_200_000) {
					order.price = order.price + order.price * SELL_HIGHER_CCI_200_000;
				} else if (order.cci > SELL_HIGHER_CCI_150_200) {
					order.price = order.price + order.price * SELL_HIGHER_CCI_150_200;
				} else if (order.cci > SELL_HIGHER_CCI_100_150) {
					order.price = order.price + order.price * SELL_HIGHER_CCI_100_150;
				} else {
					order.price = order.price + order.price * SELL_HIGHER_PERCENT;
				}
				order.stopLossPrice = order.price - order.price * STOP_LOSS_PERCENT;
				order.timeOut = new Date().getTime() + 16 * 30 * 60 * 1000; //sell timeout
				orders[index] = order;
				console.log("buy happened" + JSON.stringify(order));
			} else if (order.side === "sell" && order.price < orderStatus.result[0].H) {//hodl forever :D :D :D or sell it with current price
				//sell happened
				wallet = wallet + order.price * order.quantity - order.price * order.quantity * 0.0025;
				orders.splice(index, 1);
				index--;
				current_order_count--;
				order.soldPrice = order.price;
				happenedOrders.push({
					order: order,
					stopLoss: false,
					wallet: wallet,
					activeOrders: orders,
					holdingOrders: holdingOrders
				});
				console.log("sell happened" + JSON.stringify(order));
			} else if (order.side === "sell" && order.stopLossPrice > orderStatus.result[0].L) {
				//stoploss worked
				wallet = wallet + order.stopLossPrice * order.quantity - order.stopLossPrice * order.quantity * 0.0025;
				orders.splice(index, 1);
				index--;
				current_order_count--;
				order.soldPrice = order.stopLoss;
				happenedOrders.push({
					order: order,
					stopLoss: true,
					wallet: wallet,
					activeOrders: orders,
					holdingOrders: holdingOrders
				});
			}
		} else {
			//timeout remove order
			orders.splice(index, 1);
			index--;
			if (order.side === "buy") {
				wallet = wallet + order.price * (order.quantity + order.quantity * 0.0025); //at first removed 0.0025 quantity as fee
			} else {
				//hodl forever :D :D :D or sell it with current price
				holdingOrders.push(order);
			}
		}

	if (happenedOrders.length > 0) console.log(happenedOrders);
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
