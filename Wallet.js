import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, Button} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Firebase from 'firebase';

export default class Wallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      stocks: [
        {
          name: 'BTC',
        }
      ],
    }

    this.renderRow = this.renderRow.bind(this); 
  }
  
  load = (name) => {
    this.props.navigation.navigate('Loading',{
      name: name,
    })
  }

  componentDidMount() {
    this.setState({id: Firebase.auth().currentUser.uid});
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
      <View>
        <Text style={{fontSize: 30, textAlign: 'center'}}>My Wallet</Text>
        <FlatList
          data={this.state.stocks}
          renderItem={this.renderRow}
          keyExtractor={item => item.name}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
