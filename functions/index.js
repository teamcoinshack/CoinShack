const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


/*
  LIST OF ALL BADGES
  have1friend,
  have5friends,
  have10friends,
  have50friends,
  spent10000atOnce,
  spent100000atOnce,
  earned10000atOnce,
  earned100000atOnce,
  own5coins
*/

// listener for friendsList
exports.friendsBadges = functions.database.ref('/friends/{uid}/friendsList')
  .onWrite((change, context) => {
    // Exit when the data is deleted.
    if (!change.after.exists()) {
      return null;
    }

    // Exit if user has already achieved the top tier friends badge,
    // i.e., the user has already reached having 50 friends previously
    if (Object.keys(change.before.val()).length > 50) {
      return null;
    }

    const updatedFriendsList = change.after.val();
    const numFriends = Object.keys(updatedFriendsList).length;

    if (numFriends >= 50) {
      return change.after.ref.parent.parent.parent
        .child(`users/${context.params.uid}/badges`)
        .update({
          have50friends: true
        });
    } else if (numFriends >= 10) {
      return change.after.ref.parent.parent.parent
        .child(`users/${context.params.uid}/badges`)
        .update({
          have10friends: true
        });
    } else if (numFriends >= 5) {
      return change.after.ref.parent.parent.parent
        .child(`users/${context.params.uid}/badges`)
        .update({
          have5friends: true
        });
    } else if (numFriends >= 1) {
      return change.after.ref.parent.parent.parent
        .child(`users/${context.params.uid}/badges`)
        .update({
          have1friend: true
        });
    }

    return null;
  });

// listener for cash
exports.cashChangeBadges = functions.database.ref('/users/{uid}/cash')
  .onUpdate(change => {
    const beforeVal = change.before.val();
    const afterVal = change.after.val();

    if (beforeVal > afterVal) { // user buys
      let spent = beforeVal - afterVal;
      if (spent >= 100000) {
        return change.after.ref.parent
          .child('badges')
          .update({
            spent100000atOnce: true
          });
      } else if (spent >= 10000) {
        return change.after.ref.parent
          .child('badges')
          .update({
            spent10000atOnce: true
          });
      }
    } else { // user sells
      let earned = afterVal - beforeVal;
      if (earned >= 100000) {
        return change.after.ref.parent
          .child('badges')
          .update({
            earned100000atOnce: true
          });
      } else if (earned >= 10000) {
        return change.after.ref.parent
          .child('badges')
          .update({
            earned10000atOnce: true
          });
      }
    }

    return null;
  });

// listener for wallet
exports.ownCoinsBadge = functions.database.ref('/users/{uid}/wallet')
  .onUpdate(change => {
    const updatedWallet = change.after.val();
    const numCoins = Object.keys(updatedWallet).length;

    if (numCoins < 5) {
      return null;
    }

    let userHasAllCoins = true;
    for (let coin in updatedWallet) {
      if (!userHasAllCoins) {
        break
      }

      if (updatedWallet[coin] < 0.001) {
        userHasAllCoins = false;
      }
    }

    if (userHasAllCoins) {
      return change.after.ref.parent
        .child('badges')
        .update({
          own5coins: true
        });
    }

    return null;
  });
