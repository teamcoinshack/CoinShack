import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet, Button} from 'react-native';

import Graph from './Graph.js';
import db from './Database.js';
import Firebase from 'firebase';

export default class BuySellPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      cash: '',
      stock: '',
      stockValue: '',
      moneyBuy: '0',
      stockBuy: '0',
      moneySell: '0',
      stockSell: '0',
      rate: 0.000090, //rate is harcoded for now, to be extracted in loading page
    }

    this.buy = this.buy.bind(this);
    this.sellOnPress = this.sellOnPress.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      id: navigation.getParam('uid', this.state.user),
      cash: navigation.getParam('cash', 'Loading...'),
      stock: navigation.getParam('stock', 'Loading...'),
      stockValue: navigation.getParam('value', 'Loading...'),
    })
  }


  sellOnPress() {
    if (this.state.stockValue / this.state.rate >= this.state.moneySell) {
      this.setState({
        cash: db.buy(
          this.state.id, 
          this.state.stock,
          this.state.cash, 
          -this.state.moneySell,
          this.state.stockValue,
          this.state.rate
        ),
        stockValue: this.state.stockValue + (-this.state.moneySell * this.state.rate)
      })
    } else {
      alert("Not enough stocks!");
    }
  }

  buy() {
   this.props.navigation.navigate('Buy', {stock: this.state.stock});
  }

  sell() {
   this.props.navigation.navigate('Sell', {stock: this.state.stock});
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={()=> this.props.navigation.navigate('Main')}
          title="Return to My Wallet"
          color='brown'
        />
        <Text style={styles.cashText}>
          {'Cash: $' + db.stringify(Math.floor(this.state.cash))}
        </Text>
        <Text style={styles.cashText}>
          {parseFloat(this.state.stockValue).toFixed(3) + ' BTC'}
        </Text>
        <Graph />
        <View style={{flexDirection: 'row'}}>
          <Button
            onPress={this.buy}
            title="Buy"
            color='green'
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            onPress={this.sell}
            title="Sell"
            color="red"
          />
        </View>
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
    fontSize: 25,
    fontWeight: 'bold'
  },
  textInput: {
    height: 40,
    width: '30%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    textAlign: 'center',
  },
});
