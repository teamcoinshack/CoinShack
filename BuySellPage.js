import React, {Component} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';

import Graph from './Graph.js';
import db from './Database.js';
import Firebase from 'firebase';

export default class BuySellPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      cash: '',
      init: true,
    }

    this.buyOnPress = this.buyOnPress.bind(this);
    this.sellOnPress = this.sellOnPress.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (this.state.init) {
      this.setState({
        id: navigation.getParam('uid', this.state.user),
        cash: navigation.getParam('cash', 'Loading...'),
        init: false,
      })
    }
  }

  testVal = 10; // hard-coded for testing

  buyOnPress() {
    db.deductCash(this.state.id, this.testVal);
    const localID = this.state.id;
    this.props.navigation.navigate('Loading', {
      uid: localID
    });
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

  initialise = (id, cash) => {
    this.setState({
      id: id,
      cash: cash,
      init: false
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.cashText}>
          {'Cash: ' + this.state.cash}
        </Text>
        <Text style={styles.cashText}>
          {'Value in stocks: 0'}
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
