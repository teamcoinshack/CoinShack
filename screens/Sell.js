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

export default class Sell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      cash: null,
      id: null,
      rate: null,
      actualMoneySell: '',
      displayMoneySell: '',
      displayStockSell: '',
      input1: false,
      input2: false,
    }

    this.sellOnPress = this.sellOnPress.bind(this);
    this.sellAll = this.sellAll.bind(this);
  }

  async sellOnPress() {
    try {
      const res = await db.buy(
        this.state.uid,
        this.state.id,
        -this.state.actualMoneySell,
        this.state.rate,
      )
      if (res === 0) {
        this.props.navigation.navigate('Main');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sellAll() {
    try {
      const res = await db.sellAll(
        this.state.uid,
        this.state.id,
        this.state.rate,
      )
      if (res === 0) {
        this.props.navigation.navigate('Main');
      }
    } catch(error) {
      console.log(error);
    }
  }


  componentDidMount() {
    const { navigation } = this.props;
    const uid = navigation.getParam('uid', null);
    const id = navigation.getParam('id', null);
    const rate = navigation.getParam('rate', null);
    const cash = navigation.getParam('cash', null);
    this.setState({
      uid: uid,
      cash: cash,
      id: id,
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
    );

    const box2 = (
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType='numeric'
        placeholderTextColor='#919191'
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
    );

    const button = (
      <TouchableOpacity
            style={styles.buttonRow}
            onPress={this.sellOnPress}
          >
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center',
            }}>
              <Text style={{ color: '#ff077a', fontSize: 20, fontWeight: '700',}}>
                Sell
              </Text>
            </View>
          </TouchableOpacity>
    );

    const sellAllButton = (
      <TouchableOpacity
        style={styles.buttonRow}
        onPress={this.sellAll}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Text style={{ color: '#ff077a', fontSize: 20, fontWeight: '700', }}>
            Sell All
          </Text>
        </View>
      </TouchableOpacity>
    );

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
              {this.state.id}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {sellAllButton}
          </View>
        </View>
    );
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
