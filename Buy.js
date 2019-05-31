import React from 'react';
import {TextInput, Text, View, StyleSheet, Button} from 'react-native';
import db from './Database.js';

export default class Buy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      cash: '',
      stock: '',
      moneyBuy: '',
      stockBuy: '',
      input1: false,
      input2: false,
      rate: '', //rate is harcoded for now
    }

    this.buyOnPress = this.buyOnPress.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.formatStock = this.formatStock.bind(this);
  }

  async buyOnPress() {
    try {
      await db.buy(
        this.state.id,
        this.state.stock,
        this.state.moneyBuy,
        this.state.rate,
      )
      this.props.navigation.navigate('Main');
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const id = navigation.getParam('id', null);
    const stock = navigation.getParam('stock', null);
    const rate = navigation.getParam('rate', null);
    const cash = navigation.getParam('cash', null);
    this.setState({
      id: id,
      cash: cash,
      stock: stock,
      rate: rate,
    })
  }

  formatMoney(money) {
    if (money === '$' || money === '') {
      return '';
    }
    let res = '';
    if (this.state.moneyBuy.charAt(0) !== '$') {
      res += '$';
    }
    if (this.state.moneyBuy.charAt(0) === '.') {
      res += '0';
    }
    return res += money;
  }

  formatStock(stock) {
    const symbol = ' ' + this.state.stock;
    if (stock === symbol || stock === '') {
      return '';
    }
    let res = '';
    if (this.state.stockBuy.charAt(0) === '.') {
      res += '0';
    }
    res += stock;
    if (!this.state.stockBuy.includes(symbol)) {
      res += symbol;
    }
    return res;
  }

  render() {
    const box1 = (
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType='numeric'
        placeholder={ this.state.moneyBuy === ''
                    ? '$0.00'
                    : '$' + parseFloat(this.state.moneyBuy).toFixed(2)} 
        onChangeText={value => this.setState({ 
          input1: String(value) === '' ? false : true,
          input2: false,
          moneyBuy: String(value) === '' 
            ? '0' 
            : String(value).charAt(0) === '$' 
                ? String(value).substring(1, value.length)
                : String(value),
          stockBuy: Number(String(value).substring(1, value.length)) / this.state.rate,
        })}
        value={!this.state.input1 || this.state.moneyBuy === ''
          ? ''
          : this.formatMoney(this.state.moneyBuy)
        }
      />
    )
    const symbol = ' ' + this.state.stock;
    const box2 = (
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType='numeric'
        placeholder= { this.state.stockBuy === ''
                   ? '0.000 ' + this.state.stock
                   : parseFloat(this.state.stockBuy).toFixed(5) + symbol}
        onChangeText={value => this.setState({ 
          input1: false,
          input2: String(value) === '' ? false : true,
          stockBuy: String(value) === '' 
            ? '0' 
            : String(value).includes(symbol)
              ? String(value).substring(0, value.length - symbol.length)
              : String(value),
          moneyBuy: Number(String(value).substring(0, value.length - symbol.length))*this.state.rate,
        })}
        value={!this.state.input2 || this.state.stockBuy === '' 
            ? '' 
            : this.formatStock(this.state.stockBuy)
        }
      />
    )
    return (
        <View style={styles.container}>
          {box1}
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={this.buyOnPress}
              title="Buy"
              color='green'
              style={{ fontSize: 40 }}
            />
          </View>
          {box2}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  textInput: {
    height: 40,
    width: '100%',
    borderColor: '#F5FCFF',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 40,
  },
});
