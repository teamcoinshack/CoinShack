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
      actualMoneySell: '',
      displayMoneySell: '',
      displayStockSell: '',
      input1: false,
      input2: false,
      rate: '', //rate is harcoded for now
    }

    this.sellOnPress = this.sellOnPress.bind(this);
    this.sellAll = this.sellAll.bind(this);
  }

  async sellOnPress() {
    try {
      const res = await db.buy(
        this.state.id,
        this.state.stock,
        -this.state.actualMoneySell,
        this.state.rate,
      )
      if (res !== 0) {
        this.props.navigation.navigate('Main');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sellAll() {
    try {
      await db.sellAll(
        this.state.id,
        this.state.stock,
        this.state.rate,
      )
      this.props.navigation.navigate('Main');
    } catch(error) {
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
        placeholder={ this.state.actualMoneySell === ''
                    ? '0.00'
                    : this.state.displayMoneySell} 
        onChangeText={value => Number(db.unStringify(value)) > 999999999999 
        ? this.setState({
            state: this.state,
        })
        : this.setState({ 
            input1: String(value) === '' ? false : true,
            input2: false,
            actualMoneySell: String(value) === '' 
              ? '0' 
              : db.unStringify(value),
            displayMoneySell: String(value) === '' 
              ? '0.00' 
              : db.stringify(db.unStringify(String(value))),
            displayStockSell:db.stringify(
              (Number(db.unStringify(String(value)))/this.state.rate).toFixed(5)
            ),
          })
        }
        value={!this.state.input1
          ? ''
          :this.state.displayMoneySell
        }
      />
    )
    const box2 = (
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType='numeric'
        placeholder= { this.state.displayStockSell === ''
                   ? '0.000'
                   : this.state.displayStockSell}
        onChangeText={value => Number(db.unStringify(value)) > 99999
        ? this.setState({
          state: this.state,
        })
        : this.setState({ 
            input1: false,
            input2: String(value) === '' ? false : true,
            displayStockSell: String(value) === '' 
              ? '0.00000' 
              : db.stringify(db.unStringify(String(value))),
            actualMoneySell: Number(db.unStringify(String(value))*this.state.rate),
            displayMoneySell: db.stringify(
              (Number(db.unStringify(value))*this.state.rate).toFixed(2)
            ),
          })
        }
        value={!this.state.input2
            ? '' 
            : this.state.displayStockSell
        }
      />
    )
    return (
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={this.state.input1 ? styles.selected : styles.unselected}>$</Text>
            {box1}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={this.sellOnPress}
              title="Sell"
              color='red'
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {box2}
            <Text style={this.state.input2 ? styles.selected : styles.unselected}>
              {this.state.stock}
            </Text>
          </View>
          <View>
            <Button
              onPress={this.sellAll}
              title="Sell All"
              color='red'
            />
          </View>
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
    width: '70%',
    borderColor: '#F5FCFF',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 30,
    alignItems: 'center',
  },
  selected: {
    color: '#000000',
    fontSize: 30,
  },
  unselected: {
    color: '#C7C7CD',
    fontSize: 30,
  },
});
