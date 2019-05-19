import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import * as Firebase from 'firebase';
import db from './Database.js';

export default class Loading extends React.Component {

  retrieveCash = (uid) => {
    Firebase.app()
          .database()
          .ref('/users/' + uid)
          .once('value')
          .then((snap) => {
            this.props.navigation.navigate('BuySellPage', {
              uid: uid,
              cash: '$' + db.stringify(snap.val().cash),
            })
          })
          .catch(function(error) { 
            alert('error in loading');  
          });
  }

  render() {
    const { navigation } = this.props;
    const uid = navigation.getParam('uid', '0');
    //retrieving cash from database
    this.retrieveCash(uid);
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
