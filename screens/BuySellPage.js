import React, {Component} from 'react';
import {
  TextInput, 
  Text, 
  View, 
  ScrollView,
  ActivityIndicator, 
  StyleSheet, 
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';

import Graph from '../components/Graph.js';
import db from '../Database.js';
import q from '../Query.js';
import Firebase from 'firebase';

const background = '#373b48';
export default class BuySellPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      uid: null,
      cash: null,
      change: null,
      id: null,
      stockValue: null,
      rate: null,
      isLoading: true,
    }

    this.goToBuy = this.goToBuy.bind(this);
    this.goToSell = this.goToSell.bind(this);
  }

  goToBuy() {
    this.props.navigation.navigate('Buy', {
      uid: this.state.uid,
      id: this.state.id,
      rate: this.state.rate,
      cash: this.state.cash,
    })
  }

  goToSell() {
    this.props.navigation.navigate('Sell', {
      uid: this.state.uid,
      id: this.state.id,
      rate: this.state.rate,
      cash: this.state.cash,
    })
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const uid = navigation.getParam('uid', null);
      const name = navigation.getParam('name', null);
      const path = navigation.getParam('path', null);
      const data = await q.fetch(name);
      const rate = Number(data.market_data.current_price.usd).toFixed(2);
      const snap = await db.getData(uid);
      const change = Number(data.market_data.price_change_percentage_24h).toFixed(2);
      const id = data.symbol.toUpperCase();
      const amt = snap.val()[id] === undefined ? 0 : snap.val()[id];
      this.setState({
        uid: uid,
        cash: snap.val().cash,
        change: change,
        id: id,
        name: name,
        stockValue: amt,
        rate: rate,
        isLoading: false,
        path: path,
      })
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const loading = (
      <View style={styles.loading1}>
        <ActivityIndicator color="#ffffff" />
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

    const cashRow = (
      <TouchableOpacity 
        style={styles.row}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/icons/cash.png')}
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.cashName}>
            <Text style={styles.name}>Cash</Text>
          </View>
          <View style={{ 
            flexDirection: 'column', 
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
            {this.state.cash === undefined
              ? loading
              : cashValue}
          </View>
        </View>
      </TouchableOpacity>
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
    
    const currRow = (
      <TouchableOpacity 
        style={styles.row}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imageContainer}>
            <Image
              source={this.state.path}
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.cashName}>
            <Text style={styles.name}>{this.state.id}</Text>
          </View>
          <View style={{ 
            flexDirection: 'column', 
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
            {this.state.cash === undefined
              ? loading
              : walletValue}
          </View>
        </View>
      </TouchableOpacity>
    );

    if (this.state.isLoading) {
      return (
        <View style={styles.container}></View>
      );
    }

    const change = (
      <Text style={this.state.change > 0 ? styles.up : styles.down}>
        {this.state.change > 0 
          ? ' +' + this.state.change + '% in the past 24h'
          : ' ' + this.state.change + '% in the past 24h'}
      </Text>
    );

    return (
      <ScrollView style={{
        backgroundColor: background,
      }}>
        <View style={styles.container}>
          <View style={{ paddingTop: 10}}>
          </View>
          {cashRow}
          {currRow}
          <View style={{ paddingTop: 20}}>
          </View>
          <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#ffffff',
              }}>
                $
              </Text>
              <Text style={styles.value1}>
                {db.stringify(this.state.rate)}
              </Text>
            </View>
            {change}
          </View>
          <Graph 
            name={this.state.name}
            height={250}
            width={400}
            tick={5}
            grid={false}
            days={30}
          />
          <View style={{ paddingTop: 20}}>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.buttonRow}
              onPress={this.goToBuy}
            >
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center',
              }}>
                <Text style={{ color: '#14ff81', fontSize: 20, fontWeight: '700',}}>
                  Buy
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.buttonRow}
              onPress={this.goToSell}
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
          </View>
          <View style={{ paddingTop: 40}}>
          </View>
        </View>
      </ScrollView>
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
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
    height: 60,
  },
  cashText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
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
  value1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  value2: {
    fontSize: 17,
    color: '#a8a8a8',
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
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  cashValue: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#aeb3c4', 
    fontWeight: '600',
  },
  cashName: {
    paddingLeft: 18,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 20,
    color: '#dbdbdb', 
    fontWeight: '600',
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
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  up: {
    fontSize: 17,
    color: '#7aef82',
  },
  down: {
    fontSize: 17,
    color: '#ed4444',
  },
});
