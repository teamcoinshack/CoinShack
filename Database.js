import Firebase from 'firebase';

export default class Database {
  static initUser(userID) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + userID);
    userRef.set({
      cash: 1000000.00,
    });
  }

  static createAccount(uid, stock) {
    Firebase.app()
            .database()
            .ref('/users/' + uid)
            .update({ [stock]: 0 })
    return true;
  }

  static buy(uid, stock, initCash, cash, initStock, rate) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + uid);
    console.log(uid);
    console.log(stock);
    console.log(initCash);
    console.log(cash);
    console.log(initStock);
    console.log(rate);
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
