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
      let walletRef = Firebase.app()
                            .database()
                            .ref('/users/' + id + '/wallet/');
      const snap = await this.getData(id);
      if (!('wallet' in snap.val())) {
        alert("No cryptocurrency to sell!");
        return 1;
      }
      let wallet = snap.val().wallet;
      if (!(stock in wallet)) {
        alert("No cryptocurrency to sell!");
        return 1;
      }
      const initCash = snap.val().cash;
      let hist = ('history' in snap.val()) ? snap.val().history : [];
      hist.unshift({
        symbol: stock,
        buy: false,
        date: new Date(),
        coinValue: snap.val().wallet[stock], 
        rate: rate,
      })
      userRef.update({
        cash: initCash + (snap.val().wallet[stock] * rate),
        history: hist,
      });
      walletRef.child(stock).remove();
      return 0;
    } catch (error) {
      console.log(error);
      alert('Something broke! :(');
    }
  }

  static updateTotal(uid, total) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + uid);
    userRef.update({
      totalValue: total,
    });
  }

  // can consider using cloud functions for new user creation,
  // set cash value, send email bla bla
  static async initUser(user, username) {
    try {
      console.log(user);
      const userID = user.uid;
      let userRef = Firebase.app()
                            .database()
                            .ref('/users/' + userID);
      let dataRef = Firebase.app()
                            .database()
                            .ref('/usersData/');
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/usersData/')
                                 .once('value');
      userRef.set({
        username: username,
        cash: 10000.00,
        totalValue: 0,
        email: user.email,
      });
      let usernames = (!snap.val() || (!('usernames' in snap.val()))) 
                        ? {} 
                        : snap.val().usernames;
      usernames[userID] = username;
      let emails = (!snap.val() || (!('emails' in snap.val())))
                      ? {}
                      : snap.val().emails;
      emails[userID] = user.email;
      dataRef.update({
        usernames: usernames,
        emails: emails,
      })
    } catch(error) {
      console.log(error);
    }
  }
  
  static async addAlert(name, uid, price, notifyWhenAbove, active) {
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + uid)
                                 .once('value')
      let alerts = (!('alerts' in snap.val())) ? [] : snap.val().alerts;
      if (!(name in alerts)) {
        //no alerts yet for this particular coin. Create an array and insert
        let arr = [];
        arr.push({
          index: 0,
          price: price,
          notifyWhenAbove: notifyWhenAbove,
          active : active,
        });
        let userRef = Firebase.app()
                              .database()
                              .ref('/users/' + uid + '/alerts/');
        userRef.update({
          [name]: arr,
        });
        return 0;
      } else {
        const alerts = snap.val().alerts[name];
        // take old array, append new alert, push new array back
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
        alertRef.child(name).remove();
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
                                 .once('value');
      let alerts = ('alerts' in snap.val()) ? snap.val().alerts : false;
      if (!alerts) {
        return [];
      }
      console.log(name in alerts);
      return (name in alerts) ? alerts[name] : [];
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
      const snap = await this.getData(uid);
      const userRef = Firebase.app()
                              .database()
                              .ref('/users/' + uid);
      let wallet = (!('wallet' in snap.val())) ? [] : snap.val().wallet;
      const initCash = snap.val().cash;
      if (cash > initCash) {
        alert("Not enough cash!");
        return 1;
      }
      let initStock;
      if (!(stock in wallet)){
        initStock = 0;
      } else {
        initStock = wallet[stock];
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
      if (!('wallet' in snap.val())) {
        //entire wallet not present
        wallet = {
          [stock]: initStock + (cash / rate),
        }
      } else {
        //wallet present
        wallet[stock] = initStock + (cash / rate);
      }
      userRef.update({
        cash: initCash - cash,
        wallet: wallet,
        history: hist,
      })
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

  static async search(query) {
    try {
      const usernameRef = Firebase.app()
                              .database()
                              .ref('/usersData/usernames/');
      const emailsRef = Firebase.app()
                              .database()
                              .ref('/usersData/emails/');
      const userSnap = await usernameRef.orderByValue()
                                        .startAt(query)
                                        .endAt(query + '\uf8ff')
                                        .once("value");
      const emailSnap = await emailsRef.orderByValue()
                                       .startAt(query)
                                       .endAt(query + '\uf8ff')
                                       .once("value");
      let res = [];
      for (let uid in userSnap.val()) {
        res.push(uid);
      }
      for (let uid in emailSnap.val()) {
        if (!res.includes(uid)) {
          res.push(uid);
        }
      }
      console.log(res);
      return res;
    } catch(error) {
      console.log(error);
    }
  }

}
