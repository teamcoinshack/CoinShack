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

    this.buyOnPress = this.buyOnPress.bind(this);
    this.sellOnPress = this.sellOnPress.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      id: navigation.getParam('uid', this.state.user),
      cash: navigation.getParam('cash', 'Loading...'),
      stock: navigation.getParam('BTC', 'Loading...'),
      stockValue: navigation.getParam('value', 'Loading...'),
    })
  }

  buyOnPress() {
    //harcoded rate of 1SGD = 0.000090 BTC
    if (this.state.cash >= this.state.moneyBuy) {
      this.setState({
        cash: db.buy(
          this.state.id, 
          this.state.stock === 'BTC' ? 1 : 0,
          this.state.cash, 
          this.state.moneyBuy,
          this.state.stockValue,
          this.state.rate
        ),
        stockValue: this.state.stockValue + (this.state.moneyBuy * this.state.rate),
        moneyBuy: 0,
        stockBuy: 0,
        moneySell: 0,
        stockSell: 0,
      })
    } else {
      alert("Not enough money!");
    }
  }

  sellOnPress() {
    if (this.state.stockValue / this.state.rate >= this.state.moneySell) {
      this.setState({
        cash: db.buy(
          this.state.id, 
          this.state.stock === 'BTC' ? 1 : 0,
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
            onPress={this.buyOnPress}
            title="Buy"
            color='green'
          />
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType='numeric'
            placeholder={ this.state.moneyBuy + ' SGD'}
            onChangeText={value => this.setState({ 
              moneyBuy: String(value), 
              stockBuy: String(this.state.rate * value)
            })}
            value={this.state.moneyBuy}
          />
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType='numeric'
            placeholder= { this.state.stockBuy + ' BTC' }
            onChangeText={value => this.setState({ 
              stockBuy: String(value), 
              moneyBuy: String(value / this.state.rate),
            })}
            value={this.state.stockBuy}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            onPress={this.sellOnPress}
            title="Sell"
            color="red"
          />
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType='numeric'
            placeholder={ this.state.moneySell + ' SGD' }
            onChangeText={value => this.setState({ 
              moneySell: String(value), 
              stockSell: String(this.state.rate * value)
            })}
            value={this.state.moneySell}
          />
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType='numeric'
            placeholder= { this.state.stockSell + ' BTC' }
            onChangeText={value => this.setState({ 
              stockSell: String(value), 
              moneySell: String(value / this.state.rate),
            })}
            value={this.state.stockSell}
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
