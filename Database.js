import Firebase from 'firebase';
import q from './Query.js';
import { Mapping } from './Masterlist.js';

export default class Database {
  static async getData(uid) {
      let snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + uid)
                                 .once('value');
      return snap.val() ? snap : false;
  }

  // can consider using cloud functions for new user creation,
  // set cash value, send email bla bla
  static async initUser(user, username) {
    try {
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
        email: user.email,
        title_id: 1,
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
    } catch (error) {
      console.log(error);
    }
  }

  static async getTotalValue(uid, snapped) {
    try {
      let wallet = ('wallet' in snapped) 
                      ? snapped.wallet 
                      : false;
      let totalValue = snapped.cash;
      const keys = Object.keys(wallet);
      if (keys) {
        for (let k = 0; k < keys.length; k++) {
          const data = await q.fetch(Mapping[keys[k]]);
          const rate = data.market_data.current_price.usd;
          const value = wallet[keys[k]] * rate;
          totalValue += value;
        }
      }
      const userRef = Firebase.app()
                            .database()
                            .ref('/users/' + uid);
      const snap = await Firebase.app()
                            .database()
                            .ref('/users/' + uid + '/title_id/')
                            .once('value');
      const title_id = snap.val();
      const newTitle = this.newTitle(title_id, totalValue);
      if (newTitle > title_id) {
        userRef.update({
          title_id: newTitle,
        })
      }
      return totalValue;
    } catch (error) {
      console.log(error);
    }
  }

  static newTitle(title_id, value) {
    if (title_id <= 5 && value >= 50000) {
      return 6;
    }
    if (title_id <= 4 && value >= 30000) {
      return 5;
    }
    if (title_id <= 3 && value >= 20000) {
      return 4;
    }
    if (title_id <= 2 && value >= 15000) {
      return 3;
    }
    if (title_id === 1 && value >= 11000) {
      return 2;
    }
    return title_id;
  }

  static async addAlert(name, uid, price, notifyWhenAbove, active) {
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + uid)
                                 .once('value')
      let alerts = (!('alerts' in snap.val())) ? [] : snap.val().alerts;
      if (!(name in alerts)) {  
        // no alerts yet for this particular coin. Create an array and insert
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
    } catch (error) {
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
      alerts.forEach((obj, index) => obj.index = index);
      
      let alertRef = Firebase.app()
                            .database()
                            .ref('/users/' + uid + '/alerts/');

      if (alerts.length === 0) {
        alertRef.child(name).remove();
      } else {
        alertRef.update({
          [name]: alerts,
        });
      }
      return 0;
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      console.log(error);
    }
  }

  static async changePassword(user, newPass) {
    try {
      await user.updatePassword(newPass);
    } catch (error) {
      console.log(error);
    }
  }

  static updateUsername(uid, username) {
    if (username.length > 12) { return 0; }
    let userRef = Firebase.app()
                            .database()
                            .ref('/users/' + uid);
    let usernamesRef = Firebase.app()
                            .database()
                            .ref('/usersData/usernames/');
    userRef.update({
      username: username,
    })
    usernamesRef.update({
      [uid]: username,
    })
    return 1;
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

  static async isFriend(uid, friendUid) {
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/friends/' + uid + '/friendsList/')
                                 .once('value')
      if (!snap.val()) { return false; }
      return friendUid in  snap.val();
    } catch (error) {
      console.log(error);
    }
  }

  static async requesting(uid, friendUid) {
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/friends/' + friendUid + '/requestsList/')
                                 .once('value');
      if (!snap.val()) { return false; }
      return uid in snap.val();
    } catch (error) {
      console.log(error);
    }
  }

  static async addFriend(uid, friendUid) {
    try {
      const friendRef =  Firebase.app()
                                 .database()
                                 .ref('/friends/' + friendUid);
      const snap  =  await Firebase.app()
                                .database()
                                .ref('/friends/'+friendUid+'/requestsList/')
                                .once('value');
      let reqs = (snap.val()) ? snap.val() : {};
      reqs[uid] = 0;
      friendRef.update({
        requestsList: reqs,
      })
      return 0;
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteRequest(uid, friendUid) {
    try {
      const friendRef =  Firebase.app()
                                 .database()
                                 .ref('/friends/' + friendUid);
      const snap =  await Firebase.app()
                                  .database()
                                  .ref('/friends/' +friendUid+'/requestsList/')
                                  .once('value');
      if (snap.val() && (uid in snap.val())) {
        let reqs = snap.val();
        delete reqs[uid]
        friendRef.update({
          requestsList: reqs,
        })
        return 0;
      } else {
        return 1;
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteFriend(uid, friendUid) {
    try {
      let myFriends = await this.getFriends(uid);
      let friendsFriends = await this.getFriends(friendUid);
      if (friendUid in myFriends && uid in friendsFriends) {
        delete myFriends[friendUid];
        delete friendsFriends[uid];
        const myRef =  Firebase.app()
                                   .database()
                                   .ref('/friends/' + uid);
        const friendsRef =  Firebase.app()
                                   .database()
                                   .ref('/friends/' + friendUid);
        myRef.update({
          friendsList: myFriends,
        })
        friendsRef.update({
          friendsList: friendsFriends,
        })
        return 0;
      }
      return 1;
    } catch (error) {
      console.log(error);
    }
  }

  static async getRequests(uid) {
    try {
      const snap = await Firebase.app()
                            .database()
                            .ref('/friends/' + uid + '/requestsList/')
                            .once('value');
      return snap.val() ? snap.val() : {};
    } catch (error) {
      console.log(error);
    }
  }

  static async getFriends(uid) {
    try {
      const snap = await Firebase.app()
                            .database()
                            .ref('/friends/' + uid + '/friendsList/')
                            .once('value');
      return snap.val() ? snap.val() : {};
    } catch (error) {
      console.log(error);
    }
  }

  static async acceptRequest(uid, friendUid) {
    try {
      const mySnap = await Firebase.app()
                            .database()
                            .ref('/friends/' + uid + '/requestsList/')
                            .once('value');
      if (mySnap.val() && (friendUid in mySnap.val())) {
        const myRef =  Firebase.app()
                                   .database()
                                   .ref('/friends/' + uid);
        const friendsRef =  Firebase.app()
                                   .database()
                                   .ref('/friends/' + friendUid);
        const req = mySnap.val()[friendUid];
        let friendsfriends = await this.getFriends(friendUid);
        let reqs = await this.getRequests(uid);
        let friends = await this.getFriends(uid);
        delete reqs[friendUid];
        friends[friendUid] = 0;
        friendsfriends[uid] = 0;
        myRef.update({
          requestsList: reqs,
          friendsList: friends,
        })
        friendsRef.update({
          friendsList: friendsfriends,
        })
        return 0;
      }
      return 1;
    } catch (error) {
      console.log(error);
    }
  }

  static async rejectRequest(uid, friendUid) {
    try {
      let myRequests = await this.getRequests(uid);
      if (friendUid in myRequests) {
        delete myRequests[friendUid];
        const myRef =  Firebase.app()
                                   .database()
                                   .ref('/friends/' + uid);
        myRef.update({
          requestsList: myRequests,
        })
        return 0;
      }
      return 1;
    } catch (error) {
      console.log(error);
    }
  }

  static storePhoto(uid, url) {
      const userRef = Firebase.app()
                            .database()
                            .ref('/photos/' + uid);
      userRef.update({
        image: url
      })
      return 1;
  }

  static async getPhoto(uid) {
    const snap = await Firebase.app()
                          .database()
                          .ref('/photos/' + uid)
                          .once('value');
    return snap.val() ? snap.val().image : false;  
  }

  static removeFriend(uid, deletedUid) {
    // used when user deletes account and friend of user refreshes friends list
    const ref = Firebase.app()
                        .database()
                        .ref('/friends/' + uid)
    ref.child('friendsList').child(deletedUid).set(null);
    ref.child('requestsList').child(deletedUid).set(null);
  }

  static deleteAccount(uid) {
      Firebase.app()
              .database()
              .ref('/usersData/emails/')
              .child(uid)
              .set(null);
      Firebase.app()
              .database()
              .ref('/usersData/usernames/')
              .child(uid)
              .set(null);
      Firebase.app()
              .database()
              .ref('/users/')
              .child(uid)
              .set(null);
      Firebase.app()
              .database()
              .ref('/photos/')
              .child(uid)
              .set(null);
      Firebase.app()
              .database()
              .ref('/friends/')
              .child(uid)
              .set(null);
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

  static async uniqueUsername(uid, username) {
    try {
      const snap = await Firebase.app()
                              .database()
                              .ref('/usersData/usernames/')
                              .orderByValue()
                              .equalTo(username)
                              .once('value');
      let res = snap.val();
      return (!uid) ? (!res) 
                    : (!res) ? true
                             : (uid in res)
                                ? Object.keys(res).length === 1 
                                : Object.keys(res).length === 0
    } catch (error) {
      console.log(error);
    }
  }

  static async searchExact(query, isEmail) {
    //returns email if query exists
    try {
      let snap;
      const emailsRef = Firebase.app()
                              .database()
                              .ref('/usersData/emails/');
      if (isEmail) {
        snap = await emailsRef.orderByValue()
                                         .equalTo(query)
                                         .once("value");
      } else {
        const usernameRef = Firebase.app()
                                    .database()
                                    .ref('/usersData/usernames/');
        snap = await usernameRef.orderByValue()
                                          .equalTo(query)
                                          .once("value");
      }
      if (snap.val()) {
        const uid = Object.keys(snap.val())[0];
        const snap2 = await emailsRef.child(uid).once('value');
        return snap2.val() ? snap2.val() : false;
      }
      return snap.val() ? Object.keys(snap.val())[0] : false;
    } catch (error) {
      console.log(error);
    }
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
      return res;
    } catch (error) {
      console.log(error);
    }
  }

}
