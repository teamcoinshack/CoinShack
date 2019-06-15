import React from 'react';
import {
  TextInput, 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Button,
} from 'react-native';
import db from '../Database.js';

const background = '#373b48';
export default class Buy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      cash: '',
      stock: '',
      actualMoneyBuy: '',
      displayMoneyBuy: '',
      displayStockBuy: '',
      input1: false,
      input2: false,
      rate: '', //rate is harcoded for now
    }

    this.buyOnPress = this.buyOnPress.bind(this);
  }

  async buyOnPress() {
    try {
      if (this.state.actualMoneyBuy < 1) {
        alert("Minimum purchase is $1");
        return;
      }
      const res = await db.buy(
        this.state.id,
        this.state.stock,
        this.state.actualMoneyBuy,
        this.state.rate,
      )
      if (res !== 0) {
        this.props.navigation.navigate('Main');
      }
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
        placeholderTextColor='#919191'
        placeholder={ this.state.actualMoneyBuy === ''
                    ? '0.00'
                    : this.state.displayMoneyBuy} 
        onChangeText={value => Number(db.unStringify(value)) > 999999999999 
        ? this.setState({
            state: this.state,
        })
        : this.setState({ 
            input1: String(value) === '' ? false : true,
            input2: false,
            actualMoneyBuy: String(value) === '' 
              ? '0' 
              : db.unStringify(value),
            displayMoneyBuy: String(value) === '' 
              ? '0.00' 
              : db.stringify(db.unStringify(String(value))),
            displayStockBuy:db.stringify(
              (Number(db.unStringify(String(value)))/this.state.rate).toFixed(5)
            ),
          })
        }
        value={!this.state.input1
          ? ''
          :this.state.displayMoneyBuy
        }
      />
    )
    const box2 = (
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType='numeric'
        placeholderTextColor='#919191'
        placeholder= { this.state.displayStockBuy === ''
                   ? '0.000'
                   : this.state.displayStockBuy}
        onChangeText={value => Number(db.unStringify(value)) > 99999
        ? this.setState({
          state: this.state,
        })
        : this.setState({ 
            input1: false,
            input2: String(value) === '' ? false : true,
            displayStockBuy: String(value) === '' 
              ? '0.00000' 
              : db.stringify(db.unStringify(String(value))),
            actualMoneyBuy: Number(db.unStringify(String(value))*this.state.rate),
            displayMoneyBuy: db.stringify(
              (Number(db.unStringify(value))*this.state.rate).toFixed(2)
            ),
          })
        }
        value={!this.state.input2
            ? '' 
            : this.state.displayStockBuy
        }
      />
    )
    const button = (
      <TouchableOpacity
            style={styles.buttonRow}
            onPress={this.buyOnPress}
          >
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center',
            }}>
              <Text style={{ color: '#14ffb0', fontSize: 20, fontWeight: '700',}}>
                Buy
              </Text>
            </View>
          </TouchableOpacity>
    )
    return (
        <View style={styles.container}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'flex-end', 
            justifyContent: 'center',
            width: '80%',
          }}>
            <Text style={this.state.input1 ? styles.selected : styles.unselected}>$</Text>
            {box1}
          </View>
          <View style={{flexDirection: 'row'}}>
            {button}
          </View>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'flex-end', 
          }}>
            {box2}
            <Text style={this.state.input2 ? styles.selected : styles.unselected}>
              {this.state.stock}
            </Text>
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
    backgroundColor: background,
  },
  textInput: {
    width: 250,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 30,
    alignItems: 'center',
    color: '#ffffff',
  },
  selected: {
    color: '#ffffff',
    fontSize: 30,
  },
  unselected: {
    color: '#919191',
    fontSize: 30,
  },
  buttonRow: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10,
  }
});
