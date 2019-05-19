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
}
