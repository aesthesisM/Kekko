var HitBTC = require('./hitbtc');
var client = new HitBTC('f39356b5f3bd407da77c042d55625dd7', '58f9d3ece954f73067485b11a5d5602a', 'live');

/*

*/
//public methods
//client.tickerAll(console.log);
//client.tickerPair('BTCUSD',console.log);

//private methods require authentication
//client.activeOrders(console.log);
client.activeOrderById('47d9ca49cc694ca4b27319ef28d67bb7',console.log);
//client.addOrder(); //has not tested yet
//client.cancelOrder(); //has not tested yet
//client.cancellAllOrders(); //has not tested yet


