export default class Query {

  static async fetch(stock) {
    //stock must be full name of stock instead of symbol
    let res = await fetch("https://api.coingecko.com/api/v3/coins/" + stock);
    let data = await res.json();
    return data.market_data.current_price.sgd;
  }

  static async getNews() {
    const url = "https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=bb387e29c09a46659af73f291edf4816"
    let res = await fetch(url);
    let data = await res.json();
    return data.articles;
  }
}
