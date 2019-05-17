import React, {Component} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';

import Graph from './Graph.js';
import db from './Database.js';
import Firebase from 'firebase';

export default class BuySellPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      cash: 0,
    }

    this.buyOnPress = this.buyOnPress.bind(this);
    this.sellOnPress = this.sellOnPress.bind(this);
    this.logout = this.logout.bind(this);
  }

  testVal = 10; // hard-coded for testing

  buyOnPress() {
    this.setState({cash: this.state.cash + this.testVal});
  }

  sellOnPress() {
    this.setState({cash: this.state.cash - this.testVal});
  }

  logout() {
    Firebase.auth()
            .signOut()
            .then(() => (this.props.navigation.navigate('Login')))
            .catch(function(error) {
              alert(error.code);
            })
  }


  render() {
    const { navigation } = this.props;
    const uid = navigation.getParam('uid', 'NO_ID');
    const cash = stringify('1000000');
    //const cash = stringify(db.getCash(uid));
    return (
      <View style={styles.container}>
        <Text style={styles.cashText}>
          {"$" + cash}
        </Text>
        <Graph />
        <Button
          onPress={this.buyOnPress}
          title="Buy"
          color='green'
        />
        <Button
          onPress={this.sellOnPress}
          title="Sell"
          color="red"
        />
        <Button
          onPress={this.logout}
          title="Logout"
        />
      </View>
    );
  }
}

function stringify(num) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  }
});
