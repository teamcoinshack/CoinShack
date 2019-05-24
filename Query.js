export default class Query {

  static fetch(stock) {
    fetch("https://api.coingecko.com/api/v3/coins/bitcoin")
      .then(res => console.log(res.json()));
  }
}
