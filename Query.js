import { Mapping } from './Masterlist.js';

const NEWS_API_KEY = "bb387e29c09a46659af73f291edf4816";

export default class Query {
  static async fetch(stock) {
    //stock must be full name of stock instead of symbol
    let res = await fetch("https://api.coingecko.com/api/v3/coins/" + stock);
    let data = await res.json();
    return data;
  }

  static async getNews(...topics) {
    try {
      let allArticles = [];
      for (topic of topics) {
        const url = `https://newsapi.org/v2/everything?q=${topic}`
          + `&sortBy=publishedAt&language=en&pageSize=30&apiKey=${NEWS_API_KEY}`;
        let res = await fetch(url);
        let data = await res.json();
        allArticles.push(...(data.articles));
      }
      return allArticles;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  
  static async fetchBySymbol(symbol) {
    try {
      const res = await this.fetch(Mapping[symbol]);
      return res;
    } catch(error) {
      console.log(error);
    }
  }
}
