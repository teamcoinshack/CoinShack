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
      if (snap.val()[stock] === 0 || snap.val()[stock] === undefined) {
        alert("No cryptocurrency to sell!");
        return 1;
      }
      userRef.update({
        cash: initCash + (snap.val()[stock] * rate),
        [stock]: 0,
      });
      return 0;
    } catch (error) {
      console.log(error);
    }
  }


  // can consider using cloud functions for new user creation,
  // set cash value, send email bla bla
  static initUser(userID, emailLogin) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + userID);
    userRef.set({
      cash: 1000000.00,
      alerts: {
        bitcoin: 0,
        ethereum: 0,
        dash: 0,
        ripple: 0,
        litecoin: 0,
      },
      emailLogin: emailLogin,
    });
  }
  
  static async addAlert(name, uid, price, notifyWhenAbove, active) {
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + uid)
                                 .once('value')
      const alerts = snap.val().alerts[name];
      if (alerts === 0) {
        //no alerts yet. Create an array and insert
        let arr = [];
        arr.push({
          index: 0,
          price: price,
          notifyWhenAbove: notifyWhenAbove,
          active: active,
        });
        let userRef = Firebase.app()
                              .database()
                              .ref('/users/' + uid + '/alerts/');
        userRef.update({
          [name]: arr,
        });
        return 0;
      } else {
        //take old array, append new alert, push new array back
        alerts.push({
          price: price,
          notifyWhenAbove: notifyWhenAbove,
          active: active,
          index: alerts.length,
        });
        let userRef = Firebase.app()
                              .database()
                              .ref('/users/' + uid + '/alerts/');
        userRef.update({
          [name]: alerts,
        });
        return 0;
      }
    } catch(error) {
      console.log(error);
    }
  }

  static async deleteAlert(uid, index, name) {
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + uid)
                                 .once('value')
      let alerts = snap.val().alerts[name];
      alerts.splice(index, 1);
      for (let i = 0; i < alerts.length; i++) {
        let obj = alerts[i];
        obj.index = i;
        alerts[i] = obj;
      }
      let userRef = Firebase.app()
                            .database()
                            .ref('/users/' + uid + '/alerts/');
      if (alerts.length === 0) {
        userRef.update({
          [name]: 0.
        });
      } else {
        userRef.update({
          [name]: alerts,
        });
      }
      return 0;
    } catch(error) {
      console.log(error);
    }
  }

  static async getAlerts(uid, name) {
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + uid)
                                 .once('value')
      const alerts = snap.val().alerts[name];
      if (alerts === 0) {
        return [];
      }
      return alerts;
    } catch(error) {
      console.log(error);
    }
  }

  static async changePassword(user, newPass) {
    try {
      await user.updatePassword(newPass);
    } catch(error) {
      console.log(error);
    }
  }

  static initAccount(uid, stock) {
    Firebase.app()
            .database()
            .ref('/users/' + uid)
            .update({ [stock]: 0 })
    return true;
  }

  static async buy(uid, id, cash, rate) {
    try {
      let userRef = Firebase.app()
                            .database()
                            .ref('/users/' + uid);
      const snap = await this.getData(uid);
      console.log(snap.val());
      const initCash = snap.val().cash;
      if (cash > initCash) {
        alert("Not enough cash!");
        return 1;
      }
      if (snap.val()[id] === undefined) {
        await this.initAccount(uid, id);
      }
      const initStock = snap.val()[id];
      if (initStock + (cash / rate) < 0) {
        alert("Not enough cryptocurrency!");
        return 1;
      }
      if (initStock === 0 && cash < 0) {
        alert("No cryptocurrency to sell!");
        return 1;
      }
      userRef.update({
        cash: initCash - cash,
        [id]: initStock + (cash / rate),
      });
      return 0;
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
