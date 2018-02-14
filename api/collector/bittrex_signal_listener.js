var io = require("socket.io-client")("http://localhost:50000")//"http://gravja.com:8080");
var async = require("async");
var Bittrex = require("../rest/bittrex/bittrex");
var bittrexClient = new Bittrex();
var orderSignature = "Bam";
var happenedOrders = [];
var orders = [];
var wallet = 1;

const MAX_ORDER_COUNT = 10;
const SELL_HIGHER_PERCENT = 0.01;
const STOP_LOSS_PERCENT = 0.05;

const SELL_HIGHER_CCI_100_150 = 0.01;
const SELL_HIGHER_CCI_150_200 = 0.012;
const SELL_HIGHER_CCI_200_250 = 0.014;
const SELL_HIGHER_CCI_250_000 = 0.016;

var current_order_count = 0;


io.on("signal", function (data) {
	runSignalOrder(data);
});

function runSignalOrder(data) {
	if (current_order_count < MAX_ORDER_COUNT && data.lastClosePrice < 0.01) { //dont work with expensive coins
		placeOrder(data, "buy", new Date().getTime() + 30 * 60 * 1000); //time+30 min for buy timeout);
		current_order_count++;
	}
}

function placeOrder(data, side, timeOut) {
	var quantity = parseFloat(wallet / (MAX_ORDER_COUNT - orders.length) / data.lastClosePrice);
	wallet = wallet - quantity * data.lastClosePrice;
	quantity = (quantity - quantity * 0.0025).toFixed(8);
	var orderObj = {
		side: side, //"sell"
		pair: data.pair,
		price: parseFloat(data.lastClosePrice).toFixed(8),
		quantity: quantity,
		stopLossPrice: parseFloat(data.lastClosePrice- data.lastClosePrice * STOP_LOSS_PERCENT).toFixed(8),
		interval: "oneMin",
		timeOut: timeOut,
		boughtPrice: 0,
		soldPrice: 0,
		cci: data.CCI,
		clientOrderId: orderSignature + new Date().getTime()
	};

	orders.push(orderObj);
	console.log(
		"Current orders :\nOrderLength : " +
		orders.length +
		"\n" +
		JSON.stringify(orders,null,"\t") +
		"\nWallet : " +
		wallet
	);
}

function cancelOrder(data) {


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
	if (orderStatus != null &&
		orderStatus.result != null && orderStatus.result != undefined &&
		orderStatus.result.length > 0 &&
		orderStatus.result[0] != undefined && orderStatus.result[0] != null &&
		orderStatus.result[0].H != undefined && orderStatus.result[0].H != null &&
		orderStatus.result[0].L != undefined && orderStatus.result[0].L != null)
		if (order.timeOut > new Date().getTime()) {
			//if result data is not null
			if (order.side === "buy" && orderStatus.result[0].L < order.price) {
				//buy happened....
				//put place order
				order.side = "sell";
				order.boughtPrice = order.price;
				order.price = parseFloat(order.price);
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
				order.timeOut = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; //sell timeout 1 week o.O
				orders[index] = order;
				console.log("buy happened" + JSON.stringify(order));
			} else if (order.side === "sell" && order.price < orderStatus.result[0].H) {
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
				});
				console.log("sell happened" + JSON.stringify(order));
			} else if (order.side === "sell" && order.stopLossPrice > orderStatus.result[0].L) {
				//stoploss worked
				wallet = wallet + order.stopLossPrice * order.quantity;
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
			}
		} else {
			//timeout remove order 
			//dont remove sell orders.
			//sell with profit or stop loss no other less
			if (order.side === "buy") {
				wallet = wallet + order.price * (order.quantity + order.quantity * 0.0025); //at first removed 0.0025 quantity as fee
				orders.splice(index, 1);
				index--;
			}
		}

	if (happenedOrders.length > 0) console.log("happened Orders: \n"+JSON.stringify(happenedOrders,null,"\t"));
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
