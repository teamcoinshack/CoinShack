import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet, Button} from 'react-native';

import Graph from './Graph.js';
import db from './Database.js';
import Firebase from 'firebase';

export default class BuySellPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wallet: {},
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
      rate: '', //rate is harcoded for now
    }

    this.buy = this.buy.bind(this);
    this.buyOnPress = this.buyOnPress.bind(this);
    this.sellOnPress = this.sellOnPress.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const myWallet = navigation.getParam('myWallet', null);
    const thisWallet = myWallet === null ? this.state.wallet : myWallet;
    const uid = navigation.getParam('uid', null);
    const stock = navigation.getParam('stock', null);
    const rate = navigation.getParam('rate', null);
    Firebase.app()
            .database()
            .ref('/users/' + uid)
            .once('value')
            .then((snap) => {
              this.setState({
                wallet: thisWallet,
                id: uid, 
                cash: navigation.getParam('cash', 'Loading...'),
                stock: stock,
                stockValue: snap.val()[stock],
                rate: rate,
              })
            })
            .catch((e) => {
            });
  }

  buy(par) {
    //harcoded rate of 1SGD = 0.000090 BTC
    if ((par === 1 && this.state.cash >= this.state.moneyBuy) 
          || (par === -1 && this.state.stockValue >= this.state.stockSell)) {
      const val = par === 1 ? this.state.moneyBuy : par * this.state.moneySell;
      const remainingCash = db.buy(
                              this.state.id, 
                              this.state.stock,
                              this.state.cash, 
                              val,
                              this.state.stockValue,
                              this.state.rate
                            );

      this.state.wallet.setState({
        cash: remainingCash,
        stocks: this.state
                    .wallet
                    .state
                    .stocks
                    .map(x => { 
                      if (x.name === this.state.stock) {
                        x.value = this.state.stockValue + (val / this.state.rate);
                        return x;
                      }
                      return x;
                    })
      })
      this.setState({
        cash: db.buy(
          this.state.id, 
          this.state.stock,
          this.state.cash, 
          val,
          this.state.stockValue,
          this.state.rate
        ),
        stockValue: this.state.stockValue + (val / this.state.rate),
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
          {'Cash: $' + db.stringify(Number(this.state.cash).toFixed(2))}
        </Text>
        <Text style={styles.cashText}>
          {parseFloat(this.state.stockValue).toFixed(3) + ' ' + this.state.stock}
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
              stockBuy: String(value / this.state.rate),
            })}
            value={
              !this.state.inputMoney || this.state.moneyBuy === '0' 
                ? '' 
                : this.state.moneyBuy.charAt(0) === '.'
                  ? '0' + this.state.moneyBuy
                  : this.state.moneyBuy
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
              moneyBuy: String(value * this.state.rate),
            })}
            value={
              !this.state.inputStock || this.state.stockBuy === '0' 
                ? '' 
                : this.state.stockBuy.charAt(0) === '.' 
                  ? '0' + this.state.stockBuy
                  : this.state.stockBuy
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
              stockSell: String(value / this.state.rate),
            })}
            value={
              !this.state.inputMoney || this.state.moneySell === '0' 
                ? '' 
                : this.state.moneySell.charAt(0) === ','
                  ? '0' + this.state.moneySell
                  : this.state.moneySell
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
              moneySell: String(value * this.state.rate),
            })}
            value={
              !this.state.inputStock || this.state.stockSell === '0' 
                ? '' 
                : this.state.stockSell.charAt(0) === '.'
                  ? '0' + this.state.stockSell
                  : this.state.stockSell
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
