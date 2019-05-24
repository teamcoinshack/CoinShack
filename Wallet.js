import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, Button, TouchableHighlight} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Firebase from 'firebase';
import db from './Database.js';
import q from './Query.js';

export default class Wallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      cash: '',
      stocks: [
        {id: 'BTC'},
        {id: 'ETH'},
        {id: 'DASH'},
        {id: 'XRP'},
      ],
      totalValue: '',
    }

    this.renderRow = this.renderRow.bind(this); 
    this.load = this.load.bind(this);
  }
  
  load(id) {
    this.props.navigation.navigate('BuySellPage',{
      myWallet: this,
      uid: this.state.id,
      cash: this.state.cash,
      stock: id,
      rate: this.state
                .stocks
                .filter(x => x.id === id)[0]
                .rate,
    })
  }

  async componentDidMount() {
    const { navigation } = this.props;
    if (navigation.getParam('error', false)) {
      alert("Error in loading");
    }
    const uid = Firebase.auth().currentUser.uid;
    const rates = [
      {
        id: 'BTC',
        name: 'bitcoin',
        rate: '',
      },
      {
        id: 'ETH',
        name: 'ethereum',
        rate: '',
      },
      {
        id: 'DASH',
        name: 'dash',
        rate: '',
      },
      {
        id: 'XRP',
        name: 'ripple',
        rate: '',
      }
    ]
    rates.map(async function(stock) {
      try {
        stock.rate = await q.fetch(stock.name);
        return stock;
      } catch (error) {
        console.log(error);
      }
    })
    try {
      const snap = await Firebase.app()
                                 .database()
                                 .ref('/users/' + uid)
                                 .once('value')
      await this.setState({
              id: uid,
              cash: snap.val().cash,
              stocks: this.state.stocks
                          .map(item => ({
                            id: item.id,
                            rate: rates.filter(x => item.id === x.id)[0].rate,
                            value: snap.val()[item.id] === undefined
                                  ? 0 
                                  : Number(snap.val()[item.id]),
                          }))
      })

      await this.setState({
              totalValue: Number(this.state.cash) 
                          + this.state
                                .stocks
                                .map(x => x.value * x.rate)
                                .reduce((x, y) => x + y, 0)
            })
    } catch (error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    return (
      <TouchableHighlight 
        style={styles.row}
        onPress={() => this.load(item.id)}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.nameIcon}>
            <Text style={styles.name}>{item.id}</Text>
            <Text style={styles.rate}>${Number(item.rate).toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
            <Text style={item.value === 0 
                          ? styles.noValue1 
                          : styles.stockValue1}>
              ${db.stringify((item.value * item.rate).toFixed(2))}
            </Text>
            <Text style={item.value === 0 
                          ? styles.noValue2
                          : styles.stockValue2}>
              {db.stringify(Number(item.value).toFixed(3))} {item.id}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  
  render() {
    const money = db.stringify(Number(this.state.cash).toFixed(2));
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 30, textAlign: 'center'}}>My Wallet</Text>
        <Text style={{fontSize: 30, textAlign: 'center'}}>
          Total Assets: ${db.stringify(Number(this.state.totalValue).toFixed(2))}
        </Text>
        <Text style={{fontSize: 20, textAlign: 'center'}}>Cash: ${money}</Text>
        <FlatList
          style={styles.flatStyle}
          data={this.state.stocks}
          renderItem={this.renderRow}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#99c0ff',
    flex: 1,
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
  },
  nameIcon: {
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 20,
  },
  rate: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 17,
    color: '#4a4d51',
  },
  stockValue1: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
  },
  stockValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
  },
  flatStyle: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    marginTop: 14,
    alignSelf: "stretch",
  },
  buttonStyle: {
    fontSize: 30,
    justifyContent: 'flex-start',
  },
  noValue1: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#74777c',
  },
  noValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
    color: '#74777c',
  },
});
