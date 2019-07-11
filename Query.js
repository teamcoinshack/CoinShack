import { Mapping } from './Masterlist.js';

const NEWS_API_KEY = "bb387e29c09a46659af73f291edf4816";

export default class Query {
  static async fetch(stock) {
    //stock must be full name of stock instead of symbol
    let res = await fetch("https://api.coingecko.com/api/v3/coins/" + stock);
    let data = await res.json();
    return data;
  }

  static async getNews(topics) {
    try {      
      const url = `https://newsapi.org/v2/everything?q=${topics}`
        + `&sortBy=publishedAt&language=en&pageSize=60&apiKey=${NEWS_API_KEY}`;
      let res = await fetch(url);
      let data = await res.json();
      return data.articles;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
