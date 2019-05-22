import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import Firebase from 'firebase';
import db from './Database.js';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stock: '',
    }
  }


  retrieveAssets = (uid) => {
    Firebase.app()
          .database()
          .ref('/users/' + uid)
          .once('value')
          .then((snap) => {
            this.props.navigation.navigate('BuySellPage', {
              uid: uid,
              cash: snap.val().cash,
              stock: this.state.stock,
              value: snap.val()[this.state.stock],
            }) 
          })
          .catch((e) => { 
            this.props.navigation.navigate('Wallet', {error : true});
          });
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      //if previous page was BuySellPage, stock will not be null
      stock: navigation.getParam('name', null),
    })
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
