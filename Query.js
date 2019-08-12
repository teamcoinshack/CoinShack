import { NEWS_API_KEY } from './keys.js';

export default class Query {
  static async fetch(stock) {
    // stock must be full name of stock instead of symbol
    let res = await fetch("https://api.coingecko.com/api/v3/coins/" + stock
     + "?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false");
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

  static getTitle(title_id) {
    if (title_id === 1) {
      return 'TENDERFOOT';
    }
    if (title_id === 2) {
      return 'NOVICE';
    }
    if (title_id === 3) {
      return 'INITIATE';
    }
    if (title_id === 4) {
      return 'MASTER';
    }
    if (title_id === 5) {
      return 'VETERAN';
    }
    if (title_id === 6) {
      return 'LEGENDARY';
    }
  }
}
