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
      let hist = ('history' in snap.val()) ? snap.val().history : [];
      hist.unshift({
        symbol: stock,
        buy: false,
        date: new Date(),
        coinValue: snap.val()[stock], 
        rate: rate,
      })
      userRef.update({
        cash: initCash + (snap.val()[stock] * rate),
        history: hist,
      });
      userRef.child(stock).remove();
      return 0;
    } catch (error) {
      console.log(error);
      alert('Something broke! :(');
    }
  }


  // can consider using cloud functions for new user creation,
  // set cash value, send email bla bla
  static initUser(userID) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + userID);
    userRef.set({
      cash: 1000000.00,
      alerts: 0,
    });
  }
  
  static async addAlert(name, uid, price, notifyWhenAbove, active) {
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + uid)
                                 .once('value')
      let alerts = (!('alerts' in snap.val())) ? [] : snap.val().alerts;
      if (!(name in alerts)) {
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
        if (snap.val().alerts === 0) {
          //no alerts for all crypto
          userRef.set({
            [name]: arr,
          })
        } else {
          userRef.update({
            [name]: arr,
          });
        }
        return 0;
      } else {
        const alerts = snap.val().alerts[name];
        //take old array, append new alert, push new array back
        alerts.push({
          index: alerts.length,
          price: price,
          notifyWhenAbove: notifyWhenAbove,
          active: active,
        });
        let alertRef = Firebase.app()
                              .database()
                              .ref('/users/' + uid + '/alerts/');
        alertRef.update({
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
      let alertRef = Firebase.app()
                            .database()
                            .ref('/users/' + uid + '/alerts/');
      let userRef = Firebase.app()
                            .database()
                            .ref('/users/' + uid);
      if (alerts.length === 0) {
        userRef.child('alerts').remove();
      } else {
        alertRef.update({
          [name]: alerts,
        });
      }
      return 0;
    } catch(error) {
      console.log(error);
    }
  }

  static async toggleAlert(uid, index, name) {
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + uid)
                                 .once('value')
      let alerts = snap.val().alerts[name];
      alerts[index].active = !alerts[index].active;
      let userRef = Firebase.app()
                            .database()
                            .ref('/users/' + uid + '/alerts/');
      userRef.update({
        [name]: alerts,
      });
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
      let alerts;
      alerts = ('alerts' in snap.val()) ? snap.val().alerts : [];
      if (alerts.length === 0) {
        return [];
      }
      return ([name] in alerts) ? alerts[name] : [];
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

  static async buy(uid, stock, cash, rate) {
    try {
      let userRef = Firebase.app()
                            .database()
                            .ref('/users/' + uid);
      const snap = await this.getData(uid);
      const initCash = snap.val().cash;
      if (cash > initCash) {
        alert("Not enough cash!");
        return 1;
      }
      let initStock;
      if (!([stock] in snap.val())) {
        initStock = 0;
      } else {
        initStock = snap.val()[stock];
      }
      if (initStock + (cash / rate) < 0) {
        alert("Not enough cryptocurrency!");
        return 1;
      }
      if (initStock === 0 && cash < 0) {
        alert("No cryptocurrency to sell!");
        return 1;
      }
      let hist = ('history' in snap.val()) ? snap.val().history : [];
      hist.unshift({
        symbol: stock,
        buy: cash > 0,
        date: new Date(),
        coinValue: Math.abs(cash / rate),
        rate: rate
      })
      userRef.update({
        cash: initCash - cash,
        [stock]: initStock + (cash / rate),
        history: hist
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
