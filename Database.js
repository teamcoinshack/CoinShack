import Firebase from 'firebase';

export default class Database {
  static initUser(userID) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + userID);
    userRef.set({
      cash: 1000000.00,
      BTC: 0,
    });
  }

  static buy(uid, stock, initCash, cash, initStock, rate) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + uid);
    userRef.set({
      cash: initCash - cash,
      [stock]: initStock + (cash / rate),
    });
    return initCash - cash;
  }

  static stringify(num) {
    return num === undefined 
      ? '' 
      : num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

}
