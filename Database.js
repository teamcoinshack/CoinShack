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
