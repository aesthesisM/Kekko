var io = require("socket.io-client")("http://localhost:50000");
var async = require("async");
var Bittrex = require("../rest/bittrex/bittrex");
var bittrexClient = new Bittrex();
io.on("signal", function(data) {
  console.log(data);
  runSignalOrder(data);
});
var happenedOrders = [];
var holdingOrders = [];
var orders = [];
var wallet = 1;

const MAX_ORDER_COUNT = 10;
const SELL_HIGHER_PERCENT = 0.02;
const STOP_LOSS_PERCENT = 0.02;
var current_order_count = 0;

function runSignalOrder(data) {
  if (current_order_count < MAX_ORDER_COUNT) {
    placeOrder(data, "buy", new Date().getTime() + 30 * 60 * 1000); //time+30 min for buy timeout);
    current_order_count++;
  }
}

function placeOrder(data, side, timeOut) {
  var quantity = parseFloat(
    wallet / (MAX_ORDER_COUNT - orders.length) / data.lastClosePrice
  );
  wallet = wallet - quantity * data.lastClosePrice;
  quantity = quantity - quantity * 0.0025;
  var orderObj = {
    side: side, //"sell"
    price: data.lastClosePrice,
    quantity: quantity,
    pair: data.pair,
    stopLossPrice: 0,
    interval: "oneMin",
    timeOut: timeOut
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
        _: new Date().getTime(),
        index: 0
      },
      recursive
    );
}

function recursive(orderStatus, err, pair, interval, index) {
  var order = orders[index];
  console.log(orderStatus);
  if (orderStatus != null && orderStatus.result != null && orderStatus.result != undefined && orderStatus.result.length > 0)//if result data is not null 
    if(order.timeOut > new Date().getTime()){
        if (order.side === "buy") {
        if (orderStatus.result[0].L < order.price) {
            //buy happened....
            //put place order
            order.side = "sell";
            order.price = order.price + order.price * SELL_HIGHER_PERCENT;
            order.stopLossPrice = order.price - order.price * STOP_LOSS_PERCENT;
            order.timeOut = new Date().getTime() + 8 * 30 * 60 * 1000; //sell timeout
            orders.splice(index, 1);
            index--;
            orders.push(order);
            console.log("buy happened"+ JSON.stringify(order));
        }
        } else if (order.side === "sell" && order.price < orderStatus.result[0].H) {
        //sell happened
        wallet =
            wallet +
            order.price * order.quantity -
            order.price * order.quantity * 0.0025;
        orders.splice(index, 1);
        index--;
        current_order_count--;
        happenedOrders.push({ order: order, stopLoss: false, wallet: wallet });
        console.log("sell happened"+ JSON.stringify(order));
        } else if (
        order.side === "sell" &&
        order.stopLossPrice > orderStatus.result[0].L
        ) {
        //stoploss worked
        wallet =
            wallet +
            order.price * order.quantity -
            order.price * order.quantity * 0.0025;
        orders.splice(index, 1);
        index--;
        current_order_count--;
        happenedOrders.push({ order: order, stopLoss: true, wallet: wallet });
        }
    } else {
        //timeout remove order
        orders.splice(index, 1);
        index--;
        if (order.side === "buy") {
        wallet = wallet + order.price * order.quantity;
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

setInterval(function() {
  checkOrders();
}, 1 * 60 * 1000);
