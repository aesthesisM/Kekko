module.exports = {
    "up": "INSERT INTO api (name,publicKey,secretKey) VALUES ('hitbtc',null,null),('poloniex',null,null),('bittrex',null,null)",
    "down": "delete from api where name in ('hitbtc','poloniex','bittrex')"
}