import React, { Component } from 'react';
import { LineChart, Grid } from  'react-native-svg-charts';
import { Dimensions, StyleSheet, View, ActivityIndicator } from 'react-native';

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stock: this.props.stock,
      data: [],
      mapping: {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        DASH: 'dash',
        XRP: 'ripple',
      },
      isLoading: true,
    };

    this.fetch = this.fetch.bind(this);
  }

  componentDidMount() {
    this.fetch(this.state.stock);
  }
  
  fetch(stock) {
    fetch("https://api.coingecko.com/api/v3/coins/" 
          + this.state.mapping[stock] 
          + "/market_chart?vs_currency=sgd&days=30")
      .then(res => res.json())
      .then(resJSON => {
        this.setState({ 
          data: resJSON.prices.map(valuePair => valuePair[1]), 
          isLoading: false,
        });
      })
      .catch(error => {
        alert("stock not found")
      })
  }

  // current staic graph
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator color="#00ff00" />
        </View>
      )
    }
    return (
        <LineChart
            style={{ height: 400, width: 400 }}
            data={ this.state.data }
            svg={{ stroke: 'green' }}
            contentInset={{ top: 20, bottom: 20 }}
        >
            <Grid/>
        </LineChart>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: Math.round(Dimensions.get('window').width),
    height: 400, 
    justifyContent: 'center',
  }
})
