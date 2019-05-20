import Firebase from 'firebase';

export default class Database {
  static initUser(userID) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + userID);
    userRef.set({
      cash: 1000000,
      BTC: 0,
    });
  }

  static buy(uid, stockCode, initCash, cash, initStock, rate) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + uid);
    if (stockCode === 1) {
      userRef.set({
        cash: initCash - cash,
        BTC: initStock + (cash * rate),
      });
    }
    return initCash - cash;
  }

  static stringify(num) {
    num += '';
    if (num === undefined) {
      return '';
    }
    let result = '';
    while(num.length > 3) {
      const remain = num.substring(num.length - 3, num.length);
      result = ',' + remain + result;
      num = num.substring(0, num.length - 3)
    }
    return num + result;
  }

}
