import Firebase from 'firebase';

export default class Database {
  static initUser(userID) {
    let userRef = Firebase.app()
                           .database()
                           .ref('users/' + userID);
    userRef.set({
      cash: 1000000,
    });
  }

  //in progress
  static getCash(userID) {
    var amt;
    Firebase.app()
            .database()
            .ref('users/' + userID)
            .once('value')
            .then(function(snapshot) {
              amt = snapshot.val().cash
            })

    return amt;
  }

}
