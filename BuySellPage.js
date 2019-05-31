import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet, Button} from 'react-native';

import Graph from './Graph.js';
import db from './Database.js';
import Firebase from 'firebase';

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
        cash: navigation.getParam('cash', 'Loading...'),
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
    if (this.state.isLoading) {
      return null;
    }
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', flex: 0, justifyContent: 'flex-start'}}>
        </View>
        <Text style={styles.value1}>
          {this.state.stockValue === undefined
            ? '$0.00'
            : '$' + db.stringify(
                      parseFloat(this.state.stockValue * this.state.rate).toFixed(2)
                    )
          }
        </Text>
        <Text style={styles.value2}>
          {this.state.stockValue === undefined 
           ? '0.000 ' + this.state.stock
           : parseFloat(this.state.stockValue).toFixed(3) + ' ' + this.state.stock}
        </Text>
        <Graph stock={this.state.stock} />
        <Text style={styles.cashText}>
          {'Cash: $' + db.stringify(Number(this.state.cash).toFixed(2))}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Button
            onPress={this.goToBuy}
            title="Buy"
            color='green'
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            onPress={this.goToSell}
            title="Sell"
            color='red'
          />
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
    backgroundColor: '#F5FCFF'
  },
  cashText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  value1: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  value2: {
    fontSize: 17,
    color: 'gray',
  },
});
