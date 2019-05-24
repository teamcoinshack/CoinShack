export default class Query {

  static async fetch(stock) {
    //stock must be full name of stock instead of symbol
    let res = await fetch("https://api.coingecko.com/api/v3/coins/" + stock);
    let data = await res.json();
    return data.market_data.current_price.sgd;
  }
}
