import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, Button } from 'react-native';
import Firebase from 'firebase';

export default class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
    }
  }

  componentDidMount() {
    this.setState({id: Firebase.auth().currentUser.uid});
  }

  render() {
    return (
      <View style={styles.container}>
        <Button 
          onPress={() => this.props.navigation.navigate('Wallet')} 
          title='Go to wallet'
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
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  }
});
