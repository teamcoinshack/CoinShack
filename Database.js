import Firebase from 'firebase';

export default class Database {
  static initUser(userID) {
    let userRef = Firebase.app()
                          .database()
                          .ref('/users/' + userID);
    userRef.set({
      cash: 1000000,
    });
  }

  static deductCash(uid, amt) {
    Firebase.app()
          .database()
          .ref('/users/' + uid)
          .once('value')
          .then(function(snap) {
            return snap.val().cash;
          })
          .then(function(x) {
            return x - amt;
          })
          .then(function(y) {
            Firebase.app()
                    .database()
                    .ref('/users/' + uid)
                    .set({
                      cash: y,
                    })
          });
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
