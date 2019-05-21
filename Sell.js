import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet, Button, TouchableOpacity, Image} from 'react-native';

export default class Sell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: '',
      moneySell: '0',
      stockSell: '0',
      inputMoney: false,
      inputStock: false,
      rate: 0.000090,
    }

  }

  /*
  buyOnPress() {
    //harcoded rate of 1SGD = 0.000090 BTC
    if (this.state.cash >= this.state.moneyBuy) {
      this.setState({
        cash: db.buy(
          this.state.id, 
          this.state.stock,
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
      this.props.navigation.navigate('BuySellPage');
    } else {
      alert("Not enough money!");
    }
  }
  */

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({ stock: navigation.getParam('stock', 'null') });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <View style={styles.backButton}>
            <TouchableOpacity 
              activeOpacity={0.5}
              onPress={()=>this.props.navigation.goBack()}>
              <Image
                source={require('./icons/back_button.png')}
                style={{ width: 50, height: 50}} 
              />
            </TouchableOpacity>  
          </View>
        </View>
        <View style={styles.header}>
          <View style={styles.subheader}>
            <Text>SGD</Text>
          </View>
          <View style={styles.subheader}>
            <Text>{this.state.stock}</Text>
          </View>
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
            value={this.state.inputMoney ? this.state.moneySell : ''}
          />
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
            value={this.state.inputStock ? this.state.stockSell : ''}
          />
        </View>
        <View style={styles.keyboardRow}>
          <View style={{flex:1, backgroundColor: 'powderblue'}} />
          <View style={{flex:1 , backgroundColor: 'skyblue'}} />
          <View style={{flex:1 , backgroundColor: 'steelblue'}} />
        </View>
        <View style={styles.keyboardRow}>
          <View style={{flex:1, backgroundColor: 'skyblue'}} />
          <View style={{flex:1 , backgroundColor: 'steelblue'}} />
          <View style={{flex:1 , backgroundColor: 'powderblue'}} />
        </View>
        <View style={styles.keyboardRow}>
          <View style={{flex:1, backgroundColor: 'steelblue'}} />
          <View style={{flex:1 , backgroundColor: 'powderblue'}} />
          <View style={{flex:1 , backgroundColor: 'skyblue'}} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  keyboardRow: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
  },
  subheader: {
    flex:1,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backButton: {
    flex:1,
    width: 25,
    height: 25,
  },
  conversion: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    height: 40,
    width: '50%',
    borderWidth: 3,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 20,
    borderColor: 'green',
    borderRadius: 20,
  },
});
