import React, { Component } from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Dimensions,   
} from 'react-native';
import db from '../Database.js';
import MyRow from '../components/MyRow.js';
import MyInput from '../components/MyInput.js';

const background = '#373b48';

export default class Sell extends Component {
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
      refreshing: false,
      callback: null,
    }

    this.sellOnPress = this.sellOnPress.bind(this);
    this.sellAll = this.sellAll.bind(this);
    this.resetState = this.resetState.bind(this);
    this.box1OnChangeText = this.box1OnChangeText.bind(this);
    this.box2OnChangeText = this.box2OnChangeText.bind(this);
  }

  async sellOnPress() {
    try {
      if (this.state.actualMoneySell <= 0) {
        alert("Invalid amount!");
        this.resetState();
        return;
      }
      this.setState({ refreshing: true });
      const res = await db.buy(
        this.state.uid,
        this.state.id,
        -this.state.actualMoneySell,
        this.state.rate,
      )
      if (res === 0) {
        this.state.callback();
        this.props.navigation.navigate('Main');
      }
      this.resetState();
    } catch (error) {
      console.log(error);
    }
  }

  resetState() {
    this.setState({ 
      refreshing: false,
      actualMoneySell: '',
      displayMoneySell: '',
      displayStockSell: '',
      input1: false,
      input2: false,
    });
  }

  async sellAll() {
    try {
      this.setState({ refreshing: true });
      const res = await db.sellAll(
        this.state.uid,
        this.state.id,
        this.state.rate,
      )
      if (res === 0) {
        this.state.callback();
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
    const stockValue = navigation.getParam('stockValue', null);
    const callback = navigation.getParam('callback', null);
    this.setState({
      callback: callback,
      uid: uid,
      cash: cash,
      id: id,
      rate: rate,
      stockValue: stockValue,
    });
  }

  box1OnChangeText(value) {
    Number(db.unStringify(value)) > 999999999999
      ? this.setState({
          state: this.state,
        })
      : this.setState({
          input1: String(value) !== '',
          input2: false,
          actualMoneySell: String(value) === ''
            ? '0'
            : db.unStringify(value),
          displayMoneySell: String(value) === ''
            ? '0.00'
            : db.stringify(db.unStringify(String(value))),
          displayStockSell: db.stringify(
            (Number(db.unStringify(String(value))) / this.state.rate).toFixed(5)
          ),
        })
  }

  box2OnChangeText(value) {
    Number(db.unStringify(value)) > 99999
      ? this.setState({
          state: this.state,
        })
      : this.setState({ 
          input1: false,
          input2: String(value) !== '',
          displayStockSell: String(value) === '' 
            ? '0.00000' 
            : db.stringify(db.unStringify(String(value))),
          actualMoneySell: Number(db.unStringify(String(value))*this.state.rate),
          displayMoneySell: db.stringify(
            (Number(db.unStringify(value))*this.state.rate).toFixed(2)
          ),
        })
  }

  render() {
    const loading = (
      <View style={styles.loading}>
        <View style={styles.loading1}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width * 0.7)}
            flexStart={true}
          />
        </View>
      </View>
    );

    const money = db.stringify(Number(this.state.cash).toFixed(2));

    const cashValue = (
      <Text style={this.state.cash === 0 
                    ? styles.noValue1 
                    : styles.cashValue}>
         ${money}
      </Text>
    );

    const walletValue = (
      <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
        <Text style={this.state.stockValue === 0 
                          ? styles.noValue1 
                          : styles.stockValue1}>
          ${db.stringify((this.state.stockValue * this.state.rate).toFixed(2))}
        </Text>
        <Text style={this.state.stockValue === 0 
                          ? styles.noValue2
                          : styles.stockValue2}>
          {db.stringify(Number(this.state.stockValue).toFixed(3))} {this.state.id}
        </Text>
      </View>
    );

    const button = (
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.sellOnPress}
        >
          <Text style={{ color: '#ff077a', fontSize: 20, fontWeight: '700',}}>
            Sell
          </Text>
        </TouchableOpacity>
      </View>
    );

    const sellAllButton = (
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.sellAll}
        >
          <Text style={{ color: '#ff077a', fontSize: 20, fontWeight: '700', }}>
            Sell All
          </Text>
        </TouchableOpacity>
      </View>
    );

    const inputs = (
      <View style={styles.inputs}>
        <MyInput
          leftText="$"
          placeholder={
            this.state.actualMoneySell === ''
              ? '0.00'
              : this.state.displayMoneySell
          }
          onChangeText={this.box1OnChangeText}
          value={
            !this.state.input1
              ? ''
              : this.state.displayMoneySell
          }
          keyboardType="numeric"
        />

        {button}

        <MyInput
          rightText={this.state.id}
          placeholder={
            this.state.displayStockSell === ''
              ? '0.000'
              : this.state.displayStockSell
          }
          onChangeText={this.box2OnChangeText}
          value={
            !this.state.input2
              ? '' 
              : this.state.displayStockSell
          }
          keyboardType="numeric"
          textAlign="right"
        />

        {sellAllButton}
      </View>
    );

    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={{
          backgroundColor: background,
        }}
      >
        <View style={styles.container}>
          <View style={{
            marginTop: 10,
            marginBottom: 40,
          }}>
            <MyRow
              text='Cash'
              isCash
              path={require('../assets/icons/cash.png')}
              right={cashValue}
            />
            <MyRow
              text={this.state.id}
              path={this.props.navigation.getParam('path', null)}
              right={walletValue}
            />
          </View>
          {this.state.refreshing ? loading : inputs}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: background,
  },
  loading: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: background,
  },
  buttonRow: {
    flex: 1,
    flexDirection: "row",
  },
  button: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  noValue1: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#74777c',
    fontWeight: '500',
  },
  noValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
    color: '#74777c',
    fontWeight: '500',
  },
  stockValue1: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#aeb3c4', 
    fontWeight: '600',
  },
  stockValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
    color: '#aeb3c4', 
    fontWeight: '600',
  },
  cashValue: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#aeb3c4', 
    fontWeight: '600',
  },
  inputs: {
    flex: 1,
    width: "75%",
    justifyContent: "center",
  }
});
