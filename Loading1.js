import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import Firebase from 'firebase';
import db from './Database.js';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }


  retrieveAssets = (uid) => {
    Firebase.app()
          .database()
          .ref('/users/' + uid)
          .once('value')
          .then((snap) => {
            this.props.navigation.navigate('Dashboard')
          })
          .catch((e) => { 
            this.props.navigation.navigate('Wallet', {error : true});
          });
  }

  render() {
    //retrieving cash from database
    this.retrieveAssets(Firebase.auth().currentUser.uid);
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Loading</Text>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
})
