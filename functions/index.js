const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


// if more than 1 friend have badge
exports.badgeTest = functions.database.ref('/friends/{uid}/friendsList')
  .onWrite((change, context) => {
    // Exit when the data is deleted.
    if (!change.after.exists()) {
      return null;
    }

    const updatedFriendsList = change.after.val();

    if (Object.keys(updatedFriendsList).length >= 1) {
      return change.after.ref.parent.parent.parent
        .child(`users/${context.params.uid}/badges`)
        .update({
          have1friend: true
        })
    }

    return null;
  });
