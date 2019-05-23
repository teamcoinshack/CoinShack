import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, Button, TouchableHighlight} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Firebase from 'firebase';
import db from './Database.js';

export default class Wallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      cash: '',
      stocks: [
        {name: 'BTC'},
        {name: 'ETH(not working)'},
        {name: 'AAPL(not working)'},
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
    })
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.getParam('error', false)) {
      alert("Error in loading");
    }
    const uid = Firebase.auth().currentUser.uid;
    Firebase.app()
          .database()
          .ref('/users/' + uid)
          .once('value')
          .then((snap) => {
            this.setState({
              id: uid,
              cash: snap.val().cash,
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
        <View>
          <View style={styles.nameIcon}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <Text style={styles.stockValue}>{item.value}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  
  render() {
    const money = db.stringify(this.state.cash);
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
    borderRadius: 2,
    backgroundColor: '#99c0ff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
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
    fontSize: 15,
  },
  stockValue: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 10,
  },
  flatStyle: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'flex-start',
  },
  buttonStyle: {
    fontSize: 30,
    justifyContent: 'flex-start',
  }
});
