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
      inputMoney: false,
      inputStock: false,
      rate: 0.000090, //rate is harcoded for now, to be extracted in loading page
    }

    this.buy = this.buy.bind(this);
    this.buyOnPress = this.buyOnPress.bind(this);
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

  buy(par) {
    //harcoded rate of 1SGD = 0.000090 BTC
    if ((par === 1 && this.state.cash >= this.state.moneyBuy) 
          || (par === -1 && this.state.stockValue >= this.state.stockSell)) {
      const val = par === 1 ? this.state.moneyBuy : par * this.state.moneySell;
      this.setState({
        cash: db.buy(
          this.state.id, 
          this.state.stock,
          this.state.cash, 
          val,
          this.state.stockValue,
          this.state.rate
        ),
        stockValue: this.state.stockValue + (val * this.state.rate),
        moneyBuy: '0',
        stockBuy: '0',
        moneySell: '0',
        stockSell: '0',
      })
    } else {
      if (par === 1) {
        alert("Not enough money!");
      } else { 
        alert("Not enough stocks!");
      }
    }
  }

  buyOnPress() {
    this.buy(1);
  }

  sellOnPress() {
    this.buy(-1);
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
        <View style={styles.conversion}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType='numeric'
            placeholder={ parseFloat(this.state.moneyBuy).toFixed(2) + ' SGD'}
            onChangeText={value => this.setState({ 
              inputMoney: String(value) === '' ? false : true,
              inputStock: false,
              moneyBuy: String(value) === '' ? '0' : String(value), 
              stockBuy: String(this.state.rate * value),
            })}
            value={
              !this.state.inputMoney || this.state.moneyBuy === '0' 
                ? '' : this.state.moneyBuy
            }
          />
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={this.buyOnPress}
              title="Buy"
              color='green'
            />
          </View>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType='numeric'
            placeholder= { parseFloat(this.state.stockBuy).toFixed(5) + ' BTC' }
            onChangeText={value => this.setState({ 
              inputStock: String(value) === '' ? false : true,
              inputMoney: false,
              stockBuy: String(value) === '' ? '0' : String(value), 
              moneyBuy: String(value / this.state.rate),
            })}
            value={
              !this.state.inputStock || this.state.stockBuy === '0' 
                ? '' : this.state.stockBuy
            }
          />
        </View>
        <View style={styles.conversion}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType='numeric'
            placeholder={ parseFloat(this.state.moneySell).toFixed(2) + ' SGD'}
            onChangeText={value => this.setState({ 
              inputMoney: String(value) === '' ? false : true,
              inputStock: false,
              moneySell: String(value) === '' ? '0' : String(value), 
              stockSell: String(this.state.rate * value),
            })}
            value={
              !this.state.inputMoney || this.state.moneySell === '0' 
                ? '' : this.state.moneySell
            }
          />
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={this.sellOnPress}
              title="Sell"
              color="red"
            />
          </View>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType='numeric'
            placeholder= { parseFloat(this.state.stockSell).toFixed(5) + ' BTC' }
            onChangeText={value => this.setState({ 
              inputStock: String(value) === '' ? false : true,
              inputMoney: false,
              stockSell: String(value) === '' ? '0' : String(value), 
              moneySell: String(value / this.state.rate),
            })}
            value={
              !this.state.inputStock || this.state.stockSell === '0' 
                ? '' : this.state.stockSell
            }
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
  conversion: {
    flexDirection: 'row',
  }
});
