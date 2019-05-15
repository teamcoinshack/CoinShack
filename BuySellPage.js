import React, {Component} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';

export default class BuySellPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cash: 0,
    }

    this.buyOnPress = this.buyOnPress.bind(this);
    this.sellOnPress = this.sellOnPress.bind(this);
  }

  testVal = 10; // hard-coded for testing

  buyOnPress() {
    this.setState({cash: this.state.cash + this.testVal});
  }

  sellOnPress() {
    this.setState({cash: this.state.cash - this.testVal})
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.cashText}>
          {"$" + this.state.cash}
        </Text>
        <Button
          onPress={this.buyOnPress}
          title="Buy"
          color='green'
        />
        <Button
          onPress={this.sellOnPress}
          title="Sell"
          color="red"
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