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
      moneyBuy: null,
      stockBuy: null,
      moneySell: null,
      stockSell: null,
      input1: false,
      input2: false,
      input3: false,
      input4: false,
      rate: '', //rate is harcoded for now
      isLoading: true,
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
                isLoading: false,
              })
            })
            .catch((e) => {
            });
  }

  buy(par, haveAccount) {
    if (!haveAccount) {
      return this.setState({ stockValue: 0 }, function() {
        this.buy(par, db.createAccount(this.state.id, this.state.stock))
      });
    }
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
        moneyBuy: null,
        stockBuy: null,
        moneySell: null,
        stockSell: null,
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
    this.buy(1, this.state.stockValue !== undefined);
  }

  sellOnPress() {
    this.buy(-1, this.state.stockValue !== undefined);
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }
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
          {this.state.stockValue === undefined 
           ? '0.000 ' + this.state.stock
           : parseFloat(this.state.stockValue).toFixed(3) + ' ' + this.state.stock}
        </Text>
        <Graph stock={this.state.stock} />
        <View style={styles.conversion}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType='numeric'
            placeholder={ this.state.moneyBuy === null 
                          ? '$0.00'
                          : '$' + parseFloat(this.state.moneyBuy).toFixed(2)} 
            onChangeText={value => this.setState({ 
              input1: String(value) === '' ? false : true,
              input2: false,
              input3: false,
              input4: false,
              moneyBuy: String(value) === '' ? '0' : String(value), 
              stockBuy: String(value / this.state.rate),
              moneySell: null,
              stockSell: null,
            })}
            value={
              !this.state.input1 || this.state.moneyBuy === null 
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
            placeholder= { this.state.stockBuy === null
                           ? '0.000 ' + this.state.stock
                           : parseFloat(this.state.stockBuy).toFixed(5) + ' ' + this.state.stock}
            onChangeText={value => this.setState({ 
              input1: false,
              input2: String(value) === '' ? false : true,
              input3: false,
              input4: false,
              inputMoney: false,
              stockBuy: String(value) === '' ? '0' : String(value), 
              moneyBuy: String(value * this.state.rate),
              moneySell: null,
              stockSell: null,
            })}
            value={
              !this.state.input2 || this.state.stockBuy === null 
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
            placeholder={ this.state.moneySell === null 
                          ? '$0.00'
                          : '$' + parseFloat(this.state.moneySell).toFixed(2)}
            onChangeText={value => this.setState({ 
              input1: false,
              input2: false,
              input3: String(value) === '' ? false : true,
              input4: false,
              moneyBuy: null,
              stockBuy: null,
              moneySell: String(value) === '' ? '0' : String(value), 
              stockSell: String(value / this.state.rate),
            })}
            value={
              !this.state.input3|| this.state.moneySell === null 
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
            placeholder= { this.state.stockSell === null
                           ? '0.000 ' + this.state.stock
                           : parseFloat(this.state.stockSell).toFixed(5) + ' ' + this.state.stock}
            onChangeText={value => this.setState({ 
              input1: false,
              input2: false,
              input3: false,
              input4: String(value) === '' ? false : true,
              moneyBuy: null,
              stockBuy: null,
              stockSell: String(value) === '' ? '0' : String(value), 
              moneySell: String(value * this.state.rate),
            })}
            value={
              !this.state.input4 || this.state.stockSell === null 
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
