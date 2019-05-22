import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, Button} from 'react-native';
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
      <View>
        <Button
          onPress={() => this.load(item.name)}
          title={item.name}
        />
      </View>
    )
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 30, textAlign: 'center'}}>My Wallet</Text>
        <Text style={{fontSize: 25, textAlign: 'center'}}>Cash: ${db.stringify(this.state.cash)}</Text>
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
  flatStyle: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  buttonStyle: {
    fontSize: 30,
    justifyContent: 'flex-start',
  }
});
