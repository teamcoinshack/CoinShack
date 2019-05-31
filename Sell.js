import React from 'react';
import {TextInput, Text, View, StyleSheet, Button} from 'react-native';
import db from './Database.js';

export default class Sell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      cash: '',
      stock: '',
      moneySell: null,
      stockSell: null,
      input1: false,
      input2: false,
      rate: '', //rate is harcoded for now
    }

    this.sellOnPress = this.sellOnPress.bind(this);
  }

  async sellOnPress() {
    try {
      await db.buy(
        this.state.id,
        this.state.stock,
        -this.state.moneySell,
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

  render() {
    const box1 = (
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType='numeric'
        placeholder={ this.state.moneySell === null 
                    ? '$0.00'
                    : '$' + parseFloat(this.state.moneySell).toFixed(2)} 
        onChangeText={value => this.setState({ 
          input1: String(value) === '' ? false : true,
          input2: false,
          moneySell: String(value) === '' ? '0' : String(value), 
          stockSell: String(value / this.state.rate),
        })}
        value={!this.state.input1 || this.state.moneySell === null 
                ? '' 
                : this.state.moneySell.charAt(0) === '.'
                  ? '0' + this.state.moneySell
                  : this.state.moneySell
        }
      />
    )
    const box2 = (
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType='numeric'
        placeholder= { this.state.stockSell === null
                   ? '0.000 ' + this.state.stock
                   : parseFloat(this.state.stockSell).toFixed(5) + ' ' + this.state.stock}
        onChangeText={value => this.setState({ 
          input1: false,
          input2: String(value) === '' ? false : true,
          stockSell: String(value) === '' ? '0' : String(value), 
          moneySell: String(value * this.state.rate),
        })}
        value={!this.state.input2 || this.state.stockSell === null 
            ? '' 
            : this.state.stockSell.charAt(0) === '.' 
              ? '0' + this.state.stockSell
              : this.state.stockSell
        }
      />
    )
    return (
        <View style={styles.container}>
          {box1}
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={this.sellOnPress}
              title="Sell"
              color='red'
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
    width: '30%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    textAlign: 'center',
  },
});
