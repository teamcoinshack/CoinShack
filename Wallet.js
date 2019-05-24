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
        {name: 'BTC'},
        {name: 'ETH'},
        {name: 'DASH'},
        {name: 'XRP'},
      ],
    }

    this.renderRow = this.renderRow.bind(this); 
  }
  
  load = (name) => {
    this.props.navigation.navigate('BuySellPage',{
      myWallet: this,
      uid: this.state.id,
      cash: this.state.cash,
      stock: name,
      rate: this.state
                .stocks
                .filter(x => x.name === name)[0]
                .rate,
    })
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.getParam('error', false)) {
      alert("Error in loading");
    }
    const uid = Firebase.auth().currentUser.uid;
    const rates = {
      BTC: 10513.84,
      ETH: 238.48,
      DASH: 222.10,
      XRP: 0.52,
    }
    Firebase.app()
          .database()
          .ref('/users/' + uid)
          .once('value')
          .then((snap) => {
            this.setState({
              id: uid,
              cash: snap.val().cash,
              stocks: this.state.stocks
                          .map(item => ({
                            name: item.name,
                            rate: rates[item.name],
                            value: snap.val()[item.name] === undefined
                                   ? 0 
                                   : Number(snap.val()[item.name]).toFixed(3),
                          }))
            })
          })
          .catch((e) => { 
            this.props.navigation.navigate('Wallet', {error : true});
          });
  }

  renderRow({item}) {
    return (
      <TouchableHighlight 
        style={styles.row}
        onPress={() => this.load(item.name)}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.nameIcon}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.rate}>${item.rate}</Text>
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
              {db.stringify(Number(item.value).toFixed(3))} {item.name}
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
        <Text style={{fontSize: 25, textAlign: 'center'}}>Cash: ${money}</Text>
        <FlatList
          style={styles.flatStyle}
          data={this.state.stocks}
          renderItem={this.renderRow}
          keyExtractor={item => item.name}
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
