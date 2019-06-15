import React, {Component} from 'react';
import {
  TextInput, 
  Text, 
  View, 
  StyleSheet, 
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';

import Graph from '../components/Graph.js';
import db from '../Database.js';
import Firebase from 'firebase';

const background = '#373b48';
export default class BuySellPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      cash: '',
      stock: '',
      stockValue: '',
      rate: '', //rate is harcoded for now
      isLoading: true,
    }

    this.goToBuy = this.goToBuy.bind(this);
    this.goToSell = this.goToSell.bind(this);
  }

  goToBuy() {
    this.props.navigation.navigate('Buy', {
      id: this.state.id,
      stock: this.state.stock,
      rate: this.state.rate,
      cash: this.state.cash,
    })
  }

  goToSell() {
    this.props.navigation.navigate('Sell', {
      id: this.state.id,
      stock: this.state.stock,
      rate: this.state.rate,
      cash: this.state.cash,
    })
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const id = navigation.getParam('id', null);
    const stock = navigation.getParam('stock', null);
    const rate = navigation.getParam('rate', null);
    try {
      const snap = await db.getData(id);
      this.setState({
        id: id,
        cash: snap.val().cash,
        stock: stock,
        stockValue: snap.val()[stock],
        rate: rate,
        isLoading: false,
      })
    } catch (error) {
      console.log(error);
    }
  }


  render() {
    const money = db.stringify(Number(this.state.cash).toFixed(2));
    const CashRow = (
      <TouchableOpacity 
        style={styles.cashRow}
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
            <Text style={this.state.cash === 0 
                          ? styles.noValue1 
                          : styles.cashValue}>
              {this.state.cash === undefined
               ? loading
               : '$' + money}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
    if (this.state.isLoading) {
      return (
        <View style={styles.container}></View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={{ paddingTop: 10}}>
        </View>
        {CashRow}
        <View style={{ paddingTop: 20}}>
        </View>
        <View>
          <Text style={styles.value1}>
            {this.state.stockValue === undefined
              ? '$0.00'
              : '$' + db.stringify(
                        parseFloat(this.state.stockValue * this.state.rate).toFixed(2)
                      )
            }
          </Text>
        </View>
        <Text style={styles.value2}>
          {this.state.stockValue === undefined 
           ? '0.000 ' + this.state.stock
           : parseFloat(this.state.stockValue).toFixed(3) + ' ' + this.state.stock}
        </Text>
        <Graph 
          stock={this.state.stock}
          height={300}
          width={400}
          tick={5}
          grid={false}
        />
        <View style={{ paddingTop: 50}}>
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
              <Text style={{ color: '#14ffb0', fontSize: 20, fontWeight: '700',}}>
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
  cashRow: {
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
  value1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  value2: {
    fontSize: 17,
    color: '#a8a8a8',
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
  }
});
