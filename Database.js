import Firebase from 'firebase';

export default class Database {
  static async getData(userID) {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + userID)
                                 .once('value')
      return snap;
  }

  static async sellAll(id, stock, rate) {
    try {
      let userRef = Firebase.app()
                            .database()
                            .ref('/users/' + id);
      const snap = await this.getData(id);
      const initCash = snap.val().cash;
      userRef.update({
        cash: initCash + (snap.val()[stock] * rate),
        [stock]: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static initUser(userID) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + userID);
    userRef.set({
      cash: 1000000.00,
    });
  }

  static initAccount(uid, stock) {
    Firebase.app()
            .database()
            .ref('/users/' + uid)
            .update({ [stock]: 0 })
    return true;
  }

  static async buy(id, stock, cash, rate) {
    try {
      let userRef = Firebase.app()
                            .database()
                            .ref('/users/' + id);
      const snap = await this.getData(id);
      const initCash = snap.val().cash;
      if (cash > initCash) {
        alert("Not enough cash!");
        return 0;
      }
      if (snap.val()[stock] === undefined) {
        await this.initAccount(id, stock);
      }
      const initStock = snap.val()[stock];
      if (initStock + (cash / rate) < 0) {
        alert("Not enough stock!");
        return 0;
      }
      userRef.update({
        cash: initCash - cash,
        [stock]: initStock + (cash / rate),
      });
    } catch (error) {
      console.log(error);
    }
  }

  static stringify(num) {
    if (num === undefined) {
      return '';
    } else {
      var parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
  }

  static unStringify(num) {
    return num === ''
      ? ''
      : num.toString().replace(/,/g, '');
  }

}
